export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>img-server &bull; Panel de Control</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f17;
      --surface: #121824;
      --surface-card: #182030;
      --border: #232e42;
      --border-focus: #3b82f6;
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --primary-subtle: rgba(59, 130, 246, 0.12);
      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --danger: #ef4444;
      --danger-hover: #dc2626;
      --success: #10b981;
      --radius: 10px;
      --radius-sm: 6px;
      --shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text-main);
      min-height: 100vh;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
    }
    header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 0.875rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: inherit; }
    .brand-icon { width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; color: #fff; }
    .brand-title { font-weight: 700; font-size: 1.125rem; letter-spacing: -0.02em; }
    .brand-badge { font-size: 0.75rem; font-weight: 600; background: var(--primary-subtle); color: var(--primary); padding: 2px 8px; border-radius: 999px; border: 1px solid rgba(59, 130, 246, 0.25); }
    .header-actions { display: flex; align-items: center; gap: 0.75rem; }
    button, .btn {
      font-family: inherit; font-size: 0.875rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: var(--radius-sm); border: 1px solid transparent; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.15s ease;
    }
    button:disabled, .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: var(--primary); color: #fff; }
    .btn-primary:hover:not(:disabled) { background: var(--primary-hover); }
    .btn-secondary { background: var(--surface-card); color: var(--text-main); border-color: var(--border); }
    .btn-secondary:hover:not(:disabled) { border-color: var(--text-muted); }
    .btn-danger { background: rgba(239, 68, 68, 0.15); color: var(--danger); border-color: rgba(239, 68, 68, 0.3); }
    .btn-danger:hover:not(:disabled) { background: var(--danger); color: #fff; }
    .btn-sm { font-size: 0.75rem; padding: 0.3rem 0.65rem; }
    input, select {
      font-family: inherit; font-size: 0.875rem; background: var(--surface); border: 1px solid var(--border); color: var(--text-main); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); outline: none; transition: border-color 0.15s;
    }
    input:focus, select:focus { border-color: var(--border-focus); }
    .pw-input-wrapper { position: relative; display: inline-flex; align-items: center; width: 100%; }
    .pw-input-wrapper input { width: 100%; padding-right: 2.5rem; }
    .pw-eye-btn { position: absolute; right: 0.5rem; background: transparent; border: none; color: var(--text-dim); padding: 0.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .pw-eye-btn:hover { color: var(--text-main); }
    #login-overlay { position: fixed; inset: 0; background: rgba(11, 15, 23, 0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1.5rem; }
    .login-box { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); width: 100%; max-width: 420px; padding: 2rem; box-shadow: var(--shadow); }
    .login-box h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
    .login-box p { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
    .form-group label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
    main { flex: 1; max-width: 1400px; width: 100%; margin: 0 auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
    .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.35rem; }
    .stat-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-dim); }
    .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--text-main); font-feature-settings: 'tnum'; }
    .stat-sub { font-size: 0.8125rem; color: var(--text-muted); }
    .controls-bar { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem 1.25rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
    .controls-left, .controls-right { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; }
    .image-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; display: flex; flex-direction: column; transition: transform 0.15s ease, border-color 0.15s ease; }
    .image-card:hover { border-color: rgba(59, 130, 246, 0.4); transform: translateY(-2px); }
    .thumb-wrap { position: relative; aspect-ratio: 16/10; background: #06090e; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; }
    .thumb-wrap img { width: 100%; height: 100%; object-fit: contain; }
    .thumb-badge { position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(0, 0, 0, 0.75); font-size: 0.7rem; font-weight: 600; text-transform: uppercase; padding: 2px 6px; border-radius: var(--radius-sm); color: #e2e8f0; }
    .image-meta { padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
    .image-id { font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .image-details { display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; color: var(--text-muted); }
    .image-actions { display: flex; align-items: center; gap: 0.5rem; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid rgba(255, 255, 255, 0.05); }
    .modal-overlay { position: fixed; inset: 0; background: rgba(11, 15, 23, 0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1.5rem; }
    .modal-box { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); width: 100%; max-width: 840px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow); }
    .modal-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
    .modal-header h3 { font-size: 1.125rem; font-weight: 700; }
    .modal-body { padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.25rem; }
    .preview-stage { background: #06090e; border-radius: var(--radius-sm); border: 1px solid var(--border); min-height: 280px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 1rem; }
    .preview-stage img { max-width: 100%; max-height: 400px; object-fit: contain; }
    .presets-row { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
    .preset-btn { font-size: 0.75rem; padding: 0.35rem 0.75rem; background: var(--surface-card); border: 1px solid var(--border); color: var(--text-muted); }
    .preset-btn.active { background: var(--primary-subtle); border-color: var(--primary); color: var(--primary); }
    .url-box { display: flex; gap: 0.5rem; align-items: center; }
    .url-box input { flex: 1; font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem; }
    .drop-zone { border: 2px dashed var(--border); border-radius: var(--radius); padding: 2.5rem 1.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; cursor: pointer; }
    .drop-zone:hover, .drop-zone.dragover { border-color: var(--primary); background: var(--primary-subtle); }
    #toast-container { position: fixed; bottom: 1.5rem; right: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; z-index: 200; pointer-events: none; }
    .toast { pointer-events: auto; background: var(--surface); border: 1px solid var(--border); color: var(--text-main); padding: 0.75rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.875rem; box-shadow: var(--shadow); }
    .toast-success { border-left: 4px solid var(--success); }
    .toast-error { border-left: 4px solid var(--danger); }
    .toast-info { border-left: 4px solid var(--primary); }
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, 0.2); border-top-color: currentColor; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .state-box { background: var(--surface); border: 1px dashed var(--border); border-radius: var(--radius); padding: 3rem 1.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; color: var(--text-muted); }
    @media (max-width: 640px) { header { padding: 0.75rem 1rem; } main { padding: 1rem; } .controls-bar { flex-direction: column; align-items: stretch; } .controls-left, .controls-right { width: 100%; justify-content: space-between; } .stats-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <h1>Panel Admin</h1>
</body>
</html>`;

