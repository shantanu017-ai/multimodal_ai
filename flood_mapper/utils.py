"""
Aegis-Orbit: Multimodal Spaceborne Flood Damage Mapping
Module: utils.py
Author: Expert Geospatial & AI Engineering Team
Hackathon: Multimodal AI Hackathon 2026 (Track B: Mapping Flood Damage from Space)

Attributions:
- "Contains modified Copernicus Sentinel data 2026."
- "Produced using Copernicus WorldDEM-30 © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018 provided under COPERNICUS by the European Union and ESA; all rights reserved."
- "© OpenStreetMap contributors."
"""

import os
import json
import logging
from typing import Dict, Any, List, Optional, Tuple

import requests
import numpy as np

try:
    import folium
    from folium import plugins
    HAS_FOLIUM = True
except ImportError:
    HAS_FOLIUM = False

try:
    import geopandas as gpd
    from shapely.geometry import box, mapping
    HAS_GEOPANDAS = True
except ImportError:
    HAS_GEOPANDAS = False

logger = logging.getLogger("flood_mapper.utils")


# ===========================================================================
# 1. INTERACTIVE FOLIUM MAP GENERATION
# ===========================================================================

def to_geojson(df_or_gdf):
    """
    Safely convert GeoDataFrame or pandas DataFrame with Shapely geometries
    into a GeoJSON FeatureCollection dictionary.
    """
    if df_or_gdf is None or (hasattr(df_or_gdf, "empty") and df_or_gdf.empty):
        return None
    from shapely.geometry import mapping
    features = []
    for _, row in df_or_gdf.iterrows():
        geom = row.get("geometry")
        if geom is not None and hasattr(geom, "is_empty") and not geom.is_empty:
            props = {str(k): (round(v, 3) if isinstance(v, (float, np.floating)) else str(v)) 
                     for k, v in row.items() if k != "geometry"}
            features.append({
                "type": "Feature",
                "geometry": mapping(geom),
                "properties": props
            })
    return {"type": "FeatureCollection", "features": features}


