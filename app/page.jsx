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
            <img src="/logo.png" alt="Insta Buildings" style={{ height: "48px", objectFit: "contain" }} />
            <div>
              <img src="/logo.png" alt="Insta Buildings" style={{ height: "48px", objectFit: "contain" }} />
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
const [quotePrice, setQuotePrice] = useState("");
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
          <img src="/logo.png" alt="Insta Buildings" style={{ height: "48px", objectFit: "contain" }} />
          <div>
            <img src="/logo.png" alt="Insta Buildings" style={{ height: "48px", objectFit: "contain" }} />
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
                <div style={{ margin: "1.5rem 0", padding: "1.2rem 1.5rem", background: "rgba(61,127,193,0.08)", border: "1px solid var(--blue3)", borderRadius: "8px" }}>
  <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text3)", marginBottom: "0.75rem" }}>
    💲 Precio Final de Cotización
  </div>
  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
    <input
      type="number"
      placeholder={`Ej. ${Math.round(result.finalTotal).toLocaleString()}`}
      value={quotePrice}
      onChange={e => setQuotePrice(e.target.value)}
      style={{ fontSize: "1.2rem", fontWeight: 700, flex: 1 }}
    />
    <div style={{ fontSize: "0.78rem", color: "var(--text3)", whiteSpace: "nowrap" }}>USD</div>
  </div>
  {quotePrice && (
    <div style={{ fontSize: "0.75rem", color: "var(--green)", marginTop: "0.5rem" }}>
      ✓ El contrato se generará por {fmt(parseFloat(quotePrice))}
    </div>
  )}
