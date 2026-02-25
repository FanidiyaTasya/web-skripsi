@extends('layouts.admin')

@section('content')
    <div class="container-fluid">

        {{-- Page Title --}}
        <div class="mb-4">
            <h4 class="fw-bold">Validasi Antropometri Balita</h4>
        </div>


        {{-- Upload Card --}}
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h6 class="fw-semibold mb-3">Upload File Excel</h6>
                <div class="mb-3">
                    <label class="form-label">Pilih File (.xlsx)</label>

                    {{-- 🔥 ID WAJIB sama dengan JS --}}
                    <input type="file" id="fileInput" class="form-control" accept=".xlsx,.xls,.csv">

                    <small class="text-muted">
                        Sistem akan membaca kolom otomatis dari file Excel
                    </small>
                </div>

                <div class="col-md-4 d-flex gap-2 mt-3 mt-md-0">
                    {{-- Preview opsional --}}
                    <button type="button" id="parseBtn" class="btn btn-outline-primary w-100">
                        Preview
                    </button>

                    {{-- Generate langsung bisa --}}
                    <button type="button" id="uploadBtn" class="btn btn-success w-100" disabled>
                        Generate Form
                    </button>
                </div>

                {{-- link hasil --}}
                <div id="generatedLink" class="mt-3"></div>

            </div>
        </div>

        {{-- Preview --}}
        <div id="preview" class="mb-4"></div>


        {{-- List Form --}}
        <div class="card">
            <div class="card-body">
                <h6 class="fw-semibold mb-3">Daftar Form</h6>
                <div id="formsList"></div>
            </div>
        </div>
    </div>


    {{-- ================= JS ================= --}}
    <script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>
    <script src="{{ asset('assets/js/admin.js') }}"></script>
@endsection
