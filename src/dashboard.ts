export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>img-server &bull; Console</title>
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
  <header>
    <a href="/admin" class="brand">
      <div class="brand-icon">⚡</div>
      <span class="brand-title">img-server &bull; Console</span>
      <span class="brand-badge">v1.0</span>
    </a>
    <div class="header-actions">
      <span id="auth-status" style="font-size: 0.8125rem; color: var(--text-muted);"></span>
      <button id="btn-logout" class="btn btn-secondary btn-sm" style="display: none;">Salir</button>
    </div>
  </header>

  <div id="login-overlay">
    <div class="login-box">
      <h2>Acceso al Panel</h2>
      <p>Ingresá la Admin Key para ver métricas globales, o la API Key del proyecto.</p>
      <div class="form-group">
        <label for="input-key">Clave de Acceso</label>
        <div class="pw-input-wrapper">
          <input type="password" id="input-key" placeholder="Admin Key o API Key..." autocomplete="current-password">
          <button type="button" class="pw-eye-btn" id="eye-btn" aria-label="Mostrar clave" title="Mostrar u ocultar clave">
            <svg id="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
      <div class="form-group">
        <label for="input-project-manual">Proyecto por defecto (opcional si es Admin)</label>
        <input type="text" id="input-project-manual" placeholder="ej. showroomisabella">
      </div>
      <button class="btn btn-primary" id="btn-login" style="width: 100%;">Entrar</button>
    </div>
  </div>

  <main id="main-content" style="display: none;">
    <section class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Espacio en Disco</span>
        <span class="stat-value" id="stat-total-bytes">0 B</span>
        <span class="stat-sub">Originales subidos</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Espacio en Caché</span>
        <span class="stat-value" id="stat-cache-bytes">0 B</span>
        <span class="stat-sub">Variantes transformadas</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Total Archivos</span>
        <span class="stat-value" id="stat-total-files">0</span>
        <span class="stat-sub" id="stat-projects-sub">0 proyectos activos</span>
      </div>
    </section>

    <section class="controls-bar">
      <div class="controls-left">
        <label for="select-project" style="font-size: 0.8125rem; font-weight: 600; color: var(--text-muted);">Proyecto:</label>
        <select id="select-project"></select>
        <input type="text" id="search-prefix" placeholder="Filtrar por prefijo o folder..." style="min-width: 220px;">
        <button class="btn btn-secondary btn-sm" id="btn-refresh">↻ Actualizar</button>
      </div>
      <div class="controls-right">
        <button class="btn btn-primary" id="btn-open-upload">+ Subir Imagen</button>
      </div>
    </section>

    <section id="gallery-container">
      <div id="gallery" class="gallery-grid"></div>
      <div id="empty-state" class="state-box" style="display: none;">
        <p>No se encontraron imágenes en este proyecto.</p>
      </div>
      <div id="loading-state" class="state-box" style="display: none;">
        <span class="spinner"></span>
        <p>Cargando galería...</p>
      </div>
    </section>
  </main>

  <!-- Modal Subir Imagen -->
  <div id="modal-upload" class="modal-overlay" style="display: none;">
    <div class="modal-box" style="max-width: 520px;">
      <div class="modal-header">
        <h3>Subir Nueva Imagen</h3>
        <button class="btn btn-secondary btn-sm modal-close">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="upload-folder">Carpeta / Folder (Opcional)</label>
          <input type="text" id="upload-folder" placeholder="ej. productos, avatares">
        </div>
        <div class="drop-zone" id="drop-zone">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          <div>
            <p style="font-weight: 600; font-size: 0.875rem;">Arrastrá tu imagen aquí o hacé click para seleccionar</p>
            <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 4px;">JPEG, PNG, WebP o GIF (hasta 10MB)</p>
          </div>
          <input type="file" id="file-input" accept="image/jpeg,image/png,image/webp,image/gif" style="display: none;">
        </div>
        <div id="upload-file-info" style="display: none; font-size: 0.8125rem; color: var(--primary); font-weight: 600;"></div>
        <button class="btn btn-primary" id="btn-do-upload" style="width: 100%;" disabled>Subir Imagen</button>
      </div>
    </div>
  </div>

  <!-- Modal Detalle y Probador -->
  <div id="modal-detail" class="modal-overlay" style="display: none;">
    <div class="modal-box">
      <div class="modal-header">
        <h3 id="detail-title">Detalle de Imagen</h3>
        <button class="btn btn-secondary btn-sm modal-close">✕</button>
      </div>
      <div class="modal-body">
        <div class="preview-stage">
          <img id="detail-img" src="" alt="Preview">
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; background: var(--surface-card); padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--border); font-size: 0.8125rem;">
          <div><span style="color: var(--text-dim); display: block; font-size: 0.7rem; text-transform: uppercase;">Dimensiones</span><b id="detail-dims">-</b></div>
          <div><span style="color: var(--text-dim); display: block; font-size: 0.7rem; text-transform: uppercase;">Peso</span><b id="detail-size">-</b></div>
          <div><span style="color: var(--text-dim); display: block; font-size: 0.7rem; text-transform: uppercase;">Formato</span><b id="detail-format">-</b></div>
          <div><span style="color: var(--text-dim); display: block; font-size: 0.7rem; text-transform: uppercase;">Fecha</span><b id="detail-date">-</b></div>
        </div>
        <div class="form-group">
          <label>Probador de Transformaciones (Presets)</label>
          <div class="presets-row">
            <button class="btn preset-btn active" data-tf="">Original</button>
            <button class="btn preset-btn" data-tf="w_300">w_300 (Miniatura)</button>
            <button class="btn preset-btn" data-tf="w_600">w_600 (Mediana)</button>
            <button class="btn preset-btn" data-tf="w_300,h_300,c_fill">300x300 c_fill</button>
            <button class="btn preset-btn" data-tf="f_auto,q_auto">f_auto, q_auto</button>
            <button class="btn preset-btn" data-tf="w_400,q_80,f_webp">w_400 webp q80</button>
          </div>
        </div>
        <div class="form-group">
          <label for="custom-tf">Transformación personalizada</label>
          <input type="text" id="custom-tf" placeholder="ej: w_400,h_200,c_fill,q_85">
        </div>
        <div class="form-group">
          <label>URL Resultante</label>
          <div class="url-box">
            <input type="text" id="result-url" readonly>
            <button class="btn btn-primary" id="btn-copy-url">Copiar URL</button>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
          <button class="btn btn-danger" id="btn-delete-img">Eliminar Imagen</button>
        </div>
      </div>
    </div>
  </div>

  <div id="toast-container"></div>

  <script>
    (() => {
      const state = {
        apiKey: localStorage.getItem('img_admin_key') || '',
        project: localStorage.getItem('img_project') || '',
        projects: [],
        stats: null,
        images: [],
        selectedImage: null,
        currentTf: '',
        uploadFile: null,
      };

      const $ = (s) => document.querySelector(s);
      const $$ = (s) => document.querySelectorAll(s);

      function showToast(text, type = 'info') {
        const cont = $('#toast-container');
        const t = document.createElement('div');
        t.className = 'toast toast-' + type;
        t.textContent = text;
        cont.appendChild(t);
        setTimeout(() => {
          t.style.opacity = '0';
          t.style.transition = 'opacity 0.3s ease';
          setTimeout(() => t.remove(), 300);
        }, 3200);
      }

      function formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }

      // Password visibility toggle
      const eyeBtn = $('#eye-btn');
      const pwInput = $('#input-key');
      if (eyeBtn && pwInput) {
        eyeBtn.addEventListener('click', () => {
          const isPw = pwInput.type === 'password';
          pwInput.type = isPw ? 'text' : 'password';
          eyeBtn.innerHTML = isPw
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
        });
      }

      async function apiFetch(url, options = {}) {
        const headers = options.headers || {};
        if (state.apiKey) headers['x-api-key'] = state.apiKey;
        return fetch(url, { ...options, headers });
      }

      async function loadStats() {
        try {
          const res = await apiFetch('/admin/api/stats');
          if (res.ok) {
            const data = await res.json();
            state.stats = data;
            state.projects = data.projects || Object.keys(data.byProject || {});
            $('#stat-total-bytes').textContent = formatBytes(data.totalBytes);
            $('#stat-cache-bytes').textContent = formatBytes(data.cacheBytes);
            $('#stat-total-files').textContent = data.totalFiles.toLocaleString();
            $('#stat-projects-sub').textContent = state.projects.length + ' proyectos activos';
            updateProjectSelector();
            return true;
          }
        } catch (e) {}
        return false;
      }

      function updateProjectSelector() {
        const sel = $('#select-project');
        sel.innerHTML = '';
        const projs = state.projects.length ? state.projects : (state.project ? [state.project] : []);
        projs.forEach((p) => {
          const opt = document.createElement('option');
          opt.value = p;
          opt.textContent = p;
          if (p === state.project) opt.selected = true;
          sel.appendChild(opt);
        });
        if (!state.project && projs[0]) {
          state.project = projs[0];
          localStorage.setItem('img_project', state.project);
        }
      }

      async function loadGallery() {
        if (!state.project) return;
        $('#loading-state').style.display = 'flex';
        $('#empty-state').style.display = 'none';
        $('#gallery').innerHTML = '';

        try {
          const prefix = $('#search-prefix').value.trim();
          const q = new URLSearchParams({ limit: '100' });
          if (prefix) q.set('prefix', prefix);
          const res = await apiFetch('/v1/' + encodeURIComponent(state.project) + '/list?' + q.toString());
          if (res.ok) {
            const data = await res.json();
            state.images = data.resources || [];
            renderGallery();
          } else {
            showToast('No se pudieron listar las imágenes', 'error');
          }
        } catch (err) {
          showToast('Error de conexión al cargar imágenes', 'error');
        } finally {
          $('#loading-state').style.display = 'none';
        }
      }

      function renderGallery() {
        const gal = $('#gallery');
        gal.innerHTML = '';
        if (state.images.length === 0) {
          $('#empty-state').style.display = 'flex';
          return;
        }
        $('#empty-state').style.display = 'none';

        state.images.forEach((img) => {
          const card = document.createElement('div');
          card.className = 'image-card';
          const thumbUrl = '/' + state.project + '/image/upload/w_300,h_200,c_fill/' + img.public_id + '.' + img.format;
          card.innerHTML = '' +
            '<div class="thumb-wrap">' +
              '<img src="' + thumbUrl + '" alt="' + img.public_id + '" loading="lazy">' +
              '<span class="thumb-badge">' + img.format + '</span>' +
            '</div>' +
            '<div class="image-meta">' +
              '<span class="image-id" title="' + img.public_id + '">' + img.public_id + '</span>' +
              '<div class="image-details">' +
                '<span>' + (img.width ? (img.width + '×' + img.height) : '-') + '</span>' +
                '<span>&bull;</span>' +
                '<span>' + formatBytes(img.bytes) + '</span>' +
              '</div>' +
              '<div class="image-actions">' +
                '<button class="btn btn-secondary btn-sm btn-inspect" style="flex: 1;">Inspeccionar</button>' +
              '</div>' +
            '</div>';
          card.querySelector('.thumb-wrap').addEventListener('click', () => openDetail(img));
          card.querySelector('.btn-inspect').addEventListener('click', () => openDetail(img));
          gal.appendChild(card);
        });
      }

      function buildTransformedUrl(img, tf) {
        const prefix = tf ? (tf + '/') : '';
        return window.location.origin + '/' + state.project + '/image/upload/' + prefix + img.public_id + '.' + img.format;
      }

      function openDetail(img) {
        state.selectedImage = img;
        state.currentTf = '';
        $('#detail-title').textContent = img.public_id;
        $('#detail-dims').textContent = img.width ? (img.width + ' × ' + img.height + ' px') : 'Desconocido';
        $('#detail-size').textContent = formatBytes(img.bytes);
        $('#detail-format').textContent = (img.format || '').toUpperCase();
        $('#detail-date').textContent = img.created_at ? new Date(img.created_at).toLocaleDateString() : '-';
        $('#custom-tf').value = '';
        $$('.preset-btn').forEach((b) => b.classList.toggle('active', b.dataset.tf === ''));
        updateDetailPreview();
        $('#modal-detail').style.display = 'flex';
      }

      function updateDetailPreview() {
        if (!state.selectedImage) return;
        const url = buildTransformedUrl(state.selectedImage, state.currentTf);
        $('#detail-img').src = url;
        $('#result-url').value = url;
      }

      // Presets
      $$('.preset-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          $$('.preset-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          state.currentTf = btn.dataset.tf;
          $('#custom-tf').value = state.currentTf;
          updateDetailPreview();
        });
      });

      $('#custom-tf').addEventListener('input', (e) => {
        state.currentTf = e.target.value.trim();
        $$('.preset-btn').forEach((b) => b.classList.toggle('active', b.dataset.tf === state.currentTf));
        updateDetailPreview();
      });

      $('#btn-copy-url').addEventListener('click', async () => {
        const url = $('#result-url').value;
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          showToast('URL copiada al portapapeles', 'success');
        } else {
          $('#result-url').select();
          document.execCommand('copy');
          showToast('URL copiada', 'success');
        }
      });

      $('#btn-delete-img').addEventListener('click', async () => {
        if (!state.selectedImage) return;
        if (!confirm('¿Eliminar definitivamente ' + state.selectedImage.public_id + '?')) return;
        const btn = $('#btn-delete-img');
        btn.disabled = true;
        try {
          const res = await apiFetch('/v1/' + encodeURIComponent(state.project) + '/' + state.selectedImage.public_id, {
            method: 'DELETE',
          });
          if (res.ok) {
            showToast('Imagen eliminada correctamente', 'success');
            $('#modal-detail').style.display = 'none';
            loadGallery();
            loadStats();
          } else {
            showToast('Error al eliminar imagen (verificá permisos)', 'error');
          }
        } catch (err) {
          showToast('Error de red al eliminar', 'error');
        } finally {
          btn.disabled = false;
        }
      });

      // Modals close
      $$('.modal-close').forEach((btn) => {
        btn.addEventListener('click', () => {
          $$('.modal-overlay').forEach((m) => (m.style.display = 'none'));
        });
      });

      // Upload modal
      $('#btn-open-upload').addEventListener('click', () => {
        state.uploadFile = null;
        $('#file-input').value = '';
        $('#upload-folder').value = '';
        $('#upload-file-info').style.display = 'none';
        $('#btn-do-upload').disabled = true;
        $('#modal-upload').style.display = 'flex';
      });

      const dropZone = $('#drop-zone');
      const fileInput = $('#file-input');
      dropZone.addEventListener('click', () => fileInput.click());
      dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleSelectedFile(e.dataTransfer.files[0]);
        }
      });
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          handleSelectedFile(fileInput.files[0]);
        }
      });

      function handleSelectedFile(file) {
        state.uploadFile = file;
        $('#upload-file-info').textContent = 'Seleccionado: ' + file.name + ' (' + formatBytes(file.size) + ')';
        $('#upload-file-info').style.display = 'block';
        $('#btn-do-upload').disabled = false;
      }

      $('#btn-do-upload').addEventListener('click', async () => {
        if (!state.uploadFile || !state.project) return;
        const btn = $('#btn-do-upload');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Subiendo...';
        const fd = new FormData();
        fd.append('file', state.uploadFile);
        const folder = $('#upload-folder').value.trim();
        if (folder) fd.append('folder', folder);

        try {
          const res = await apiFetch('/v1/' + encodeURIComponent(state.project) + '/upload', {
            method: 'POST',
            body: fd,
          });
          if (res.ok) {
            showToast('Imagen subida exitosamente', 'success');
            $('#modal-upload').style.display = 'none';
            loadGallery();
            loadStats();
          } else {
            const err = await res.json().catch(() => ({}));
            showToast(err.error || 'Error al subir imagen', 'error');
          }
        } catch (e) {
          showToast('Error de red al subir archivo', 'error');
        } finally {
          btn.disabled = false;
          btn.textContent = 'Subir Imagen';
        }
      });

      // Controls
      $('#select-project').addEventListener('change', (e) => {
        state.project = e.target.value;
        localStorage.setItem('img_project', state.project);
        loadGallery();
      });
      $('#btn-refresh').addEventListener('click', () => {
        loadStats();
        loadGallery();
      });
      $('#search-prefix').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') loadGallery();
      });

      // Login & Init
      function checkAuth() {
        if (state.apiKey) {
          $('#login-overlay').style.display = 'none';
          $('#main-content').style.display = 'flex';
          $('#btn-logout').style.display = 'inline-flex';
          $('#auth-status').textContent = state.project ? ('Conectado: ' + state.project) : 'Conectado';
          loadStats().then(() => loadGallery());
        } else {
          $('#login-overlay').style.display = 'flex';
          $('#main-content').style.display = 'none';
          $('#btn-logout').style.display = 'none';
        }
      }

      $('#btn-login').addEventListener('click', () => {
        const key = $('#input-key').value.trim();
        const proj = $('#input-project-manual').value.trim();
        if (!key) {
          showToast('Ingresá una clave válida', 'error');
          return;
        }
        state.apiKey = key;
        localStorage.setItem('img_admin_key', key);
        if (proj) {
          state.project = proj;
          localStorage.setItem('img_project', proj);
        }
        checkAuth();
      });

      $('#btn-logout').addEventListener('click', () => {
        state.apiKey = '';
        state.project = '';
        localStorage.removeItem('img_admin_key');
        localStorage.removeItem('img_project');
        checkAuth();
      });

      checkAuth();
    })();
  </script>
</body>
</html>`;
