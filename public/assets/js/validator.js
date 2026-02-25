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
    let signaturePad;

    /* ================= RESPONSIVE SETUP ================= */

    function updateLayoutSettings() {
        const width = window.innerWidth;
        console.log("Current width:", width);

        itemsPerStep = width <= 768 ? 1 : 5;
        totalSteps = Math.ceil(rows.length / itemsPerStep) + 1;

        console.log("Items per step:", itemsPerStep);
    }

    updateLayoutSettings();

    window.addEventListener('resize', () => {
        const oldItems = itemsPerStep;
        updateLayoutSettings();

        if (oldItems !== itemsPerStep) {
            currentStep = 0;
            renderStep();
        }
    });

    /* ================= PROGRESS ================= */
    function calculateProgress() {
        let validatedCount = 0;
        rows.forEach(r => {
            if (r.validation && r.validation.status) {
                validatedCount++;
            }
        });
        return rows.length === 0 ? 0 :
            Math.round((validatedCount / rows.length) * 100);
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

                // reset border dulu
                card.style.border = "1px solid #dee2e6";

                if (!checked) {
                    isValid = false;

                    // kasih highlight merah
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

    //         // TODO: TTD masih optional
    //         // <div class="col-12 mb-3">
    //         //     <label class="form-label">Tanda Tangan</label>
    //         //     <canvas id="sigPad" class="signature-canvas"></canvas>
    //         //     <button type="button" id="clearSig" class="btn btn-sm btn-secondary mt-2">
    //         //         Clear
    //         //     </button>
    //         // </div>

        const canvas = document.getElementById('sigPad');
        signaturePad = new SignaturePad(canvas);

        function resizeCanvas() {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = 120 * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
        }

        resizeCanvas();

        if (meta.signature) {
            signaturePad.fromDataURL(meta.signature);
        }

        document.getElementById('clearSig').onclick =
            () => signaturePad.clear();
    }

    /* ================= VALIDATION STEP ================= */
    // function renderValidationStep() {

    //     let start = (currentStep - 1) * itemsPerStep;
    //     let end = start + itemsPerStep;
    //     let slice = rows.slice(start, end);

    //     slice.forEach((r, idx) => {

    //         const globalIndex = start + idx;

    //         const checkedValid =
    //             r.validation?.status === 'valid' ? 'checked' : '';
    //         const checkedInvalid =
    //             r.validation?.status === 'invalid' ? 'checked' : '';

    //         wizardContainer.innerHTML += `
    //             <div class="card shadow-sm wizard-card mb-3"
    //                  data-index="${globalIndex}"
    //                  data-id="${r.id}">

    //                 <div class="card-body small">

    //                     <div class="row g-3">

    //                         <div class="col-md-6">
    //                             <div class="field-label">Posyandu</div>
    //                             <div class="field-value">${r.child.posyandu ?? '-'}</div>
    //                         </div>

    //                         <div class="col-md-6">
    //                             <div class="field-label">Tahun</div>
    //                             <div class="field-value">${r.year ?? '-'}</div>
    //                         </div>

    //                         <div class="col-md-6">
    //                             <div class="field-label">Bulan</div>
    //                             <div class="field-value">${r.month ?? '-'}</div>
    //                         </div>

    //                         <div class="col-md-6">
    //                             <div class="field-label">ID Balita</div>
    //                             <div class="field-value">${r.child.child_nik}</div>
    //                         </div>

    //                         <div class="col-md-6">
    //                             <div class="field-label">Nama</div>
    //                             <div class="field-value">${r.child.name ?? '-'}</div>
    //                         </div>

    //                         <div class="col-md-6">
    //                             <div class="field-label">Usia (bln)</div>
    //                             <div class="field-value">${r.age_months}</div>
    //                         </div>

    //                         <div class="col-md-6">
    //                             <div class="field-label">Jenis Kelamin</div>
    //                             <div class="field-value">
    //                                 ${r.child.gender == 1 ? 'Laki-laki' : 'Perempuan'}
    //                             </div>
    //                         </div>

    //                         <div class="col-md-6">
    //                             <div class="field-label">Status Gizi BB/TB</div>
    //                             <div class="field-value text-primary fw-semibold">
    //                                 ${r.nutrition_status ?? '-'}
    //                             </div>
    //                         </div>

    //                         <div class="col-md-6">
    //                             <div class="field-label">Berat (kg)</div>
    //                             <div class="field-value">${r.weight}</div>
    //                         </div>

    //                         <div class="col-md-6">
    //                             <div class="field-label">Tinggi (cm)</div>
    //                             <div class="field-value">${r.height}</div>
    //                         </div>

    //                     </div>

    //                     <hr class="my-4">

    //                     <div>
    //                         <label class="form-label fw-semibold">Validasi</label>

    //                         <div class="d-flex gap-4 mt-2">
    //                             <div class="form-check">
    //                                 <input class="form-check-input"
    //                                        type="radio"
    //                                        name="valid-${globalIndex}"
    //                                        value="valid"
    //                                        ${checkedValid}>
    //                                 <label class="form-check-label">Valid</label>
    //                             </div>

    //                             <div class="form-check">
    //                                 <input class="form-check-input"
    //                                        type="radio"
    //                                        name="valid-${globalIndex}"
    //                                        value="invalid"
    //                                        ${checkedInvalid}>
    //                                 <label class="form-check-label">Tidak Valid</label>
    //                             </div>
    //                         </div>
    //                     </div>

    //                 </div>
    //             </div>
    //         `;
    //     });
    // }

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

                    <!-- HEADER MINI -->
                    <div class="mb-3">
                        <div class="fw-bold fs-6">
                            ${r.child.name ?? '-'}
                        </div>
                        <div class="text-muted small">
                            ID: ${r.child.child_nik}
                        </div>
                    </div>

                    <!-- DATA GRID -->
                    <div class="row g-3">

                        <div class="col-6">
                            <div class="field-label">Posyandu</div>
                            <div class="field-value">${r.child.posyandu ?? '-'}</div>
                        </div>

                        <div class="col-6">
                            <div class="field-label">Tahun</div>
                            <div class="field-value">${r.year ?? '-'}</div>
                        </div>

                        <div class="col-6">
                            <div class="field-label">Bulan</div>
                            <div class="field-value">${r.month ?? '-'}</div>
                        </div>

                        <div class="col-6">
                            <div class="field-label">Usia</div>
                            <div class="field-value">${r.age_months} bln</div>
                        </div>

                        <div class="col-6">
                            <div class="field-label">Jenis Kelamin</div>
                            <div class="field-value">
                                ${r.child.gender == 1 ? 'Laki-laki' : 'Perempuan'}
                            </div>
                        </div>

                        <div class="col-6">
                            <div class="field-label">Status Gizi</div>
                            <div class="field-value fw-bold text-primary">
                                ${r.nutrition_status ?? '-'}
                            </div>
                        </div>

                        <div class="col-6">
                            <div class="field-label">Berat</div>
                            <div class="field-value">${r.weight} kg</div>
                        </div>

                        <div class="col-6">
                            <div class="field-label">Tinggi</div>
                            <div class="field-value">${r.height} cm</div>
                        </div>

                    </div>

                    <hr class="my-3">

                    <!-- VALIDASI -->
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

            // if (signaturePad.isEmpty()) {
            //     alert("Tanda tangan wajib diisi");
            //     return;
            // }

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
                    // signature: signaturePad.toDataURL(),
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
            alert("Validasi selesai 🎉");
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