def create_folium_map(
    bbox: list,
    flood_gdf: Any,
    damage_results: Dict[str, Any],
    cutoff_results: List[Dict[str, Any]],
    osm_data: Dict[str, Any]
) -> Any:
    """
    Build a multi-layered, interactive Folium map visualizing:
    - AI Flood Extent Polygons (Cyan/Blue overlay)
    - Damaged Buildings (Red polygons)
    - Damaged Road Segments & Bridges (Neon crimson lines)
    - Intact Road Network (Subtle slate/green lines)
    - Hospitals / Health Centers (Medical blue markers)
    - Settlements colored by accessibility status (Red = Cut Off, Orange = Delayed, Green = Accessible)
    """
    if not HAS_FOLIUM:
        return None

    min_lon, min_lat, max_lon, max_lat = bbox
    center_lat = (min_lat + max_lat) / 2.0
    center_lon = (min_lon + max_lon) / 2.0

    # Initialize map with dark theme for high-contrast geospatial inspection
    m = folium.Map(
        location=[center_lat, center_lon],
        zoom_start=11,
        tiles=None,
        control_scale=True
    )

    # Base Tile Layers
    folium.TileLayer(
        tiles="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        name="Dark Canvas (Night/High-Contrast)",
        attr="© OpenStreetMap, © CARTO"
    ).add_to(m)

    folium.TileLayer(
        tiles="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        name="Esri High-Res Satellite Imagery",
        attr="© Esri, Maxar, Earthstar Geographics"
    ).add_to(m)

    folium.TileLayer(
        tiles="OpenStreetMap",
        name="OpenStreetMap Standard",
        attr="© OpenStreetMap contributors"
    ).add_to(m)

    # -------------------------------------------------------------
    # Layer 1: Intact Road Network
    # -------------------------------------------------------------
    roads_gdf = osm_data.get("roads", None)
    damaged_roads_gdf = damage_results.get("damaged_roads_gdf", None)
    damaged_indices = set(damaged_roads_gdf.index) if damaged_roads_gdf is not None and hasattr(damaged_roads_gdf, "index") else set()

    if roads_gdf is not None and hasattr(roads_gdf, "empty") and not roads_gdf.empty:
        intact_roads = roads_gdf[~roads_gdf.index.isin(damaged_indices)]
        if not intact_roads.empty:
            intact_group = folium.FeatureGroup(name="Functional Road Network", show=True)
            for _, r in intact_roads.iterrows():
                if hasattr(r.geometry, "coords"):
                    coords = [(lat, lon) for lon, lat in r.geometry.coords]
                    folium.PolyLine(
                        locations=coords,
                        color="#4A5568",
                        weight=2.5,
                        opacity=0.6,
                        tooltip=f"Functional: {r.get('name', 'Road')}"
                    ).add_to(intact_group)
            intact_group.add_to(m)

    # -------------------------------------------------------------
    # Layer 2: AI Flood & Debris Inundation Extent
    # -------------------------------------------------------------
    flood_geojson = to_geojson(flood_gdf)
    if flood_geojson is not None and flood_geojson["features"]:
        flood_group = folium.FeatureGroup(name="AI Flood & Debris Extent (Sentinel-1 U-Net)", show=True)
        folium.GeoJson(
            data=flood_geojson,
            name="Flood Extent",
            style_function=lambda feature: {
                "fillColor": "#00D2FF",
                "color": "#0072FF",
                "weight": 1.5,
                "fillOpacity": 0.55
            },
            tooltip=folium.GeoJsonTooltip(
                fields=["id", "area_sqkm"],
                aliases=["Zone:", "Area (km²):"],
                localize=True
            )
        ).add_to(flood_group)
        flood_group.add_to(m)

    # -------------------------------------------------------------
    # Layer 3: Damaged Buildings
    # -------------------------------------------------------------
    bldgs_geojson = to_geojson(damage_results.get("damaged_buildings_gdf", None))
    if bldgs_geojson is not None and bldgs_geojson["features"]:
        bldg_group = folium.FeatureGroup(name="Flooded Buildings (OSM)", show=True)
        folium.GeoJson(
            data=bldgs_geojson,
            name="Damaged Buildings",
            style_function=lambda feature: {
                "fillColor": "#FF2A2A",
                "color": "#990000",
                "weight": 1.2,
                "fillOpacity": 0.8
            },
            tooltip=folium.GeoJsonTooltip(
                fields=["name", "building"],
                aliases=["Structure:", "Type:"]
            )
        ).add_to(bldg_group)
        bldg_group.add_to(m)

    # -------------------------------------------------------------
    # Layer 4: Damaged Road Segments & Severed Bridges
    # -------------------------------------------------------------
    if damaged_roads_gdf is not None and not damaged_roads_gdf.empty:
        damage_road_group = folium.FeatureGroup(name="Damaged / Submerged Roads", show=True)
        for _, r in damaged_roads_gdf.iterrows():
            if hasattr(r.geometry, "coords"):
                coords = [(lat, lon) for lon, lat in r.geometry.coords]
                is_bridge = str(r.get("bridge", "")).lower() == "yes"
                folium.PolyLine(
                    locations=coords,
                    color="#FF0055",
                    weight=5.0,
                    opacity=0.9,
                    dash_array="6, 6",
                    tooltip=f"DAMAGED: {r.get('name', 'Road')} ({r.get('length_km', '0')} km)" + (" [SEVERED BRIDGE]" if is_bridge else "")
                ).add_to(damage_road_group)
        damage_road_group.add_to(m)

    # -------------------------------------------------------------
    # Layer 5: Hospitals / Emergency Healthcare Centers
    # -------------------------------------------------------------
    hospitals_gdf = osm_data.get("hospitals", None)
    if hospitals_gdf is not None and not hospitals_gdf.empty:
        hosp_group = folium.FeatureGroup(name="Hospitals & Health Centers", show=True)
        for _, h in hospitals_gdf.iterrows():
            folium.Marker(
                location=[h.geometry.y, h.geometry.x],
                popup=folium.Popup(f"<b>{h.get('name', 'District Hospital')}</b><br>Emergency Care Facility<br>Beds: {h.get('beds', 'N/A')}", max_width=250),
                tooltip=f"Hospital: {h.get('name')}",
                icon=folium.Icon(color="blue", icon="plus-sign", prefix="glyphicon")
            ).add_to(hosp_group)
        hosp_group.add_to(m)

    # -------------------------------------------------------------
    # Layer 6: Settlements with Cut-Off Triage Badges
    # -------------------------------------------------------------
    settlement_group = folium.FeatureGroup(name="Settlements (Isolation Status)", show=True)
    for s in cutoff_results:
        lat, lon = s["coordinates"]
        status = s["status"]
        name = s["name"]
        pop = s["population"]
        priority = s["priority"]
        duration = s["duration_min"]

        if status == "Cut Off":
            icon_color = "red"
            icon_symbol = "remove-sign"
        elif "Delayed" in status:
            icon_color = "orange"
            icon_symbol = "time"
        else:
            icon_color = "green"
            icon_symbol = "ok-sign"

        popup_html = f"""
        <div style="font-family: Arial, sans-serif; min-width: 200px;">
            <h4 style="margin: 0 0 5px 0; color: #2D3748;">{name}</h4>
            <p style="margin: 2px 0;"><b>Population:</b> {pop:,}</p>
            <p style="margin: 2px 0;"><b>Status:</b> <span style="color: {s['badge_color']}; font-weight: bold;">{status}</span></p>
            <p style="margin: 2px 0;"><b>Est. Travel Time:</b> {duration} min</p>
            <p style="margin: 2px 0;"><b>Rescue Priority:</b> {priority}</p>
            <p style="margin: 2px 0;"><b>Nearest Hospital:</b> {s['nearest_hospital']}</p>
        </div>
        """

        folium.Marker(
            location=[lat, lon],
            popup=folium.Popup(popup_html, max_width=280),
            tooltip=f"{name} [{status}]",
            icon=folium.Icon(color=icon_color, icon=icon_symbol, prefix="glyphicon")
        ).add_to(settlement_group)
    settlement_group.add_to(m)

    # Add Layer Control
    folium.LayerControl(position="topright", collapsed=False).add_to(m)

    # Add Floating Custom Legend
    legend_html = """
    <div style="position: fixed; 
                bottom: 25px; left: 25px; width: 230px; height: 195px; 
                background-color: rgba(26, 32, 44, 0.88); 
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px; z-index:9999; font-size:12px;
                color: #F7FAFC; padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
        <b style="font-size: 13px; color: #63B3ED;">🛰️ Aegis Map Legend</b><br>
        <div style="margin-top: 6px;">
            <span style="background: #00D2FF; width: 14px; height: 14px; display: inline-block; border-radius: 2px; opacity: 0.8; vertical-align: middle;"></span>
            &nbsp;Flood/Debris Zone (AI Mask)<br>
            <span style="background: #FF2A2A; width: 14px; height: 14px; display: inline-block; border-radius: 2px; vertical-align: middle;"></span>
            &nbsp;Damaged Buildings<br>
            <span style="border-top: 3px dashed #FF0055; width: 14px; display: inline-block; vertical-align: middle;"></span>
            &nbsp;Damaged / Broken Highway<br>
            <span style="color: #E53E3E; font-size: 14px; vertical-align: middle;">●</span>
            &nbsp;<b>Cut-Off Village (Isolated)</b><br>
            <span style="color: #DD6B20; font-size: 14px; vertical-align: middle;">●</span>
            &nbsp;Delayed Route (> 2 hrs)<br>
            <span style="color: #38A169; font-size: 14px; vertical-align: middle;">●</span>
            &nbsp;Connected Settlement<br>
            <span style="color: #3182CE; font-size: 14px; vertical-align: middle;">✚</span>
            &nbsp;District Hospital Hub
        </div>
    </div>
    """
    m.get_root().html.add_child(folium.Element(legend_html))

    return m


