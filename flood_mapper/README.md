# Aegis-Orbit: Spaceborne Flood Damage & Cut-off Settlement Mapping
### *Multimodal AI Hackathon 2026 — Track B: Mapping Flood Damage from Space*

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.35+-FF4B4B.svg)](https://streamlit.io/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.1+-EE4C2C.svg)](https://pytorch.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 1. Challenge & Executive Summary

On **26 August 2026**, a high-altitude glacial collapse in the northern Rasuwa/Langtang region of Nepal triggered a catastrophic torrent of rock, ice, and hyperconcentrated debris down the **Bhote Koshi – Trishuli River corridor**. Nepal's National Disaster Risk Reduction and Management Authority (**NDRRMA**) and Copernicus EMS reported extensive loss of life, destroyed transportation bridges, severed fiber optics, and isolated Himalayan settlements.

**Aegis-Orbit** is an end-to-end operational decision-support system built to answer three vital questions for rapid search-and-rescue teams:
1. **Where did the flood hit?** 
   - Fuses Sentinel-1 Synthetic Aperture Radar (SAR) VV-band before/after differential change detection with a Deep Learning **ResNet34 U-Net** segmentation model trained on SAR flood datasets.
2. **What was damaged?** 
   - Overlays high-resolution OpenStreetMap (OSM) pre-event vector footprints (buildings, highways, bridges) to compute exact submerged infrastructure counts and road kilometer losses in EPSG:32645 (UTM 45N).
3. **Who is cut off?** 
   - Evaluates multi-modal transportation connectivity from mountain settlements to nearest district hospitals/towns via the **OpenRouteService (ORS)** API (with intelligent topological network graph fallback). Isolates communities where road links are physically severed or travel times exceed 120 minutes.

---

## 2. System Architecture

```text
               ┌─────────────────────────────────────────────────────────────┐
               │                     DATA SOURCES                            │
               ├───────────────────────────────┬─────────────────────────────┤
               │   Sentinel-1 C-Band SAR GRD   │  OpenStreetMap Pre-Event    │
               │   Pre: 2026-08-16 (Orbit Trk) │  Snapshot: 2026-07-27       │
               │   Post: 2026-08-28 (Same Trk) │  (ohsome API / GeoJSON)     │
               └───────────────┬───────────────┴──────────────┬──────────────┘
                               │                              │
                               ▼                              ▼
                 ┌───────────────────────────┐  ┌───────────────────────────┐
                 │     data_loader.py        │  │     data_loader.py        │
                 │  - Rasterio GeoTIFF / SAFE│  │  - GeoPandas parsing      │
                 │  - Decibel (dB) Conversion│  │  - Layer Categorization   │
                 │  - Bbox Window Extraction │  │  - CRS Reprojection       │
                 └─────────────┬─────────────┘  └─────────────┬─────────────┘
                               │                              │
                               ▼                              │
                 ┌───────────────────────────┐                │
                 │       ml_model.py         │                │
                 │  - ResNet34 U-Net Encoder │                │
                 │  - Tiled Patch Inference  │                │
                 │  - Water/Debris Masking   │                │
                 └─────────────┬─────────────┘                │
                               │                              │
                               ▼                              │
                 ┌────────────────────────────────────────────┴─────────────┐
                 │                geospatial_analysis.py                    │
                 │  1. SAR Differential Change Detection (Δ dB = Post - Pre) │
                 │  2. ML & Morphological Hybrid Fusion                     │
                 │  3. Spatial Overlay (gpd.overlay) Buildings & Roads      │
                 │  4. Cut-Off Routing Engine (OpenRouteService / NetworkX) │
                 └─────────────────────────────┬────────────────────────────┘
                                               │
                                               ▼
                 ┌──────────────────────────────────────────────────────────┐
                 │                 app.py (Streamlit UI)                    │
                 │  Tab 1: Interactive Folium Multi-layer Map               │
                 │  Tab 2: Quantitative Infrastructure Damage Report        │
                 │  Tab 3: Isolated Settlement Rescue Priority Triage       │
                 │  Tab 4: Automated SitRep Copilot (English & Nepali)     │
                 │  Tab 5: Sensor Physics, ML Details & Limitations         │
                 └──────────────────────────────────────────────────────────┘
```

---

## 3. Repository Structure

```text
flood_mapper/
├── app.py                   # Streamlit interactive decision-support application
├── data_loader.py           # Sentinel-1 GeoTIFF/SAFE parser & OSM GeoJSON loader
├── ml_model.py              # PyTorch ResNet34 U-Net model & sliding-window inference
├── geospatial_analysis.py   # SAR change detection, damage assessment, & routing
├── utils.py                 # Folium map builder, ohsome fetcher, & SitRep copilot
├── requirements.txt         # Production dependencies
└── README.md                # System documentation, runbook, & attributions
```

---

## 4. Quickstart & Installation

### Step 1: Clone Repository & Create Virtual Environment
```bash
git clone <repo_url>
cd flood_mapper
python -m venv venv

# On Windows:
.\venv\Scripts\activate

# On Linux/macOS:
source venv/bin/activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run the Streamlit Dashboard
```bash
streamlit run app.py
```
The application will launch automatically at `http://localhost:8501`.

---

## 5. Input Data Guide

The system operates in two flexible modes:

### Mode A: 1-Click Trishuli Flood Demo (Recommended for Judges)
- Simply open the dashboard and click **"Load Trishuli Aug 2026 Demo Data"** in the sidebar.
- Automatically loads the exact bounding box for the **Trishuli River Corridor, Nepal (`[84.8, 27.7, 85.1, 28.0]`)**, calibrated Sentinel-1 pre/post images, and pre-event OSM settlements (Syabrubesi, Dhunche, Betrawati, Bidur), hospitals, and road networks.

### Mode B: Raw Satellite & OSM Data Upload
- **Sentinel-1 Pre-flood GeoTIFF:** `S1D_IW_GRDH_...20260816...` (VV band).
- **Sentinel-1 Post-flood GeoTIFF:** `S1D_IW_GRDH_...20260828...` (VV band).
  *Tip: Both images are captured on the same orbit track (12 days apart at 12:21:41 UTC), ensuring identical radar look geometry.*
- **OpenStreetMap Data:** Pre-event JSON/GeoJSON exported via the **ohsome API** (snapshot date: `2026-07-27`).

---

## 6. Deep Learning & Geospatial Methodology

### A. Radar Physics & Change Detection
- Water surfaces act as specular reflectors for C-band radar waves, scattering radiation away from the antenna and creating very low backscatter ($\le -18 \text{ dB}$).
- The differential backscatter is computed as:
  $$\Delta \sigma^0_{\text{dB}} = \sigma^0_{\text{post, dB}} - \sigma^0_{\text{pre, dB}}$$
- Negative change indicates newly flooded terrain; positive shifts detect rough sediment and gravel debris deposition.

### B. Deep Learning Segmentation
- **Architecture:** U-Net with a pre-trained **ResNet34** encoder (`segmentation_models_pytorch`).
- **Input Channels:** 1 (VV intensity in standardized decibels).
- **Output:** Pixel-wise flood/debris probability $P \in [0, 1]$.
- **Inference Optimization:** Sliding-window tiled inference (patch size $256 \times 256$, stride $192$) with 2D Gaussian kernel blending to prevent border discontinuity artifacts across large satellite swaths.
- **Training Strategy:** Documented in `ml_model.py` with combined **Binary Cross-Entropy (BCE) + Soft Dice Loss** optimized on the **Kuro Siwo** (NeurIPS 2024) and **Sen1Floods11** benchmarks.

### C. Damage Assessment & Infrastructure Overlay
- Extracted flood polygons are projected to **EPSG:32645 (WGS 84 / UTM Zone 45N)** for metric-accurate geospatial analysis.
- OpenStreetMap buildings and highway segments are spatially intersected using `geopandas.overlay` and `sjoin`.
- Yields:
  - Total inundated buildings categorized by type (residential, school, commercial).
  - Total kilometers of damaged roads categorized by functional class (trunk, primary, secondary, tertiary).

### D. Cut-off Settlement Analysis (Routing Engine)
- Queries the **OpenRouteService (ORS)** API for driving isochrones and origin-destination routes from mountain villages to the nearest district hospital (e.g., Trishuli District Hospital, Dhunche District Hospital).
- When a bridge or road segment is submerged, routes either fail or detours surge over 2 hours.
- **Fail-safe Fallback:** If an ORS API key is not supplied, the built-in graph routing engine calculates topological network graph shortest paths using intact road geometry.

---

## 7. Situation Report Copilot (Multi-lingual)

Aegis-Orbit features an automated disaster intelligence copilot that synthesizes analysis results into a concise 1-page **Situation Report (SitRep)** formatted in both **English** and **Nepali (नेपाली)**.
- **Zero Hallucination Guarantee:** Every metric (inundation square kilometers, building count, road damage length, cutoff village names) is strictly bound to verified geospatial calculations.
- Cites comparisons against the official **Copernicus Emergency Management Service activation EMSR927**.

---

## 8. Technical Limitations & Operational Realities

As required by disaster response protocol and hackathon guidelines, we explicitly note what satellite AI cannot do:
1. **Revisit Latency:** Sentinel-1 has a 6-to-12 day revisit orbit cycle over northern Nepal. It cannot deliver real-time warning minutes before a flash avalanche.
2. **Mountain Radar Shadow & Layover:** Steep Himalayan slopes cause SAR geometric distortions (layover on foreslopes, shadow on backslopes). Valley floor detection is robust, but steep canyon walls require multi-angle or optical cross-validation.
3. **Sub-pixel Infrastructure:** Narrow mountain pedestrian trails (< 2m width) cannot be resolved at 10m Sentinel-1 pixel resolution without high-res commercial optical or UAV inputs.
4. **Educational Prototype:** This system is built for the Multimodal AI Hackathon 2026. Operational emergency deployment requires human-in-the-loop validation by NDRRMA or certified disaster commanders.

---

## 9. Required Data Attributions & Citations

- **Sentinel Satellite Data:**
  > *"Contains modified Copernicus Sentinel data 2026."*
- **Digital Elevation Model:**
  > *"Produced using Copernicus WorldDEM-30 © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018 provided under COPERNICUS by the European Union and ESA; all rights reserved."*
- **OpenStreetMap Data:**
  > *"© OpenStreetMap contributors. Extracted via HeiGIT ohsome API (snapshot date: 2026-07-27) under the Open Database License (ODbL)."*
- **Training Dataset (Kuro Siwo):**
  > *Bountos, N. I., et al. (2024). "Kuro Siwo: A Multimodal Dataset for Satellite Change Detection and Disaster Response." Advances in Neural Information Processing Systems (NeurIPS 2024).*
- **Training Dataset (Sen1Floods11):**
  > *Bonafilia, D., et al. (2020). "Sen1Floods11: A Georeferenced Dataset to Train and Test Deep Learning Flood Algorithms for Sentinel-1." IEEE/CVF CVPR Workshops 2020.*
- **Reference Validation:**
  > *Copernicus Emergency Management Service (EMS), Activation EMSR927: "Flood and Debris Flow along the Trishuli River Corridor, Nepal."*
