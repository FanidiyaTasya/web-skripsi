@extends('layouts.validator')

@section('content.validator')
    <h5 class="fw-bold mb-3">Validasi Data Balita</h5>

    <!-- PROGRESS BAR -->
    <div class="wizard-progress mb-4">
        <div class="progress">
            <div class="progress-bar" id="progressBar" style="width: 50%;">
                <span id="progressText" class="ms-auto me-2 small"></span>
            </div>
        </div>
    </div>

    <div id="wizardContainer"></div>

    <div class="d-flex justify-content-between mt-4">
        <button id="prevBtn" class="btn btn-secondary">Previous</button>
        <button id="nextBtn" class="btn btn-success">Next</button>
    </div>
@endsection
