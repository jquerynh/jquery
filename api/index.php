<?php
/**
 * index.php — Human Verification Gate
 * Detects bots from X (Twitter), TikTok, and other crawlers.
 * Real humans -> redirect to condo.php
 */

// ============================================================
// 1. KONFIGURASI
// ============================================================
$TARGET_URL   = 'condo.html';                 // Halaman tujuan
$COOKIE_NAME  = 'ch_verified';
$COOKIE_TTL   = 60 * 60 * 6;                 // 6 jam valid
$SECRET       = '9f4c8b2e7a1d5f306c9e2b8d4a7f1e6c3b9d2a5f8e1c4b7a0d3f6e9c2b5a8d1f!@#'; // Untuk signing cookie

// ============================================================
// 2. JIKA SUDAH PERNAH VERIFIKASI -> LANGSUNG REDIRECT
// ============================================================
if (isset($_COOKIE[$COOKIE_NAME])) {
    [$payload, $sig] = array_pad(explode('|', $_COOKIE[$COOKIE_NAME], 2), 2, '');
    if (hash_equals(hash_hmac('sha256', $payload, $SECRET), $sig)) {
        header('Location: ' . $TARGET_URL, true, 302);
        exit;
    }
}

// ============================================================
// 3. DETEKSI BOT — USER-AGENT BLACKLIST
// ============================================================
$ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

// Bot signature umum (X/Twitter, TikTok, social crawlers, headless, dll)
$bot_signatures = [
    // X / Twitter
    'twitterbot', 'twitter', 'x-crawler', 'xbot',
    // TikTok
    'tiktok', 'bytedance', 'musically', 'bytespider', 'tiktokbot',
    // Social preview crawlers
    'facebookexternalhit', 'facebot', 'facebookcatalog',
    'linkedinbot', 'slackbot', 'discordbot', 'telegrambot',
    'whatsapp', 'line-poker', 'pinterest', 'redditbot',
    'embedly', 'quora link preview', 'vkshare', 'w3c_validator',
    // Search engines (opsional — boleh dihapus kalau mau diizinkan)
    'googlebot', 'bingbot', 'yandexbot', 'duckduckbot',
    'baiduspider', 'sogou', 'exabot', 'ia_archiver',
    // Headless / automation
    'headlesschrome', 'phantomjs', 'puppeteer', 'playwright',
    'selenium', 'webdriver', 'python-requests', 'python-urllib',
    'curl/', 'wget/', 'go-http-client', 'java/', 'okhttp',
    'axios/', 'node-fetch', 'guzzle', 'libwww-perl',
    // Generic
    'bot', 'crawler', 'spider', 'scraper', 'preview',
    'monitoring', 'uptime', 'pingdom', 'statuscake',
];

$is_bot = false;
foreach ($bot_signatures as $sig) {
    if ($sig !== '' && strpos($ua, $sig) !== false) {
        $is_bot = true;
        break;
    }
}

// UA kosong = hampir pasti bot
if (trim($ua) === '') $is_bot = true;

// ============================================================
// 4. DETEKSI BOT — HEADER / REQUEST FINGERPRINT
// ============================================================
// Browser manusia normal selalu kirim header Accept-Language
if (empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) $is_bot = true;

// Browser manusia kirim Accept dengan text/html
$accept = $_SERVER['HTTP_ACCEPT'] ?? '';
if (stripos($accept, 'text/html') === false) $is_bot = true;

// Cek header khusus bot
if (!empty($_SERVER['HTTP_X_PURPOSE'])) $is_bot = true;                 // Chrome prerender
if (!empty($_SERVER['HTTP_X_MOZ'])) $is_bot = true;                      // Firefox prefetch
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) 
    && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
    // AJAX boleh, tapi biasanya bukan bot kalau ada cookie; abaikan
}

// ============================================================
// 5. DETEKSI BOT — METHOD
// ============================================================
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') $is_bot = true;

// ============================================================
// 6. JIKA BOT -> TAMPILKAN HALAMAN DECOY (bukan redirect)
// ============================================================
if ($is_bot) {
    // Bot melihat halaman "kosong/aman" agar tidak dapat akses ke condo.php
    http_response_code(200);
    header('Content-Type: text/html; charset=utf-8');
    header('X-Robots-Tag: noindex, nofollow');
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="robots" content="noindex,nofollow">
      <title>Loading...</title>
      <style>
        html,body{height:100%;margin:0;background:#05050a;color:#8b8b9c;
          font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center}
        .box{text-align:center;opacity:.7}
        .spinner{width:28px;height:28px;border:3px solid #222;border-top-color:#ff2d78;
          border-radius:50%;margin:0 auto 14px;animation:spin 1s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
      </style>
    </head>
    <body>
      <div class="box">
        <div class="spinner"></div>
        <div>Loading, please wait...</div>
      </div>
    </body>
    </html>
    <?php
    exit;
}

// ============================================================
// 7. MANUSIA — SET COOKIE VERIFIKASI LALU REDIRECT
// ============================================================
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
