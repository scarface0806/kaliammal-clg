/**
 * admission-modal.js  –  Global Admission Enquiry Modal
 * Kaliammal College of Education
 *
 * Self-contained: injects CSS + HTML + JS into every page automatically.
 * Include this file once on any page to enable the popup.
 */
(function () {
    'use strict';

    // Guard: skip if already initialised (e.g. navigating back)
    if (document.getElementById('kcoeModalOverlay')) return;

    /* ── 1. Inject CSS ─────────────────────────────────────────────────────── */
    var styleEl = document.createElement('style');
    styleEl.id  = 'kcoeModalStyles';
    styleEl.textContent = `
/* ===== KCOE Admission Enquiry Modal ===== */
.kcoe-modal-overlay {
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 26, 58, 0.72);
    z-index: 99999;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
}
.kcoe-modal-overlay.kcoe-open {
    display: flex;
}
.kcoe-modal {
    background: #ffffff;
    width: 100%;
    max-width: 640px;
    border-radius: 4px;
    box-shadow: 0 8px 40px rgba(0, 30, 70, 0.32);
    overflow: hidden;
    animation: kcoeModalIn 0.22s ease;
    max-height: 94vh;
    overflow-y: auto;
    position: relative;
}
@keyframes kcoeModalIn {
    from { opacity: 0; transform: translateY(-18px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}
.kcoe-modal-header {
    background: #003a6a;
    padding: 22px 28px 18px;
    position: relative;
}
.kcoe-modal-header h4 {
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 4px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
}
.kcoe-modal-header p {
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    color: rgba(255,255,255,0.75);
    margin: 0;
    letter-spacing: 0.2px;
}
.kcoe-modal-close {
    position: absolute;
    top: 14px; right: 18px;
    background: none;
    border: none;
    color: #ffffff;
    font-size: 26px;
    line-height: 1;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 3px;
    transition: background 0.15s;
    font-weight: 400;
}
.kcoe-modal-close:hover {
    background: rgba(255,255,255,0.18);
}
.kcoe-modal-body {
    padding: 26px 28px 24px;
}
.kcoe-form-row {
    display: flex;
    gap: 16px;
    margin-bottom: 0;
}
.kcoe-form-group {
    flex: 1;
    margin-bottom: 16px;
    position: relative;
}
.kcoe-form-group.kcoe-full-width {
    flex: 1 1 100%;
}
.kcoe-form-group label {
    display: block;
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #1a3c6e;
    margin-bottom: 5px;
    letter-spacing: 0.2px;
}
.kcoe-form-group label span {
    color: #c0392b;
    margin-left: 2px;
}
.kcoe-form-group input,
.kcoe-form-group select {
    width: 100%;
    padding: 9px 12px;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    color: #333;
    background: #f8fafc;
    border: 1px solid #c8d6e5;
    border-radius: 3px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
}
.kcoe-form-group input:focus,
.kcoe-form-group select:focus {
    border-color: #003a6a;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(0, 58, 106, 0.10);
}
.kcoe-form-group input.kcoe-invalid,
.kcoe-form-group select.kcoe-invalid {
    border-color: #c0392b;
}
.kcoe-form-group input::placeholder {
    color: #aab4c0;
    font-size: 12px;
}
.kcoe-form-group select {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23003a6a'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 30px;
    cursor: pointer;
}
.kcoe-error-msg {
    display: none;
    font-family: 'Poppins', sans-serif;
    font-size: 11px;
    color: #c0392b;
    margin-top: 3px;
}
.kcoe-form-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
    padding-top: 4px;
    border-top: 1px solid #e8eef5;
}
.kcoe-btn-submit {
    flex: 1;
    padding: 10px 18px;
    background: #003a6a;
    color: #ffffff;
    border: none;
    border-radius: 3px;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.18s;
}
.kcoe-btn-submit:hover {
    background: #07BF51;
}
.kcoe-btn-reset {
    padding: 10px 18px;
    background: transparent;
    color: #555;
    border: 1px solid #c8d6e5;
    border-radius: 3px;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
}
.kcoe-btn-reset:hover {
    border-color: #003a6a;
    color: #003a6a;
}
.kcoe-success-msg {
    text-align: center;
    padding: 28px 20px 20px;
}
.kcoe-success-msg i {
    font-size: 44px;
    color: #07BF51;
    display: block;
    margin-bottom: 12px;
}
.kcoe-success-msg p {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #333;
    line-height: 1.7;
    margin: 0;
}
body.kcoe-modal-active {
    overflow: hidden;
}
@media (max-width: 576px) {
    .kcoe-modal-overlay { padding: 12px; }
    .kcoe-modal-header  { padding: 18px 20px 14px; }
    .kcoe-modal-header h4 { font-size: 15px; }
    .kcoe-modal-body    { padding: 20px 16px 18px; }
    .kcoe-form-row      { flex-direction: column; gap: 0; }
    .kcoe-form-actions  { flex-direction: column; }
    .kcoe-btn-reset     { text-align: center; }
}
`;
    (document.head || document.documentElement).appendChild(styleEl);

    /* ── 2. Inject HTML ────────────────────────────────────────────────────── */
    var wrapper = document.createElement('div');
    wrapper.innerHTML = `
<div id="kcoeModalOverlay" class="kcoe-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="kcoeModalTitle">
    <div class="kcoe-modal" id="kcoeModalBox">
        <div class="kcoe-modal-header">
            <h4 id="kcoeModalTitle">Online Admission Enquiry</h4>
            <p>Kaliammal College of Education &mdash; B.Ed &amp; M.Ed Programmes</p>
            <button class="kcoe-modal-close" id="kcoeModalClose" aria-label="Close">&times;</button>
        </div>
        <div class="kcoe-modal-body">
            <form id="kcoeEnquiryForm" method="POST" novalidate>
                <input type="hidden" name="_form_type" value="admission">
                <input type="text" name="_honey" style="display:none;" tabindex="-1" autocomplete="off">
                <div class="kcoe-form-row">
                    <div class="kcoe-form-group">
                        <label for="kcoeFullName">Full Name <span>*</span></label>
                        <input type="text" id="kcoeFullName" name="fullName" placeholder="Enter your full name">
                        <span class="kcoe-error-msg" id="kcoeFullNameErr">Please enter your full name.</span>
                    </div>
                    <div class="kcoe-form-group">
                        <label for="kcoeFatherName">Father's Name</label>
                        <input type="text" id="kcoeFatherName" name="fatherName" placeholder="Enter father's name">
                    </div>
                </div>
                <div class="kcoe-form-row">
                    <div class="kcoe-form-group">
                        <label for="kcoeEmail">Email Address <span>*</span></label>
                        <input type="email" id="kcoeEmail" name="email" placeholder="Enter your email address">
                        <span class="kcoe-error-msg" id="kcoeEmailErr">Please enter a valid email address.</span>
                    </div>
                    <div class="kcoe-form-group">
                        <label for="kcoePhone">Phone Number <span>*</span></label>
                        <input type="tel" id="kcoePhone" name="phone" placeholder="10-digit mobile number" maxlength="10">
                        <span class="kcoe-error-msg" id="kcoePhoneErr">Please enter a valid 10-digit number.</span>
                    </div>
                </div>
                <div class="kcoe-form-row">
                    <div class="kcoe-form-group">
                        <label for="kcoeWhatsapp">WhatsApp Number</label>
                        <input type="tel" id="kcoeWhatsapp" name="whatsapp" placeholder="WhatsApp number (if different)" maxlength="10">
                    </div>
                    <div class="kcoe-form-group">
                        <label for="kcoeCity">City / Town <span>*</span></label>
                        <input type="text" id="kcoeCity" name="city" placeholder="Enter your city or town">
                        <span class="kcoe-error-msg" id="kcoeCityErr">Please enter your city or town.</span>
                    </div>
                </div>
                <div class="kcoe-form-row">
                    <div class="kcoe-form-group kcoe-full-width">
                        <label for="kcoeProgram">Select Programme <span>*</span></label>
                        <select id="kcoeProgram" name="program">
                            <option value="">-- Select Programme --</option>
                            <option value="BEd">B.Ed &mdash; Bachelor of Education</option>
                            <option value="MEd">M.Ed &mdash; Master of Education</option>
                        </select>
                        <span class="kcoe-error-msg" id="kcoeProgramErr">Please select a programme.</span>
                    </div>
                </div>
                <div class="kcoe-form-actions">
                    <button type="submit" class="kcoe-btn-submit">Submit Enquiry</button>
                    <button type="button" class="kcoe-btn-reset" id="kcoeResetBtn">Clear Form</button>
                </div>
            </form>
            <div id="kcoeSuccessMsg" class="kcoe-success-msg" style="display:none;">
                <i class="zmdi zmdi-check-circle"></i>
                <p>Thank you for your enquiry! Our admissions team will contact you shortly.</p>
            </div>
        </div>
    </div>
</div>
`;
    document.body.appendChild(wrapper);

    /* ── 3. Wire up event handlers ─────────────────────────────────────────── */
    var overlay    = document.getElementById('kcoeModalOverlay');
    var openBtn    = document.getElementById('kcoeAdmissionBtn') || document.querySelector('.cont-btn a');
    var closeBtn   = document.getElementById('kcoeModalClose');
    var resetBtn   = document.getElementById('kcoeResetBtn');
    var form       = document.getElementById('kcoeEnquiryForm');
    var successMsg = document.getElementById('kcoeSuccessMsg');

    function openModal() {
        overlay.classList.add('kcoe-open');
        document.body.classList.add('kcoe-modal-active');
    }

    function closeModal() {
        overlay.classList.remove('kcoe-open');
        document.body.classList.remove('kcoe-modal-active');
    }

    function clearError(inputId, errId) {
        var el = document.getElementById(inputId);
        var er = document.getElementById(errId);
        if (el) el.classList.remove('kcoe-invalid');
        if (er) er.style.display = 'none';
    }

    function showError(inputId, errId) {
        var el = document.getElementById(inputId);
        var er = document.getElementById(errId);
        if (el) el.classList.add('kcoe-invalid');
        if (er) er.style.display = 'block';
    }

    function validateForm() {
        var valid   = true;
        var name    = document.getElementById('kcoeFullName').value.trim();
        var email   = document.getElementById('kcoeEmail').value.trim();
        var phone   = document.getElementById('kcoePhone').value.trim();
        var city    = document.getElementById('kcoeCity').value.trim();
        var program = document.getElementById('kcoeProgram').value;
        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var phoneRe = /^[6-9]\d{9}$/;

        clearError('kcoeFullName', 'kcoeFullNameErr');
        clearError('kcoeEmail',    'kcoeEmailErr');
        clearError('kcoePhone',    'kcoePhoneErr');
        clearError('kcoeCity',     'kcoeCityErr');
        clearError('kcoeProgram',  'kcoeProgramErr');

        if (!name)                          { showError('kcoeFullName', 'kcoeFullNameErr'); valid = false; }
        if (!email || !emailRe.test(email)) { showError('kcoeEmail',    'kcoeEmailErr');    valid = false; }
        if (!phone || !phoneRe.test(phone)) { showError('kcoePhone',    'kcoePhoneErr');    valid = false; }
        if (!city)                          { showError('kcoeCity',     'kcoeCityErr');     valid = false; }
        if (!program)                       { showError('kcoeProgram',  'kcoeProgramErr');  valid = false; }

        return valid;
    }

    if (openBtn) {
        openBtn.addEventListener('click', function (e) {
            e.preventDefault();
            form.style.display       = 'block';
            successMsg.style.display = 'none';
            openModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            form.reset();
            ['kcoeFullName', 'kcoeEmail', 'kcoePhone', 'kcoeCity', 'kcoeProgram'].forEach(function (id) {
                document.getElementById(id).classList.remove('kcoe-invalid');
            });
            document.querySelectorAll('.kcoe-error-msg').forEach(function (el) {
                el.style.display = 'none';
            });
        });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateForm()) return;
            var data = new FormData(form);
            fetch('mail.php', { method: 'POST', body: data })
                .then(function (r) { return r.json(); })
                .then(function (res) {
                    form.style.display = 'none';
                    var icon = successMsg.querySelector('i');
                    var para = successMsg.querySelector('p');
                    if (res && res.success) {
                        if (icon) icon.className = 'zmdi zmdi-check-circle';
                        if (para) para.textContent = 'Thank you for your enquiry! Our admissions team will contact you shortly.';
                    } else {
                        if (icon) icon.className = 'zmdi zmdi-alert-circle';
                        if (para) para.textContent = (res && res.message) ? res.message : 'Submission failed. Please call 6380496226 directly.';
                    }
                    successMsg.style.display = 'block';
                    setTimeout(closeModal, 3500);
                })
                .catch(function () {
                    form.style.display = 'none';
                    var icon = successMsg.querySelector('i');
                    var para = successMsg.querySelector('p');
                    if (icon) icon.className = 'zmdi zmdi-alert-circle';
                    if (para) para.textContent = 'Unable to submit. Please call us at 6380496226.';
                    successMsg.style.display = 'block';
                    setTimeout(closeModal, 4000);
                });
        });
    }

})();
