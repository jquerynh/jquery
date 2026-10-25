<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CondoHub · Live Map Viewer</title>
<style>
  :root{
    --bg:#05050a;
    --panel:rgba(17,17,24,0.72);
    --panel-solid:#111116;
    --panel-2:#15151c;
    --border:rgba(255,255,255,0.07);
    --border-strong:rgba(255,255,255,0.14);
    --text:#ececf3;
    --muted:#8b8b9c;
    --pink:#ff2d78;
    --pink-2:#ff6fa2;
    --pink-soft:rgba(255,45,120,0.35);
    --red:#ff3b3b;
    --green:#3ddc84;
    --glow:0 0 40px rgba(255,45,120,0.25);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    background:
      radial-gradient(1000px 500px at 15% -10%, rgba(255,45,120,0.14) 0%, transparent 55%),
      radial-gradient(900px 500px at 90% 0%, rgba(80,80,255,0.10) 0%, transparent 55%),
      radial-gradient(1200px 700px at 50% 110%, rgba(255,45,120,0.08) 0%, transparent 60%),
      var(--bg);
    color:var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif;
    min-height:100vh;
    display:flex;
    flex-direction:column;
    overflow-x:hidden;
    -webkit-font-smoothing:antialiased;
  }
  body::before{
    content:"";
    position:fixed; inset:0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size:44px 44px;
    pointer-events:none;
    z-index:0;
    mask-image:radial-gradient(ellipse at center, black 35%, transparent 78%);
  }
  body::after{
    content:"";
    position:fixed; inset:0;
    background:radial-gradient(circle at 50% 120%, rgba(255,45,120,0.12), transparent 60%);
    pointer-events:none; z-index:0;
  }
  .wrap{position:relative;z-index:1;width:100%;max-width:1240px;margin:0 auto;padding:24px}

  /* ===== HEADER ===== */
  header{
    display:flex;align-items:center;justify-content:space-between;gap:16px;
    padding:16px 20px;
    border:1px solid var(--border);
    background:linear-gradient(180deg, rgba(24,24,34,0.78), rgba(12,12,18,0.78));
    border-radius:18px;
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    box-shadow:0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .brand{display:flex;align-items:center;gap:14px}
  .brand-dot{
    width:12px;height:12px;border-radius:50%;
    background:var(--red);
    box-shadow:0 0 0 0 rgba(255,59,59,0.7);
    animation:pulse 1.4s infinite;
  }
  @keyframes pulse{
    0%{box-shadow:0 0 0 0 rgba(255,59,59,0.7)}
    70%{box-shadow:0 0 0 12px rgba(255,59,59,0)}
    100%{box-shadow:0 0 0 0 rgba(255,59,59,0)}
  }
  .brand h1{
    font-size:19px;letter-spacing:0.4px;font-weight:800;
    background:linear-gradient(180deg,#fff,#c9c9d8);
    -webkit-background-clip:text;background-clip:text;color:transparent;
  }
  .brand span{font-size:11.5px;color:var(--muted);letter-spacing:0.3px}
  .live-pill{
    display:inline-flex;align-items:center;gap:8px;
    padding:7px 14px;border-radius:999px;
    background:rgba(255,59,59,0.1);
    border:1px solid rgba(255,59,59,0.4);
    color:#ffb3b3;font-size:11.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;
    box-shadow:0 0 18px rgba(255,59,59,0.18);
  }
  .live-pill .blink{width:8px;height:8px;border-radius:50%;background:var(--red);animation:blink 1s infinite}
  @keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0.2}}

  /* ===== LAYOUT ===== */
  .grid{display:grid;grid-template-columns:1fr 330px;gap:22px;margin-top:22px}
  @media (max-width:960px){.grid{grid-template-columns:1fr}}

  /* ===== PLAYER ===== */
  .player-card{
    position:relative;
    background:var(--panel);
    border:1px solid var(--border);
    border-radius:18px;overflow:hidden;
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    box-shadow:0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .player-card::before{
    content:"";position:absolute;inset:0;border-radius:18px;pointer-events:none;
    padding:1px;
    background:linear-gradient(140deg, rgba(255,45,120,0.35), transparent 40%, transparent 60%, rgba(120,90,255,0.25));
    -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;
    opacity:0.9;
  }
  .video-shell{position:relative;aspect-ratio:16/9;background:#000}
  .video-shell iframe{
    position:absolute;inset:0;width:100%;height:100%;border:0;
  }

  .play-overlay{
    position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
    background:radial-gradient(circle at center, rgba(0,0,0,0.35), rgba(0,0,0,0.88));
    cursor:pointer;z-index:5;transition:opacity 0.35s ease;
  }
  .play-overlay.hidden{opacity:0;pointer-events:none}
  .play-btn{
    width:96px;height:96px;border-radius:50%;
    background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), rgba(255,255,255,0.06));
    border:2px solid rgba(255,255,255,0.65);
    display:flex;align-items:center;justify-content:center;
    backdrop-filter:blur(8px);
    transition:transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
    box-shadow:0 0 0 0 rgba(255,45,120,0), 0 0 30px rgba(255,255,255,0.08);
  }
  .play-overlay:hover .play-btn{
    transform:scale(1.1);
    background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
    box-shadow:0 0 0 6px rgba(255,45,120,0.12), 0 0 40px rgba(255,45,120,0.35);
  }
  .play-btn svg{width:34px;height:34px;fill:#fff;margin-left:5px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5))}

  /* ===== RED OVERLAY ===== */
  .red-overlay{
    position:absolute;top:14px;right:14px;z-index:4;
    display:flex;flex-direction:column;align-items:flex-end;gap:6px;pointer-events:none;
  }
  .red-overlay .tag{
    background:linear-gradient(180deg, rgba(255,30,30,0.95), rgba(200,0,0,0.92));
    color:#fff;font-size:11.5px;font-weight:800;
    padding:5px 11px;border-radius:8px;letter-spacing:1.2px;
    text-shadow:0 0 8px rgba(255,0,0,0.8);
    box-shadow:0 0 18px rgba(255,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.2);
    display:flex;align-items:center;gap:7px;
  }
  .red-overlay .tag .dot{width:8px;height:8px;border-radius:50%;background:#fff;animation:blink 1s infinite;box-shadow:0 0 8px #fff}
  .red-overlay .scrolling{
    background:rgba(0,0,0,0.75);color:#ff5c5c;font-size:11px;font-weight:700;
    padding:4px 9px;border-radius:7px;max-width:260px;overflow:hidden;white-space:nowrap;
    border:1px solid rgba(255,0,0,0.45);
    backdrop-filter:blur(4px);
  }
  .red-overlay .scrolling span{
    display:inline-block;padding-left:100%;animation:scroll-left 14s linear infinite;
  }
  @keyframes scroll-left{
    0%{transform:translateX(0)}
    100%{transform:translateX(-100%)}
  }

  /* ===== PLAYER BAR ===== */
  .player-bar{
    display:flex;align-items:center;justify-content:space-between;gap:12px;
    padding:13px 18px;border-top:1px solid var(--border);flex-wrap:wrap;
    background:linear-gradient(180deg, rgba(20,20,28,0.4), rgba(10,10,14,0.6));
  }
  .player-meta{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
  .meta-item{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--muted)}
  .meta-item strong{color:var(--text);font-weight:700;font-variant-numeric:tabular-nums}
  .dot-live{width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 10px var(--green)}

  /* ===== TABS ===== */
  .tabs{display:flex;gap:8px;padding:12px 14px;border-top:1px solid var(--border);background:rgba(16,16,22,0.55);flex-wrap:wrap}
  .tab{
    padding:9px 16px;border-radius:10px;border:1px solid var(--border);
    background:rgba(255,255,255,0.03);color:var(--muted);font-size:12px;font-weight:600;
    cursor:pointer;transition:all 0.2s ease;
  }
  .tab:hover{color:var(--text);border-color:var(--border-strong);background:rgba(255,255,255,0.05);transform:translateY(-1px)}
  .tab.active{
    background:linear-gradient(180deg, rgba(255,45,120,0.22), rgba(255,45,120,0.08));
    color:#ffd6e6;border-color:rgba(255,45,120,0.55);
    box-shadow:0 0 16px var(--pink-soft), inset 0 1px 0 rgba(255,255,255,0.1);
  }

  /* ===== SIDE PANEL ===== */
  .side{display:flex;flex-direction:column;gap:16px}
  .card{
    background:var(--panel);
    border:1px solid var(--border);
    border-radius:18px;padding:18px;
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    box-shadow:0 12px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);
    transition:transform 0.25s ease, border-color 0.25s ease;
  }
  .card:hover{transform:translateY(-2px);border-color:var(--border-strong)}
  .card h3{
    font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:var(--muted);
    margin-bottom:14px;font-weight:800;
  }
  .count{display:flex;align-items:baseline;gap:10px}
  .count strong{
    font-size:40px;font-weight:900;letter-spacing:0.5px;
    background:linear-gradient(180deg,#fff,#c9c9d8);
    -webkit-background-clip:text;background-clip:text;color:transparent;
    font-variant-numeric:tabular-nums;
    text-shadow:0 0 30px rgba(255,255,255,0.08);
  }
  .count .unit{font-size:13px;color:var(--muted)}
  .count-bar{height:7px;background:rgba(255,255,255,0.06);border-radius:999px;margin-top:14px;overflow:hidden}
  .count-bar i{
    display:block;height:100%;width:72%;
    background:linear-gradient(90deg, var(--pink), var(--pink-2));
    border-radius:999px;transition:width 1s cubic-bezier(.4,0,.2,1);
    box-shadow:0 0 14px var(--pink-soft);
  }
  .count-sub{font-size:11.5px;color:var(--muted);margin-top:10px;display:flex;justify-content:space-between}
  .count-sub .up{color:var(--green);font-weight:700}

  /* ===== JOIN BUTTON ===== */
  .join-btn{
    display:flex;align-items:center;justify-content:center;gap:10px;
    width:100%;padding:15px 18px;border-radius:13px;text-decoration:none;
    background:linear-gradient(180deg, #ff4d8d, #e01e63);
    color:#fff;font-weight:800;letter-spacing:0.4px;font-size:14px;
    border:1px solid rgba(255,140,180,0.55);
    box-shadow:0 0 0 1px rgba(255,45,120,0.15), 0 8px 24px rgba(255,45,120,0.35);
    transition:transform 0.18s ease, box-shadow 0.25s ease, filter 0.25s ease;
    position:relative;overflow:hidden;
  }
  .join-btn::after{
    content:"";position:absolute;inset:0;
    background:linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
    transform:translateX(-100%);
    transition:transform 0.6s ease;
  }
  .join-btn:hover::after{transform:translateX(100%)}
  .join-btn:hover{
    transform:translateY(-2px);
    box-shadow:0 0 0 1px rgba(255,45,120,0.35), 0 12px 34px rgba(255,45,120,0.5);
    filter:brightness(1.06);
  }
  .join-btn:active{transform:translateY(0)}
  .join-btn svg{width:16px;height:16px;fill:#fff}

  .info-row{display:flex;justify-content:space-between;font-size:12.5px;padding:9px 0;border-bottom:1px dashed rgba(255,255,255,0.06)}
  .info-row:last-child{border-bottom:none}
  .info-row span:first-child{color:var(--muted)}
  .info-row span:last-child{color:var(--text);font-weight:700}

  /* ===== FOOTER ===== */
  footer{
    margin-top:28px;padding:18px;text-align:center;font-size:12px;color:var(--muted);
    border-top:1px solid var(--border);
    letter-spacing:0.3px;
  }
  footer strong{color:var(--pink);letter-spacing:0.5px;font-weight:800}

  /* ===== STATUS SPINNER ===== */
  .spinner{
    width:12px;height:12px;border:2px solid rgba(255,255,255,0.1);border-top-color:var(--pink);
    border-radius:50%;animation:spin 1s linear infinite;display:inline-block;
  }
  @keyframes spin{to{transform:rotate(360deg)}}

  /* ===== ENTRANCE ANIMATIONS ===== */
  @keyframes rise{
    from{opacity:0;transform:translateY(14px)}
    to{opacity:1;transform:translateY(0)}
  }
  header{animation:rise 0.5s ease both}
  .player-card{animation:rise 0.6s 0.05s ease both}
  .side .card:nth-child(1){animation:rise 0.6s 0.1s ease both}
  .side .card:nth-child(2){animation:rise 0.6s 0.15s ease both}
  .side .card:nth-child(3){animation:rise 0.6s 0.2s ease both}
  footer{animation:rise 0.6s 0.25s ease both}

  /* ===== SCROLLBAR ===== */
  ::-webkit-scrollbar{width:10px;height:10px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(255,45,120,0.25);border-radius:10px;border:2px solid transparent;background-clip:padding-box}
  ::-webkit-scrollbar-thumb:hover{background:rgba(255,45,120,0.45);background-clip:padding-box}

  /* ===== REDUCED MOTION ===== */
  @media (prefers-reduced-motion: reduce){
    *{animation:none !important;transition:none !important}
  }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="brand">
      <div class="brand-dot"></div>
      <div>
        <h1>CondoHub · Live Map</h1>
        <span>Live Stream · Real-time Map Viewer</span>
      </div>
    </div>
    <div class="live-pill">
      <span class="blink"></span>
      LIVE NOW
    </div>
  </header>

  <div class="grid">
    <main class="player-card">
      <div class="video-shell" id="videoShell">
        <div class="play-overlay" id="playOverlay">
          <div class="play-btn" role="button" aria-label="Play Live">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div class="red-overlay">
          <div class="tag"><span class="dot"></span>LIVE • CONDO HUB</div>
          <div class="scrolling"><span>🔥 Players active on map · Real-time updates · CondoHub By Choso 🔥</span></div>
        </div>
      </div>
      <div class="player-bar">
        <div class="player-meta">
          <div class="meta-item"><span class="dot-live"></span><strong>Streaming</strong></div>
          <div class="meta-item">👥 <strong id="activePlayers">1,000</strong> players online</div>
          <div class="meta-item">⏱️ <strong id="uptime">00:00:00</strong></div>
        </div>
        <div class="meta-item" id="streamStatus">
          <span class="spinner"></span>
          Connecting...
        </div>
      </div>
      <div class="tabs" id="tabs">
        <button class="tab active" data-idx="0">Stream 1</button>
        <button class="tab" data-idx="1">Stream 2</button>
        <button class="tab" data-idx="2">Stream 3</button>
      </div>
    </main>

    <aside class="side">
      <div class="card">
        <h3>Live Stats</h3>
        <div class="count">
          <strong id="bigCount">1,000</strong>
          <span class="unit">players online</span>
        </div>
        <div class="count-bar"><i id="countBar" style="width:72%"></i></div>
        <div class="count-sub">
          <span>Map Capacity</span>
          <span class="up">▲ online</span>
        </div>
      </div>

      <div class="card">
        <h3>Join Map</h3>
        <a class="join-btn"
           href="https://www.roblox.com.et/games/14153443454/Meet-a-neko?privateServerLinkCode=66899306788414906853240476258034"
           rel="noopener noreferrer" target="_blank">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          Join Map Now
        </a>
        <div style="margin-top:10px;font-size:11px;color:var(--muted);text-align:center">
          Private server · Meet a Neko
        </div>
      </div>

      <div class="card">
        <h3>Info</h3>
        <div class="info-row"><span>Streamer</span><span>CondoHub</span></div>
        <div class="info-row"><span>Server</span><span>Asia / SG</span></div>
        <div class="info-row"><span>Quality</span><span>HD · 1080p</span></div>
        <div class="info-row"><span>Mode</span><span>Live Viewer</span></div>
      </div>
    </aside>
  </div>

  <footer>
    © 2026 <strong>CondoHub By Choso</strong> · All rights reserved · Live Map Viewer
  </footer>
</div>

<script>
  const streams = [
    "https://screenapp.io/app/share/EU8EywWHkVQSiN_IfFdffu48",
    "https://screenapp.io/app/share/9_xxLDBEq5rI-3QJ-v2F_AZ_",
    "https://screenapp.io/app/share/wflSWNP4B9gRORGCy_xnvheW"
  ];

  const videoShell = document.getElementById('videoShell');
  const playOverlay = document.getElementById('playOverlay');
  const tabs = document.getElementById('tabs');
  const streamStatus = document.getElementById('streamStatus');
  let currentIdx = 0;
  let iframeEl = null;
  let playing = false;

  function buildIframe(src){
    if(iframeEl) iframeEl.remove();
    iframeEl = document.createElement('iframe');
    iframeEl.src = src;
    iframeEl.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture');
    iframeEl.setAttribute('allowfullscreen', 'true');
    iframeEl.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframeEl.loading = 'lazy';
    iframeEl.style.zIndex = '2';
    iframeEl.style.opacity = '0';
    iframeEl.style.transition = 'opacity 0.4s';
    videoShell.insertBefore(iframeEl, videoShell.firstChild);

    iframeEl.addEventListener('load', () => {
      iframeEl.style.opacity = '1';
      streamStatus.innerHTML = '<span class="dot-live"></span> Live streaming';
    });
  }

  function loadStream(idx){
    currentIdx = idx;
    [...tabs.children].forEach((b,i)=> b.classList.toggle('active', i===idx));
    playing = false;
    playOverlay.classList.remove('hidden');
    streamStatus.innerHTML = '<span class="spinner"></span> Connecting...';
    buildIframe(streams[idx]);
  }

  playOverlay.addEventListener('click', () => {
    playOverlay.classList.add('hidden');
    playing = true;
    if(!iframeEl) buildIframe(streams[currentIdx]);
  });

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if(!btn) return;
    const idx = parseInt(btn.dataset.idx, 10);
    if(idx === currentIdx && playing) return;
    loadStream(idx);
  });

  const activePlayers = document.getElementById('activePlayers');
  const bigCount = document.getElementById('bigCount');
  const countBar = document.getElementById('countBar');
  let baseCount = 1000;

  const fmt = n => n.toLocaleString('en-US');

  function updateCounts(){
    const drift = Math.floor(Math.random()*26) - 8;
    baseCount = Math.max(940, Math.min(1120, baseCount + drift));
    activePlayers.textContent = fmt(baseCount);
    bigCount.textContent = fmt(baseCount);
    const pct = Math.max(50, Math.min(95, Math.round((baseCount/1200)*100)));
    countBar.style.width = pct + '%';
  }
  updateCounts();
  setInterval(updateCounts, 3500);

  const uptimeEl = document.getElementById('uptime');
  let seconds = 0;
  setInterval(() => {
    seconds++;
    const h = String(Math.floor(seconds/3600)).padStart(2,'0');
    const m = String(Math.floor((seconds%3600)/60)).padStart(2,'0');
    const s = String(seconds%60).padStart(2,'0');
    uptimeEl.textContent = `${h}:${m}:${s}`;
  }, 1000);

  buildIframe(streams[0]);
</script>
</body>
</html>
