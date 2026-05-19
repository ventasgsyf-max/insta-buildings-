"use client";

import { useState, useEffect, useCallback } from "react";

// ============================================================
// DATA & CONFIG
// ============================================================
const STATE_RATES = {
  AL: { name: "Alabama", rate: 8.5, mobilization: 2500 },
  AK: { name: "Alaska", rate: 14.0, mobilization: 8000 },
  AZ: { name: "Arizona", rate: 9.0, mobilization: 3000 },
  AR: { name: "Arkansas", rate: 8.0, mobilization: 2200 },
  CA: { name: "California", rate: 16.5, mobilization: 5500 },
  CO: { name: "Colorado", rate: 11.0, mobilization: 3500 },
  CT: { name: "Connecticut", rate: 14.0, mobilization: 4000 },
  DE: { name: "Delaware", rate: 12.5, mobilization: 3500 },
  FL: { name: "Florida", rate: 9.5, mobilization: 3000 },
  GA: { name: "Georgia", rate: 9.0, mobilization: 2800 },
  HI: { name: "Hawaii", rate: 18.0, mobilization: 12000 },
  ID: { name: "Idaho", rate: 9.5, mobilization: 3200 },
  IL: { name: "Illinois", rate: 12.0, mobilization: 3500 },
  IN: { name: "Indiana", rate: 10.0, mobilization: 2800 },
  IA: { name: "Iowa", rate: 9.5, mobilization: 2800 },
  KS: { name: "Kansas", rate: 8.5, mobilization: 2500 },
  KY: { name: "Kentucky", rate: 8.5, mobilization: 2500 },
  LA: { name: "Louisiana", rate: 9.0, mobilization: 2800 },
  ME: { name: "Maine", rate: 11.5, mobilization: 4000 },
  MD: { name: "Maryland", rate: 13.0, mobilization: 4000 },
  MA: { name: "Massachusetts", rate: 15.0, mobilization: 4500 },
  MI: { name: "Michigan", rate: 11.0, mobilization: 3200 },
  MN: { name: "Minnesota", rate: 11.5, mobilization: 3500 },
  MS: { name: "Mississippi", rate: 8.0, mobilization: 2200 },
  MO: { name: "Missouri", rate: 9.0, mobilization: 2800 },
  MT: { name: "Montana", rate: 10.0, mobilization: 3500 },
  NE: { name: "Nebraska", rate: 9.0, mobilization: 2800 },
  NV: { name: "Nevada", rate: 10.5, mobilization: 3200 },
  NH: { name: "New Hampshire", rate: 12.5, mobilization: 4000 },
  NJ: { name: "New Jersey", rate: 15.5, mobilization: 4500 },
  NM: { name: "New Mexico", rate: 9.5, mobilization: 3000 },
  NY: { name: "New York", rate: 16.0, mobilization: 5000 },
  NC: { name: "North Carolina", rate: 9.5, mobilization: 2800 },
  ND: { name: "North Dakota", rate: 10.0, mobilization: 3200 },
  OH: { name: "Ohio", rate: 10.5, mobilization: 3000 },
  OK: { name: "Oklahoma", rate: 8.5, mobilization: 2500 },
  OR: { name: "Oregon", rate: 12.0, mobilization: 3800 },
  PA: { name: "Pennsylvania", rate: 12.0, mobilization: 3500 },
  RI: { name: "Rhode Island", rate: 13.5, mobilization: 4000 },
  SC: { name: "South Carolina", rate: 9.0, mobilization: 2800 },
  SD: { name: "South Dakota", rate: 9.5, mobilization: 3000 },
  TN: { name: "Tennessee", rate: 8.5, mobilization: 2500 },
  TX: { name: "Texas", rate: 9.5, mobilization: 2800 },
  UT: { name: "Utah", rate: 10.0, mobilization: 3200 },
  VT: { name: "Vermont", rate: 12.0, mobilization: 4000 },
  VA: { name: "Virginia", rate: 11.5, mobilization: 3500 },
  WA: { name: "Washington", rate: 13.0, mobilization: 4000 },
  WV: { name: "West Virginia", rate: 9.0, mobilization: 2800 },
  WI: { name: "Wisconsin", rate: 11.0, mobilization: 3200 },
  WY: { name: "Wyoming", rate: 10.0, mobilization: 3200 },
};

const ADDITIONAL_ITEMS_CONFIG = [
  { id: "canopy", label: "Marquesina / Canopy", unit: "LF", unitLabel: "LF", defaultCost: 45 },
  { id: "parapets", label: "Paramentos / Parapets", unit: "LF", unitLabel: "LF", defaultCost: 38 },
  { id: "dumpsterDoors", label: "Puertas de Contenedor", unit: "qty", unitLabel: "Unid.", defaultCost: 1800 },
  { id: "roofLadders", label: "Escaleras de Techo", unit: "qty", unitLabel: "Unid.", defaultCost: 2200 },
  { id: "framedOpenings", label: "Aberturas Enmarcadas", unit: "qty", unitLabel: "Unid.", defaultCost: 650 },
  { id: "louvers", label: "Rejillas / Louvers", unit: "qty", unitLabel: "Unid.", defaultCost: 850 },
  { id: "walkDoors", label: "Puertas Peatonales", unit: "qty", unitLabel: "Unid.", defaultCost: 1200 },
  { id: "overheadDoorFrames", label: "Marcos Puerta Enrollable", unit: "qty", unitLabel: "Unid.", defaultCost: 950 },
  { id: "roofExtensions", label: "Extensiones de Techo", unit: "LF", unitLabel: "LF", defaultCost: 55 },
  { id: "mezzanineSupport", label: "Soporte de Mezzanine", unit: "sqft", unitLabel: "Pie²", defaultCost: 12 },
  { id: "trimPackage", label: "Paquete de Acabados", unit: "sqft", unitLabel: "Pie²", defaultCost: 2.5 },
  { id: "insulationInstall", label: "Instalación de Aislamiento", unit: "sqft", unitLabel: "Pie²", defaultCost: 3.8 },
  { id: "metalDeckInstall", label: "Instalación Metal Deck", unit: "sqft", unitLabel: "Pie²", defaultCost: 6.5 },
  { id: "joistInstall", label: "Instalación de Vigas / Joist", unit: "tons", unitLabel: "Tons", defaultCost: 1800 },
];

const COMPLEXITY_FACTORS = [
  { value: 1.00, label: "Estándar", description: "Sin complicaciones" },
  { value: 1.15, label: "Complejidad Media", description: "Algunos retos de diseño" },
  { value: 1.30, label: "Alta Complejidad", description: "Diseño complejo / acceso difícil" },
  { value: 1.40, label: "Estructura Existente / Remodelación", description: "Trabajo en edificio existente" },
];

const PROJECT_TYPES = [
  "Edificio de Metal", "Bodega / Warehouse", "Edificio Comercial",
  "Edificio Industrial", "Solo Techo", "Barndominium"
];

const ADMIN_PASSWORD = "InstaAdmin2024";

const fmt = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

