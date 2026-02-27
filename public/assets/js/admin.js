document.addEventListener('DOMContentLoaded', () => {

    const fileInput = document.getElementById('fileInput');
    const parseBtn = document.getElementById('parseBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const preview = document.getElementById('preview');
    const generatedLink = document.getElementById('generatedLink');

    let parsedRows = [];

    // =========================
    // NORMALIZER
    // =========================
    function normalizeKey(k) {
        return k ? k.toString().trim().toLowerCase() : '';
    }

    function normalizeGender(val) {
        if (!val) return null;

        const v = String(val).toLowerCase().trim();

        if (['l', '1', 'lk', 'laki', 'laki-laki', 'male', 'm'].includes(v)) return 1;
        if (['p', '2', 'pr', 'perempuan', 'female', 'f'].includes(v)) return 2;

        return null;
    }

    function formatDecimal(value) {
        if (value === null || value === undefined || value === '') return null;
        // Support format 11,9 atau 11.9
        const cleaned = String(value).replace(',', '.');
        const number = parseFloat(cleaned);

        if (isNaN(number)) return null;
        // 🔥 Bulatkan 1 angka desimal
        return Number(number.toFixed(1));
    }

    function mapField(row) {

        const lookup = {};
        for (const key of Object.keys(row)) {
            lookup[normalizeKey(key)] = key;
        }

        const pick = (variants) => {
            for (const v of variants) {
                const k = lookup[normalizeKey(v)];
                if (k) return row[k];
            }
            return '';
        };

        return {
            posyandu: pick(['posyandu', 'nama posyandu']),
            bulan: pick(['bulan', 'month']),
            tahun: pick(['tahun', 'year']),
            id_balita: pick(['id', 'id balita', 'nik']),
            nama: pick(['nama', 'name']),
            jk: normalizeGender(pick(['jenis kelamin', 'jk', 'gender'])),
            usia_bln: pick(['usia', 'usia (bulan)', 'age']),
            berat_kg: formatDecimal(pick(['berat badan (kg)', 'bb (kg)', 'bb', 'weight'])),
            tinggi_cm: formatDecimal(pick(['tinggi badan (cm)', 'tb (cm)', 'tb', 'height'])),
            status_bb_tb: pick(['status gizi bb/tb', 'bb/tb'])
        };
    }

    // =========================
    // PARSE FILE
    // =========================
    async function parseFile() {

        const file = fileInput.files[0];
        if (!file) return null;

        const data = await file.arrayBuffer();
        const wb = XLSX.read(data);
        const sheet = wb.Sheets[wb.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        return rows.map(mapField);
    }

    // =========================
    // PREVIEW
    // =========================
    parseBtn.onclick = async () => {

        parsedRows = await parseFile();
        if (!parsedRows) return;

        renderPreview(parsedRows);
        uploadBtn.disabled = false;
    };

    function genderLabel(g) {
        if (g == 1) return 'Laki-laki';
        if (g == 2) return 'Perempuan';
        return '-';
    }

    function renderPreview(rows) {
        let html = '<table class="table table-sm table-bordered">';
        html += '<tr><th>Posyandu</th><th>ID</th><th>Nama</th><th>JK</th><th>Usia</th><th>BB</th><th>TB</th></tr>';

        rows.forEach(r => {
            html += `
            <tr>
                <td>${r.posyandu}</td>
                <td>${r.id_balita}</td>
                <td>${r.nama}</td>
                <td>${genderLabel(r.jk)}</td>
                <td>${r.usia_bln}</td>
                <td>${r.berat_kg}</td>
                <td>${r.tinggi_cm}</td>
            </tr>`;
        });

        html += '</table>';

        preview.innerHTML = html;
    }

    // =========================
    // GENERATE FORM
    // =========================
    uploadBtn.onclick = async () => {
        try {
            parsedRows = await parseFile();
            if (!parsedRows.length) return alert('Data kosong');

            uploadBtn.disabled = true;
            uploadBtn.textContent = 'Menyimpan...';

            const resp = await fetch('/admin/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ rows: parsedRows })
            });

            const data = await resp.json();
            const link = `${location.origin}/validator/${data.formId}`;

            generatedLink.innerHTML = `
                <div class="alert alert-success d-flex gap-2 align-items-center">
                    <span>Form berhasil dibuat</span>
                    <a href="${link}" target="_blank" class="btn btn-success btn-sm">Buka</a>
                    <button id="copyLinkBtn" class="btn btn-outline-secondary btn-sm">Salin Link</button>
                </div>
            `;

            document.getElementById('copyLinkBtn').onclick = () => {
                navigator.clipboard.writeText(link);
                alert('Link disalin');
            };

            loadForms();

        } catch (e) {
            alert('Gagal generate form');
        }

        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Generate Form';
    };

    // =========================
    // EXPORT PDF (GLOBAL)
    // =========================
    window.exportPdf = async function (formId) {
        const resp = await fetch(`/admin/form/${formId}`);
        const data = await resp.json();
        const rows = data.rows;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(`Laporan Validasi - ${formId}`, 14, 15);
        const body = rows.map((r, i) => [
            i + 1,
            r.child.child_nik,
            genderLabel(r.child.gender),
            r.age_months,
            r.weight,
            r.height,
            r.nutrition_status
        ]);

        doc.autoTable({
            startY: 20,
            head: [['No', 'ID', 'JK', 'Usia', 'BB', 'TB', 'Status']],
            body
        });

        doc.save(`validasi_${formId}.pdf`);
    }

    // =========================
    // DELETE FORMS
    // =========================
    window.deleteForm = async function (formId) {
        if (!confirm(`Yakin mau hapus form ${formId}? Data tidak bisa dikembalikan.`)) {
            return;
        }

        try {
            const resp = await fetch(`/admin/forms/${formId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            const data = await resp.json();

            if (data.success) {
                alert('Form berhasil dihapus');
                loadForms();
            } else {
                alert('Gagal menghapus form');
            }

        } catch (e) {
            console.error(e);
            alert('Terjadi kesalahan saat menghapus');
        }
    }

    // =========================
    // LIST FORMS
    // =========================
    function formatDateTime(dateString) {
        if (!dateString) return '-';

        const date = new Date(dateString);

        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    async function loadForms() {
        const resp = await fetch('/admin/forms');
        const data = await resp.json();
        let html = `
        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-primary text-center">
                    <tr>
                        <th>Tanggal</th>
                        <th>Form ID</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th class="text-center">Aksi</th>
                    </tr>
                </thead>

                <tbody>
        `;

        data.forms.forEach(f => {
            let statusBadge = '';
            if (!f.validated_count || f.validated_count == 0) {
                statusBadge = '<span class="badge bg-danger">Belum Divalidasi</span>';
            }
            else if (f.validated_count < f.records_count) {
                statusBadge = '<span class="badge bg-warning">Sebagian</span>';
            }
            else {
                statusBadge = '<span class="badge bg-success">Selesai</span>';
            }

            html += `
        <tr>
            <td>${formatDateTime(f.created_at)}</td>
            <td>${f.form_id}</td>
            <td>${f.records_count}</td>
            <td class="text-center">${statusBadge}</td>
            <td class="text-center">
                <div class="d-flex flex-wrap justify-content-center gap-2">
                    <button class="btn btn-outline-success btn-sm copy-link-btn" data-id="${f.form_id}">
                        Salin Link
                    </button>

                    <a href="/admin/${f.form_id}/preview" target="_blank" class="btn btn-outline-primary btn-sm">
                       Preview
                    </a>

                    <button onclick="exportPdf('${f.form_id}')" class="btn btn-outline-secondary btn-sm">
                        PDF
                    </button>

                    <a href="/admin/${f.form_id}/summary" class="btn btn-outline-info btn-sm">
                        Summary
                    </a>

                    <button onclick="deleteForm('${f.form_id}')" class="btn btn-outline-danger btn-sm">
                        Hapus
                    </button>
                </div>
            </td>
        </tr>
        `;
        });

        html += `
        </tbody>
    </table>
    </div>
    `;

        document.getElementById('formsList').innerHTML = html;

        /* =========================
            EVENT SALIN LINK
            ========================= */
        document.querySelectorAll('.copy-link-btn')
            .forEach(btn => {
                btn.addEventListener('click', () => {

                    const formId = btn.dataset.id;
                    const link = `${location.origin}/validator/${formId}`;

                    navigator.clipboard.writeText(link);

                    const originalText = btn.textContent;

                    btn.textContent = "Tersalin ✓";
                    btn.classList.remove('btn-outline-success');
                    btn.classList.add('btn-success');

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.classList.remove('btn-success');
                        btn.classList.add('btn-outline-success');
                    }, 1500);
                });
            });
    }

    loadForms();
});