</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text3)", lineHeight: 1.7, fontStyle: "italic", padding: "1rem", background: "var(--surface2)", borderRadius: "6px", border: "1px solid var(--border)" }}>
                  <strong style={{ color: "var(--text2)", fontStyle: "normal" }}>AVISO LEGAL:</strong> Este estimado es únicamente para propósitos presupuestarios y no constituye una propuesta formal ni contrato. El precio final está sujeto a revisión de planos, alcance del proyecto, condiciones del sitio, disponibilidad de mano de obra, precios de materiales y aprobación escrita por parte de Insta Buildings LLC.
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                  <button className="btn btn-primary" onClick={handleSave}>💾 Guardar Estimado</button>
                  <button className="btn btn-orange" onClick={async () => {
                    const { default: jsPDF } = await import("jspdf");
                    const { default: html2canvas } = await import("html2canvas");
                    const qn = "BDS-" + Date.now().toString().slice(-6);
                    const qDate = new Date().toLocaleDateString("en-US", {month:"2-digit",day:"2-digit",year:"numeric"});
                    const stateData = STATE_RATES[project.state];
                    const logoB64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAWKB2IDASIAAhEBAxEB/8QAHQABAAIDAQEBAQAAAAAAAAAAAAcIBAYJBQMCAf/EAGcQAQABAgMCBAwKFQsDAwMDBQABAgMEBQYHEQgSITETNTdBUWFxc3SxsrMJFBciNjhydYGVFRgjMjNCVVZXYoOEkZOhtMHD0dLTFjRHUlR2goWSlMRTosIkQ+FERWNnpeTwJSZk1P/EABwBAQABBQEBAAAAAAAAAAAAAAAHAgMEBQYBCP/EADsRAQABAgIGCAMIAwACAwEAAAABAgMEBQYRMTVysRIhMzRBUXGBEzJhIlKRobLB0fAjQuGCohVi8RT/2gAMAwEAAhEDEQA/AKZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7ETMxERvmW4aH2c6i1VVRfs4f0nl9XLOLxETFMx9pHPV8HJ24TvofZzp3S0UX7Vj07j6eWcXiKYmqJ+0jmp+Dl7ctBmekWEwGunX0q/KP3nw5/R0WVaM4zMNVeroUec/tHjy+qHtDbI8+z2KMVmm/KMDPLE3aN96uO1R1u7O7uS3DavpDINLbL71vKcFTRdnEWorxFz1125yzz1fojdHaTGjvhDdTe94Va8cuPsZ7i8wzCzFdWqnpR1Rs2+Pn7u1xGj+Dy3Lb026ddXRn7U7dnh5eytICT0UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9DIckzXPsdGCyjA3sXfnniiOSmOzVPNTHbncmvQ2xbBYToeM1Repxt7njCWpmLVM/bVck1dzkjutXmOcYXL6f81XX5Rt/vq22WZLjMyq/w09XnPVH4/wiPSOkM/1TiehZTgqq7cTuuYi5621b7tX6I3z2k56G2R5DkfExWbRTm+Ojl+aU/MaJ7VHX7tX4ISHhMNh8HhreGwli1h7FuN1Fu3RFNNMdiIjkh9Ue5npRisZrot/Yo+m2fWf4STlWieEwWqu79uvznZHpH86/Z/IiIjdEboh/XmZpnWDwG+iaui3v+nRPN3Z6zXK84xmPzHD0119DtdGp+Z0ckc8c/ZaS1g7lyOlsh19uxVXGvwbsjvhDdTe94Va8cpER3whupve8KteOWTku8LPFHNpM93bf4Z5K0gJoQYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+0U1V1RTTTNVUzuiIjfMykzQ2x/O856Hi86mrKcFO6eLVT83rjtU/S/4uXtSxMZjsPgqOnfqiI5+keLMwWX4nHXPh2KJqn8o9Z2QjnA4TFY7FW8JgsNdxN+5O6i3aomqqqe1EJd0NsVxN/iYzVV+cNb5JjB2Komue1VVzR3I3z24S1pTSmRaYwnQMowNFqqY3XL1Xrrtz3VU8vwc3Yh7jgcz0uvXtdGFjox5+P/OaRMq0MsWNVzGT06vLw/mfyj6MHJMoyzJcDTgsqwNnCWKfpbdO7f25nnme3PKznwxmKw+EtdExN2m3T1t/PPcjrtZzTU167vt4GnoVH9er56e52HLW7N7E1TVt1+Mu6sYfqim3GqI/BsOY5lhMBRvxF2ONu5KKeWqfgarmuoMXi99uxM4e1PWpn1092f2PIrrruVzXXVVVVPLMzO+ZfltrGBt2uueuWxt4amjrnrl/X3y7phhu+0+OGOyMu6YYbvtPjhmV/LK/VsSOjvhDdTe94Va8cpER3whupve8KteOWnyXeFnijm5DPd23+GeStICaEGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANi0dovUGqr3FyrBT0CJ3V4m7621R/i689qN8rV6/bsUTXcqiIjxldsWLt+uLdqmapnwhrrdtDbNNRao4mIiz8j8vq5fTV+mY40dminnq7vJHbTDobZPp/T/Q8Vj4jNswp5ePep+ZUT9rR+md/a3JDcRmemERrowcf+U/tH8/g73KtCpnVcx06v/rH7z/H4tS0Ts+05pWmm7hMN6Zx0Ry4vEbqq/8AD1qfg5ezMttfyZiImZmIiOeZeHmuo8Nh99vCxGIu9nf6yPh6/wADiq68Rjbk11zNVXnKQsJgrdiiLViiIiPJ7V67bs25uXa6aKI56qp3RDXc11NTTvt5fTxp/wCrVHJ8Efta9j8disdc4+JuzV2KeaI7kMZsbGXU09dzrn8m0t4WI66ut9cTiL2Juzdv3arlc9eqXyBsYiIjVDLiNQA9BkZd0ww3fafHDHZGXdMMN32nxwpr+WXlWyUjo74Q3U3veFWvHKREd8Ibqb3vCrXjlp8l3hZ4o5uQz3dt/hnkrSAmhBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIy7A4zMsZbweAwt7FYi5O6i3aomqqfgh5VVFMa52PaaZqnVEa5Y709O5Bm+ocdGDyfA3cVd+mmmPW0R2aqp5KY7qVtDbFLlfExmrL/Q6eSYwVir13crrjm7lO/uplyjLMvyjBUYLLMHZwmHo5rdqiKY39mezPbnlcjmeluHw+ujDfbq8/wDWP59vxdnlWhuIxOq5ip6FPl/tP8e/X9EY6G2MZbgOh4zUt6MwxMcsYa3vizTPbnnr/JHalK2Hs2cPYosYe1bs2qI4tFFFMU00x2IiOZ9GFmWaYPAU/N7m+vdyW6eWqXBYvHYrMLmu7VNU+EeEekJHy/K8NgaPh4ajVzn1lmvKzXPMHgd9EVdGvR9JRPN3Z6zXM1z/ABmM327c+l7M/S0zyz3ZeQv2Mt8bv4N1bwnjW9DM82xmPmYu3OJa61ujkj4ey88G0oopojVTGpm00xTGqABW9AAAAGRl3TDDd9p8cMdkZd0ww3fafHCmv5ZeVbJSOjvhDdTe94Va8cpER3whupve8KteOWnyXeFnijm5DPd23+GeStICaEGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9W6K7tym3boqrrqndTTTG+ZnsRDedDbL9Ral4mJvW/kZl9W6ej36Z41cfaUc892d0dtO2itB6d0pbprwGEi7jN26rF3/XXJ7O7rUx2o3dve53M9JcJgddFM9Ovyj95/wD2XS5VovjMfqrqjoUec+PpHj+UIg0NsczjNeh4vP66sqwc8vQt2+/XHc5qPh5e0nDS+mck01g/S2T4C3h4mPX3Oe5c91VPLPijrPYfO/etWLU3b1ym3RHPNU7oR7mOdYvMZ1XKvs/djZ/33SVleQ4PLo/xU66vvT1z/wA9n0Y+NxmGwdromJu00R1onnnuQ8DNdT89vL6PutceKP2tbxF67iLs3b1yq5XPPNU71mxl9dfXX1R+bo7eFqq66up7ma6lv3t9vBUzYo/rz89P7HgVVVV1TVVVNVUzvmZnfMv4Nvas0Wo1UwzqLdNEaqYAF1WAAAAAAAAMjLumGG77T44Y7Iy7phhu+0+OFNfyy8q2SkdHfCG6m97wq145SIjvhDdTe94Va8ctPku8LPFHNyGe7tv8M8laQE0IMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB62mdOZ1qTG+lcnwF3E1R8/XEbqLfbqqnkhN+htjWU5ZxMXqK5TmmKjlixTvixRPbjnr+HdHaanMs6wmXx/lq11eUbf8Anu3GWZFjMyn/ABU6qfvT1R/32RBozQ2odV3YnLsHNGF37q8Xe9bap7k/TT2o3p20Nss09pyLeJxVuM0zCnl6NfpjiUT9pRzR3Z3z24b3Zt27Nqm1Zt0W7dEcWmimN0Ux2Ih+0eZnpLi8bropnoUeUbfef/yElZVotg8Bqrrjp1+c7I9I/wD2R/KqqaaZqqmIiOWZmeSHlZrn2DwW+3RPR70fS0zyR3Zapmea4zMKvm1zdb61unkpj9vwtTYwNy71z1Q663h6q+vZDYs01Jh7G+3g4i/c/rT85H7Wr47G4nG3eiYm7VXPWjrR3IY43NnC27Pyx1+bOt2abewAZC6AAAAAAAAAAAAMjLumGG77T44Y7Iy7phhu+0+OFNfyy8q2SkdHfCG6m97wq145SIjvhDdTe94Va8ctPku8LPFHNyGe7tv8M8laQE0IMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+7Fq7fvUWbFuu7drqimiiimZqqmeaIiOeUqaG2M5pmXQ8ZqO7VlmFndMYendN+uO31qPh3z2oYWNzDD4Gjp36tXOfSGdgctxOPr6GHo18o9ZRlleXY/NcbRgstwl7F4iv523aomqe73O2mTQ2xSI6HjNWX988/pGxXydyuuPFT+FK+m9PZNp3BelMnwFrC25+emI311z2aqp5Z+F6rgMz0tv39dGGjoU+f8At/z26/qkbKdDcPh9VzFT06vL/WP59+r6MXK8vwOV4KjBZdhLOFw9v523apimI/8AntspjY7HYXBW+PibtNHYjrz3IavmupMTiN9vCRNi3/W+nn9jmbWHu4irpfnLuLOHmYiKI1RH4NizPNsHgImLtzjXOtbp5av/AIapmue4zG76KaugWZ+konlnuz13l1TNUzNUzMzzzL+NvYwVu11z1y2FvD00de2QBmr4AAAAAAAAAAAAAAAAyMu6YYbvtPjhjsjLumGG77T44U1/LLyrZKR0d8Ibqb3vCrXjlIiO+EN1N73hVrxy0+S7ws8Uc3IZ7u2/wzyVpATQgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABs+hdD55q+/V8jrVFvC26uLexN2rdRRPPu7Mzu60fkWr9+3h6JuXatUR4yvYfD3cRci3apmqqfCGsJA0Nsq1BqLiYrGUzlWX1csXb9E8euPtaOee7O6O6mHQ2zHTumeh4mu18kswp3T6ZxFMbqJ7NFPNT3eWe23lwuZ6YTOujBx/5T+0fz+Dv8q0JiNVzHT/AOMfvP8AH4ta0bojT2lLUfIzBxViZjdXir26q7V8PWjtRuhsr+V1U0UzXXVFNMRvmZndENfzXUtm1vt4KmL1fNx5+dj9rjZm/jLk11TNUz4ykDC4Si1RFuxTERHhGx7uIv2cPam7fuU26I55qnc1rNdTTO+3l9HFj/q1xy/BH7XgYzF4jGXeiYm7Vcq62/mjuR1nwbKxl9FHXX1z+TaW8LTT11db93rty9cm5euVXK556qp3y/ANhEamUAPQAAAAAAAABmZdl2Lx9e7D2pmnfy1zyUx8KmqqKY11S8mYiNcsN96sLiKMLGKrtVU2aqoppqnk3zumeT8Dbsq09hMJuuX/AP1F2P60etjuR+189bdKbXf48mpgxj6a7kUUR7sf/wDpiquKaWnANgyQAAABkZd0ww3fafHDHZGXdMMN32nxwpr+WXlWyUjo74Q3U3veFWvHKREd8Ibqb3vCrXjlp8l3hZ4o5uQz3dt/hnkrSAmhBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsFwZPYlmXh/6ulX1YLgyexLMvD/1dLmtLN21esc3UaHb0p9J5JYeRm+fYXA1VWaIm9fjnpjkinuy9dH+oOnWK74jXBWKb1cxV4Jow9uK6tUvzmWZ4zH1b7931nWop5KY+BhA39NMUxqpjU2URFMaoAFT0AAAAAAAAB+7Vu5euRbtUVV11c1NMb5l5sH4fbCYXEYu70PD2qrlXX3Rzd3sPfyrTNdW65j6+JHP0OieX4Z6zZcNh7OGtRasWqbdEdamGvv5hRR1Udc/kxbmKpp6qet4WVaZtWt1zHVRdr/6dPzsd3stgt0UW6Iot00000xuiIjdEP08rNNRZNlmY4TLcXj7VGNxlym3Yw8Txq6pqndE7o5o7c8jV1VXsTVq65n6NdfxERHSu1ao+r1Xg636VWu/x5NT3ng636VWu/x5NRhO2pXbHaQ04B0rbAAAADIy7phhu+0+OGOyMu6YYbvtPjhTX8svKtkpHR3whupve8KteOUiI74Q3U3veFWvHLT5LvCzxRzchnu7b/DPJWkBNCDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYLgyexLMvD/wBXSr6sFwZPYlmXh/6ulzWlm7avWObqNDt6U+k8ksI/1B06xXfEgI/1B06xXfEd5Z2k+ia8H80sABu2wAAAAAAAAH9iJmYiI3zPND08ryPGY7dXxeg2Z+nrjn7kddteV5Rg8BETbo493r3KuWfg7DDv423a6tsrFzEU0dW2Wu5VpzE4ndcxUzh7XYmPXz8HW+FtGAwGFwNviYa1FO/nq56p7sspj5jjsHl2DuYzH4qzhsPbjfXcu1xTTHwy093EXcRPR/KGvvYiaomap1QyHmahz7KNP4GcZnGOtYW19Lxp9dXPYppjlqnuIq1ztrtW+iYPSdjotXNONv07qY7dFE8s92rd3JQzm+aZhm+Orx2Z4y9i8RXz3LtW+d3YjsR2o5HS5ZoliMRqrxP2KfL/AGn+Pf8ABxGa6ZYfDa7eFjp1ef8ArH8+3V9Un652z5jj+iYPTNmrL8NO+JxNyIm9XHajmo/LPbhpWzu/exO0nJMRiL1y9euZhbqruXKpqqqnjRyzM8sy1lsWzPqg5D4fa8qHbf8Ax2GwODuUWKdX2Z9Z6vGXB/8AyeKx+Nt14ivX9qOrwjr8IW4eDrfpVa7/AB5NT3ng636VWu/x5NSI8J21KdLHaQ04B0rbAAAADIy7phhu+0+OGOyMu6YYbvtPjhTX8svKtkpHR3whupve8KteOUiI74Q3U3veFWvHLT5LvCzxRzchnu7b/DPJWkBNCDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYLgyexLMvD/ANXSr6sFwZPYlmXh/wCrpc1pZu2r1jm6jQ7elPpPJLCP9QdOsV3xICP9QdOsV3xHeWdpPomvB/NLAAbtsAAAAAHv6Sy7C42q9dxNE19CmOLTM8nLv5/wLV27Fqia5U11xRT0pebluWYzH1fMLfrOvcq5KY+H9jasryDB4Pdcux6Yux16o5I7kPXoppopimimKaY5IiI3RD+tJfx1y71R1Q11zEVV9UdUD83K6LVuq5crpoopjfVVVO6IjszLR9c7UNO6a4+GtXYzLMI5PS+HqiYon7evmp7nLPaQRrXXuotV3KqMdi5s4PfvpwljfTbju9eqe3O/tbm0yzRvF47VXVHQo85/aP7Dks10oweA10Uz06/KPD1nw/OUwa52x5PlM3MJkFFOa4yOSbu/dYonu89fwcnbQdqjU+ealxfpnOMfcxExPrLfztu37mmOSO7z9l44kPLckwmXxrt066vOdv8Az2RrmmfYzMp1XatVP3Y6o/77gDbtMNi2Z9UHIfD7XlQ11sWzPqg5D4fa8qGLje7XOGeTLwHerfFHNbh4Ot+lVrv8eTU954Ot+lVrv8eTUhbCdtS+grHaQ04B0rbAAAADIy7phhu+0+OGOyMu6YYbvtPjhTX8svKtkpHR3whupve8KteOUiI74Q3U3veFWvHLT5LvCzxRzchnu7b/AAzyVpATQgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWC4MnsSzLw/9XSr6sFwZPYlmXh/6ulzWlm7avWObqNDt6U+k8ksI/1B06xXfEgI/wBQdOsV3xHeWdpPomvB/NLAAbtsAAAABtWhfoWL91T+lqratC/QsX7qn9LDx/YVe3NYxPZy2VX/AG6a21Db1Tj9NYXGThMBYi3ExY9bXd41umueNVz7vXTG6N0bufesAq5t06qmc/cPMW2RohYt3sdPxKYnVTMxr89cdaPtM8Rds5fT8OqY11RE6vLVV1NIASkiQAAAAbFsz6oOQ+H2vKhrrYtmfVByHw+15UMXG92ucM8mXgO9W+KOa3Dwdb9KrXf48mp7zwdb9KrXf48mpC2E7al9BWO0hpwDpW2AAAAGRl3TDDd9p8cMdkZd0ww3fafHCmv5ZeVbJSOjvhDdTe94Va8cpER3whupve8KteOWnyXeFnijm5DPd23+GeStICaEGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwXBk9iWZeH/q6VfVguDJ7Esy8P8A1dLmtLN21esc3UaHb0p9J5JYR/qDp1iu+JAR/qDp1iu+I7yztJ9E14P5pYADdtgAAAANq0L9Cxfuqf0tVbVoX6Fi/dU/pYeP7Cr25rGJ7OWyqubdOqpnP3DzFtaNVzbp1VM5+4eYts3Qvv1fBPOlHGnO76OOP01NIASaioAAAAbFsz6oOQ+H2vKhrrYtmfVByHw+15UMXG92ucM8mXgO9W+KOa3Dwdb9KrXf48mp7zwdb9KrXf48mpC2E7al9BWO0hpwDpW2AAAAGRl3TDDd9p8cMdkZd0ww3fafHCmv5ZeVbJSOjvhDdTe94Va8cpER3whupve8KteOWnyXeFnijm5DPd23+GeStICaEGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwXBk9iWZeH/AKulX1YLgyexLMvD/wBXS5rSzdtXrHN1Gh29KfSeSWEf6g6dYrviQEf6g6dYrviO8s7SfRNeD+aWAA3bYAAAADatC/QsX7qn9LVW1aF+hYv3VP6WHj+wq9uaxiezlsqrm3TqqZz9w8xbWjVc26dVTOfuHmLbN0L79XwTzpRxpzu+jjj9NTSAEmoqAAAAGxbM+qDkPh9ryoa62LZn1Qch8PteVDFxvdrnDPJl4DvVvijmtw8HW/Sq13+PJqe88HW/Sq13+PJqQthO2pfQVjtIacA6VtgAAABkZd0ww3fafHDHZGXdMMN32nxwpr+WXlWyUjo74Q3U3veFWvHKREd8Ibqb3vCrXjlp8l3hZ4o5uQz3dt/hnkrSAmhBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsFwZPYlmXh/6ulX1YLgyexLMvD/1dLmtLN21esc3UaHb0p9J5JYR/qDp1iu+JAR/qDp1iu+I7yztJ9E14P5pYADdtgAAAANq0L9Cxfuqf0tVbVoX6Fi/dU/pYeP7Cr25rGJ7OWyqubdOqpnP3DzFtaNVzbp1VM5+4eYts3Qvv1fBPOlHGnO76OOP01NIASaioAAAAbFsz6oOQ+H2vKhrrYtmfVByHw+15UMXG92ucM8mXgO9W+KOa3Dwdb9KrXf48mp7zwdb9KrXf48mpC2E7al9BWO0hpwDpW2AAAAGRl3TDDd9p8cMdkZd0ww3fafHCmv5ZeVbJSOjvhDdTe94Va8cpER3whupve8KteOWnyXeFnijm5DPd23+GeStICaEGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwXBk9iWZeH/q6VfVguDJ7Esy8P/V0ua0s3bV6xzdRodvSn0nklhH+oOnWK74kBH+oOnWK74jvLO0n0TXg/mlgAN22AAAAA2rQv0LF+6p/S1VtWhfoWL91T+lh4/sKvbmsYns5bKq5t06qmc/cPMW1o1XNunVUzn7h5i2zdC+/V8E86Ucac7vo44/TU0gBJqKgAAABsWzPqg5D4fa8qGuti2Z9UHIfD7XlQxcb3a5wzyZeA71b4o5rcPB1v0qtd/jyanvPB1v0qtd/jyakLYTtqX0FY7SGnAOlbYAAAAZGXdMMN32nxwx2Rl3TDDd9p8cKa/ll5VslI6O+EN1N73hVrxykRHfCG6m97wq145afJd4WeKObkM93bf4Z5K0gJoQYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALBcGT2JZl4f+rpV9WC4MnsSzLw/wDV0ua0s3bV6xzdRodvSn0nklhH+oOnWK74kBH+oOnWK74jvLO0n0TXg/mlgAN22AAAAA2rQv0LF+6p/S1VtWhfoWL91T+lh4/sKvbmsYns5bKq5t06qmc/cPMW1o1XNunVUzn7h5i2zdC+/V8E86Ucac7vo44/TU0gBJqKgAAABsWzPqg5D4fa8qGuti2Z9UHIfD7XlQxcb3a5wzyZeA71b4o5rcPB1v0qtd/jyanvPB1v0qtd/jyakLYTtqX0FY7SGnAOlbYAAAAZGXdMMN32nxwx2Rl3TDDd9p8cKa/ll5VslI6O+EN1N73hVrxykRHfCG6m97wq145afJd4WeKObkM93bf4Z5K0gJoQYAAAAAACd9k+j8g1TsvtW82wNNV2MRdijEW/W3aOXrVdjtTvjtNP1zskz7IePi8r35tgKd8zNundeoj7ajr92N/chpLOf4SvE14auejVTMx17J9J/lvr2juMow1GKojpU1RE9W2PWP3hHA/sxMTMTG6Yfxu2hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFguDJ7Esy8P/V0q+rBcGT2JZl4f+rpc1pZu2r1jm6jQ7elPpPJLCP8AUHTrFd8SAj/UHTrFd8R3lnaT6JrwfzSwAG7bAAAAAbVoX6Fi/dU/paq2rQv0LF+6p/Sw8f2FXtzWMT2ctlVc26dVTOfuHmLa0arm3TqqZz9w8xbZuhffq+CedKONOd30ccfpqaQAk1FQAAAA2LZn1Qch8PteVDXWxbM+qDkPh9ryoYuN7tc4Z5MvAd6t8Uc1uHg636VWu/x5NT3ng636VWu/x5NSFsJ21L6CsdpDTgHStsAAAAMjLumGG77T44Y7Iy7phhu+0+OFNfyy8q2SkdHfCG6m97wq145SIjvhDdTe94Va8ctPku8LPFHNyGe7tv8ADPJWkBNCDAAAAAAFluDz1N7PhV3xwkRHfB56m9nwq744SIhfOt4XuKeac8i3bY4Y5NN1xs407qmK792x6SzCrljF4eIiqZ+3jmq+Hl7cII1xs61FpWa71+x6cwEc2Lw8TNMR9tHPT8PJ25WpfyYiqJiYiYnkmJZmWaR4vAaqdfSo8p/afDl9GFmujODzDXXq6FfnH7x48/qpMLI652RZDnnRMXlPFyjHTy/M6fmNc9uj6Xu0/glBmrtIZ/pbE9CzfA1UW5ndbxFHrrVzuVfondPaSHlue4TMI1UVaqvKdvt5+yNM00fxmWzruU66fvRs9/L3eCA3LSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwXBk9iWZeH/q6VfVguDJ7Esy8P/V0ua0s3bV6xzdRodvSn0nklhH+oOnWK74kBH+oOnWK74jvLO0n0TXg/mlgAN22AAAAA2rQv0LF+6p/S1VtWhfoWL91T+lh4/sKvbmsYns5bKq5t06qmc/cPMW1o1XNunVUzn7h5i2zdC+/V8E86Ucac7vo44/TU0gBJqKgAAABsWzPqg5D4fa8qGuti2Z9UHIfD7XlQxcb3a5wzyZeA71b4o5rcPB1v0qtd/jyanvPB1v0qtd/jyakLYTtqX0FY7SGnAOlbYAAAAZGXdMMN32nxwx2Rl3TDDd9p8cKa/ll5VslI6O+EN1N73hVrxykRHfCG6m97wq145afJd4WeKObkM93bf4Z5K0gJoQYAAAAAAstweepvZ8Ku+OEiI74PPU3s+FXfHCREL51vC9xTzTnkW7bHDHJo2GzjGYDF3aaK+iWuiVfM6+WOfrdhs2V51gsfuoiroV7/p1zz9yeu0jF/wA6ve7q8b5s27g7d2NeyXU14emuNfik58sXhsPjMNXhsXYtYixcjdXbu0RVTVHbieSWnZXqHF4TdbvzOItR1qp9dHcn9rasuzLCY+jfh7sTVu5aJ5Ko+Bqb2Fu2J1/nDAu4eqmNVUa4RXrrYtgsX0TGaWvRg708s4S7VM2qvc1c9PcnfHcQrn2SZrkOOnBZvgb2EvxzRXHJVHZpnmqjtxvXKYOd5Plmd4GrBZtgbOLsVfS3Kd+6ezE88T245XRZZpZicNqoxH26fzj38ff8XE5rofhsVrrw32Kv/Wfbw9vwUzEx652K4rD8fGaVvzibfPODv1RFyPc1c1XcndPblEWNwmKwOKuYXGYe7hr9ud1dq7RNNVM9uJSBgczw2Po6VirX9PGPWEcZhlWKy+vo36NXlPhPpP8AZfEBnteAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALBcGT2JZl4f8Aq6VfVguDJ7Esy8P/AFdLmtLN21esc3UaHb0p9J5JYR/qDp1iu+JAR/qDp1iu+I7yztJ9E14P5pYADdtgAAAANq0L9Cxfuqf0tVbVoX6Fi/dU/pYeP7Cr25rGJ7OWyqubdOqpnP3DzFtaNVzbp1VM5+4eYts3Qvv1fBPOlHGnO76OOP01NIASaioAAAAbFsz6oOQ+H2vKhrrYtmfVByHw+15UMXG92ucM8mXgO9W+KOa3Dwdb9KrXf48mp7zwdb9KrXf48mpC2E7al9BWO0hpwDpW2AAAAGRl3TDDd9p8cMdkZd0ww3fafHCmv5ZeVbJSOjvhDdTe94Va8cpER3whupve8KteOWnyXeFnijm5DPd23+GeStICaEGAAAAAALLcHnqb2fCrvjhIiO+Dz1N7PhV3xwkRC+dbwvcU8055Fu2xwxyRri/51e93V43yfXF/zq97urxvk3FOyHXxsH6orrt1xXRVVTVHLExO6YfkevWxZVqW9a3W8dT0Wj/qU/PR3ey2bB4rD4u10TDXablPX3c8d2Osjd9cNiL2GuxdsXardcdemWBfy+ivro6p/JjXMLTV109SSnh6s0pkWqML0DN8DRdqiN1u9T627b9zVHL8E8naY2Vampq3W8fRxZ/6tEcnwx+xsVm5bvW4uWq6a6J5qqZ3xLV9G/hK4qiZpmNkx/LWYnC010zbvUxMT59cK6a52QZ3k3RMXks15tgo5eLRT83ojt0x893afwQjSumqiqaaqZpqid0xMbpiV2Wpa32fad1XTVdxWG9LY6Y9bi7ERTX/AIo5qo7vL2Jh2GWaYV06qMZGuPvRt94/j8HA5roVRXruYKdU/dnZ7T4e/wCMKpDddc7NNRaX6JiJs+n8vp5fTWHpmeLHZrp56fyx22lO6w2Ks4qj4lmqKo+iPsVhL+EuTbvUzTP1AGQxwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYLgyexLMvD/ANXSr6sFwZPYlmXh/wCrpc1pZu2r1jm6jQ7elPpPJLCP9QdOsV3xICP9QdOsV3xHeWdpPomvB/NLAAbtsAAAABtWhfoWL91T+lqratC/QsX7qn9LDx/YVe3NYxPZy2VVzbp1VM5+4eYtrRqubdOqpnP3DzFtm6F9+r4J50o4053fRxx+mppACTUVAAAADYtmfVByHw+15UNdbFsz6oOQ+H2vKhi43u1zhnky8B3q3xRzW4eDrfpVa7/Hk1PeeDrfpVa7/Hk1IWwnbUvoKx2kNOAdK2wAAAAyMu6YYbvtPjhjsjLumGG77T44U1/LLyrZKR0d8Ibqb3vCrXjlIiO+EN1N73hVrxy0+S7ws8Uc3IZ7u2/wzyVpATQgwAAAAABZbg89Tez4Vd8cJER3weepvZ8Ku+OEiIXzreF7inmnPIt22OGOSNcX/Or3u6vG+T64v+dXvd1eN8m4p2Q6+NgAqegADKwGOxWBucfDXZp389PPTPdhiimqmKo1S8mImNUtyyrUeGxG63iojD3Ozv8AWT8PW+F7kTExExO+J5pRi9DLM2xmAmItV8e117dfLHwdhrL+XRPXb/BiXMJE9dDf0ea52T6f1BNzFYCIynH1cvHs0fMq5+2o/TG74W35VnmDx26iaug3p+krnn7k9d6jDsYnE4C70rdU0z/faWnx2X2cVR8LE0a4+v7T4eyo+sdGag0rf4ua4OegTO6jE2vXWq/8XWntTulrq62Is2cRYrsYi1bvWq44tdFdMVU1R2JiedFOudjGXY/omM0zepy/Ezyzhrm+bNc9qeej8sdqHdZZpfau6qMXHRnzjZ7+X92I7zXQu7a13MHPSj7s7fadk/lPqr+PT1FkOb6fx04POMBewl36XjR62uOzTVHJVHceY7K3cpuUxVROuJ8YcPct126porjVMeEgCtQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALBcGT2JZl4f8Aq6VfVguDJ7Esy8P/AFdLmtLN21esc3UaHb0p9J5JYR/qDp1iu+JAR/qDp1iu+I7yztJ9E14P5pYADdtgAAAANq0L9Cxfuqf0tVbVoX6Fi/dU/pYeP7Cr25rGJ7OWyqubdOqpnP3DzFtaNVzbp1VM5+4eYts3Qvv1fBPOlHGnO76OOP01NIASaioAAAAbFsz6oOQ+H2vKhrrYtmfVByHw+15UMXG92ucM8mXgO9W+KOa3Dwdb9KrXf48mp7zwdb9KrXf48mpC2E7al9BWO0hpwDpW2AAAAGRl3TDDd9p8cMdkZd0ww3fafHCmv5ZeVbJSOjvhDdTe94Va8cpER3whupve8KteOWnyXeFnijm5DPd23+GeStICaEGAAAAAALLcHnqb2fCrvjhIiO+Dz1N7PhV3xwkRC+dbwvcU8055Fu2xwxyRri/51e93V43yfXF/zq97urxvk3FOyHXxsAFT0AAAAAAevlef4zB7rdyfTFmPpap5Y7kvIFu5bpuRqqjWpqopqjVMJCy3NMHj6fmFzdXu5bdXJVDNRlRVVRVFVFU01RO+Jid0w97KtS37O63jaZv2/wCvHz8ftam/l1VPXb6/owrmEmOuhseb5Zl+b4GvBZng7OLw9fPbu0747sdie3HKhrXOxS5R0TGaTxHRKef0lfq3VR2qK55+5Vu7qacFjMNjLXRMNdpuR193PHdhkGAzTF5dX/iq1ecTs/D+y0GZZNhMwp6N+jr89kx7/tPUpbmOBxmXYy5g8fhb2GxFud1du7RNNUfBLHXC1RpnJNS4T0tnGAt4iIj1lzmuW/c1Ryx3Oaeug7XWx3OMp6JjMgrqzXBxyza3br9Edzmr+Dl7SQMs0pwuL1UXvsVfXZPpP8o2zXRHF4PXXZ+3R9Nsesfx+SLh+rlFdq5VbuUVUV0zuqpqjdMT2Jh+XUOTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFguDJ7Esy8P/V0q+rBcGT2JZl4f+rpc1pZu2r1jm6jQ7elPpPJLCP9QdOsV3xICP8AUHTrFd8R3lnaT6JrwfzSwAG7bAAAAAbVoX6Fi/dU/paq2rQv0LF+6p/Sw8f2FXtzWMT2ctlVc26dVTOfuHmLa0arm3TqqZz9w8xbZuhffq+CedKONOd30ccfpqaQAk1FQAAAA2LZn1Qch8PteVDXWxbM+qDkPh9ryoYuN7tc4Z5MvAd6t8Uc1uHg636VWu/x5NT3ng636VWu/wAeTUhbCdtS+grHaQ04B0rbAAAADIy7phhu+0+OGOyMu6YYbvtPjhTX8svKtkpHR3whupve8KteOUiI74Q3U3veFWvHLT5LvCzxRzchnu7b/DPJWkBNCDAAAAAAFluDz1N7PhV3xwkRHfB56m9nwq744SIhfOt4XuKeac8i3bY4Y5I1xf8AOr3u6vG+T64v+dXvd1eN8m4p2Q6+NgAqegAAAAAAAAAPph713D3Yu2blVuuOaaZ3NkyrU8Tut5hRu/8Ay0R44/Y1cWL2Ht3o+1C3Xapr2pLsXrV+1F2zcpuUTzTTO+H0RxgcbisFc6Jhr1VE9eOtPdhtGVakw9/dbxkRYuf1vpJ/Y1F/AV2+unrhg3MNVT1x1wxda6D07qu3VXj8J0LGbt1OLsbqbkdjf1qo7U7+1uQTrnZfqLTXHxNq38k8vp5ej4emeNRH29HPHdjfHbWepqpqpiqmYmJ5YmJ5Jf1m5ZpBi8v1UxPSo8p/by5fRy+a6N4PMddVUdGv70fvHjz+qkos5rnZXp7UfRMVhbcZXmFXL0axTHErn7ejmnuxunuoJ1pobUOlLszmOEmvC791GLs76rVXY3z9LPanckTLM/wmYaqaZ6NflP7efP6I0zXRzGZdrqqjpUfejZ7+XL6tZAbtoQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYLgyexLMvD/1dKvqwXBk9iWZeH/q6XNaWbtq9Y5uo0O3pT6TySwj/UHTrFd8SAj/AFB06xXfEd5Z2k+ia8H80sABu2wAAAAG1aF+hYv3VP6Wqtq0L9Cxfuqf0sPH9hV7c1jE9nLZVXNunVUzn7h5i2tGq5t06qmc/cPMW2boX36vgnnSjjTnd9HHH6amkAJNRUAAAANi2Z9UHIfD7XlQ11sWzPqg5D4fa8qGLje7XOGeTLwHerfFHNbh4Ot+lVrv8eTU954Ot+lVrv8AHk1IWwnbUvoKx2kNOAdK2wAAAAyMu6YYbvtPjhjsjLumGG77T44U1/LLyrZKR0d8Ibqb3vCrXjlIiO+EN1N73hVrxy0+S7ws8Uc3IZ7u2/wzyVpATQgwAAAAABZbg89Tez4Vd8cJER3weepvZ8Ku+OEiIXzreF7inmnPIt22OGOSNcX/ADq97urxvk+uL/nV73dXjfJuKdkOvjYAKnoAAAAAAAAAAAAADOyzNcZl9XzG5vt9e3Vy0z+z4G15Vn2Dxu6iuegXp+lrnknuS0YYt/CW73XPVPms3LFNfqk9+L1u3etVWr1ui5brji1UVRviqOxMNJyrPcZgt1FU9Hsx9JXPLHcltWWZrg8wiIs3OLc69urkq/8Alpr2EuWevbHmwLuHqo29cI51zsaynM+PjNO3KcrxU8s2J3zYrntRz0fBvjtIQ1NpzOtN430rnGAu4aqfnK5jfRc7dNUckriMXNMvwOaYKvBZjhLOKw9z563dpiqJ/wDntt/lmlWKwmqi99un67Y9/H3/ABcZmuiOExmuux/jr+myfbw9vwlS8TdrnYpE9Exmk8Ru6/pG/V+SiufFV+FDeaZdj8qxteCzLCXsJiKPnrd2iaZ7vc7aQcvzXC4+nXZq6/Lxj2/sI3zHKMXl1XRv06o8J8J9/wCyxQGxawAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWC4MnsSzLw/9XSr6sFwZPYlmXh/6ulzWlm7avWObqNDt6U+k8ksI/wBQdOsV3xICP9QdOsV3xHeWdpPomvB/NLAAbtsAAAABtWhfoWL91T+lqratC/QsX7qn9LDx/YVe3NYxPZy2VVzbp1VM5+4eYtrRqubdOqpnP3DzFtm6F9+r4J50o4053fRxx+mppACTUVAAAADYtmfVByHw+15UNdbFsz6oOQ+H2vKhi43u1zhnky8B3q3xRzW4eDrfpVa7/Hk1PeeDrfpVa7/Hk1IWwnbUvoKx2kNOAdK2wAAAAyMu6YYbvtPjhjsjLumGG77T44U1/LLyrZKR0d8Ibqb3vCrXjlIiO+EN1N73hVrxy0+S7ws8Uc3IZ7u2/wAM8laQE0IMAAAAAAWW4PPU3s+FXfHCREd8Hnqb2fCrvjhIiF863he4p5pzyLdtjhjkjXF/zq97urxvk+uL/nV73dXjfJuKdkOvjYAKnoAAAAPvThcRVhZxVNqqqzTVNNVUcu6eSeX8L4PImJ2GvWAPQAAAAAAAAf2mZpmJpmYmOaYfweD3sq1JibG63jInEW/6308ftbRgcdhcbb4+Gu019mOvHdhHL92btyzci5ZuVW645qqZ3Swb+At3OunqljXMNTV1x1Skx5WpNPZNqLBelM4wFrFURv4lVUbq6J7NNUcsfA8vKtTzG63mFG+P+rRHL8MfsbLh79nEWou2LlNyieaaZ3tVVbvYWuKo1xMbJj+WuxGGiaZou064nz64lAGudjWaZb0TGacu1ZnhY5Zw9W6L9EdrrV/BuntSiu9au2L1dm9brt3KJmmqiumYqpmOtMTzLrta1nojT2q7M/JLBxTiYp3UYqzupu09jl68dqd8OtyzTC5b1UYuOlHnG33jx/u1wWa6FWrmu5gp6M/dnZ7T4fn7KlCQNc7KtQ6d6JisJROa5fTy9FsUT0SiPt6OeO7G+O4j93mFxljF0fEs1RVH92+SPcXgr+DufDv0TTP1/bz9gBksUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWC4MnsSzLw/8AV0q+rBcGT2JZl4f+rpc1pZu2r1jm6jQ7elPpPJLCP9QdOsV3xICP9QdOsV3xHeWdpPomvB/NLAAbtsAAAABtWhfoWL91T+lqratC/QsX7qn9LDx/YVe3NYxPZy2VVzbp1VM5+4eYtrRqubdOqpnP3DzFtm6F9+r4J50o4053fRxx+mppACTUVAAAADYtmfVByHw+15UNdbFsz6oOQ+H2vKhi43u1zhnky8B3q3xRzW4eDrfpVa7/AB5NT3ng636VWu/x5NSFsJ21L6CsdpDTgHStsAAAAMjLumGG77T44Y7Iy7phhu+0+OFNfyy8q2SkdHfCG6m97wq145SIjvhDdTe94Va8ctPku8LPFHNyGe7tv8M8laQE0IMAAAAAAWW4PPU3s+FXfHCREd8Hnqb2fCrvjhIiF863he4p5pzyLdtjhjkjXF/zq97urxvk+uL/AJ1e93V43ybinZDr42ACp6AAAA3HRPSm73+fJpfTNNPYTFb7ljdh7v2setnux+x89EdKrvf58ml7znr92u3iKppnU1dyuqi7MxKPMxy7F4CvdiLUxTv3RXHLTPwsNJtyii5RNFymmqmqN0xMb4lr+a6ZtXN9zA1Raq/6dXzs9yeszrGY01dVzqZNvFRPVU1IfbF4XEYS70LEWqrdXbjn7nZfFsomJjXDLiYnrgAegAAAAAAAA++CxeJwd3omGu1W6uvu5p7sdd8B5MRVGqSYieqW3ZVqWze3W8bTFmv+vHzs/sbBRVTXTFVFUVUzyxMTviUYs3LczxmAq32Ls8Tfy0VctM/A1l/Lqauu31fRh3MLE9dKQmja52Y6d1N0TE0WvkbmNW+fTNimN1c9mujmq7vJPbbFlGfYXHVU2a4mzfnmpnliruS9dg2r2JwN3pW5mmr+/jDU4zA2sTRNrEURMfX9v5hUzXWh880hfp+SNqi5hblXFs4m1Vvornn3dmJ3dafytYWC4TfsSy3w/wDV1K+pYyLHXMdg6b13b1x1fRDGkGX2svx1Vm1r6PVPX9QBuGlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFguDJ7Esy8P8A1dKvqwXBk9iWZeH/AKulzWlm7avWObqNDt6U+k8ksI/1B06xXfEgI/1B06xXfEd5Z2k+ia8H80sABu2wAAAAG1aF+hYv3VP6Wqtq0L9Cxfuqf0sPH9hV7c1jE9nLZVXNunVUzn7h5i2tGq5t06qmc/cPMW2boX36vgnnSjjTnd9HHH6amkAJNRUAAAANi2Z9UHIfD7XlQ11sWzPqg5D4fa8qGLje7XOGeTLwHerfFHNbh4Ot+lVrv8eTU954Ot+lVrv8eTUhbCdtS+grHaQ04B0rbAAAADIy7phhu+0+OGOyMu6YYbvtPjhTX8svKtkpHR3whupve8KteOUiI74Q3U3veFWvHLT5LvCzxRzchnu7b/DPJWkBNCDAAAAAAFluDz1N7PhV3xwkRHfB56m9nwq744SIhfOt4XuKeac8i3bY4Y5I1xf86ve7q8b5Pri/51e93V43ybinZDr42ACp6AAAA3HRHSq73+fJpe88HRHSq73+fJpe85rF9tU1N/tJeRk2pMlzfH4zAYLHW68Zg71dm/h6vW3KaqKppmd088b4545Hrqia2v3sNtDz3EYe9cs3rea4iqi5bqmmqmei1csTHLEt80NtnzDA8TB6ms1Zhh45IxNuIi9THbjmr/JPbl0+M0TvRapvYWelExE6p2+3hP8AdrhcFpjZqu1WcXHRmJmNcbNvj4x+ceiesTh7GJtTaxFqm5RPWqhrWa6Zrp33MBXx4/6dU8vwT13saez7KNQYKMZk+Ps4u11+JO6qmexVTPLTPdh6TmaLt7C1zTPVMbYn+HbWMTrpiu3VrifeJRndt3LVybd2iqiunnpqjdMPwkXH4DC463xMTaiqetVzVR3JatmmnMVht9zCzOItdiI9fHwdf4G1sY+3c6quqWyt4mmvqnql4Y/sxMTMTG6Y54fxnsgAAAAAAAAABn6f6dYXviQEf6f6dYXviQGkzPtI9GvxnzQifhN+xLLfD/1dSvqwXCb9iWW+H/q6lfUiaJ7tp9Z5oU0x3pV6RyAHSuXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFguDJ7Esy8P8A1dKvqwXBk9iWZeH/AKulzWlm7avWObqNDt6U+k8ksI/1B06xXfEgI/1B06xXfEd5Z2k+ia8H80sABu2wAAAAG1aF+hYv3VP6Wqtq0L9Cxfuqf0sPH9hV7c1jE9nLZVXNunVUzn7h5i2tGq5t06qmc/cPMW2boX36vgnnSjjTnd9HHH6amkAJNRUAAAANi2Z9UHIfD7XlQ11sWzPqg5D4fa8qGLje7XOGeTLwHerfFHNbh4Ot+lVrv8eTU954Ot+lVrv8eTUhbCdtS+grHaQ04B0rbAAAADIy7phhu+0+OGOyMu6YYbvtPjhTX8svKtkpHR3whupve8KteOUiI74Q3U3veFWvHLT5LvCzxRzchnu7b/DPJWkBNCDAAAAAAFluDz1N7PhV3xwkRHfB56m9nwq744SIhfOt4XuKeac8i3bY4Y5I1xf86ve7q8b5Pri/51e93V43ybinZDr42ACp6AAAA3HRHSq73+fJpe88HRHSq73+fJpe85rF9tU1N/tJVA1/7O9Qe+eJ87U8R7ev/Z3qD3zxPnaniJrwnYUekcnz1jO8XPWebMyfNMxyfHUY7K8ZewmIo5q7VW6d3Ynsx2p5EzaG212rnQ8Hqyx0KrkiMbYp30z266I5Y7tO/uQg0YuYZThcwp1XqevzjbHv/PUzMtzjF5dVrsVdXjE9cT7fx1rpZfjcHmOEoxeAxVnE4e5G+m5ariqmfhhkKfaX1PnmmcX6YyfH3MPvn19v563c91TPJPd5046G2xZNm/Q8Jn1NGVYyeTokz8wrnuzy0f4uTto+zPRbFYTXXa+3T9Nsesfx+SSMq0twmM1UXvsV/XZPpP8AP5pAzTKMHj4mblHEu9a5RyT8PZapmmR4zA76+L0azH09Ec3djrN5t10XbdNy3XTXRVG+mqmd8THZiX6aKxjLlnq2x5OytYiqjZ1wjAbvmmQYPGb7lqPS96evTHrZ7sNVzLLMZgKt1+36zfyXKeWmfhbixi7d7qjqnyZ9u/Tc2bWEAyl4AAAAABn6f6dYXviQEf6f6dYXviQGkzPtI9GvxnzQifhN+xLLfD/1dSvqwXCb9iWW+H/q6lfUiaJ7tp9Z5oU0x3pV6RyAHSuXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFguDJ7Esy8P/AFdKvqwXBk9iWZeH/q6XNaWbtq9Y5uo0O3pT6TySwj/UHTrFd8SAj/UHTrFd8R3lnaT6JrwfzSwAG7bAAAAAbVoX6Fi/dU/paq2rQv0LF+6p/Sw8f2FXtzWMT2ctlVc26dVTOfuHmLa0arm3TqqZz9w8xbZuhffq+CedKONOd30ccfpqaQAk1FQAAAA2LZn1Qch8PteVDXWxbM+qDkPh9ryoYuN7tc4Z5MvAd6t8Uc1uHg636VWu/wAeTU954Ot+lVrv8eTUhbCdtS+grHaQ04B0rbAAAADIy7phhu+0+OGOyMu6YYbvtPjhTX8svKtkpHR3whupve8KteOUiI74Q3U3veFWvHLT5LvCzxRzchnu7b/DPJWkBNCDAAAAAAFluDz1N7PhV3xwkRHfB56m9nwq744SIhfOt4XuKeac8i3bY4Y5I1xf86ve7q8b5Pri/wCdXvd1eN8m4p2Q6+NgAqegAAANx0R0qu9/nyaXvPB0R0qu9/nyaXvOaxfbVNTf7SVQNf8As71B754nztTxHt6/9neoPfPE+dqeImvCdhR6RyfPWM7xc9Z5gDIY4ADatFa91FpS5TRgcV0bB799WEv76rc9zr0z3N3b3p20NtP07qbiYa5d+RuYVcnpfEVRuqn7Svmq7nJPaVfGizPR/CY/XVMdGvzj9/Pn9XQZVpJjMu1UxPSo+7P7T4cvou0/ldNNdM010xVTPJMTG+JQDsM1tqG5qnAaZxeMnF4C/FyIi/66u1xbdVUcWrn3etiN0743c25P6M81yy5lt/4NyYnq1xMeX9hKmUZrazTD/HtxMap1TE+fVP7tO1bl2FwVVm7hqJo6LM8amJ5I3bub8LwW1a6+hYT3VX6GqthgqpqsxMy6nDzM24mQBlrwAAADP0/06wvfEgI/0/06wvfEgNJmfaR6NfjPmhE/Cb9iWW+H/q6lfVguE37Est8P/V1K+pE0T3bT6zzQppjvSr0jkAOlcuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALBcGT2JZl4f+rpV9WC4MnsSzLw/wDV0ua0s3bV6xzdRodvSn0nklhH+oOnWK74kB52aZNg8fvqro6Hd/6lHJPw9lGmCv02a9dXimfD3It1a5aCPTzTJcZgN9dVPRbMf+5RHJHdjrPMb+iumuNdM62zpqiqNcACt6AANq0L9Cxfuqf0tVbVoX6Fi/dU/pYeP7Cr25rGJ7OWyqubdOqpnP3DzFtaNVzbp1VM5+4eYts3Qvv1fBPOlHGnO76OOP01NIASaioAAAAbFsz6oOQ+H2vKhrrYtmfVByHw+15UMXG92ucM8mXgO9W+KOa3Dwdb9KrXf48mp7zwdb9KrXf48mpC2E7al9BWO0hpwDpW2AAAAGRl3TDDd9p8cMdkZd0ww3fafHCmv5ZeVbJSOjvhDdTe94Va8cpER3whupve8KteOWnyXeFnijm5DPd23+GeStICaEGAAAAAALLcHnqb2fCrvjhIiO+Dz1N7PhV3xwkRC+dbwvcU8055Fu2xwxyRri/51e93V43yfXF/zq97urxvk3FOyHXxsAFT0AAABuOiOlV3v8+TS954OiOlV3v8+TS95zWL7apqb/aSqBr/ANneoPfPE+dqeI9vX/s71B754nztTxE14TsKPSOT56xneLnrPMAZDHAAAAbvsL6qmTfd/MXFo1XNhfVUyb7v5i4tGjLTTv1HBHOpKug276+Of00ta119Cwnuqv0NVbVrr6FhPdVfoaqwsB2Ee/NI+G7OABmL4AAD08ryXGY/dXFPQrM/+5XHP3I66iu5TRGuqdTyqqKY1y+en+nWF74kB52V5Pg8BEVW6OiXf+pXyz8HYei0GMv03q9dOyGsxFyLlWuET8Jv2JZb4f8Aq6lfVguE37Est8P/AFdSvqS9E920+s80MaY70q9I5ADpXLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwXBk9iWZeH/q6VfVguDJ7Esy8P/V0ua0s3bV6xzdRodvSn0nklgBFKYB42a6ewmL33LG7D3Z69Metnux+x7Irt3a7c66Z1Kqa6qJ1xKPMxy3F4CvdiLUxTv5K45aZ+FhpNuUUXKJorpiqmY3TExviWv5rpm1d33MDV0Kr/p1fOz3Ow29jMaauq51M63ionqqakPvi8LiMJd6FiLVVurt809yeu+DZRMTGuGXExPXA2rQv0LF+6p/S1VtWhfoWL91T+liY/sKvbmsYns5bKq5t06qmc/cPMW1o1XNunVUzn7h5i2zdC+/V8E86Ucac7vo44/TU0gBJqKgAAABsWzPqg5D4fa8qGuti2Z9UHIfD7XlQxcb3a5wzyZeA71b4o5rcPB1v0qtd/jyanvPB1v0qtd/jyakLYTtqX0FY7SGnAOlbYAAAAZGXdMMN32nxwx2Rl3TDDd9p8cKa/ll5VslI6O+EN1N73hVrxykRHfCG6m97wq145afJd4WeKObkM93bf4Z5K0gJoQYAAAAAAstweepvZ8Ku+OEiI74PPU3s+FXfHCREL51vC9xTzTnkW7bHDHJGuL/nV73dXjfJ9cX/ADq97urxvk3FOyHXxsAFT0AAABuOiOlV3v8APk0veeDojpVd7/Pk0vec1i+2qam/2kqga/8AZ3qD3zxPnaniPb1/7O9Qe+eJ87U8RNeE7Cj0jk+esZ3i56zzAGQxwAAAG77C+qpk33fzFxaNVzYX1VMm+7+YuLRoy0079RwRzqSroNu+vjn9NLWtdfQsJ7qr9DVW1a6+hYT3VX6GqsLAdhHvzSPhuzgB98HhMRi7vQ8NaquVdrmjuz1mXMxEa5X5mI65fBmZdluLx9e7D2vW9eurkpj4WxZXpqza3XMdVF6v+pT87H7Xv0UU0URRRTFNMRuiIjdENZfzGmnqt9bEuYqI6qXkZVp/CYTdcvRGIvR16o9bHch7INTcu13J11TrYNVdVc65kAUKUT8Jv2JZb4f+rqV9WC4TfsSy3w/9XUr6lbRPdtPrPND+mO9KvSOQA6Vy4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsFwZPYlmXh/6ulX1YLgyexLMvD/ANXS5rSzdtXrHN1Gh29KfSeSWAEUpgAAAAfLE4ezibU2r9qm5RPWqhrWa6Zrp33MBXx4/wCnXPL8EtqF6ziLlmfsyuW7tVvYjO7buWbk27tFVFdPPTVG6YbPoX6Fi/dU/pe5j8Bhcdb4mJtRVu5quaqO5LGyTK4yyq/TTd6JRcmJp3xumN2/nZ17G03rE0z1SyLmIi5bmPF6Srm3TqqZz9w8xbWjVc26dVTOfuHmLbdaF9+r4J50uA053fRxx+mppACTUVAAAADYtmfVByHw+15UNdbFsz6oOQ+H2vKhi43u1zhnky8B3q3xRzW4eDrfpVa7/Hk1PeeDrfpVa7/Hk1IWwnbUvoKx2kNOAdK2wAAAAyMu6YYbvtPjhjsjLumGG77T44U1/LLyrZKR0d8Ibqb3vCrXjlIiO+EN1N73hVrxy0+S7ws8Uc3IZ7u2/wAM8laQE0IMAAAAAAWW4PPU3s+FXfHCREd8Hnqb2fCrvjhIiF863he4p5pzyLdtjhjkjXF/zq97urxvk+uL/nV73dXjfJuKdkOvjYAKnoAAADcdEdKrvf58ml7zwdEdKrvf58ml7zmsX21TU3+0lUDX/s71B754nztTxHt6/wDZ3qD3zxPnaniJrwnYUekcnz1jO8XPWeYAyGOAAAA3fYX1VMm+7+YuLRqubC+qpk33fzFxaNGWmnfqOCOdSVdBt318c/ppa1rr6FhPdVfoaxZtXL1yLdqiquueammN8t6zrK4zOqxTXdm3RbmZq3Ryzv3czJwGBwuBt8TDWoo7NXPM92Wls42mzZimOuXf28RFu3EeLX8q0zVVuuZhVxY/6VE8vwz+xsmGsWcNai1YtU26I61MPqMG9iLl6ftSx7l2qvaALK2AAAAifhN+xLLfD/1dSvqwXCb9iWW+H/q6lfUraJ7tp9Z5of0x3pV6RyAHSuXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFguDJ7Esy8P8A1dKvqwXBk9iWZeH/AKulzWlm7avWObqNDt6U+k8ksAIpTAAAAAAAAAKubdOqpnP3DzFtaNVzbp1VM5+4eYtuu0L79XwTzpcZpzu+jjj9NTSAEmoqAAAAGxbM+qDkPh9ryoa62LZn1Qch8PteVDFxvdrnDPJl4DvVvijmtw8HW/Sq13+PJqe88HW/Sq13+PJqQthO2pfQVjtIacA6VtgAAABkZd0ww3fafHDHZGXdMMN32nxwpr+WXlWyUjo74Q3U3veFWvHKREd8Ibqb3vCrXjlp8l3hZ4o5uQz3dt/hnkrSAmhBgAAAAACy3B56m9nwq744SIjvg89Tez4Vd8cJEQvnW8L3FPNOeRbtscMcka4v+dXvd1eN8n1xf86ve7q8b5NxTsh18bABU9AAAAbjojpVd7/Pk0veeDojpVd7/Pk0vec1i+2qam/2kqga/wDZ3qD3zxPnaniPb1/7O9Qe+eJ87U8RNeE7Cj0jk+esZ3i56zzAGQxwAAAG77C+qpk33fzFxaNVzYX1VMm+7+YuLRoy0079RwRzqSroNu+vjn9NIA5F2YAAAAAAACJ+E37Est8P/V1K+rBcJv2JZb4f+rqV9Stonu2n1nmh/THelXpHIAdK5cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWC4MnsSzLw/wDV0q+rBcGT2JZl4f8Aq6XNaWbtq9Y5uo0O3pT6TySwAilMAAAAAAAAAq5t06qmc/cPMW1o1XNunVUzn7h5i267Qvv1fBPOlxmnO76OOP01NIASaioAAAAbFsz6oOQ+H2vKhrrYtmfVByHw+15UMXG92ucM8mXgO9W+KOa3Dwdb9KrXf48mp7zwdb9KrXf48mpC2E7al9BWO0hpwDpW2AAAAGRl3TDDd9p8cMdkZd0ww3fafHCmv5ZeVbJSOjvhDdTe94Va8cpER3whupve8KteOWnyXeFnijm5DPd23+GeStICaEGAAAAAALLcHnqb2fCrvjhIiO+Dz1N7PhV3xwkRC+dbwvcU8055Fu2xwxyRri/51e93V43yfXF/zq97urxvk3FOyHXxsAFT0AAABuOiOlV3v8+TS954OiOlV3v8+TS95zWL7apqb/aSqBr/ANneoPfPE+dqeI9vX/s71B754nztTxE14TsKPSOT56xneLnrPMAZDHAAAAbvsL6qmTfd/MXFo1XNhfVUyb7v5i4tGjLTTv1HBHOpKug276+Of00gDkXZgAAAAAAAIn4TfsSy3w/9XUr6sFwm/Yllvh/6upX1K2ie7afWeaH9Md6VekcgB0rlwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYLgyexLMvD/ANXSr6sFwZPYlmXh/wCrpc1pZu2r1jm6jQ7elPpPJLACKUwAAAAAAAACrm3TqqZz9w8xbWjVc26dVTOfuHmLbrtC+/V8E86XGac7vo44/TU0gBJqKgAAABsWzPqg5D4fa8qGuti2Z9UHIfD7XlQxcb3a5wzyZeA71b4o5rcPB1v0qtd/jyanvPB1v0qtd/jyakLYTtqX0FY7SGnAOlbYAAAAZGXdMMN32nxwx2Rl3TDDd9p8cKa/ll5VslI6O+EN1N73hVrxykRHfCG6m97wq145afJd4WeKObkM93bf4Z5K0gJoQYAAAAAAstweepvZ8Ku+OEiI74PPU3s+FXfHCREL51vC9xTzTnkW7bHDHJGuL/nV73dXjfJ9cX/Or3u6vG+TcU7IdfGwAVPQAAAG46I6VXe/z5NL3ng6I6VXe/z5NL3nNYvtqmpv9pKoGv8A2d6g988T52p4j29f+zvUHvnifO1PETXhOwo9I5PnrGd4ues8wBkMcAAABu+wvqqZN938xcWjVc2F9VTJvu/mLi0aMtNO/UcEc6kq6Dbvr45/TSAORdmAAAAAAAAifhN+xLLfD/1dSvqwXCb9iWW+H/q6lfUraJ7tp9Z5of0x3pV6RyAHSuXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFguDJ7Esy8P8A1dKvqwXBk9iWZeH/AKulzWlm7avWObqNDt6U+k8ksAIpTAAAAAAAAAKubdOqpnP3DzFtaNVzbp1VM5+4eYtuu0L79XwTzpcZpzu+jjj9NTSAEmoqAAAAGxbM+qDkPh9ryoa6zchzK9k+dYPNcPRRXdwl6m9RTXv4szTO/dO7rLGJtzcs10U7ZiY/Jfwtym3forq2RMT+ErmsLOcvozLB9AquTbmKuNTVEb+XdMcv4WmaG2q6e1F0PC4uuMqzCrk6FfrjiVz9pXzT3J3T3UgIWxGGxGBu9G7TNNUf3q8JTxgsfYxdEXcPXFUfT9/L3R/meVYzL6t963xrfWuU8tP/AMMBJ1URVE01RExPPEvCzXTeHv77mDmLFz+r9JP7GbYzGJ6rnV9W4t4uJ6q2nDJx2CxWCudDxNqqjsT1p7ksZs6aoqjXDLiYmNcACp6MjLumGG77T44Y7Iy7phhu+0+OFNfyy8q2SkdHfCG6m97wq145SIjvhDdTe94Va8ctPku8LPFHNyGe7tv8M8laQE0IMAAAAAAWW4PPU3s+FXfHCREd8Hnqb2fCrvjhIiF863he4p5pzyLdtjhjkjXF/wA6ve7q8b5Pri/51e93V43ybinZDr42ACp6AycDgcVjbnEw1qqvszzRHdlTVVFMa5eTMRGuWMz8synGY+Ym1b4tvr3KuSn/AOWx5VpvDYfdcxcxiLkfS/SR+34XuUxFMRTTEREc0Q1l/MYjqt9f1YlzFxHVQw8my+jLcJ0Ci5VcmauNVVMbuXdEcn4GaDU1VTXM1TtYMzNU65VA1/7O9Qe+eJ87U8R7ev8A2d6g988T52p4iccJ2FHpHJ8/YzvFz1nmAMhjgAAAN32F9VTJvu/mLi0armwvqqZN938xcWjRlpp36jgjnUlXQbd9fHP6aQByLswAAAAAAAET8Jv2JZb4f+rqV9WC4TfsSy3w/wDV1K+pW0T3bT6zzQ/pjvSr0jkAOlcuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALBcGT2JZl4f+rpV9WC4MnsSzLw/9XS5rSzdtXrHN1Gh29KfSeSWAEUpgAAAAAAAAFXNunVUzn7h5i2tGq5t06qmc/cPMW3XaF9+r4J50uM053fRxx+mppACTUVAAAAAADedDbTtRaZ6Hhq7vySy6nk9LYiqd9Ediivnp7nLHaaMMfE4SziqPh3qYqj6snC4y/hLnxLFU0z9P71rYaJ19p3VdFNGBxXQMZu31YS/upuR2d3WqjufDubUpPbrrt3KbluuqiumYmmqmd0xMc0xKTtC7Ys5yjoeEz6mvNsHHJ0SZ+b0R7qfn/wDFy9twmZ6H10a68HOuPuzt9p8ff80g5VprRXqt42NU/ejZ7x4e35LD3rVq9bm3et03KJ56ao3w1zNNMRO+5l9e6f8ApVz4p/azdLaoyPU2E9MZPj7d/dG+u3Prblv3VM8sd3mey5CKr+ErmmYmJjbE/wAO+w+KiqmLlqrXE+XXCNMRYvYe7Nq/bqt1xzxVD5pIxuEw2MtdDxNqm5T1t/PHcnrNXzXTV+zvuYKqb1HPxJ+ej9raWMfRc6quqWyt4mmrqq6pa+yMu6YYbvtPjh8a6aqKpprpmmqOSYmN0w+2XdMMN32nxwza/llkTsSOjvhDdTe94Va8cpER3whupve8KteOWoyXeFnijm5DPd23+GeStICaEGAAAAAALLcHnqb2fCrvjhIiO+Dz1N7PhV3xwkRC+dbwvcU8055Fu2xwxyRri/51e93V43yfXF/zq97urxvxRTVXXFFFM1VTO6IiN8y3FPyw6+Nj8vrh7F7EXYtWLdVyuetTD3Mq01eu7rmOqmzRz8SPnp/Y2fB4TD4O10PDWqbdPX3c892euwb+YUW+qjrn8mPcxNNPVT1vAyrTNMbrmYV8af8ApUTyfDP7Gx2bVuzbi3aopoojmppjdD9jUXb9d2ddUsCu5VXPXIAsqAAFQNf+zvUHvnifO1PEe3r/ANneoPfPE+dqeInPCdhR6RyfP+M7xc9Z5gDIY4AAADd9hfVUyb7v5i4tGq5sL6qmTfd/MXFo0Zaad+o4I51JV0G3fXxz+mkAci7MAAAAAAABE/Cb9iWW+H/q6lfVguE37Est8P8A1dSvqVtE920+s80P6Y70q9I5ADpXLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwXBk9iWZeH/q6VfVguDJ7Esy8P/V0ua0s3bV6xzdRodvSn0nklgBFKYAAAAAAAABVzbp1VM5+4eYtrRqubdOqpnP3DzFt12hffq+CedLjNOd30ccfpqaQAk1FQAAAAAAAAADIy/G4vL8XRi8Dib2GxFud9Fy1XNNUfDCX9Dba71voeD1ZYm9RzenbFERVHbrojknu07u5KGBr8fleGx9PRv06/r4x7/wBhscvzbFZdX0rFerzjwn1j+yubk2a5dnGBoxuV42zi8PXzV26t+6exPXie1PKzVN9PZ7m+n8dGMyfH3sJd6/En1tcdiqmeSqO1MJs0Ntoy/HcTB6ntU4DETyRibcTNmqe3HPT+WO4j/M9FMThdddj7dP5x7ePt+CSMq0wwuL1UYj7FX/rPv4e/4pPzLLMHj6d1+36/dyXKeSqPha5cyDF4LH2Ltv5vZi7TM1Uxy0xvjnhtmGv2MTYoxGGvW71m5HGouW6oqpqjsxMckvo521ibtn7Ph5O0t36qY6p1wI74Q3U3veFWvHKREd8Ibqb3vCrXjllZLvCzxRzaXPd23+GeStICaEGAAAAAALLcHnqb2fCrvjhIiO+Dz1N7PhV3xwkRC+dbwvcU8055Fu2xwxyabhdP4vGYq5cu/wDp7M1zO+qPXTG/rQ2bLctwmAo3WLfruvXVy1T8LMGLexVy71TPU3Vy9VX1TsAGMtAAAAAAKga/9neoPfPE+dqeI9vX/s71B754nztTxE54TsKPSOT5/wAZ3i56zzAGQxwAAAG77C+qpk33fzFxaNVzYX1VMm+7+YuLRoy0079RwRzqSroNu+vjn9NIA5F2YAAAAAAACJ+E37Est8P/AFdSvqwXCb9iWW+H/q6lfUraJ7tp9Z5of0x3pV6RyAHSuXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFguDJ7Esy8P/V0q+rBcGT2JZl4f+rpc1pZu2r1jm6jQ7elPpPJLACKUwAAAAAAAADTdebOcg1bVXir9FWDzGYiIxdnnq3Rujj081UckdieTnbkL+GxN7DXIuWappn6MfE4Wzirc2r1MVUz4SqprfZ5qLStVd7E4f01gInkxdiJqoiPto56Ph5OxMtQXZqiKqZpqiJiY3TE9dGuudkORZ30TF5PNOUY6eXdRTvsVz26fpe7T+CXdZZphTVqoxkap+9Gz3j+PwR/muhVdOu5gp1x92dvtP8AP4yrgPd1bpPPtL4roOb4Gu3RM7rd+n11q57mrm+Dn7TwnbWrtu9RFduYmJ8YcHes3LNc0XKZiY8JAFxbAAAAAAAAAAbDo/WWoNK4iK8qxtUWZnfXhrvrrVfdp609uN09tOmhtrWQZ9FvC5lVTlOPq5OLdq+ZVz9rXzR3J3djlVqGlzPIcJmEa641VecbffzbzKtIcZlsxTRVro+7Oz28vZdpHfCG6m97wq145Q7obaTqLS00Yei96fy+nnwuIqmYpj7Srnp/LHabrtL1/kGrtmt21g7tWHx0X7VVeEvclcRvnfNM81Udzl7MQ4+zo9i8vzC1VMdKjpR1x6+MeHL6u2v6S4PMcuvURPRr6M9U+nhPjz+iFgElItAAAAAAWW4PPU3s+FXfHCREd8Hnqb2fCrvjhIiF863he4p5pzyLdtjhjkANY2oAAAAAAACoGv8A2d6g988T52p4j29f+zvUHvnifO1PETnhOwo9I5Pn/Gd4ues8wBkMcB72ktI5/qnE9CyjA13LcTuuX6/W2rfdq/RG+e0t3b1uzRNdyqIiPGV2zZuX64t26ZmZ8IeC3DQ+zrUWqqqL1jD+k8BM8uLxETFMx9rHPV8HJ24TDobZFkWR9DxebcXNsdHL80p+Y0T2qPpu7Vv7kJIiIpiIiIiI5IiHE5nphTTrowca/wD7Ts9o/n8Hd5VoVVVquY2dUfdjb7z/AB+LT9CbO9P6TmjE4e1OLzGImJxd756N8bp4sc1PJMxycu6eWZbiDhcRibuJuTcvVTVP1SBhsLZwtuLdmmKaY8IAFhkAAAAAAAAIn4TfsSy3w/8AV1K+rBcJv2JZb4f+rqV9Stonu2n1nmh/THelXpHIAdK5cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWC4MnsSzLw/9XSr6sFwZPYlmXh/6ulzWlm7avWObqNDt6U+k8ksAIpTAAAAAAAAAAAAA+OMwuGxuFuYXGYe1iLFyOLXbu0RVTVHYmJ50R652K4XE8fGaWvxhbs75nCXqpm3V7mrnp7k747iYhnYHMsTgK+lYq1fTwn1hr8wyvC5hR0b9Gvynxj0lTTPMmzTI8dVgs2wN7CX6fpblPJVHZieaY7cMBcvPcmyvPcBVgc2wNnF2KvpblPLTPZpnnpntxyoV1zsWxeG6JjNLX5xdnnnCXqoi5T7mrmq7k7p7qQMs0sw+J1UYj7FX5T7+Hv+KOM10PxOF114b7dPl/tHt4+34IeH2xmGxODxNzDYuxdw9+3O6u3cpmmqme3Evi6yJiY1w4+YmJ1SAPXgAAAAAAAAAAAAAAAAACy3B56m9nwq744SIjvg89Tez4Vd8cJEQvnW8L3FPNOeRbtscMcgBrG1AAAAAAAAVA1/7O9Qe+eJ87U8R7ev/Z3qD3zxPnanlYLCYrHYq3hcHh7uJv3J3UWrVE1VVT2ohOWFmIw9Ez5RyQBiomrE1xH3p5vi9DIclzXPcdTgsowN7F3556bcclMdmqeamO3O5KehtiuKxHExmqr84W1zxg7NUTcq91VzU9yN89uE0ZHk+V5JgacFlOBs4SxT9Lbp557MzzzPbnlc3melmHw2ujD/AG6vP/WPfx9vxdTlWh2JxWqvE/Yp8v8Aafbw9/wRdobYtgsLFvGapvRjL3PGEs1TFqn3VXPV3I3R3Ut4TDYfB4ajDYSxaw9i3G6i3aoimmmO1EckPqI/x2ZYnHV9K/Vr+nhHpCRsvyvC5fR0LFGrznxn1kAYLYAAAAAAAAAAAAIn4TfsSy3w/wDV1K+rBcJv2JZb4f8Aq6lfUraJ7tp9Z5of0x3pV6RyAHSuXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFguDJ7Esy8P/V0q+rBcGT2JZl4f+rpc1pZu2r1jm6jQ7elPpPJLACKUwAAAAAAAAAAAAAAAAPC1bpLIdUYboOb4Gi7XTG63fo9bdt9yrn+Cd8dpBmudkOe5J0TF5RvzbA08u6indeojt0fTd2nf3IWQG4y3PcXl86rdWunynZ7eXs0maaP4PMo13KdVX3o2+/n7qTVRNNU01RMTE7pieeH8Wr1vs707qqmu9iMP6Ux8xyYvDxFNcz9tHNV8PL2JhBGuNm2otLTXfrs+nsvjmxWHpmYpj7ennp8XbSHlmkeEx+qmZ6NflP7T48/ojXNdGMZl+uuI6dHnH7x4cvq0sB0DnAAAAAAAAAAAAAAAAFluDz1N7PhV3xwkRHfB56m9nwq744SIhfOt4XuKeac8i3bY4Y5ADWNqAAAAAAAAgmNkub6h1rnOY5ndjLctu5jfuUTyVXbtE3apiaY5oiY6893dKWtJ6UyLS+F6BlGBotVTG65eq9ddue6q5/g5u09wbTG5zi8ZTFuurVTHhGzq8/P3ajAZJg8DXNy3Trrnr1z1z1+Xl7ADVtuAAAAAAAAAAAAAAAAifhN+xLLfD/1dSvqwXCb9iWW+H/q6lfUraJ7tp9Z5of0x3pV6RyAHSuXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE18HTUuS5fl2MyXH463hcZiMV0SzTd9bTXE0xG6Kubfvjmn4EKDAzLL6Mww82K51a/GPo2OV5jXl2JpxFERMx4T9V2hV/Q20/UWmeJhrl35JZfTyel8RVO+mPtK+enucsdpO2ite6d1XbpowOK6DjN2+rCX91NyO51qo7cb+3uRfmej+Ly/XVMdKjzj9/Ll9Ur5VpJg8x1UxPRr+7P7T48/o2oBo3QAAAAAAAAAAAAAAAAD+TETG6Y3xL+gI51zslyDPouYrLKacpx9XLxrVPzKuftqOt3ad3woM1fo3UGlcRNGa4KqLMzuoxNv11qvuVdae1O6e0ty+eJsWMVh68PibNu/ZuRurt3KYqpqjsTE8kukyzSfF4LVRc+3R5Ttj0n+XL5ropg8drrt/Yr842T6x/GpSkT7rnYvl+N4+M0xejAX55Zwt2ZmzVP2s89P5Y7iFNQZFm+QY6cFnGAvYS9y8Xjx62uOzTVHJVHbiUh5dnGEzCP8VXX5Tt/vojXM8kxmW1f5qfs+cdcf8APd5oDaNSAAAAAAAAAAAAstweepvZ8Ku+OEiI74PPU3s+FXfHCREL51vC9xTzTnkW7bHDHIAaxtQAAAAAAAAAAAAAAAAAAAAAAAAAAaprbX+ndKUVW8biuj42I9bhLExVc5uTjdamO78G9BGudpuotT9Ew1N35HZdVyelrFU76o+3q56u5yR2m9yzR7F4/VVEdGjzn9o8eX1c/mukmDy7XTM9Kv7sfvPhz+jcuEVqbJMxy/B5Ll+Pt4rF4fFdFvRa9dTRHFqjdNUcm/fPNHwoVBJ+W5fRl+HixROuI8Z+qJ80zGvMcTViK4iJnwj6ADPa8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfq3XXbuU3LddVFdMxNNVM7piY5piX5ASjobbFnOUdDwmfU15rg45Oi7/m9Ed2eSv/ABcvbThpbU+R6mwnpjJ8fbv7o9fan1ty37qmeWO7zdiVPmRl2NxmXYujF4DFXsNiLc76blquaao+GHL5nothcXrrtfYq+myfWP4dZlWluLweqi99uj67Y9J/n8l0hBuhttd23NvB6ssdFo5vTtijdVHbrojknu07u5KZsnzTLs4wNGOyvGWcXh6+au1Vvjf2J7E9qeVH2YZTisvq1XqerzjZPv8A2UkZbnGEzGnXYq6/GJ6pj2/jqZgDWtoAAAAAAAAAAAAAAAAMLOcqy3OcDXgc0wVnF4ernouU7909mOvE9uOVmiqmuqiYqpnVMKa6Ka6ZpqjXEoL1zsUvWuiYzSl+b1HPOCv1RFcdqivmnuTu7sogx+DxeX4u5hMdhr2GxFud1du7RNNVPdiV03jaq0vkepsJ6XzjA27+6Ji3dj1ty37mqOWO5zdmHX5Zpdes6qMVHTp8/H/vP6uKzXQyxf13MJPQq8v9f+fnH0U+En652PZzlHHxeRVV5tg43z0OKfm9Ee5j5/uxy9pGVdFVuuqiumqmumd1VMxumJ7Eu/wePw+No6dirXH5x6x4I7xuX4nA3Ph36Jpn8p9J2S/IDLYQAAAAAAACy3B56m9nwq744SIjvg89Tez4Vd8cJEQvnW8L3FPNOeRbtscMcgBrG1AAAAAAAAAAAAAAAAAAAAAABhZzmuW5Nga8dmmNs4TD089dyrdvnsR15ntRyoY11tqv3uiYLSlibFHNONv07657dFHNHdnf3IbLL8pxWYVarNPV5zsj3/jravMs5wmXU679XX4RHXM+37z1Ja1VqjI9MYT0xnGOt2JqiZt2o9dcue5pjlnu8yDtc7Yc6zfj4TIqaspwc8nRIq336491Hzvcjl7aN8fjMXmGLuYvHYm9icRcnfXcu1zVVV3Zl8EhZZothcJqru/bq+uyPSP5/JG2a6W4vGa6LP2KPptn1n+Pzf2uqquuquuqaqqp3zMzvmZ7L+A6dygAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9LT2e5vp/HRjMnx97CXevxJ9bXHYqpnkqjtTDzRRXbpuUzTXGuJ8JV27lduqK6J1THjCf8AQ22fLsfxMHqazTl+IndEYm3EzZqntxz0fljtwlfDX7GJsUYjDXrd6zcjjUXLdUVU1R2YmOSVKWw6P1nqDSuI4+VY2YszO+vDXfXWq+7T1p7cbpcbmeiFq7rrwk9GfKdnt5fn7O3yrTS7a1W8ZHSjzjb7+E/lPqtyI70NtZyDP+h4XMZpynH1ckUXa/mVc/a19buTu+FIjgsXgr+Dr+Hfpmmf7s80h4PHYfG2/iWK4qj+7Y8ABjMsAAAAAAAAAAAAAAAAaprbQOntV26q8bhugY3d63F2Iim52uN1qo7vwbm1i9YxF3D1xctVTTMeMLGIw1rE25t3qYqpnwlV7XOzHUWmOiYmi38kcup5fTNimd9Efb089Pd5Y7bRl2kObfdH5BhNO16hwWBpwmOi/RRX0H1tFzjTyzVTzb+3G7t73e5LpVViLlOHxNP2p6omP3j+PwR3nuiFGHt1YnC1fZiNc0z+0/tP4oIAdw4IAAAAABZbg89Tez4Vd8cJER3weepvZ8Ku+OEiIXzreF7inmnPIt22OGOQA1jagAAAAAAAAAAAAAAAAAA/kzERvmd0QjrXO1rIMh6JhcsmnNsfHJxbVXzG3P21fX7lO/tzDKwmCv4yv4dimap/u3yYmMx2HwVv4l+uKY/uyNspBxWIsYXD14jE3rdizbjjV3LlUU00x2ZmeZE+udtGAwXRMHpizGOvxyTirsTFmmftY56vyR3URaw1jn+qsR0TNcbVNmJ328Nb9bao7lPXntzvnttfd7lmiFq1qrxc9KfKNnv58vVHma6aXruu3g46Mec7fbwj859Ho6gzzNs/x043N8dexd6d+6a55KI7FNMclMdqHnA7Kiim3TFNEaojwhxFy5Vcqmuudcz4yAKlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3XQ20rUWluJh6b3p/L6d0elcRVMxTHYoq56fyx2mlCxicLZxVHw71MVR9WRhcXewlyLlmqaZ+i1miNoWndV002sLiPSuOmOXCX5imvf1+LPNVHc5ezENuUmpmaaoqpmYmJ3xMc8JK0LtfzzJeh4TOYqzbAxycaur5vRHaqn57uVfhhwmZ6H1U668HOuPuzt9p/n8Ug5VprRXqt42NU/ejZ7x4e34LHjw9J6syLVGF6NlGOou1xG+5Yq9bdt+6p5/h5u29xxV21XZrmi5ExMeEu7s3rd6iK7dUTE+MAC2uAAAAAAAAAAAAAACO+EN1N73hVrxykRHfCG6m97wq145bPJd4WeKObVZ7u2/wAM8laQE0IMAAAAAAWW4PPU3s+FXfHCREd8Hnqb2fCrvjhIiF863he4p5pzyLdtjhjkANY2oAAAAAAAAAAAAAADwtW6tyHS2G6Lm+Oot3Ko327FHrrtzuU9jtzujtrlqzcvVxRbiZmfCFq9et2KJruVRER4y91p+t9omnNK012cRifTePjmwmHmKq4n7aean4eXsRKH9c7Xc9zvomEyjjZTgZ5N9urferjt1/S9ynd3ZRtVM1VTVVMzMzvmZ55dtlmh9VWqvGTqj7sbfef4/Fwma6a0067eCjXP3p2e0fz+DctcbSNR6pmuxcv+kcBPJGFw9UxFUfb1c9Xw8naaYDusPhbOGo+HZpimPoj/ABOLvYq5Ny9VNU/UAX2OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+2CxWJwWKt4rB4i7h79ud9Fy1XNNVM9qYS5obbVisNxMHqqxOKtc0YyxTEXI91TzVd2N09qUOjAx2WYbH0dG/Tr+vjHpLYZfmmKy+vpWK9XnHhPrH9lcvI84yvO8DTjcpx1nF2KvprdXNPYmOeJ7U8rPU1yLOs1yLHU43Kcdewl+Oeq3VyVR2Ko5qo7U74TTobbTg8V0PB6psxhL3NGLs0zNqr3VPPT3Y3x3Ef5nonicNrrw/wBun/2j28fb8Ej5VphhsVqoxP2Kv/Wffw9/xTCPlhMTh8ZhqMThL9rEWLkb6LlquKqao7UxyS+rlJiYnVLsImJjXAA8egAAAAAAAAACO+EN1N73hVrxykRHfCG6m97wq145bPJd4WeKObVZ7u2/wzyVpATQgwAAAAABZbg89Tez4Vd8cJER3weepvZ8Ku+OEiIXzreF7inmnPIt22OGOQA1jagAAAAAAAAAAPjjcVhsFhbmKxmItYexbjfXcu1xTTTHbmXsRMzqh5MxEa5fZgZ7nOV5FgKsdm2Os4SxT9Ncq5ap7FMc9U9qOVFmudtWEw3HwelbEYq7zTi71Mxbp9zTz1d2d0dqULZ5nGaZ3jqsbm2OvYu/V9Ncq5o7ERzRHajkdZlmieIxOqvEfYp/Ofbw9/wcfmumOGwuujDfbq8/9Y9/H2/FKWudtOMxXRMHpazOEs804u9TE3avc081PdnfPcRJjMTicZibmJxd+7iL9yd9dy5VNVVU9uZfESBgctw2Bo6NinV9fGfWUcZhmmKzCvp369flHhHpAAzmvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe9pLV2faWxPRcox1du3VO+5Yr9daud2ns9uN09tOehtruRZ30PCZvuynHTyb7lXzGue1X9L3Kt3dlW4abMsiwmYRrrp1Vecbffz927yvSDGZbOq3Vrp+7Oz28vZdmmYqpiqmYmJjfEx139VV0RtF1HpWaLOHxHpvARz4TETNVMR9rPPT8HJ2pTvofaRp3VMUWLV/wBJZhVyelcRMRVVP2lXNV8HL2keZno5i8Brq1dKjzj948OX1SVlWk2DzDVRr6FflP7T48/o3MBoHRgAAAAAAACO+EN1N73hVrxykRHfCG6m97wq145bPJd4WeKObVZ7u2/wzyVpATQgwAAAAABZbg89Tez4Vd8cJER3weepvZ8Ku+OEiIXzreF7inmnPIt22OGOQA1jagAAAAAAAD+VTFNM1VTEREb5mes0zXO0nTulorw9d70/mFPNhcPVEzTP29XNT+We0gfW+0PUWqqq7OJxPpXAzPJhMPM00THW4089Xw8nYiHQZZo5i8fqqmOjR5z+0ePL6uczXSfB5froienX5R+8+HP6Jh1ztfyPJeiYTJ4pzbHRyb6Kt1iie3V9N3KfwwgzVurM91RiujZvjq7tFM77din1tq37mn9PP23hiQ8tyPCZfGu3Trq852/89ka5pn+MzKdVyrVT92Nnv5+4A3DSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+xMxMTE7ph/AEjaG2t5/kPQ8Lmczm2Ajk4t2r5tbj7Wvr9yrf2phOmkNY5BqnDxcyrHU1XojfXhrnrbtHdp68duN8dtUV9cLiL+FxFGIw165YvW541Fy3VNNVM9mJjmc1mejGFxuuu39ivzjZPrH8OpyrSvGYHVRc+3R5Ttj0n+da6ogLQ22jH4LoeD1PZnHWI3RGKtREXaY+2jmq/JPdTZp/PMpz/Axjcox1nF2Z3b5onlonsVRPLTPalHuY5Pi8vq/y09XnGz++qScszvB5lT/hq+15T1T/AN9tb0QGrbYAAAAR3whupve8KteOUiI74Q3U3veFWvHLZ5LvCzxRzarPd23+GeStICaEGAAAAAALLcHnqb2fCrvjhIiO+Dz1N7PhV3xwkRC+dbwvcU8055Fu2xwxyAGsbUAAAAHm6hz3KNP4KcZnGPs4S11uPPrq57FNMctU9qIQlrnbRmOO4+E0zZqy/DzyTibkRN6qO1HLFP5Z7jaZdk2LzCf8VPV5zs/vo1GZ53g8tp/zVfa8o65/57pe1jrPT+lcPx81xkRemN9GGteuu19ynrR253QgvXW1nP8AP+iYXLaqspwFXJxbVfzWuPtq+t3I3fCj7E37+JxFeIxN65evXJ41dy5VNVVU9mZnll80h5ZoxhMFqrr+3X5zsj0j+UbZrpXjMdrot/Yo8o2z6z/GoAdI5cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZuTZtmWTY6nG5Vjb2ExFPNXbq3b47ExzTHankYQpqoprpmmqNcSqorqoqiqmdUwnTQ22qxem3g9V4eLFc8kYyxTM0T7ujnjuxv7kJfwGMwmPwlvF4LE2sTh7kb6LlquKqao7UwpY9rSuqM80xi/TGT465Yiqd9y1Prrdz3VM8k93ncfmeiNm9rrws9Cry8P+cvo7XKtM79jVbxcdOnz/ANv+/lP1XAEYaG2w5Lm/EwmeU05TjJ5OiVVb7Fc+6n53uTydtJ1FVNdFNdFUVU1RviYnfEx2XA4zAYjBV9C/Tqn8p9J8Ui4LMMNjrfxLFcVR+cesbYf0BiMwR3whupve8KteOUiI74Q3U3veFWvHLZ5LvCzxRzarPd23+GeStICaEGAAAAAALLcHnqb2fCrvjhIiO+Dz1N7PhV3xwkRC+dbwvcU8055Fu2xwxyAGsbUH5uV0W7dVy5XTRRTEzVVVO6IiOeZlGOudsWTZR0TCZDTTm2Mjk6JE7rFE92OWv/Dydtl4PAYjG19CxTrn8o9ZYWNzDDYGjp4iuKY/OfSNspIzDG4PLsJXi8firOGw9uN9Vy7XFNMfDKINc7a7NvomD0nY6LXzenb9G6mO3RRPLPdq3dyUS6p1PnmpsX6YzjH3L+6d9FqPW27fuaY5I7vP2ZeM7/LNEbNnVXip6dXl4f8AeX0R3mumd+/rt4SOhT5/7f8AOf1ZucZrmOcY6vG5pjb2LxFfPXdq37u1HYjtRyMIHX0000RFNMaohxVddVdU1VTrmQBUpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG2aJ1/qLSldNvB4n0xgon12EvzNVvt8Xr0z3Ph3tTFm/h7WIom3dpiqJ81/D4m9hrkXLNU01R4wtFobabp3U/Q8NVd+R2Y1cnpa/VG6qftKuaruck9pvCkqQdDbVtQ6emjDY2urNsBHJ0O/X80oj7Wvn+Cd8dxw2Z6HzGuvBz/4z+0/z+Lvsq01idVvHR/5R+8fx+CzKO+EN1N73hVrxy2DRuttParsxOWYyIxERvrwt71t2n4OvHbjfDX+EN1N73hVrxy5vK7Fyxmdqi7TMTFUdU+rqM2xFrEZVeuWqoqiaZ649FaQExoSAAAAAAWW4PPU3s+FXfHCREd8Hnqb2fCrvjh7+s9cae0pan5JYyKsTu30YWz667V2OT6WO3O6EOZpYuX8zu27VMzM1T1R6ptyrEWsPlVm5dqimmKY659GytG1ztO07pnj4ai58kswp3x6WsVRuonsV181Pc5Z7SHdc7VdQ6j6JhcJXOVZfVydCsVevrj7evnnuRujutAdLlmh+vVXjJ/8Y/ef4/Fy+a6bRGu3gY/8p/aP5/BtWtdfai1XXVRjsV0HB799OEsb6bcd3r1T3d/a3NVB3FjD2sPRFu1TFMR4Q4HEYm7ia5uXqpqqnxkAXlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+7F67h71F6xdrtXaJ41FdFU01Uz2YmOZtucbQs9znSNenc3qoxlPRKK7eJq5LscXrVbuSru8/ZmWnixdwtm9VTVcpiZpnXE+MMizi71imqm3VMRVGqY8JgAX2OAAAAAA2/KNoOfZNpKjT2UV0YOjolddzE08t2eNPNTPNT4+3DU7127fvV3r1yu5crmaqq66pmqqZ68zPO/AsWsNZs1VVUUxE1TrmfGWRexV69TTTcqmYpjVEeER9ABfY4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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";
                    const lineItems = [];
                    const sqft = parseFloat(project.sqft) || 0;
                    const stateRate = stateData ? (config.stateRates[project.state] ?? stateData.rate) : 0;
                    if (project.includeInstallation) {
                      const basePerItem = (sqft * stateRate) / 4;
                      lineItems.push({ desc: "Structural Erection Labor", qty: sqft.toLocaleString() + " SqFt", price: stateRate * 0.25, total: basePerItem });
                      lineItems.push({ desc: "Welding Equipment & Supplies", qty: sqft.toLocaleString() + " SqFt", price: stateRate * 0.25, total: basePerItem });
                      lineItems.push({ desc: "Skytrack Machinery", qty: sqft.toLocaleString() + " SqFt", price: stateRate * 0.25, total: basePerItem });
                      lineItems.push({ desc: "Scissor Lift Equipment", qty: sqft.toLocaleString() + " SqFt", price: stateRate * 0.25, total: basePerItem });
                    }
                    const addItemConfig = [
                      {id:"canopy",label:"Canopy",unit:"LF"},{id:"parapets",label:"Parapets",unit:"LF"},
                      {id:"dumpsterDoors",label:"Dumpster Doors",unit:"ea"},{id:"roofLadders",label:"Roof Ladders",unit:"ea"},
                      {id:"framedOpenings",label:"Framed Openings",unit:"ea"},{id:"louvers",label:"Louvers",unit:"ea"},
                      {id:"walkDoors",label:"Walk Doors",unit:"ea"},{id:"overheadDoorFrames",label:"Overhead Door Frames",unit:"ea"},
                      {id:"roofExtensions",label:"Roof Extensions",unit:"LF"},{id:"mezzanineSupport",label:"Mezzanine Support",unit:"sqft"},
                      {id:"trimPackage",label:"Trim Package",unit:"sqft"},{id:"insulationInstall",label:"Insulation Installation",unit:"sqft"},
                      {id:"metalDeckInstall",label:"Metal Deck Installation",unit:"sqft"},{id:"joistInstall",label:"Joist Installation",unit:"tons"},
                    ];
                    addItemConfig.forEach(item => {
                      const a = additionals[item.id];
                      if (a && a.enabled) {
                        const qty = parseFloat(a.qty) || 0;
                        const uc = parseFloat(a.unitCost) || 0;
                        lineItems.push({ desc: item.label, qty: qty + " " + item.unit, price: uc, total: qty * uc });
                      }
                    });
                    const grandTotal = result.finalTotal;
                    const fmtUSD = (n) => new Intl.NumberFormat("en-US", {style:"currency",currency:"USD"}).format(n);
                    const scopeAllItems = [
                      {id:"canopy",label:"Canopy"},{id:"parapets",label:"Parapets"},{id:"dumpsterDoors",label:"Dumpster Doors"},
                      {id:"roofLadders",label:"Roof Ladders"},{id:"framedOpenings",label:"Framed Openings"},{id:"louvers",label:"Louvers"},
                      {id:"walkDoors",label:"Walk Doors"},{id:"overheadDoorFrames",label:"Overhead Door Frames"},
                      {id:"roofExtensions",label:"Roof Extensions"},{id:"mezzanineSupport",label:"Mezzanine Structure"},
                      {id:"trimPackage",label:"Trim & Flashings"},{id:"insulationInstall",label:"Insulation"},
                      {id:"metalDeckInstall",label:"Metal Deck Installation"},{id:"joistInstall",label:"Joist Installation"},
                      {label:"Wall Panels"},{label:"Roof Panels"},{label:"Anchor Bolts"},{label:"Field Welding"},
                      {label:"Crane Service"},{label:"Concrete Work"},{label:"Engineering / Sealed Drawings"},{label:"Permit Processing"},
                    ];
                    const scopeRows = scopeAllItems.map(item => {
                      const inc = item.id ? (additionals[item.id] && additionals[item.id].enabled) : false;
                      const qty = item.id && inc ? (additionals[item.id].qty || "") : "";
                      const badge = inc
                        ? `<span style="background:#d4edda;color:#155724;font-weight:700;padding:2px 8px;border-radius:10px;font-size:9px;">Included</span>`
                        : `<span style="background:#f8d7da;color:#721c24;font-weight:700;padding:2px 8px;border-radius:10px;font-size:9px;">Excluded</span>`;
                      return `<tr><td style="padding:5px 10px;border-bottom:1px solid #eee;font-size:10px;">${item.label}</td><td style="padding:5px 10px;border-bottom:1px solid #eee;">${badge}</td><td style="padding:5px 10px;border-bottom:1px solid #eee;font-size:10px;">${qty}</td></tr>`;
                    }).join("");
                    const priceRows = lineItems.map((item, i) => {
                      const bg = i % 2 === 0 ? "#fff" : "#f7f7f7";
                      return `<tr style="background:${bg}"><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:10px;">${item.desc}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:10px;text-align:center;">${item.qty}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:10px;text-align:right;">${fmtUSD(item.price)}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:10px;text-align:right;">${fmtUSD(item.total)}</td></tr>`;
                    }).join("");
                    const html = `<html><head><meta charset="UTF-8"/><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#222;background:white;width:780px;}</style></head><body><div style="padding:32px 40px;">
<div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:3px solid #e05014;margin-bottom:0;">
  <img src="data:image/png;base64,${logoB64}" style="height:70px;object-fit:contain;" alt="logo"/>
  <div style="text-align:right;">
    <div style="font-size:22px;font-weight:900;color:#e05014;text-transform:uppercase;line-height:1.1;">Metal Building Erection<br/>Contract</div>
    <div style="font-size:11px;color:#555;margin-top:4px;">Quote No. <strong style="color:#222;">${qn}</strong> &nbsp;|&nbsp; Date: <strong style="color:#222;">${qDate}</strong></div>
  </div>
</div>
<div style="background:#1a1a1a;color:#ccc;font-size:9px;padding:5px 40px;margin:0 -40px;letter-spacing:0.5px;text-align:center;margin-bottom:20px;">
  49 Kings Lake Estates Blvd, Humble TX 77346 &nbsp;|&nbsp; <strong style="color:#e05014;">Ph. 832-560-9155</strong> &nbsp;|&nbsp; admin@instabuildings.com
</div>
<div style="margin-bottom:20px;">
  <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#e05014;letter-spacing:1px;border-bottom:1.5px solid #e05014;padding-bottom:3px;margin-bottom:10px;">Customer Information</div>
  <table style="width:100%;border-collapse:collapse;font-size:10px;">
    <tr><td style="padding:3px 0;font-weight:700;width:130px;">Customer:</td><td>${project.customerName || ""}</td><td style="font-weight:700;width:130px;">Phone:</td><td>${project.phone || ""}</td></tr>
    <tr><td style="padding:3px 0;font-weight:700;">Email:</td><td>${project.email || ""}</td><td style="font-weight:700;">Date:</td><td>${qDate}</td></tr>
    <tr><td style="padding:3px 0;font-weight:700;">Project Name:</td><td>${project.projectName || ""}</td><td style="font-weight:700;">Project Type:</td><td>${project.projectType}</td></tr>
    <tr><td style="padding:3px 0;font-weight:700;">Address:</td><td>${project.city || ""}${project.state ? ", " + (stateData && stateData.name || "") : ""} ${project.zip || ""}</td><td style="font-weight:700;">Total Area:</td><td>${project.sqft ? Number(project.sqft).toLocaleString() + " SqFt" : ""}</td></tr>
    <tr><td style="padding:3px 0;font-weight:700;">Project Location:</td><td colspan="3">${project.city || ""}${project.state ? ", " + (stateData && stateData.name || "") : ""}</td></tr>
  </table>
</div>
<div style="background:#f9f9f9;border-left:3px solid #e05014;padding:8px 12px;margin-bottom:20px;font-size:10px;color:#444;line-height:1.6;">
  We are sending you this sales contract as requested by the client according to the desired specifications. Includes labor, and equipment necessary for steel erection. This price is based on project criteria listed below:
</div>
<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#e05014;letter-spacing:1px;border-bottom:1.5px solid #e05014;padding-bottom:3px;margin-bottom:10px;">Scope of Work & Pricing</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
  <thead><tr style="background:#1a1a1a;"><th style="color:white;padding:7px 10px;text-align:left;font-size:10px;text-transform:uppercase;">Description</th><th style="color:white;padding:7px 10px;text-align:center;font-size:10px;text-transform:uppercase;">Qty / Unit</th><th style="color:white;padding:7px 10px;text-align:right;font-size:10px;text-transform:uppercase;">Unit Price</th><th style="color:white;padding:7px 10px;text-align:right;font-size:10px;text-transform:uppercase;">Total</th></tr></thead>
  <tbody>${priceRows}<tr style="background:#e05014;"><td colspan="3" style="padding:8px 10px;color:white;font-weight:700;font-size:11px;">TOTAL PACKAGE PRICE</td><td style="padding:8px 10px;color:white;font-weight:700;font-size:11px;text-align:right;">${fmtUSD(grandTotal)} USD</td></tr></tbody>
</table>
<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#e05014;letter-spacing:1px;border-bottom:1.5px solid #e05014;padding-bottom:3px;margin-bottom:10px;">Payment Schedule</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
  <thead><tr style="background:#333;"><th style="color:white;padding:6px 10px;font-size:10px;text-align:left;">Installment</th><th style="color:white;padding:6px 10px;font-size:10px;text-align:left;">Milestone</th><th style="color:white;padding:6px 10px;font-size:10px;text-align:right;">Amount (USD)</th></tr></thead>
  <tbody>
    <tr><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:10px;"><strong>Down Payment (50%)</strong></td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:10px;">Prior to mobilization</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:700;color:#e05014;text-align:right;">${fmtUSD(grandTotal * 0.50)}</td></tr>
    <tr style="background:#f7f7f7;"><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:10px;"><strong>Progress Payment (40%)</strong></td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:10px;">Per % of structural completion (verified in writing)</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:700;color:#e05014;text-align:right;">${fmtUSD(grandTotal * 0.40)}</td></tr>
    <tr><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:10px;"><strong>Final Payment (10%)</strong></td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:10px;">Upon substantial completion</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:700;color:#e05014;text-align:right;">${fmtUSD(grandTotal * 0.10)}</td></tr>
  </tbody>
</table>
<div style="background:#fff8e6;border:1px solid #f0c040;border-left:4px solid #e05014;padding:8px 12px;border-radius:3px;margin-bottom:20px;font-size:9px;color:#555;line-height:1.5;">
  <strong>NO RETAINAGE ALLOWED</strong> — No retention is permitted unless expressly agreed in writing by Insta Buildings LLC.<br/>
  <strong>Right to Suspend:</strong> Failure to make any payment entitles Insta Buildings LLC. to immediately suspend all work without penalty or liability.
</div>
<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#e05014;letter-spacing:1px;border-bottom:1.5px solid #e05014;padding-bottom:3px;margin-bottom:10px;">Scope Clarification</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
  <thead><tr style="background:#333;"><th style="color:white;padding:6px 10px;font-size:10px;text-align:left;">Item</th><th style="color:white;padding:6px 10px;font-size:10px;">Status</th><th style="color:white;padding:6px 10px;font-size:10px;">Qty / Notes</th></tr></thead>
  <tbody>${scopeRows}</tbody>
</table>
<div style="margin-bottom:14px;"><div style="font-size:10px;font-weight:700;color:#e05014;text-transform:uppercase;margin-bottom:4px;">Mobilization</div><div style="font-size:9px;color:#444;line-height:1.6;">Insta Buildings LLC. has included a Maximum of 1 Mobilization to complete this project. Any additional mobilization required will induce additional cost of a minimum of $2,000.00 per day per remobilization.</div></div>
<div style="margin-bottom:14px;"><div style="font-size:10px;font-weight:700;color:#e05014;text-transform:uppercase;margin-bottom:4px;">Terms & Conditions</div><div style="font-size:9px;color:#444;line-height:1.6;"><strong>Job Site:</strong> Insta Buildings LLC. must have a minimum of 25' of smooth concrete or stable ground access around perimeter of slab. <strong>Down Time:</strong> Any unscheduled downtime cost will be passed to customer. <strong>Payment Terms:</strong> 50% to begin erection. NO RETAINAGE IS ALLOWED. This Contract is governed by the laws of the State of Texas.</div></div>
<div style="margin-bottom:14px;"><div style="font-size:10px;font-weight:700;color:#e05014;text-transform:uppercase;margin-bottom:4px;">Force Majeure</div><div style="font-size:9px;color:#444;line-height:1.6;">Under no circumstances shall Insta Buildings LLC. be liable for any delays or failure in performance due to: strikes, acts of God, war, civil disturbances, fire, flood, epidemics, inability to secure materials or transportation, or any other causes beyond reasonable control.</div></div>
<div style="margin-bottom:14px;"><div style="font-size:10px;font-weight:700;color:#e05014;text-transform:uppercase;margin-bottom:4px;">Exclusions</div><div style="font-size:9px;color:#444;line-height:1.6;">Insta Buildings LLC. specifically EXCLUDES: Light Gauge Framing, Loose Lintels, Miscellaneous Fasteners, Epoxy/Expansion/Wedge Anchor Installation, Civil Works, Touch Up Painting, Core Drilling, Aluminum or Stainless-Steel Items, Sealed Drawings, Concrete Work of any kind.</div></div>
<div style="display:flex;gap:30px;margin-top:30px;">
  <div style="flex:1;border:1px solid #ccc;border-radius:4px;overflow:hidden;">
    <div style="background:#e05014;color:white;font-weight:700;font-size:9px;padding:5px 10px;text-transform:uppercase;letter-spacing:0.5px;">Seller / Contractor — Insta Buildings LLC.</div>
    <div style="padding:14px 10px;">
      <div style="font-size:10px;font-weight:700;color:#222;">Insta Buildings LLC.</div>
      <div style="font-size:10px;color:#555;margin-top:2px;">Manuel Angel Guajardo</div>
      <div style="border-top:1px solid #999;margin-top:28px;padding-top:4px;font-size:8px;color:#777;display:flex;justify-content:space-between;"><span>Signature</span><span>Date: ____________</span></div>
    </div>
  </div>
  <div style="flex:1;border:1px solid #ccc;border-radius:4px;overflow:hidden;">
    <div style="background:#e05014;color:white;font-weight:700;font-size:9px;padding:5px 10px;text-transform:uppercase;letter-spacing:0.5px;">Buyer / Client</div>
    <div style="padding:14px 10px;">
      <div style="font-size:10px;font-weight:700;color:#222;">${project.customerName || "_____________________________"}</div>
      <div style="font-size:10px;color:#555;margin-top:2px;">&nbsp;</div>
      <div style="border-top:1px solid #999;margin-top:28px;padding-top:4px;font-size:8px;color:#777;display:flex;justify-content:space-between;"><span>Signature</span><span>Date: ____________</span></div>
    </div>
  </div>
</div>
<div style="margin-top:24px;border-top:2px solid #e05014;padding-top:8px;display:flex;justify-content:space-between;align-items:center;">
  <div style="font-size:8px;color:#777;">49 Kings Lake Estates Blvd, Humble TX 77346 | Ph. 832-560-9155 | admin@instabuildings.com</div>
  <div style="font-size:8px;color:#e05014;font-weight:700;">Quote No. ${qn}</div>
</div>
</div></body></html>`;
                    const container = document.createElement("div");
                    container.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:780px;background:white;z-index:-1;";
                    container.innerHTML = html;
                    document.body.appendChild(container);
                    try {
                      const canvas = await html2canvas(container, {
                        scale: 2, useCORS: true, allowTaint: true,
                        backgroundColor: "#ffffff", width: 780, windowWidth: 780,
                      });
                      const imgData = canvas.toDataURL("image/jpeg", 0.95);
                      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
                      const pdfW = pdf.internal.pageSize.getWidth();
                      const pdfH = pdf.internal.pageSize.getHeight();
                      const imgH = (canvas.height * pdfW) / canvas.width;
                      let position = 0;
                      let remainingH = imgH;
                      pdf.addImage(imgData, "JPEG", 0, position, pdfW, imgH);
                      remainingH -= pdfH;
                      while (remainingH > 0) {
                        position -= pdfH;
                        pdf.addPage();
                        pdf.addImage(imgData, "JPEG", 0, position, pdfW, imgH);
                        remainingH -= pdfH;
                      }
                      pdf.save("InstaBuildings-Contract-" + (project.projectName || "estimate").replace(/\s+/g, "-") + "-" + new Date().toISOString().slice(0, 10) + ".pdf");
                    } finally {
                      document.body.removeChild(container);
                    }
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
          <img src="/logo.png" alt="Insta Buildings" style={{ height: "48px", objectFit: "contain" }} />
          <div>
            <img src="/logo.png" alt="Insta Buildings" style={{ height: "48px", objectFit: "contain" }} />
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
