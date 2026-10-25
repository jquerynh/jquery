<?php
/**
 * index.php — Human Verification Gate
 * Simple verification page with two buttons.
 * Click -> set signed cookie -> redirect to condo.html
 */

// ============================================================
// 1. CONFIG
// ============================================================
$TARGET_URL  = 'condo.html';
$COOKIE_NAME = 'ch_verified';
$COOKIE_TTL  = 60 * 60 * 6; // 6 hours
$SECRET      = '9f4c8b2e7a1d5f306c9e2b8d4a7f1e6c3b9d2a5f8e1c4b7a0d3f6e9c2b5a8d1f!@#';

// ============================================================
// 2. ALREADY VERIFIED -> REDIRECT
// ============================================================
if (isset($_COOKIE[$COOKIE_NAME])) {
    [$payload, $sig] = array_pad(explode('|', $_COOKIE[$COOKIE_NAME], 2), 2, '');
    if (hash_equals(hash_hmac('sha256', $payload, $SECRET), $sig)) {
        header('Location: ' . $TARGET_URL, true, 302);
        exit;
    }
}

// ============================================================
// 3. BUTTON ACTION
// ============================================================
$action = $_POST['action'] ?? $_GET['action'] ?? '';

if ($action === 'verify' || $action === 'join') {
    $ip      = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $payload = base64_encode($ip . '|' . time());
    $sig     = hash_hmac('sha256', $payload, $SECRET);
    $token   = $payload . '|' . $sig;

    setcookie($COOKIE_NAME, $token, [
        'expires'  => time() + $COOKIE_TTL,
        'path'     => '/',
        'secure'   => !empty($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    header('Location: ' . $TARGET_URL, true, 302);
    exit;
}

// ============================================================
// 4. VERIFICATION PAGE
// ============================================================
http_response_code(200);
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verification · Access</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    font-family:'Inter',system-ui,-apple-system,sans-serif;
    background:#08080f;
    color:#ececf2;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px;
    min-height:100vh;
    position:relative;
    overflow:hidden;
  }
  /* Ambient glow background */
  body::before,
  body::after{
    content:'';
    position:fixed;
    border-radius:50%;
    filter:blur(120px);
    pointer-events:none;
    z-index:0;
  }
  body::before{
    width:480px;height:480px;
    background:rgba(255,45,120,.22);
    top:-160px;left:50%;transform:translateX(-70%);
    animation:float 14s ease-in-out infinite;
  }
  body::after{
    width:420px;height:420px;
    background:rgba(90,90,255,.18);
    bottom:-180px;right:-60px;
    animation:float 18s ease-in-out infinite reverse;
  }
  @keyframes float{
    0%,100%{transform:translate(0,0) scale(1)}
    50%{transform:translate(20px,30px) scale(1.08)}
  }

  .card{
    position:relative;
    z-index:1;
    width:100%;
    max-width:400px;
    background:rgba(18,18,28,.72);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,.08);
    border-radius:24px;
    padding:40px 28px 32px;
    box-shadow:
      0 30px 80px rgba(0,0,0,.6),
      0 1px 0 rgba(255,255,255,.05) inset;
    animation:rise .6s cubic-bezier(.2,.8,.2,1);
  }
  @keyframes rise{
    from{opacity:0;transform:translateY(16px)}
    to{opacity:1;transform:translateY(0)}
  }

  .icon{
    width:64px;height:64px;
    margin:0 auto 22px;
    border-radius:20px;
    background:linear-gradient(135deg,rgba(255,45,120,.18),rgba(255,90,160,.08));
    border:1px solid rgba(255,45,120,.3);
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 8px 32px rgba(255,45,120,.2);
  }
  .icon svg{
    width:28px;height:28px;
    stroke:#ff5aa0;
    stroke-width:2;
    fill:none;
    stroke-linecap:round;
    stroke-linejoin:round;
  }

  h1{
    font-size:22px;
    font-weight:700;
    text-align:center;
    letter-spacing:-.3px;
    margin-bottom:8px;
  }
  .sub{
    font-size:14px;
    color:#8f8fa8;
    text-align:center;
    line-height:1.55;
    margin-bottom:30px;
    padding:0 4px;
  }

  .btn{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:10px;
    width:100%;
    padding:15px 18px;
    border-radius:14px;
    font-size:15px;
    font-weight:600;
    font-family:inherit;
    cursor:pointer;
    border:none;
    transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
    margin-bottom:12px;
    letter-spacing:.1px;
  }
  .btn:last-of-type{margin-bottom:0}
  .btn:active{transform:scale(.975)}
  .btn svg{
    width:18px;height:18px;
    stroke-width:2.4;
    fill:none;
    stroke-linecap:round;
    stroke-linejoin:round;
    flex-shrink:0;
  }

  .btn-verify{
    background:linear-gradient(135deg,#ff2d78 0%,#ff5aa0 100%);
    color:#fff;
    box-shadow:0 10px 28px rgba(255,45,120,.4),0 1px 0 rgba(255,255,255,.2) inset;
    stroke:#fff;
  }
  .btn-verify:hover{
    box-shadow:0 14px 36px rgba(255,45,120,.55),0 1px 0 rgba(255,255,255,.25) inset;
  }

  .btn-join{
    background:rgba(255,255,255,.04);
    color:#ececf2;
    border:1px solid rgba(255,255,255,.12);
    stroke:#ececf2;
  }
  .btn-join:hover{
    background:rgba(255,255,255,.08);
    border-color:rgba(255,255,255,.2);
  }

  .divider{
    display:flex;
    align-items:center;
    gap:12px;
    margin:22px 0 18px;
    color:#5a5a70;
    font-size:11.5px;
    text-transform:uppercase;
    letter-spacing:1.2px;
    font-weight:600;
  }
  .divider::before,
  .divider::after{
    content:'';
    flex:1;
    height:1px;
    background:rgba(255,255,255,.08);
  }

  .foot{
    text-align:center;
    font-size:12px;
    color:#5a5a70;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:6px;
  }
  .foot svg{
    width:13px;height:13px;
    stroke:#5a5a70;
    stroke-width:2;
    fill:none;
    stroke-linecap:round;
    stroke-linejoin:round;
  }
</style>
</head>
<body>
  <form class="card" method="post" action="">
    <div class="icon">
      <svg viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </div>

    <h1>Verification Required</h1>
    <p class="sub">Confirm you're human to continue to the main page.</p>

    <button type="submit" name="action" value="verify" class="btn btn-verify">
      <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
      Verify Human
    </button>

    <div class="divider">or</div>

    <button type="submit" name="action" value="join" class="btn btn-join">
      <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
      Join Map
    </button>

    <div class="foot" style="margin-top:24px">
      <svg viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      Secure access · no personal data
    </div>
  </form>
</body>
</html>
