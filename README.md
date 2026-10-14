# Aegis-Orbit: Spaceborne Flood Damage & Cut-off Settlement Mapping

> **Multimodal AI Hackathon 2026 — Track B: Mapping Flood Damage from Space**  
> *Rapid Earth Observation & Multimodal Geospatial Intelligence for Disaster Response*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.35+-FF4B4B.svg?logo=streamlit&logoColor=white)](https://streamlit.io/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.1+-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Executive Summary

On **26 August 2026**, a high-altitude glacial collapse in the northern Rasuwa/Langtang region of Nepal triggered a catastrophic torrent of rock, ice, and hyperconcentrated debris down the **Bhote Koshi – Trishuli River corridor**. Transportation bridges were destroyed, optical fiber lines severed, and multiple Himalayan settlements left isolated with blocked road access.

**Aegis-Orbit** is an operational decision-support system fusing Synthetic Aperture Radar (SAR) Earth Observation data with vector road networks and machine learning to deliver rapid triage intelligence:
1. **Where did the flood hit?** Sentinel-1 SAR VV-band before/after differential change detection ($\Delta\sigma^0$) combined with a Deep Learning **ResNet34 U-Net** segmentation model.
2. **What was damaged?** Automated spatial overlay with OpenStreetMap (OSM) pre-event footprints (buildings, highways, bridges) to compute submerged infrastructure counts and road losses in metric projection (EPSG:32645).
3. **Who is cut off?** Real-time multi-modal connectivity routing (OpenRouteService + topological fallback graph) identifying isolated settlements whose access to district hospitals is severed or delayed by >120 minutes.
4. **Actionable Situation Reports (SitRep):** Multilingual SitRep copilot generating instant, zero-hallucination briefings in **English** and **Nepali (नेपाली)** for emergency coordinators.

---

## 🏗️ Architecture & Monorepo Structure

```text
multimodal_ai/
├── backend/                  # FastAPI Geospatial & ML Inference Microservice
│   ├── main.py               # REST API endpoints (SAR processing, routing, damage overlay)
│   └── requirements.txt      # FastAPI, Rasterio, GeoPandas, Shapely
├── frontend/                 # Next.js 14 Web Application
│   ├── app/                  # Next.js App Router (Dashboard, Login, Register)
│   ├── components/           # Interactive Leaflet map, temporal comparison slider,
│   │                         # SitRep copilot, upstream tracer, EMSR validation
│   ├── context/              # LanguageContext (English / Nepali toggle)
│   └── package.json          # Next.js, React Leaflet, Tailwind CSS, Framer Motion
├── flood_mapper/             # Standalone Python / Streamlit Geospatial Pipeline
│   ├── app.py                # Streamlit interactive decision-support UI
│   ├── ml_model.py           # PyTorch ResNet34 U-Net model & sliding-window inference
│   ├── geospatial_analysis.py# SAR change detection, overlay, and isochrone engine
│   ├── data_loader.py        # Rasterio GeoTIFF & OSM GeoJSON loader
│   ├── utils.py              # Folium map builder & SitRep copilot
│   ├── requirements.txt      # Python dependencies
│   └── README.md             # Detailed Track B documentation
├── .gitignore                # Production ignore rules (excludes >1GB SAR files & caches)
└── README.md                 # Project Overview & Setup Instructions
```

---

## 🚀 Quickstart Guide

### 1. Backend (FastAPI Geospatial Engine)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Documentation will be accessible at: `http://localhost:8000/docs`

### 2. Frontend (Next.js 14 Dashboard)
```bash
cd frontend
npm install
npm run dev
```
Web app will be accessible at: `http://localhost:3000`

### 3. Streamlit Research & Analysis Tool
```bash
cd flood_mapper
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
streamlit run app.py
```
Streamlit app will launch at: `http://localhost:8501`

---

## 🛰️ Datasets & Methodology

- **SAR Satellite Imagery**: Sentinel-1 C-Band SAR GRD (Pre-event: 2026-08-16, Post-event: 2026-08-28, Orbit Track VV-band).
- **Vector Infrastructure**: OpenStreetMap pre-event vector footprints extracted via the HeiGIT ohsome API (snapshot: 2026-07-27).
- **ML Architecture**: ResNet34 U-Net with Gaussian window patch-blending trained on **Kuro Siwo** (NeurIPS 2024) and **Sen1Floods11** datasets.
- **Reference Ground Truth**: Copernicus Emergency Management Service activation **EMSR927** (*Trishuli River Corridor, Nepal*).

---

## 📜 Attributions & Licenses

- **Sentinel Satellite Imagery**: *"Contains modified Copernicus Sentinel data 2026."*
- **Elevation Data**: *"Produced using Copernicus WorldDEM-30 © DLR e.V. and Airbus Defence and Space GmbH."*
- **OpenStreetMap**: *"© OpenStreetMap contributors under the Open Database License (ODbL)."*
- **License**: Released under the [MIT License](LICENSE).
