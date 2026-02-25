@extends('layouts.validator')

@section('content.validator')
    <h4 class="fw-bold mb-3">VALIDASI DATA GIZI BALITA</h4>
    <hr class="my-3">
    <!-- PROGRESS BAR -->
    <div class="wizard-progress mb-3">
        <div class="progress">
            <div id="progressBar" class="progress-bar" style="width:0%">
            </div>
        </div>
        <div class="text-end small mt-2 fw-semibold" id="progressText"></div>
    </div>

    <div id="wizardContainer"></div>

    <div class="wizard-actions">
        <button id="prevBtn" class="btn btn-prev">Previous</button>
        <button id="nextBtn" class="btn btn-next">Next</button>
    </div>
@endsection