# ===========================================================================
# 2. MULTI-LINGUAL SITUATION REPORT GENERATOR (ENGLISH & NEPALI)
# ===========================================================================

def generate_situation_report(
    bbox: list,
    damage_results: Dict[str, Any],
    cutoff_results: List[Dict[str, Any]],
    flood_date: str = "2026-08-26 / 2026-08-28"
) -> Dict[str, str]:
    """
    Generate an authoritative 1-page emergency Situation Report (SitRep)
    in English and Nepali (नेपाली), strictly grounded in the calculated data.
    Cites Copernicus EMS activation EMSR927.
    """
    flooded_sqkm = damage_results.get("total_flooded_area_sqkm", 0.0)
    buildings_count = damage_results.get("damaged_buildings_count", 0)
    roads_km = damage_results.get("damaged_roads_km", 0.0)
    bridges_count = damage_results.get("damaged_bridges_count", 0)

    cutoff_villages = [s for s in cutoff_results if s["status"] == "Cut Off"]
    delayed_villages = [s for s in cutoff_results if "Delayed" in s["status"]]
    isolated_pop = sum(s["population"] for s in cutoff_villages)
    delayed_pop = sum(s["population"] for s in delayed_villages)

    cutoff_names_en = ", ".join([s["name"].split("(")[0].strip() for s in cutoff_villages]) or "None"
    delayed_names_en = ", ".join([s["name"].split("(")[0].strip() for s in delayed_villages]) or "None"

    # --- English Situation Report ---
    report_en = f"""# EMERGENCY SITUATION REPORT (SITREP #01)
### DISASTER MONITORING: TRISHULI RIVER GLACIAL FLOOD & DEBRIS FLOW
**Event Date:** 26 August 2026 | **Satellite Assessment Window:** 16–28 August 2026  
**Area of Interest (AOI):** Trishuli River Corridor, Rasuwa/Nuwakot, Nepal [{bbox[0]:.2f}, {bbox[1]:.2f}, {bbox[2]:.2f}, {bbox[3]:.2f}]  
**Reference Activation:** Copernicus Emergency Management Service EMSR927  
**Attributions:** Contains modified Copernicus Sentinel data 2026 | © OpenStreetMap contributors

---

### 1. EXECUTIVE SUMMARY & KEY NUMERICAL FINDINGS
Following the high-altitude glacial collapse and subsequent debris flood down the Bhote Koshi–Trishuli corridor on 26 August 2026, automated radar change detection and ResNet34 U-Net neural segmentation indicate extensive catastrophic infrastructure inundation:

- **Total Inundated / Debris Footprint:** **{flooded_sqkm:.2f} km²**
- **Damaged / Submerged Buildings:** **{buildings_count:,} structures**
- **Disrupted Highway Network:** **{roads_km:.2f} km** of critical roadways
- **Severed Bridges / Waterway Crossings:** **{bridges_count} bridges** destroyed or compromised
- **Completely Cut-Off Settlements:** **{len(cutoff_villages)} villages** (Est. **{isolated_pop:,} residents** trapped)
- **Severely Delayed Access Settlements:** **{len(delayed_villages)} villages** (Est. **{delayed_pop:,} residents**)

---

### 2. RESCUE ACCESS & CONNECTIVITY ASSESSMENT
The Pasang Lhamu Highway corridor between Betrawati and the northern gorge has suffered structural bridge failures and debris blockages, severing ground vehicular access:

- **Critical Isolated Settlements (NO ROAD ACCESS):**  
  **{cutoff_names_en}**  
  *Operational Directive:* Immediate rotary-wing airdrop of water purification tablets, high-energy rations, and satellite communication kits required. Foot search-and-rescue teams must deploy along ridge trails.
- **Delayed Settlements (> 120 min Detour):**  
  **{delayed_names_en}**  
  *Operational Directive:* Route detours operational but subject to secondary landslide risk. Deploy heavy earth-moving equipment for rapid road clearance.

---

### 3. SATELLITE SENSOR CONSTRAINTS & OPERATIONAL LIMITATIONS
1. **Revisit Cadence:** Sentinel-1 radar revisits occur on a 6-to-12 day cycle. Rapid mudslide dynamics within hours cannot be tracked without daily SAR/optical constellations.
2. **Steep Valley Radar Shadow:** Deep Himalayan canyon topography introduces radar shadow and layover artifacts; high-resolution drone or helicopter visual reconnaissance must confirm ground conditions.
"""

    # --- Nepali Situation Report (नेपाली) ---
    cutoff_names_np = ", ".join([s["name"] for s in cutoff_villages]) or "कुनै छैन"
    delayed_names_np = ", ".join([s["name"] for s in delayed_villages]) or "कुनै छैन"

    report_np = f"""# विपद् स्थिति प्रतिवेदन (SITREP #०१)
### त्रिशूली-भोटेकोशी हिमपहिरो तथा बाढी क्षति मूल्याङ्कन
**घटना मिति:** २६ अगस्ट २०२६ | **उपग्रह विश्लेषण मिति:** १६ र २८ अगस्ट २०२६  
**प्रभावित क्षेत्र:** त्रिशूली नदी कोरिडोर, रसुवा र नुवाकोट जिल्ला, नेपाल  
**सन्दर्भ:** कोपर्निकस आपतकालीन व्यवस्थापन सेवा (EMSR927)  
**स्रोत आभार:** Contains modified Copernicus Sentinel data 2026 | © OpenStreetMap contributors

---

### १. प्रमुख निष्कर्ष तथा तथ्याङ्क
सेन्टिनेल-१ रडार उपग्रह र आर्टिफिसियल इन्टेलिजेन्स (U-Net मोडेल) विश्लेषणबाट प्राप्त प्रमुख क्षतिको विवरण:

- **कुल बाढी तथा लेदो ग्रस्त क्षेत्रफल:** **{flooded_sqkm:.2f} वर्ग किलोमिटर**
- **क्षतिग्रस्त / डुबानमा परेका घर-संरचनाहरू:** **{buildings_count:,} वटा**
- **क्षतिग्रस्त सडक सञ्जाल:** **{roads_km:.2f} कि.मी.**
- **भत्किएका पुलहरू:** **{bridges_count} वटा**
- **यातायातबाट पूर्ण रूपमा विच्छेद भएका बस्तीहरू:** **{len(cutoff_villages)} गाउँहरू** (करिब **{isolated_pop:,}** जनसंख्या सम्पर्कविहीन)
- **सवारी आवागमनमा गम्भीर ढिलाइ (> २ घण्टा):** **{len(delayed_villages)} गाउँहरू** (करिब **{delayed_pop:,}** जनसंख्या)

---

### २. उद्धार तथा पहुँच प्राथमिकता
पासाङ ल्हामु राजमार्ग र नदी तटीय सडकहरू लेदो र बाढीले बगाएपछि तल्लो त्रिशूली अस्पतालसँगको सम्पर्क टुटेको छ:

- **सम्पर्कविहीन बस्तीहरू (सवारी साधन जान नसक्ने):**  
  **{cutoff_names_np}**  
  *उद्धार सुझाव:* तत्काल हेलिकप्टर मार्फत औषधि, खाद्यान्न तथा स्याटेलाइट फोन ढुवानी गर्न सिफारिस गरिन्छ।
- **गम्भीर ढिलाइ भएका बस्तीहरू:**  
  **{delayed_names_np}**  
  *उद्धार सुझाव:* बैकल्पिक पहाडी बाटो खुलाउन डोजर तथा हेभी इक्विपमेन्ट परिचालन आवश्यक।
"""

    return {
        "en": report_en,
        "np": report_np
    }


# ===========================================================================
# 3. OHSOME API QUERY HELPER (PRE-EVENT SNAPSHOT 2026-07-27)
# ===========================================================================

def fetch_ohsome_osm_data(bbox: list, snapshot_date: str = "2026-07-27T00:00:00Z") -> Dict[str, Any]:
    """
    Fetch pre-event OpenStreetMap data from HeiGIT ohsome API.
    Bbox format: [min_lon, min_lat, max_lon, max_lat].
    """
    url = "https://api.ohsome.org/v1/elements/geometry"
    b_str = f"{bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]}"
    params = {
        "bboxes": b_str,
        "time": snapshot_date,
        "types": "way,relation,node",
        "filter": "building=* or highway=* or amenity=hospital"
    }

    try:
        resp = requests.get(url, params=params, timeout=12)
        if resp.status_code == 200:
            return resp.json()
        logger.warning(f"ohsome API returned status {resp.status_code}")
    except Exception as e:
        logger.error(f"Error querying ohsome API: {e}")

    return {}
