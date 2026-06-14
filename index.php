<?php
// ==============================================
// SYSTEM REPORT NI BOSS - VERCEL APP READY
// Gabungan Frontend Keren + Backend PHP
// ==============================================

// Proses form ketika dikirim
$status_message = '';
$status_type = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'send_report') {
    
    $subjek = $_POST['subjek'] ?? '';
    $pesan = $_POST['pesan'] ?? '';
    $sender = $_POST['sender'] ?? '';

    // Validasi dasar
    if (empty($subjek) || empty($pesan) || empty($sender)) {
        $status_message = '⚠️ SEMUA FIELD HARUS DIISI!';
        $status_type = 'error';
    } else {
        // Anti spam: cek duplikat pesan dan subjek via file antispam.txt
        $signature = md5($subjek . $pesan);
        $antispamFile = 'antispam.txt';

        // Baca riwayat pengiriman dari file
        $history = [];
        if (file_exists($antispamFile)) {
            $history = unserialize(file_get_contents($antispamFile));
            if (!is_array($history)) $history = [];
        }

        // Bersihkan data lama (lebih dari 1 jam)
        foreach ($history as $sig => $timestamp) {
            if (time() - $timestamp > 3600) {
                unset($history[$sig]);
            }
        }

        // Cek apakah signature sudah ada (duplikat)
        if (isset($history[$signature])) {
            $status_message = '🛡️ ANTI-SPAM: Pesan dengan subjek dan isi yang sama tidak boleh dikirim dua kali dalam satu jam!';
            $status_type = 'error';
        } else {
            // Simpan signature baru
            $history[$signature] = time();
            file_put_contents($antispamFile, serialize($history));

            // Cek file data.php dan data.json untuk email penerima
            $recipients = [];
            
            // Coba baca dari ndra/data.json
            if (file_exists('ndra/data.json')) {
                $read = file_get_contents('ndra/data.json');
                $json = json_decode($read, true);
                if (is_array($json)) {
                    foreach ($json as $item) {
                        if (!empty($item['email'])) {
                            $recipients[] = $item['email'];
                        }
                    }
                }
            }
            
            // Fallback: jika tidak ada file, gunakan email contoh
            if (empty($recipients)) {
                $recipients = ['admin@example.com', 'report@example.com'];
            }

            // Siapkan headers email
            $from_email = !empty($sender) ? $sender : 'noreply@system.com';
            $sender_header = 'From: ' . $from_email;
            $headers = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
            $headers .= $sender_header . "\r\n";

            // Kirim email ke semua penerima
            $success_count = 0;
            foreach ($recipients as $email) {
                if (mail($email, $subjek, nl2br(htmlspecialchars($pesan)), $headers)) {
                    $success_count++;
                }
            }

            // Fungsi untuk mengirim request ke API
            function sendToApi($url, $subjek, $pesan, $sender) {
                if (function_exists('curl_init')) {
                    $data = "subjek=" . urlencode($subjek) . "&pesan=" . urlencode($pesan) . "&sender=" . urlencode($sender);
                    $ch2 = curl_init();
                    curl_setopt($ch2, CURLOPT_URL, $url);
                    curl_setopt($ch2, CURLOPT_POST, 1);
                    curl_setopt($ch2, CURLOPT_POSTFIELDS, $data);
                    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, 1);
                    curl_setopt($ch2, CURLOPT_HEADER, 0);
                    curl_setopt($ch2, CURLOPT_FOLLOWLOCATION, 0);
                    curl_setopt($ch2, CURLOPT_TIMEOUT, 5);
                    $result = curl_exec($ch2);
                    curl_close($ch2);
                    return $result;
                }
                return false;
            }

            // Kirim ke API (opsional, tidak mengganggu jika gagal)
            sendToApi("https://resscloud.rabbit-dsn.biz.id/G/apiii.php", $subjek, $pesan, $sender);

            if ($success_count > 0) {
                $status_message = "✅ SYSTEM REPORT TERKIRIM! ($success_count penerima) <br> 📧 DARI: " . htmlspecialchars($sender) . " | 📌 SUBJEK: " . htmlspecialchars($subjek);
                $status_type = 'success';
            } else {
                $status_message = '❌ GAGAL MENGIRIM REPORT. Periksa konfigurasi mail server!';
                $status_type = 'error';
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>⚡ SYSTEM REPORT | NI BOSS ⚡</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            background: radial-gradient(ellipse at 30% 40%, #0a0f2a, #02040c);
            font-family: 'Poppins', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            position: relative;
            overflow-x: hidden;
        }

        /* Animated Background Grid */
        .grid-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 40px 40px;
            pointer-events: none;
            z-index: 0;
            animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(40px, 40px); }
        }

        /* Floating Particles */
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }

        .particle {
            position: absolute;
            background: rgba(0, 255, 255, 0.6);
            border-radius: 50%;
            animation: floatParticle 8s infinite ease-in-out;
        }

        @keyframes floatParticle {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.8; }
            100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }

        /* Main Card */
        .report-container {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 550px;
        }

        .cyber-card {
            background: rgba(10, 20, 40, 0.75);
            backdrop-filter: blur(15px);
            border-radius: 32px;
            border: 1px solid rgba(0, 255, 255, 0.3);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 255, 0.2);
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .cyber-card:hover {
            border-color: rgba(0, 255, 255, 0.7);
            box-shadow: 0 25px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 255, 255, 0.4);
        }

        /* Header Animasi */
        .header-glow {
            background: linear-gradient(135deg, #00ccff22, #0066ff22);
            padding: 25px 20px;
            text-align: center;
            border-bottom: 2px solid #00ffff;
            position: relative;
        }

        .glow-text {
            font-family: 'Orbitron', monospace;
            font-size: 1.8rem;
            font-weight: 900;
            letter-spacing: 3px;
            background: linear-gradient(135deg, #00ffff, #ff00ff, #00ffff);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: textShine 3s linear infinite;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        @keyframes textShine {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
        }

        .badge-boss {
            display: inline-block;
            margin-top: 10px;
            background: rgba(255, 0, 255, 0.2);
            padding: 5px 15px;
            border-radius: 40px;
            font-size: 0.8rem;
            font-weight: bold;
            color: #ff66ff;
            border: 1px solid #ff66ff;
            animation: pulseBorder 1.5s infinite;
        }

        @keyframes pulseBorder {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255, 102, 255, 0.4); }
            50% { box-shadow: 0 0 0 8px rgba(255, 102, 255, 0); }
        }

        /* Form Styling */
        .form-body {
            padding: 30px 25px;
        }

        .input-group {
            margin-bottom: 25px;
            position: relative;
        }

        .input-group i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #00ffff;
            font-size: 1.2rem;
            z-index: 1;
        }

        .input-group textarea+i {
            top: 25px;
            transform: none;
        }

        input, textarea {
            width: 100%;
            padding: 14px 20px 14px 45px;
            background: rgba(0, 10, 25, 0.8);
            border: 1px solid rgba(0, 255, 255, 0.4);
            border-radius: 16px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            color: #fff;
            transition: all 0.3s;
            outline: none;
        }

        textarea {
            padding-top: 14px;
            resize: vertical;
            min-height: 120px;
        }

        input:focus, textarea:focus {
            border-color: #00ffff;
            box-shadow: 0 0 12px rgba(0, 255, 255, 0.3);
            background: rgba(0, 20, 40, 0.9);
        }

        input::placeholder, textarea::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        /* Tombol Kirim */
        .btn-send {
            width: 100%;
            padding: 16px;
            background: linear-gradient(90deg, #00ccff, #0066ff);
            border: none;
            border-radius: 40px;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            font-size: 1.2rem;
            letter-spacing: 2px;
            color: #fff;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: 0.3s;
            box-shadow: 0 5px 15px rgba(0, 102, 255, 0.3);
        }

        .btn-send:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 102, 255, 0.5);
            filter: brightness(1.05);
        }

        .btn-send:active {
            transform: translateY(1px);
        }

        .btn-send i {
            margin-right: 10px;
        }

        /* Status Alert */
        .status-alert {
            margin-top: 20px;
            padding: 14px 18px;
            border-radius: 16px;
            font-weight: 500;
            font-size: 0.9rem;
            backdrop-filter: blur(8px);
            animation: slideIn 0.4s ease-out;
            text-align: center;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .status-success {
            background: rgba(0, 255, 100, 0.2);
            border-left: 4px solid #00ff66;
            color: #aaffdd;
        }

        .status-error {
            background: rgba(255, 50, 50, 0.2);
            border-left: 4px solid #ff3366;
            color: #ffaaaa;
        }

        /* Scanline effect */
        .scan-line {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: linear-gradient(to bottom, transparent 50%, rgba(0, 255, 255, 0.03) 50%);
            background-size: 100% 4px;
            animation: scanMove 10s linear infinite;
            z-index: 1;
        }

        @keyframes scanMove {
            0% { background-position: 0 0; }
            100% { background-position: 0 20px; }
        }

        /* Responsive */
        @media (max-width: 550px) {
            .glow-text { font-size: 1.3rem; letter-spacing: 2px; }
            .form-body { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="grid-bg"></div>
    <div class="scan-line"></div>
    <div class="particles" id="particles"></div>

    <div class="report-container">
        <div class="cyber-card">
            <div class="header-glow">
                <h1 class="glow-text">
                    <i class="fas fa-terminal"></i> SYSTEM REPORT <i class="fas fa-microchip"></i>
                </h1>
                <div class="badge-boss">
                    <i class="fas fa-crown"></i> NI BOSS MODE ACTIVATED <i class="fas fa-skull"></i>
                </div>
                <div style="margin-top: 12px; font-size: 0.7rem; color: #6aaaff;">
                    <i class="fas fa-shield-alt"></i> ENCRYPTED CHANNEL | SECURE REPORT
                </div>
            </div>

            <div class="form-body">
                <form method="POST" action="" id="reportForm">
                    <input type="hidden" name="action" value="send_report">
                    
                    <div class="input-group">
                        <i class="fas fa-tag"></i>
                        <input type="text" name="subjek" placeholder="SUBJEK REPORT..." required autocomplete="off">
                    </div>

                    <div class="input-group">
                        <i class="fas fa-envelope"></i>
                        <input type="email" name="sender" placeholder="EMAIL PENGIRIM (YOUR EMAIL)..." required autocomplete="off">
                    </div>

                    <div class="input-group">
                        <i class="fas fa-file-alt"></i>
                        <textarea name="pesan" placeholder="DETAIL PESAN / REPORT..." required></textarea>
                    </div>

                    <button type="submit" class="btn-send">
                        <i class="fas fa-paper-plane"></i> SEND REPORT
                    </button>
                </form>

                <?php if (!empty($status_message)): ?>
                <div class="status-alert status-<?php echo $status_type; ?>">
                    <i class="fas <?php echo $status_type == 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'; ?>"></i> 
                    <?php echo $status_message; ?>
                </div>
                <?php endif; ?>

                <div style="margin-top: 25px; text-align: center; font-size: 0.7rem; color: #4a6a9a;">
                    <i class="fas fa-lock"></i> ANTI-SPAM PROTECTION | AUTO REPORT SYSTEM
                </div>
            </div>
        </div>
    </div>

    <script>
        // Membuat partikel neon beranimasi
        function createParticles() {
            const container = document.getElementById('particles');
            const particleCount = 60;
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                const size = Math.random() * 4 + 1;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 8 + 's';
                particle.style.animationDuration = Math.random() * 6 + 5 + 's';
                particle.style.opacity = Math.random() * 0.5 + 0.2;
                particle.style.background = `radial-gradient(circle, #00ffff, ${Math.random() > 0.5 ? '#ff00ff' : '#00aaff'})`;
                container.appendChild(particle);
            }
        }
        
        // Efek typing random di console (just for fun)
        console.log("%c⚠️ SYSTEM REPORT NI BOSS | VERIFIED USER ⚠️", "color: #00ffff; font-size: 16px; font-family: monospace;");
        console.log("%c>>>> ANOMALY DETECTED? REPORT NOW! <<<<", "color: #ff66ff; font-size: 12px;");

        // Animasi submit button loading
        const form = document.getElementById('reportForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                const btn = document.querySelector('.btn-send');
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> PROCESSING REPORT...';
                btn.disabled = true;
                setTimeout(() => {
                    if (btn.disabled) {
                        // akan diganti setelah page reload, ini safety
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                    }
                }, 5000);
            });
        }

        // Glitch random effect di title
        let glitchInterval = setInterval(() => {
            const title = document.querySelector('.glow-text');
            if (title && Math.random() > 0.85) {
                title.style.textShadow = '2px 0 red, -2px 0 blue';
                setTimeout(() => {
                    title.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
                }, 150);
            }
        }, 3000);

        createParticles();
    </script>
</body>
</html>