// ============================================================
// STYLES
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0c0f;
    --surface: #111418;
    --surface2: #181c22;
    --surface3: #1e2530;
    --border: #2a3040;
    --border2: #3a4455;
    --text: #e8ecf0;
    --text2: #8fa0b5;
    --text3: #5a6a7e;
    --blue: #3d7fc1;
    --blue2: #5298d8;
    --blue3: #1a4a7a;
    --orange: #e07a30;
    --orange2: #f0913f;
    --green: #2eaa6e;
    --red: #d04545;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'IBM Plex Sans', sans-serif;
    --font-mono: 'IBM Plex Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font-body);
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    min-height: 100vh;
  }

  /* LAYOUT */
  .app { min-height: 100vh; }

  /* LANDING */
  .landing {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .landing-bg {
    position: absolute; inset: 0;
    background: 
      repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(61,127,193,0.04) 60px, rgba(61,127,193,0.04) 61px),
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(61,127,193,0.04) 60px, rgba(61,127,193,0.04) 61px),
      radial-gradient(ellipse at 20% 50%, rgba(61,127,193,0.12) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(224,122,48,0.08) 0%, transparent 50%),
      var(--bg);
    z-index: 0;
  }

  .landing-content {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    min-height: 100vh;
  }

  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 3rem;
    border-bottom: 1px solid var(--border);
    background: rgba(10,12,15,0.8);
    backdrop-filter: blur(20px);
    position: sticky; top: 0; z-index: 100;
  }

  .logo-area { display: flex; align-items: center; gap: 1rem; }
  .logo-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, var(--blue), var(--orange));
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; font-weight: 700; color: white;
    flex-shrink: 0;
  }
  .logo-text { font-family: var(--font-display); font-size: 1.6rem; letter-spacing: 2px; color: var(--text); }
  .logo-sub { font-size: 0.65rem; color: var(--text3); letter-spacing: 3px; text-transform: uppercase; margin-top: -4px; }

  .nav-actions { display: flex; gap: 1rem; align-items: center; }

  .btn {
    font-family: var(--font-body);
    font-weight: 600; font-size: 0.875rem;
    padding: 0.6rem 1.5rem;
    border-radius: 4px; border: none;
    cursor: pointer; transition: all 0.2s;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--blue), var(--blue2));
    color: white;
    box-shadow: 0 4px 20px rgba(61,127,193,0.3);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(61,127,193,0.5); }
  .btn-orange {
    background: linear-gradient(135deg, var(--orange), var(--orange2));
    color: white;
    box-shadow: 0 4px 20px rgba(224,122,48,0.3);
  }
  .btn-orange:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(224,122,48,0.5); }
  .btn-ghost {
    background: transparent; color: var(--text2);
    border: 1px solid var(--border2);
  }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-sm { padding: 0.4rem 1rem; font-size: 0.78rem; }
  .btn-lg { padding: 1rem 2.5rem; font-size: 1rem; }
  .btn-danger { background: var(--red); color: white; }

  .hero {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 5rem 3rem;
    text-align: center; flex-direction: column;
    gap: 2rem;
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(61,127,193,0.15); border: 1px solid rgba(61,127,193,0.3);
    color: var(--blue2); padding: 0.4rem 1.2rem; border-radius: 50px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(3rem, 8vw, 6.5rem);
    line-height: 0.95; letter-spacing: 3px;
    color: var(--text);
    max-width: 900px;
  }

  .hero-title span { color: var(--orange); }

  .hero-subtitle {
    font-size: 1.1rem; color: var(--text2);
    max-width: 600px; line-height: 1.8;
  }

  .hero-stats {
    display: flex; gap: 3rem; justify-content: center;
    padding: 2rem 3rem;
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    width: 100%; max-width: 700px;
    margin: 1rem 0;
  }

  .stat { text-align: center; }
  .stat-num { font-family: var(--font-display); font-size: 2.5rem; color: var(--blue2); letter-spacing: 2px; }
  .stat-label { font-size: 0.7rem; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; }

  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }

  /* MAIN APP LAYOUT */
  .app-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: 100vh;
  }

  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 0;
    position: sticky; top: 0; height: 100vh;
    overflow-y: auto;
    display: flex; flex-direction: column;
  }

  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
    background: var(--surface2);
  }

  .sidebar-nav { padding: 1rem 0; flex: 1; }

  .nav-section { margin-bottom: 0.5rem; }
  .nav-section-title {
    padding: 0.5rem 1.5rem;
    font-size: 0.65rem; letter-spacing: 3px; text-transform: uppercase;
    color: var(--text3); font-weight: 600;
  }

  .nav-item {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.65rem 1.5rem;
    cursor: pointer; transition: all 0.15s;
    color: var(--text2); font-size: 0.875rem;
    border-left: 3px solid transparent;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active {
    background: rgba(61,127,193,0.1);
    border-left-color: var(--blue);
    color: var(--blue2);
  }
  .nav-item-icon { font-size: 1rem; width: 20px; text-align: center; }

  .main-content {
    background: var(--bg);
    overflow-y: auto;
  }

  .page-header {
    padding: 2rem 2.5rem 1.5rem;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    display: flex; align-items: center; justify-content: space-between;
  }

  .page-title { font-family: var(--font-display); font-size: 2rem; letter-spacing: 2px; }
  .page-subtitle { font-size: 0.85rem; color: var(--text3); margin-top: 0.2rem; }

  .page-body { padding: 2rem 2.5rem; }

  /* CARDS */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .card-header {
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid var(--border);
    background: var(--surface2);
    display: flex; align-items: center; justify-content: space-between;
  }

  .card-title {
    font-size: 0.8rem; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; color: var(--text2);
    display: flex; align-items: center; gap: 0.5rem;
  }

  .card-body { padding: 1.5rem; }

  /* FORM */
  .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.2rem; }
  .form-grid-2 { grid-template-columns: repeat(2, 1fr); }
  .form-grid-3 { grid-template-columns: repeat(3, 1fr); }

  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-group.span-2 { grid-column: span 2; }
  .form-group.span-3 { grid-column: span 3; }

  label {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--text3);
  }

  input, select, textarea {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 0.9rem;
    padding: 0.65rem 0.9rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(61,127,193,0.15);
  }

  select option { background: var(--surface2); }

  .toggle-group { display: flex; gap: 0; border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
  .toggle-btn {
    flex: 1; padding: 0.6rem; background: var(--surface2);
    border: none; color: var(--text3); cursor: pointer;
    font-size: 0.8rem; font-weight: 600; transition: all 0.15s;
    font-family: var(--font-body);
  }
  .toggle-btn.active { background: var(--blue3); color: var(--blue2); }
  .toggle-btn + .toggle-btn { border-left: 1px solid var(--border); }

  /* ADDITIONALS */
  .additionals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 0.75rem;
  }

  .additional-item {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1rem;
    transition: border-color 0.2s;
  }

  .additional-item.enabled { border-color: var(--blue3); background: rgba(26,74,122,0.1); }

  .additional-item-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .additional-item-label {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.85rem; font-weight: 600; cursor: pointer;
    color: var(--text2);
  }
  .additional-item-label.enabled { color: var(--text); }

  .checkbox {
    width: 18px; height: 18px; border-radius: 3px;
    border: 2px solid var(--border2); background: var(--surface3);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; transition: all 0.15s;
  }
  .checkbox.checked { background: var(--blue); border-color: var(--blue); }

  .additional-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
  .additional-inputs label { font-size: 0.65rem; }
  .additional-inputs input { font-size: 0.82rem; padding: 0.45rem 0.7rem; }

  .item-subtotal {
    font-family: var(--font-mono); font-size: 0.85rem;
    color: var(--orange); text-align: right; margin-top: 0.5rem;
    font-weight: 500;
  }

  /* RESULT PANEL */
  .result-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    position: sticky; top: 1rem;
  }

  .result-header {
    background: linear-gradient(135deg, var(--blue3), rgba(61,127,193,0.2));
    border-bottom: 1px solid var(--border);
    padding: 1.2rem 1.5rem;
  }

  .result-header h3 { font-family: var(--font-display); font-size: 1.1rem; letter-spacing: 2px; }

  .result-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  .result-row:last-child { border-bottom: none; }

  .result-label { font-size: 0.82rem; color: var(--text2); }
  .result-value { font-family: var(--font-mono); font-size: 0.9rem; color: var(--text); }

  .result-total {
    background: rgba(61,127,193,0.08);
    border-top: 2px solid var(--blue);
  }

  .range-display {
    padding: 1.5rem;
    text-align: center;
    background: linear-gradient(135deg, rgba(61,127,193,0.05), rgba(224,122,48,0.05));
    border-bottom: 1px solid var(--border);
  }

  .range-label {
    font-size: 0.7rem; letter-spacing: 3px; text-transform: uppercase;
    color: var(--text3); margin-bottom: 0.5rem;
  }

  .range-values {
    font-family: var(--font-display); font-size: 1.6rem; letter-spacing: 1px;
    color: var(--orange);
    line-height: 1.2;
  }

  .min-warning {
    background: rgba(208,69,69,0.1); border: 1px solid rgba(208,69,69,0.3);
    padding: 0.6rem 1rem; border-radius: 4px; margin: 0.5rem 1.5rem;
    font-size: 0.78rem; color: #ff8080;
    display: flex; align-items: center; gap: 0.5rem;
  }

  .disclaimer {
    padding: 1rem 1.5rem;
    font-size: 0.72rem; color: var(--text3); line-height: 1.6;
    border-top: 1px solid var(--border);
    font-style: italic;
  }

  /* ADMIN */
  .admin-login {
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 2rem;
  }

  .admin-login-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 2.5rem; width: 100%; max-width: 400px;
    text-align: center;
  }

  .admin-login-icon {
    font-size: 2.5rem; margin-bottom: 1rem;
    background: rgba(61,127,193,0.15); width: 70px; height: 70px;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem;
    border: 2px solid var(--blue3);
  }

  .table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  .table th {
    padding: 0.8rem 1rem; text-align: left;
    font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase;
    color: var(--text3); background: var(--surface2);
    border-bottom: 2px solid var(--border);
  }
  .table td {
    padding: 0.7rem 1rem; border-bottom: 1px solid var(--border);
    color: var(--text2);
  }
  .table tr:hover td { background: rgba(61,127,193,0.03); color: var(--text); }
  .table input { padding: 0.35rem 0.6rem; font-size: 0.82rem; }

  /* ESTIMATES LIST */
  .estimate-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 1.2rem 1.5rem;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.75rem; cursor: pointer;
    transition: border-color 0.2s;
  }
  .estimate-card:hover { border-color: var(--blue3); }

  .estimate-meta { font-size: 0.75rem; color: var(--text3); margin-top: 0.2rem; }

  /* ALERT */
  .alert {
    padding: 0.75rem 1rem; border-radius: 4px; margin-bottom: 1rem;
    font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;
  }
  .alert-success { background: rgba(46,170,110,0.1); border: 1px solid rgba(46,170,110,0.3); color: #50d090; }
  .alert-error { background: rgba(208,69,69,0.1); border: 1px solid rgba(208,69,69,0.3); color: #ff7070; }

  /* PROGRESS STEPS */
  .steps-bar {
    display: flex; padding: 1.5rem 2.5rem;
    background: var(--surface); border-bottom: 1px solid var(--border);
    gap: 0; overflow-x: auto;
  }

  .step {
    display: flex; align-items: center; gap: 0.75rem;
    flex-shrink: 0; padding-right: 2rem; cursor: pointer;
  }

  .step-num {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700;
    background: var(--surface3); border: 2px solid var(--border2);
    color: var(--text3); flex-shrink: 0; transition: all 0.2s;
  }
  .step.active .step-num { background: var(--blue); border-color: var(--blue); color: white; }
  .step.done .step-num { background: var(--green); border-color: var(--green); color: white; }

  .step-label { font-size: 0.78rem; font-weight: 600; color: var(--text3); white-space: nowrap; }
  .step.active .step-label { color: var(--blue2); }
  .step.done .step-label { color: var(--green); }

  .step-arrow { color: var(--border2); margin-right: 1rem; }

  /* COMPLEXITY SELECTOR */
  .complexity-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
  .complexity-option {
    background: var(--surface2); border: 2px solid var(--border);
    border-radius: 6px; padding: 1rem; cursor: pointer; transition: all 0.15s;
  }
  .complexity-option.selected { border-color: var(--blue); background: rgba(26,74,122,0.2); }
  .complexity-option:hover:not(.selected) { border-color: var(--border2); }
  .complexity-factor { font-family: var(--font-mono); font-size: 1.2rem; color: var(--orange); font-weight: 500; }
  .complexity-name { font-size: 0.88rem; font-weight: 600; color: var(--text); margin: 0.25rem 0; }
  .complexity-desc { font-size: 0.75rem; color: var(--text3); }

  /* SECTION DIVIDERS */
  .section-divider {
    display: flex; align-items: center; gap: 1rem;
    margin: 1.5rem 0;
  }
  .section-divider::before, .section-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }
  .section-divider span {
    font-size: 0.65rem; letter-spacing: 3px; text-transform: uppercase;
    color: var(--text3); white-space: nowrap;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  /* PRINT / PDF STYLES */
  .pdf-preview {
    background: white; color: #111; padding: 40px;
    font-family: var(--font-body); max-width: 800px; margin: 0 auto;
    border-radius: 8px;
  }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .app-layout { grid-template-columns: 1fr; }
    .sidebar { position: fixed; left: -280px; top: 0; z-index: 200; height: 100vh; transition: left 0.3s; }
    .sidebar.open { left: 0; }
    .nav { padding: 1rem 1.5rem; }
    .hero { padding: 3rem 1.5rem; }
    .page-body { padding: 1.5rem; }
    .form-grid { grid-template-columns: 1fr; }
    .form-group.span-2, .form-group.span-3 { grid-column: span 1; }
    .complexity-grid { grid-template-columns: 1fr; }
    .hero-stats { gap: 1.5rem; flex-wrap: wrap; }
  }
`;

// ============================================================
// COMPONENTS
// ============================================================

function Icon({ name }) {
  const icons = {
    building: "🏗️", admin: "⚙️", estimate: "📊", list: "📋",
    dollar: "💲", pdf: "📄", save: "💾", close: "✕", check: "✓",
    alert: "⚠️", lock: "🔒", menu: "☰", home: "🏠", plus: "➕",
    edit: "✏️", trash: "🗑️", eye: "👁", chart: "📈", shield: "🛡️",
    truck: "🚛", gear: "⚙️", phone: "📞", mail: "📧", pin: "📍",
    star: "⭐", users: "👥", logout: "🚪",
  };
  return <span>{icons[name] || "•"}</span>;
}

// ============================================================
// LANDING
// ============================================================
function Landing({ onStart, onAdmin }) {
  return (
    <div className="landing">
      <div className="landing-bg" />
      <div className="landing-content">
        <nav className="nav">
          <div className="logo-area">
            <div className="logo-icon">IB</div>
            <div>
              <div className="logo-text">INSTA BUILDINGS</div>
              <div className="logo-sub">Metal Building Specialists</div>
            </div>
          </div>
          <div className="nav-actions">
            <button className="btn btn-ghost btn-sm" onClick={onAdmin}>Panel Admin</button>
            <button className="btn btn-primary btn-sm" onClick={onStart}>Iniciar Estimado</button>
          </div>
        </nav>

        <div className="hero">
          <div className="hero-badge">✦ Plataforma Profesional de Estimados</div>
          <h1 className="hero-title">
            ESTIMADOR DE COSTOS<br /><span>METAL BUILDING</span>
          </h1>
          <p className="hero-subtitle">
            Generación rápida de presupuestos preliminares para proyectos de instalación de edificios de acero prefabricado. Proteja su rentabilidad con estimados precisos.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">50+</div>
              <div className="stat-label">Estados</div>
            </div>
            <div className="stat">
              <div className="stat-num">14</div>
              <div className="stat-label">Adicionales</div>
            </div>
            <div className="stat">
              <div className="stat-num">4</div>
              <div className="stat-label">Niveles Complejidad</div>
            </div>
          </div>

          <div className="hero-actions">
            <button className="btn btn-orange btn-lg" onClick={onStart}>
              🚀 Comenzar Estimado
            </button>
            <button className="btn btn-ghost btn-lg" onClick={onAdmin}>
              ⚙️ Acceso Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ESTIMATOR
// ============================================================
function Estimator({ config, onSaveEstimate, onBack }) {
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);

  const [project, setProject] = useState({
    projectName: "", customerName: "", email: "", phone: "",
    state: "", city: "", zip: "",
    projectType: PROJECT_TYPES[0],
    sqft: "", height: "",
    includeInstallation: true, includeMaterial: false, drawingsAvailable: false,
  });

  const [additionals, setAdditionals] = useState(
    ADDITIONAL_ITEMS_CONFIG.reduce((acc, item) => ({
      ...acc,
      [item.id]: { enabled: false, qty: 1, unitCost: config.additionalCosts[item.id] ?? item.defaultCost }
    }), {})
  );

  const [complexityFactor, setComplexityFactor] = useState(1.00);

  // CALCULATIONS
  const calc = useCallback(() => {
    const sqft = parseFloat(project.sqft) || 0;
    const stateData = STATE_RATES[project.state];
    const stateRate = stateData ? (config.stateRates[project.state] ?? stateData.rate) : 0;

    const baseCost = sqft * stateRate;

    const additionalsCost = Object.keys(additionals).reduce((sum, id) => {
      const item = additionals[id];
      if (!item.enabled) return sum;
      return sum + (parseFloat(item.qty) || 0) * (parseFloat(item.unitCost) || 0);
    }, 0);

    const mobilization = stateData ? (config.mobilizationCosts[project.state] ?? stateData.mobilization) : 0;

    const subtotal = (baseCost + additionalsCost + mobilization) * complexityFactor;

    const margin = config.profitMargin / 100;
    const withMargin = subtotal * (1 + margin);
    const minPrice = config.minimumProject;

    const finalTotal = Math.max(withMargin, minPrice);
    const belowMin = withMargin < minPrice;

    const rangeMin = finalTotal * 0.92;
    const rangeMax = finalTotal * 1.08;

    return { baseCost, additionalsCost, mobilization, subtotal, withMargin, finalTotal, rangeMin, rangeMax, belowMin };
  }, [project, additionals, complexityFactor, config]);

  const result = calc();

  const updateProject = (field, val) => setProject(p => ({ ...p, [field]: val }));
  const updateAdditional = (id, field, val) => setAdditionals(a => ({ ...a, [id]: { ...a[id], [field]: val } }));
  const toggleAdditional = (id) => setAdditionals(a => ({ ...a, [id]: { ...a[id], enabled: !a[id].enabled } }));

  const handleSave = () => {
    const est = {
      id: Date.now(),
      date: new Date().toLocaleDateString("es-MX"),
      project, additionals, complexityFactor, result,
    };
    onSaveEstimate(est);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const steps = [
    { n: 1, label: "Información del Proyecto" },
    { n: 2, label: "Adicionales" },
    { n: 3, label: "Complejidad" },
    { n: 4, label: "Estimado Final" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <nav className="nav">
        <div className="logo-area">
          <div className="logo-icon">IB</div>
          <div>
            <div className="logo-text">INSTA BUILDINGS</div>
            <div className="logo-sub">Estimador de Costos</div>
          </div>
        </div>
        <div className="nav-actions">
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Inicio</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            💾 Guardar Estimado
          </button>
        </div>
      </nav>

      {saved && <div className="alert alert-success" style={{ margin: "0.5rem 2rem" }}>✓ Estimado guardado correctamente</div>}

      <div className="steps-bar">
        {steps.map((s, i) => (
          <div key={s.n} className="step" style={{ display: "flex", alignItems: "center" }}>
            <div className={`step ${step === s.n ? "active" : step > s.n ? "done" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
              onClick={() => setStep(s.n)}>
              <div className={`step-num ${step === s.n ? "active" : step > s.n ? "done" : ""}`}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
                  background: step === s.n ? "var(--blue)" : step > s.n ? "var(--green)" : "var(--surface3)",
                  border: `2px solid ${step === s.n ? "var(--blue)" : step > s.n ? "var(--green)" : "var(--border2)"}`,
                  color: step >= s.n ? "white" : "var(--text3)",
                }}>
                {step > s.n ? "✓" : s.n}
              </div>
              <div style={{
                fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap",
                color: step === s.n ? "var(--blue2)" : step > s.n ? "var(--green)" : "var(--text3)"
              }}>
                {s.label}
              </div>
            </div>
            {i < steps.length - 1 && <span style={{ color: "var(--border2)", margin: "0 1rem" }}>›</span>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", padding: "2rem 2.5rem", alignItems: "start" }}>
        <div style={{ minWidth: 0 }}>
          {/* STEP 1 */}
          {step === 1 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">📋 Información del Proyecto</div>
              </div>
              <div className="card-body">
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label>Nombre del Proyecto</label>
                    <input value={project.projectName} onChange={e => updateProject("projectName", e.target.value)} placeholder="Ej. Bodega Industrial Norte" />
                  </div>
                  <div className="form-group">
                    <label>Nombre del Cliente</label>
                    <input value={project.customerName} onChange={e => updateProject("customerName", e.target.value)} placeholder="Nombre completo" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={project.email} onChange={e => updateProject("email", e.target.value)} placeholder="cliente@email.com" />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input value={project.phone} onChange={e => updateProject("phone", e.target.value)} placeholder="(555) 000-0000" />
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <select value={project.state} onChange={e => updateProject("state", e.target.value)}>
                      <option value="">— Seleccionar Estado —</option>
                      {Object.entries(STATE_RATES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ciudad</label>
                    <input value={project.city} onChange={e => updateProject("city", e.target.value)} placeholder="Ciudad" />
                  </div>
                  <div className="form-group">
                    <label>Código Postal</label>
                    <input value={project.zip} onChange={e => updateProject("zip", e.target.value)} placeholder="ZIP Code" />
                  </div>
                  <div className="form-group">
                    <label>Tipo de Proyecto</label>
                    <select value={project.projectType} onChange={e => updateProject("projectType", e.target.value)}>
                      {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Superficie (SqFt)</label>
                    <input type="number" value={project.sqft} onChange={e => updateProject("sqft", e.target.value)} placeholder="Ej. 5000" min="0" />
                  </div>
                  <div className="form-group">
                    <label>Altura del Edificio (ft)</label>
                    <input type="number" value={project.height} onChange={e => updateProject("height", e.target.value)} placeholder="Ej. 24" min="0" />
                  </div>

                  <div className="section-divider span-3" style={{ gridColumn: "1 / -1" }}>
                    <span>Alcance del Trabajo</span>
                  </div>

                  <div className="form-group">
                    <label>¿Incluye Instalación?</label>
                    <div className="toggle-group">
                      <button className={`toggle-btn ${project.includeInstallation ? "active" : ""}`} onClick={() => updateProject("includeInstallation", true)}>Sí</button>
                      <button className={`toggle-btn ${!project.includeInstallation ? "active" : ""}`} onClick={() => updateProject("includeInstallation", false)}>No</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>¿Incluye Material?</label>
                    <div className="toggle-group">
                      <button className={`toggle-btn ${project.includeMaterial ? "active" : ""}`} onClick={() => updateProject("includeMaterial", true)}>Sí</button>
                      <button className={`toggle-btn ${!project.includeMaterial ? "active" : ""}`} onClick={() => updateProject("includeMaterial", false)}>No</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>¿Planos Disponibles?</label>
                    <div className="toggle-group">
                      <button className={`toggle-btn ${project.drawingsAvailable ? "active" : ""}`} onClick={() => updateProject("drawingsAvailable", true)}>Sí</button>
                      <button className={`toggle-btn ${!project.drawingsAvailable ? "active" : ""}`} onClick={() => updateProject("drawingsAvailable", false)}>No</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">➕ Elementos Adicionales</div>
                <span style={{ fontSize: "0.78rem", color: "var(--text3)" }}>
                  {Object.values(additionals).filter(a => a.enabled).length} seleccionados
                </span>
              </div>
              <div className="card-body">
                <div className="additionals-grid">
                  {ADDITIONAL_ITEMS_CONFIG.map(item => {
                    const add = additionals[item.id];
                    return (
                      <div key={item.id} className={`additional-item ${add.enabled ? "enabled" : ""}`}>
                        <div className="additional-item-header">
                          <div className={`additional-item-label ${add.enabled ? "enabled" : ""}`}
                            onClick={() => toggleAdditional(item.id)}>
                            <div className={`checkbox ${add.enabled ? "checked" : ""}`}>
                              {add.enabled && <span style={{ color: "white", fontSize: "0.7rem" }}>✓</span>}
                            </div>
                            {item.label}
                          </div>
                        </div>
                        {add.enabled && (
                          <>
                            <div className="additional-inputs">
                              <div className="form-group">
                                <label>Cantidad ({item.unitLabel})</label>
                                <input type="number" min="0" value={add.qty}
                                  onChange={e => updateAdditional(item.id, "qty", e.target.value)} />
                              </div>
                              <div className="form-group">
                                <label>Costo / {item.unitLabel}</label>
                                <input type="number" min="0" value={add.unitCost}
                                  onChange={e => updateAdditional(item.id, "unitCost", e.target.value)} />
                              </div>
                            </div>
                            <div className="item-subtotal">
                              {fmt((parseFloat(add.qty) || 0) * (parseFloat(add.unitCost) || 0))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">⚡ Factor de Complejidad</div>
              </div>
              <div className="card-body">
                <p style={{ color: "var(--text2)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                  Seleccione el nivel de complejidad del proyecto. Este factor se aplica al costo total para reflejar la dificultad de instalación.
                </p>
                <div className="complexity-grid">
                  {COMPLEXITY_FACTORS.map(cf => (
                    <div key={cf.value}
                      className={`complexity-option ${complexityFactor === cf.value ? "selected" : ""}`}
                      onClick={() => setComplexityFactor(cf.value)}>
                      <div className="complexity-factor">×{cf.value.toFixed(2)}</div>
                      <div className="complexity-name">{cf.label}</div>
                      <div className="complexity-desc">{cf.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">📊 Desglose del Estimado</div>
              </div>
              <div className="card-body">
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", letterSpacing: "1px", marginBottom: "0.3rem" }}>
                    {project.projectName || "Proyecto sin nombre"}
                  </h3>
                  <div style={{ fontSize: "0.82rem", color: "var(--text3)" }}>
                    Cliente: {project.customerName || "—"} | {project.projectType} | {project.sqft ? `${Number(project.sqft).toLocaleString()} SqFt` : "—"}
                    {project.state ? ` | ${STATE_RATES[project.state]?.name}` : ""}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
                  {[
                    { label: "Costo Base (SqFt × Tarifa)", val: result.baseCost },
                    { label: "Elementos Adicionales", val: result.additionalsCost },
                    { label: "Movilización", val: result.mobilization },
                    { label: `Factor Complejidad (×${complexityFactor})`, val: result.subtotal - (result.baseCost + result.additionalsCost + result.mobilization) },
                    { label: `Margen de Utilidad (${config.profitMargin}%)`, val: result.withMargin - result.subtotal },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.7rem 0", borderBottom: "1px solid var(--border)", fontSize: "0.9rem" }}>
                      <span style={{ color: "var(--text2)" }}>{row.label}</span>
                      <span style={{ fontFamily: "var(--font-mono)", color: row.val < 0 ? "var(--red)" : "var(--text)" }}>
                        {fmt(row.val)}
                      </span>
                    </div>
                  ))}
                </div>

                {result.belowMin && (
                  <div className="min-warning" style={{ margin: "1rem 0" }}>
                    ⚠️ El costo calculado está por debajo del mínimo de proyecto ({fmt(config.minimumProject)}). Se aplica precio mínimo.
                  </div>
                )}

                <div style={{ textAlign: "center", padding: "2rem", background: "linear-gradient(135deg, rgba(61,127,193,0.05), rgba(224,122,48,0.05))", borderRadius: "8px", margin: "1.5rem 0", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text3)", marginBottom: "0.75rem" }}>
                    Presupuesto Estimado del Proyecto
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--orange)", letterSpacing: "1px" }}>
                    {fmt(result.rangeMin)} — {fmt(result.rangeMax)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: "0.5rem" }}>
                    Rango preliminar de presupuesto
                  </div>
                </div>

                <div style={{ fontSize: "0.72rem", color: "var(--text3)", lineHeight: 1.7, fontStyle: "italic", padding: "1rem", background: "var(--surface2)", borderRadius: "6px", border: "1px solid var(--border)" }}>
                  <strong style={{ color: "var(--text2)", fontStyle: "normal" }}>AVISO LEGAL:</strong> Este estimado es únicamente para propósitos presupuestarios y no constituye una propuesta formal ni contrato. El precio final está sujeto a revisión de planos, alcance del proyecto, condiciones del sitio, disponibilidad de mano de obra, precios de materiales y aprobación escrita por parte de Insta Buildings LLC.
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                  <button className="btn btn-primary" onClick={handleSave}>💾 Guardar Estimado</button>
                  <button className="btn btn-orange" onClick={async () => {
                    const { default: jsPDF } = await import("jspdf");
                    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
                    const pw = 215.9; const m = 15; const cw = pw - m * 2; let y = 0;
                    doc.setFillColor(255,255,255); doc.rect(0,0,pw,38,"F");
                    doc.setFontSize(7.5); doc.setTextColor(80,80,80);
                    doc.text("49 Kings Lake Estates Blvd, Humble TX 77346  |  Ph. 832-560-9155  |  admin@instabuildings.com", pw-m, 10, {align:"right"});
                    doc.setFontSize(16); doc.setFont(undefined,"bold"); doc.setTextColor(224,80,20);
                    doc.text("Metal Building Erection", pw-m, 20, {align:"right"});
                    doc.text("Contract", pw-m, 28, {align:"right"});
                    doc.setFontSize(8); doc.setTextColor(60,60,60); doc.setFont(undefined,"normal");
                    const qn = "BDS-"+Date.now().toString().slice(-6);
                    doc.text("Quote No. "+qn, pw-m, 34, {align:"right"});
                    doc.text("Date: "+new Date().toLocaleDateString("en-US"), m, 34);
                    doc.setDrawColor(224,80,20); doc.setLineWidth(1.5); doc.line(m,38,pw-m,38);
                    y = 46;
                    doc.setFillColor(255,252,240); doc.setDrawColor(224,180,80); doc.setLineWidth(0.4);
                    doc.roundedRect(m,y,cw,12,1,1,"FD");
                    doc.setFontSize(8); doc.setTextColor(60,60,60);
                    doc.text(doc.splitTextToSize("This quotation is valid for 30 calendar days from the date of issuance. After this period, Insta Buildings LLC. reserves the right to modify prices, availability, scheduling, and other terms without prior notice.",cw-6),m+3,y+5);
                    y+=18;
                    const sh=(t,yp)=>{doc.setFontSize(9);doc.setFont(undefined,"bold");doc.setTextColor(224,80,20);doc.text(t,m,yp);doc.setDrawColor(224,80,20);doc.setLineWidth(0.5);doc.line(m,yp+1.5,pw-m,yp+1.5);return yp+7;};
                    y=sh("PROJECT INFORMATION",y);
                    const fields=[["Customer",project.customerName||""],["Email",project.email||""],["Phone",project.phone||""],["Address",(project.city||"")+(project.state?", "+STATE_RATES[project.state]?.name:"")+" "+(project.zip||"")],["Project Name",project.projectName||""],["Project Type",project.projectType],["Total Area",project.sqft?Number(project.sqft).toLocaleString()+" SqFt":""],["Building Height",(project.height||"")+" ft"],["Start Date","___________"],["Est. Completion","___________"],["Quote No.",qn]];
                    doc.setFontSize(8);
                    fields.forEach(([l,v],i)=>{const ry=y+i*6.5;doc.setFillColor(i%2===0?250:255,i%2===0?250:255,i%2===0?250:255);doc.rect(m,ry-4,cw,6.5,"F");doc.setDrawColor(220,220,220);doc.setLineWidth(0.2);doc.rect(m,ry-4,cw,6.5,"D");doc.setFont(undefined,"bold");doc.setTextColor(40,40,40);doc.text(l,m+2,ry);doc.setFont(undefined,"normal");doc.setTextColor(80,80,80);doc.text(String(v),m+55,ry);});
                    y+=fields.length*6.5+6;
                    y=sh("SCOPE OF WORK",y);
                    ["Structural Erection Labor","Welding Equipment & Supplies","Skytrack Machinery","Scissor Lift Equipment"].forEach((item,i)=>{doc.setFillColor(i%2===0?255:250,i%2===0?255:250,i%2===0?255:250);doc.rect(m,y-3.5,cw,5.5,"F");doc.setDrawColor(220,220,220);doc.setLineWidth(0.2);doc.rect(m,y-3.5,cw,5.5,"D");doc.setFont(undefined,"normal");doc.setTextColor(60,60,60);doc.text(item,m+2,y);y+=5.5;});
                    y+=5;
                    y=sh("PAYMENT SCHEDULE",y);
                    const tot=result.finalTotal;
                    doc.setFillColor(248,248,248);doc.rect(m,y-3,cw,5,"F");doc.setFontSize(7.5);doc.setFont(undefined,"bold");doc.setTextColor(120,120,120);
                    doc.text("Installment",m+2,y);doc.text("Milestone",m+45,y);doc.text("%",m+148,y);doc.text("Amount (USD)",pw-m-2,y,{align:"right"});y+=4;
                    [["Down Payment","Prior to mobilization","50%",tot*0.50],["Progress Payment","Per % completion (verified in writing)","40%",tot*0.40],["Final Payment","Upon substantial completion","10%",tot*0.10]].forEach(([inst,ms,pct,amt],i)=>{doc.setFillColor(i%2===0?255:250,i%2===0?255:250,i%2===0?255:250);doc.rect(m,y-3.5,cw,6,"F");doc.setDrawColor(220,220,220);doc.setLineWidth(0.2);doc.rect(m,y-3.5,cw,6,"D");doc.setFont(undefined,"bold");doc.setTextColor(40,40,40);doc.text(inst,m+2,y);doc.setFont(undefined,"normal");doc.setTextColor(80,80,80);doc.text(ms,m+45,y);doc.text(pct,m+148,y);doc.setFont(undefined,"bold");doc.text(fmt(amt),pw-m-2,y,{align:"right"});y+=6;});
                    y+=3;
                    doc.setFillColor(255,252,240);doc.setDrawColor(224,130,50);doc.setLineWidth(0.4);doc.rect(m,y,cw,14,"FD");doc.setFontSize(7.5);doc.setFont(undefined,"bold");doc.setTextColor(40,40,40);doc.text("NO RETAINAGE ALLOWED",m+2,y+5);doc.setFont(undefined,"normal");doc.text(" — No retention permitted unless agreed in writing by Insta Buildings LLC.",m+2,y+10,{maxWidth:cw-4});y+=18;
                    doc.addPage();y=20;
                    y=sh("SCOPE CLARIFICATION",y);
                    const si2=[{id:"canopy",label:"Canopy"},{id:"parapets",label:"Parapets"},{id:"dumpsterDoors",label:"Dumpster Doors"},{id:"roofLadders",label:"Roof Ladders"},{id:"framedOpenings",label:"Framed Openings"},{id:"louvers",label:"Louvers"},{id:"walkDoors",label:"Walk Doors"},{id:"overheadDoorFrames",label:"Overhead Door Frames"},{id:"roofExtensions",label:"Roof Extensions"},{id:"mezzanineSupport",label:"Mezzanine Structure"},{id:"trimPackage",label:"Trim & Flashings"},{id:"insulationInstall",label:"Insulation"},{id:"metalDeckInstall",label:"Metal Deck Installation"},{id:"joistInstall",label:"Joist Installation"},{label:"Wall Panels"},{label:"Roof Panels"},{label:"Anchor Bolts"},{label:"Field Welding"},{label:"Crane Service"},{label:"Concrete Work"},{label:"Engineering / Sealed Drawings"},{label:"Permit Processing"}];
                    doc.setFillColor(248,248,248);doc.rect(m,y-3,cw,5,"F");doc.setFont(undefined,"bold");doc.setTextColor(120,120,120);doc.text("Item",m+2,y);doc.text("Status",m+90,y);doc.text("Qty / Description",m+130,y);y+=4;
                    si2.forEach((item,i)=>{const inc=item.id?additionals[item.id]?.enabled:false;doc.setFillColor(i%2===0?255:250,i%2===0?255:250,i%2===0?255:250);doc.rect(m,y-3.5,cw,5.5,"F");doc.setDrawColor(220,220,220);doc.setLineWidth(0.2);doc.rect(m,y-3.5,cw,5.5,"D");doc.setFont(undefined,"normal");doc.setTextColor(60,60,60);doc.text(item.label,m+2,y);if(inc){doc.setTextColor(30,140,80);doc.setFont(undefined,"bold");doc.text("Included",m+90,y);doc.setFont(undefined,"normal");doc.setTextColor(80,80,80);doc.text(String(additionals[item.id]?.qty||""),m+130,y);}else{doc.setTextColor(200,60,40);doc.setFont(undefined,"bold");doc.text("Excluded",m+90,y);doc.setFont(undefined,"normal");}doc.setTextColor(60,60,60);y+=5.5;});
                    y+=6;
                    doc.addPage();y=20;
                    const cl=(t,txt,yp)=>{if(yp>240){doc.addPage();yp=20;}doc.setFontSize(8.5);doc.setFont(undefined,"bold");doc.setTextColor(224,80,20);doc.text(t,m,yp);doc.setDrawColor(224,80,20);doc.setLineWidth(0.4);doc.line(m,yp+1.5,pw-m,yp+1.5);yp+=5;doc.setFontSize(7.5);doc.setFont(undefined,"normal");doc.setTextColor(50,50,50);const ls=doc.splitTextToSize(txt,cw);doc.text(ls,m,yp);return yp+ls.length*3.5+5;};
                    y=cl("LIMITATION OF LIABILITY","THE TOTAL LIABILITY OF INSTA BUILDINGS LLC. SHALL NOT EXCEED THE TOTAL CONTRACT PRICE. Under no circumstances shall Insta Buildings LLC. be liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, revenue, business interruption, or loss of use.",y);
                    y=cl("CLIENT RESPONSIBILITIES","Client shall provide approved construction drawings prior to mobilization. Client is responsible for: accuracy of drawings; correct anchor bolt placement; site accessibility; coordination with other contractors; and compliance with engineering and permits. Client shall provide electrical power within 50 feet of the slab, safe site access, and 25 feet of clear space around the slab perimeter.",y);
                    y=cl("FORMAL ACCEPTANCE","Upon substantial completion, Client has five (5) business days to issue written acceptance or submit a deficiency list. Failure to respond constitutes full acceptance. Title, risk, and responsibility transfer to Client upon acceptance.",y);
                    y=cl("CHANGE ORDERS","Any modification must be documented in a written Change Order signed by both parties prior to commencing additional work. Verbal instructions are not authorization. Insta Buildings LLC. may suspend modified work until a signed Change Order is received.",y);
                    y=cl("WARRANTY","Insta Buildings LLC. warrants installation workmanship for twelve (12) months from written acceptance. Warranty excludes: engineering defects; defective third-party materials; weather damage; structural movement; foundation failures; and post-installation modifications.",y);
                    y=cl("MOBILIZATION & DOWN TIME","One (1) mobilization is included. Additional mobilizations: minimum $2,000 USD/day. Unscheduled downtime caused by site restrictions, unsafe conditions, delays, lack of materials, weather, or Client interference shall be charged to Client.",y);
                    y=cl("FORCE MAJEURE","Insta Buildings LLC. is not liable for delays from natural disasters, hurricanes, storms, floods, fires, governmental acts, war, terrorism, labor shortages, material shortages, pandemics, or any cause beyond its reasonable control.",y);
                    y=cl("GOVERNING LAW","This Contract is governed by the laws of the State of Texas. Disputes shall be resolved by binding arbitration in Harris County, Texas under AAA rules. The prevailing party is entitled to recover attorneys fees and arbitration expenses.",y);
                    if(y>210){doc.addPage();y=20;}
                    y+=5;y=sh("QUOTE ACCEPTANCE",y);
                    doc.setFontSize(7.5);doc.setFont(undefined,"normal");doc.setTextColor(60,60,60);
                    doc.text(doc.splitTextToSize("Once accepted in writing — by signature, email, advance payment, or any express manifestation — this quotation constitutes a legally binding contract. Commencement of work constitutes full acceptance of all terms.",cw),m,y);
                    y+=16;
                    doc.setDrawColor(180,180,180);doc.setLineWidth(0.3);doc.rect(m,y,85,45,"D");doc.rect(m+100,y,85,45,"D");
                    doc.setFillColor(245,245,245);doc.rect(m,y,85,8,"F");doc.rect(m+100,y,85,8,"F");
                    doc.setFontSize(8);doc.setFont(undefined,"bold");doc.setTextColor(40,40,40);
                    doc.text("Seller — Insta Buildings LLC.",m+2,y+5.5);doc.text("Buyer / Client",m+102,y+5.5);
                    doc.setFont(undefined,"normal");doc.setTextColor(80,80,80);doc.setFontSize(7.5);
                    doc.text("Manuel Angel Guajardo",m+2,y+15);doc.text(project.customerName||"_____________________________",m+102,y+15);
                    doc.setDrawColor(100,100,100);doc.line(m+2,y+35,m+80,y+35);doc.line(m+102,y+35,m+180,y+35);
                    doc.setFontSize(7);doc.setTextColor(120,120,120);
                    doc.text("Signature                    Date: ____________",m+2,y+39);
                    doc.text("Signature                    Date: ____________",m+102,y+39);
                    const pc=doc.getNumberOfPages();
                    for(let p=1;p<=pc;p++){doc.setPage(p);doc.setFillColor(245,245,245);doc.rect(0,273.4,pw,6,"F");doc.setDrawColor(224,80,20);doc.setLineWidth(0.5);doc.line(0,273.4,pw,273.4);doc.setFontSize(7);doc.setTextColor(120,120,120);doc.setFont(undefined,"normal");doc.text("49 Kings Lake Estates Blvd, Humble TX 77346  |  832-560-9155  |  admin@instabuildings.com",m,277.5);doc.text("Page "+p+" of "+pc,pw-m,277.5,{align:"right"});}
                    doc.save("InstaBuildings-Contract-"+(project.projectName||"estimate").replace(/\s+/g,"-")+"-"+new Date().toISOString().slice(0,10)+".pdf");
                  }}>
                    📄 Export Contract PDF
                  </button>
                  <button className="btn btn-ghost" onClick={() => alert(`Enviando a: ${project.email}`)}>
                    📧 Enviar por Email
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
            <button className="btn btn-ghost" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>
              ← Anterior
            </button>
            <button className="btn btn-primary" onClick={() => setStep(s => Math.min(4, s + 1))} disabled={step === 4}>
              Siguiente →
            </button>
          </div>
        </div>

        {/* LIVE RESULT PANEL */}
        <div className="result-panel">
          <div className="result-header">
            <h3>📊 Estimado en Vivo</h3>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: "0.2rem" }}>
              {project.sqft ? `${Number(project.sqft).toLocaleString()} sqft` : "Ingrese los datos"}
            </div>
          </div>
          <div className="result-row">
            <span className="result-label">Costo Base</span>
            <span className="result-value">{fmt(result.baseCost)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Adicionales</span>
            <span className="result-value">{fmt(result.additionalsCost)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Movilización</span>
            <span className="result-value">{fmt(result.mobilization)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Factor ×{complexityFactor}</span>
            <span className="result-value" style={{ color: "var(--orange)" }}>
              {fmt(result.subtotal - (result.baseCost + result.additionalsCost + result.mobilization))}
            </span>
          </div>
          <div className="result-row">
            <span className="result-label">Utilidad ({config.profitMargin}%)</span>
            <span className="result-value" style={{ color: "var(--green)" }}>{fmt(result.withMargin - result.subtotal)}</span>
          </div>

          {result.belowMin && (
            <div style={{ padding: "0.5rem 1rem", background: "rgba(208,69,69,0.1)", borderTop: "1px solid rgba(208,69,69,0.2)", fontSize: "0.73rem", color: "#ff8080" }}>
              ⚠️ Mínimo de proyecto aplicado
            </div>
          )}

          <div className="range-display">
            <div className="range-label">Presupuesto Estimado</div>
            <div className="range-values">
              {result.finalTotal > 0 ? `${fmt(result.rangeMin)}\n${fmt(result.rangeMax)}` : "—"}
            </div>
            {result.finalTotal > 0 && (
              <div style={{ fontSize: "0.68rem", color: "var(--text3)", marginTop: "0.4rem" }}>
                Rango de presupuesto preliminar
              </div>
            )}
          </div>

          <div className="disclaimer">
            Solo propósitos presupuestarios. No constituye propuesta formal ni contrato.
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN PANEL
// ============================================================
function AdminPanel({ config, onUpdateConfig, estimates, onBack }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("pricing");
  const [localConfig, setLocalConfig] = useState({ ...config });

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setError(false); }
    else { setError(true); }
  };

  const save = () => {
    onUpdateConfig(localConfig);
    alert("✓ Configuración guardada");
  };

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-icon">🔒</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", letterSpacing: "2px", marginBottom: "0.5rem" }}>ACCESO ADMIN</h2>
          <p style={{ color: "var(--text3)", fontSize: "0.85rem", marginBottom: "2rem" }}>Insta Buildings LLC — Panel de Control</p>
          {error && <div className="alert alert-error">Contraseña incorrecta</div>}
          <div className="form-group" style={{ textAlign: "left", marginBottom: "1rem" }}>
            <label>Contraseña</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={login}>Ingresar</button>
          <button className="btn btn-ghost btn-sm" style={{ width: "100%", marginTop: "0.75rem" }} onClick={onBack}>← Volver al inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="nav">
        <div className="logo-area">
          <div className="logo-icon">IB</div>
          <div>
            <div className="logo-text">INSTA BUILDINGS</div>
            <div className="logo-sub">Panel Administrativo</div>
          </div>
        </div>
        <div className="nav-actions">
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Salir</button>
          <button className="btn btn-primary btn-sm" onClick={save}>💾 Guardar Config</button>
        </div>
      </nav>

      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--surface)", overflowX: "auto" }}>
        {[
          { id: "pricing", label: "🗺️ Tarifas por Estado" },
          { id: "additionals", label: "➕ Costos Adicionales" },
          { id: "margins", label: "🛡️ Márgenes & Mínimos" },
          { id: "estimates", label: "📋 Estimados Guardados" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600,
              color: tab === t.id ? "var(--blue2)" : "var(--text3)",
              borderBottom: `2px solid ${tab === t.id ? "var(--blue)" : "transparent"}`,
              whiteSpace: "nowrap", fontFamily: "var(--font-body)",
              transition: "all 0.15s",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "2rem 2.5rem" }}>
        {/* PRICING TABLE */}
        {tab === "pricing" && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">🗺️ Tarifas por Estado ($/SqFt)</div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Estado</th>
                      <th>Abrev.</th>
                      <th>$/SqFt</th>
                      <th>Movilización ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(STATE_RATES).map(([k, v]) => (
                      <tr key={k}>
                        <td>{v.name}</td>
                        <td style={{ fontFamily: "var(--font-mono)", color: "var(--blue2)" }}>{k}</td>
                        <td>
                          <input type="number" step="0.1"
                            value={localConfig.stateRates[k] ?? v.rate}
                            onChange={e => setLocalConfig(c => ({ ...c, stateRates: { ...c.stateRates, [k]: parseFloat(e.target.value) } }))}
                            style={{ width: 90 }} />
                        </td>
                        <td>
                          <input type="number" step="100"
                            value={localConfig.mobilizationCosts[k] ?? v.mobilization}
                            onChange={e => setLocalConfig(c => ({ ...c, mobilizationCosts: { ...c.mobilizationCosts, [k]: parseFloat(e.target.value) } }))}
                            style={{ width: 110 }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ADDITIONALS TABLE */}
        {tab === "additionals" && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">➕ Costos de Elementos Adicionales</div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Elemento</th>
                    <th>Unidad</th>
                    <th>Costo Unitario ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {ADDITIONAL_ITEMS_CONFIG.map(item => (
                    <tr key={item.id}>
                      <td>{item.label}</td>
                      <td style={{ color: "var(--blue2)", fontFamily: "var(--font-mono)" }}>{item.unitLabel}</td>
                      <td>
                        <input type="number" step="0.5"
                          value={localConfig.additionalCosts[item.id] ?? item.defaultCost}
                          onChange={e => setLocalConfig(c => ({ ...c, additionalCosts: { ...c.additionalCosts, [item.id]: parseFloat(e.target.value) } }))}
                          style={{ width: 120 }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MARGINS */}
        {tab === "margins" && (
          <div className="card" style={{ maxWidth: 600 }}>
            <div className="card-header">
              <div className="card-title">🛡️ Protección de Rentabilidad</div>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Margen de Utilidad (%)</label>
                  <input type="number" min="0" max="100" value={localConfig.profitMargin}
                    onChange={e => setLocalConfig(c => ({ ...c, profitMargin: parseFloat(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label>Precio Mínimo de Proyecto ($)</label>
                  <input type="number" min="0" step="1000" value={localConfig.minimumProject}
                    onChange={e => setLocalConfig(c => ({ ...c, minimumProject: parseFloat(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label>Rango Inferior (%)</label>
                  <input type="number" min="0" max="50" value={localConfig.rangeLow}
                    onChange={e => setLocalConfig(c => ({ ...c, rangeLow: parseFloat(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label>Rango Superior (%)</label>
                  <input type="number" min="0" max="50" value={localConfig.rangeHigh}
                    onChange={e => setLocalConfig(c => ({ ...c, rangeHigh: parseFloat(e.target.value) }))} />
                </div>
              </div>
              <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(46,170,110,0.08)", border: "1px solid rgba(46,170,110,0.2)", borderRadius: "6px" }}>
                <div style={{ fontSize: "0.78rem", color: "var(--text2)" }}>
                  <strong style={{ color: "var(--green)" }}>Configuración Actual:</strong><br />
                  Margen: {localConfig.profitMargin}% | Mínimo: {fmt(localConfig.minimumProject)} | Rango: ±{localConfig.rangeLow}% – ±{localConfig.rangeHigh}%
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: "1.5rem" }} onClick={save}>
                💾 Guardar Configuración
              </button>
            </div>
          </div>
        )}

        {/* ESTIMATES */}
        {tab === "estimates" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "2px" }}>Estimados Guardados</h2>
              <span style={{ fontSize: "0.82rem", color: "var(--text3)" }}>{estimates.length} registros</span>
            </div>
            {estimates.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--text3)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📋</div>
                <div>No hay estimados guardados aún.</div>
              </div>
            ) : estimates.map(est => (
              <div key={est.id} className="estimate-card">
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>
                    {est.project.projectName || "Proyecto sin nombre"}
                  </div>
                  <div className="estimate-meta">
                    {est.project.customerName} | {est.project.projectType} | {est.project.sqft} sqft | {est.project.state}
                  </div>
                  <div className="estimate-meta">{est.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-mono)", color: "var(--orange)", fontWeight: 600 }}>
                    {fmt(est.result.rangeMin)} – {fmt(est.result.rangeMax)}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: "0.2rem" }}>Rango estimado</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [view, setView] = useState("landing"); // landing | estimator | admin
  const [estimates, setEstimates] = useState([]);
  const [config, setConfig] = useState({
    stateRates: {},
    mobilizationCosts: {},
    additionalCosts: {},
    profitMargin: 18,
    minimumProject: 25000,
    rangeLow: 8,
    rangeHigh: 8,
  });

  const handleSaveEstimate = (est) => {
    setEstimates(prev => [est, ...prev]);
  };

  return (
    <div className="app">
      <style>{styles}</style>
      {view === "landing" && (
        <Landing onStart={() => setView("estimator")} onAdmin={() => setView("admin")} />
      )}
      {view === "estimator" && (
        <Estimator config={config} onSaveEstimate={handleSaveEstimate} onBack={() => setView("landing")} />
      )}
      {view === "admin" && (
        <AdminPanel config={config} onUpdateConfig={setConfig} estimates={estimates} onBack={() => setView("landing")} />
      )}
    </div>
  );
}
