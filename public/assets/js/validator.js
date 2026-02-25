document.addEventListener('DOMContentLoaded', async () => {
    const wizardContainer = document.getElementById('wizardContainer');
    const progressBar = document.getElementById('progressBar');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    const resp = await fetch(`/validator/${FORM_ID}/data`);
    const data = await resp.json();

    const rows = data.rows;
    const meta = data.meta || {};

    let currentStep = 0;
    let itemsPerStep;
    let totalSteps;

    /* ================= RESPONSIVE SETUP ================= */

    function updateLayoutSettings() {
        const width = window.innerWidth;
        console.log("Current width:", width);

        itemsPerStep = width <= 768 ? 1 : 5;
        totalSteps = Math.ceil(rows.length / itemsPerStep) + 1;

        console.log("Items per step:", itemsPerStep);
    }

    updateLayoutSettings();

    /* ================= AUTO RESUME ================= */
    // Cari index pertama yang belum divalidasi
    let firstUnvalidatedIndex = rows.findIndex(r => !r.validation);

    // Kalau semua sudah divalidasi
    if (firstUnvalidatedIndex === -1) {
        currentStep = totalSteps - 1;
    } else {
        // Hitung step berdasarkan itemsPerStep
        currentStep = Math.floor(firstUnvalidatedIndex / itemsPerStep) + 1;
    }

    // Kalau belum ada validasi sama sekali
    if (rows.every(r => !r.validation)) {
        currentStep = 1;
    }

    window.addEventListener('resize', () => {
        const oldItems = itemsPerStep;
        updateLayoutSettings();
        if (oldItems !== itemsPerStep) {
            // Hitung ulang step berdasarkan progress yang sudah ada
            let firstUnvalidatedIndex = rows.findIndex(r => !r.validation);

            if (firstUnvalidatedIndex === -1) {
                currentStep = totalSteps - 1;
            } else {
                currentStep = Math.floor(firstUnvalidatedIndex / itemsPerStep) + 1;
            }
            renderStep();
        }
    });

    /* ================= PROGRESS ================= */
    function calculateProgress() {
        const validatedCount = rows.filter(r => r.validation).length;
        return Math.round((validatedCount / rows.length) * 100);
    }

    /* ================= RENDER ================= */
    function renderStep() {
        wizardContainer.innerHTML = '';
        let progress = calculateProgress();
        progressBar.style.width = progress + "%";
        document.getElementById('progressText').textContent = progress + "%";

        prevBtn.disabled = currentStep === 0;
        nextBtn.textContent =
            currentStep === totalSteps - 1 ? "Selesai" : "Next";

        if (currentStep === 0) {
            renderIdentityStep();
        } else {
            renderValidationStep();
        }
    }

    /* =============== VALIDATION FUNCTION =============== */
    function validateCurrentStep() {
        let isValid = true;
        document.querySelectorAll('.wizard-card')
            .forEach(card => {
                const index = card.dataset.index;
                const checked =
                    card.querySelector(
                        `input[name="valid-${index}"]:checked`
                    );
                card.style.border = "1px solid #dee2e6";

                if (!checked) {
                    isValid = false;
                    card.style.border = "2px solid #dc3545";
                }
            });
        return isValid;
    }

    /* ================= STEP 0 ================= */
    function renderIdentityStep() {
        wizardContainer.innerHTML = `
        <div class="row">
            <div class="col-12 mb-3">
                <label class="form-label">Nama Validator</label>
                <input id="validatorName" class="form-control" value="${meta.name || ''}">
            </div>

            <div class="col-12 mb-3">
                <label class="form-label">Jabatan</label>
                <input id="validatorRole" class="form-control" value="${meta.role || ''}">
            </div>

            </div>
        `;
    }

    function formatStatusGizi(status) {
        if (!status) return '-';
        const map = {
            'Gz.Brk': 'Gizi Buruk',
            'Gz.Krg': 'Gizi Kurang',
            'Normal': 'Normal',
            'Gz.Lbh': 'Gizi Lebih',
            'R.Gz.Lbh': 'Risiko Gizi Lebih',
            'Obesitas': 'Obesitas'
        };
        return map[status] ?? status;
    }

    /* ================= VALIDATION STEP ================= */
    function renderValidationStep() {

        let start = (currentStep - 1) * itemsPerStep;
        let end = start + itemsPerStep;
        let slice = rows.slice(start, end);

        slice.forEach((r, idx) => {

            const globalIndex = start + idx;

            const checkedValid =
                r.validation?.status === 'valid' ? 'checked' : '';
            const checkedInvalid =
                r.validation?.status === 'invalid' ? 'checked' : '';

            wizardContainer.innerHTML += `
            <div class="card shadow-sm wizard-card mb-3"
                 data-index="${globalIndex}"
                 data-id="${r.id}">

                <div class="card-body small">
                    <!-- ================= HEADER ================= -->
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <!-- LEFT SIDE -->
                            <div>
                                <div class="fw-bold fs-5">
                                    ${r.child.name ?? '-'}
                                </div>
                                <div class="text-muted small">
                                    ${r.child.child_nik ?? '-'}
                                </div>
                            </div>

                            <!-- RIGHT SIDE BADGES -->
                            <div class="text-end">
                                <div class="d-flex flex-column gap-1 align-items-end">
                                    <span class="badge bg-light text-dark">
                                        ${r.child.posyandu ?? '-'}
                                    </span>
                                    <span class="badge bg-light text-dark">
                                        ${r.month ?? '-'} ${r.year ?? '-'}
                                    </span>
                                </div>
                            </div>

                        </div>

                    <!-- ================= DATA GRID ================= -->
                    <div class="row g-3">
                        <div class="col-6">
                            <div class="field-label">Usia</div>
                            <div class="field-value">
                                ${r.age_months ?? '-'} bln
                            </div>
                        </div>

                        <div class="col-6">
                            <div class="field-label">Jenis Kelamin</div>
                            <div class="field-value">
                                ${r.child.gender == 1 ? 'Laki-laki' : 'Perempuan'}
                            </div>
                        </div>
                
                        <div class="col-6">
                            <div class="field-label">Berat</div>
                            <div class="field-value">
                                ${r.weight ?? '-'} kg
                            </div>
                        </div>

                        <div class="col-6">
                            <div class="field-label">Tinggi</div>
                            <div class="field-value">
                                ${r.height ?? '-'} cm
                            </div>
                        </div>

                        <div class="col-6">
                            <div class="field-label">Status Gizi</div>
                            <div class="field-value fw-bold text-primary">
                                ${formatStatusGizi(r.nutrition_status)}
                            </div>
                        </div>

                    </div>

                    <hr class="my-3">

                    <!-- ================= VALIDASI ================= -->
                    <div>
                        <div class="fw-semibold mb-2">Validasi</div>
                        <div class="d-flex gap-3">
                            <div class="form-check">
                                <input class="form-check-input"
                                       type="radio"
                                       id="valid-${globalIndex}"
                                       name="valid-${globalIndex}"
                                       value="valid"
                                       ${checkedValid}>
                                <label class="form-check-label"
                                       for="valid-${globalIndex}">
                                       Valid
                                </label>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input"
                                       type="radio"
                                       id="invalid-${globalIndex}"
                                       name="valid-${globalIndex}"
                                       value="invalid"
                                       ${checkedInvalid}>
                                <label class="form-check-label"
                                       for="invalid-${globalIndex}">
                                       Tidak Valid
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        });
    }

    /* ================= SAVE ================= */

    async function saveValidationStep() {
        const responses = [];
        document.querySelectorAll('.wizard-card')
            .forEach(card => {

                const index = card.dataset.index;
                const checked =
                    card.querySelector(
                        `input[name="valid-${index}"]:checked`
                    );

                responses.push({
                    data_id: card.dataset.id,
                    status: checked ? checked.value : null
                });
            });

        await fetch('/validator/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN':
                    document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                formId: FORM_ID,
                rows: responses
            })
        });
    }

    /* ================= NAVIGATION ================= */

    nextBtn.onclick = async () => {

        if (currentStep === 0) {

            const name =
                document.getElementById('validatorName').value;
            const role =
                document.getElementById('validatorRole').value;

            if (!name || !role) {
                alert("Nama & Jabatan wajib diisi");
                return;
            }

            await fetch('/validator/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    formId: FORM_ID,
                    name: name,
                    role: role,
                    rows: []
                })
            });

            currentStep++;
            renderStep();
            return;
        }

        // VALIDASI dulu
        if (!validateCurrentStep()) {
            alert("Semua data harus divalidasi sebelum lanjut.");
            return;
        }

        await saveValidationStep();

        if (currentStep < totalSteps - 1) {
            currentStep++;
            renderStep();
        } else {
            window.location.href = `/validator/${FORM_ID}/success`;
        }
    };

    prevBtn.onclick = () => {
        if (currentStep > 0) {
            currentStep--;
            renderStep();
        }
    };

    renderStep();
});