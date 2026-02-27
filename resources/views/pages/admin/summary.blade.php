@extends('layouts.admin')

@section('content')
    <div class="container-fluid">

        <div class="card shadow-sm border-0">
            <div class="card-body">

                @php
                    $percentage = round(($valid / max($total, 1)) * 100);
                @endphp

                {{-- HEADER --}}
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 class="mb-1">Ringkasan Validasi</h4>
                        <small class="text-muted">Form ID: {{ $formId }}</small>
                    </div>
                </div>

                {{-- SUMMARY CARDS --}}
                <div class="row g-4 mb-4">

                    <div class="col-md-3">
                        <div class="card border-0 shadow-sm h-100 text-center">
                            <div class="card-body">
                                <div class="text-muted mb-2">Total Data</div>
                                <h2 class="fw-bold">{{ $total }}</h2>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card border-0 shadow-sm h-100 bg-success bg-opacity-10 text-center">
                            <div class="card-body">
                                <div class="text-success fw-semibold mb-2">Valid</div>
                                <h2 class="fw-bold text-success">{{ $valid }}</h2>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card border-0 shadow-sm h-100 bg-danger bg-opacity-10 text-center">
                            <div class="card-body">
                                <div class="text-danger fw-semibold mb-2">Tidak Valid</div>
                                <h2 class="fw-bold text-danger">{{ $invalid }}</h2>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card border-0 shadow-sm h-100 bg-warning bg-opacity-10 text-center">
                            <div class="card-body">
                                <div class="text-warning fw-semibold mb-2">Belum Divalidasi</div>
                                <h2 class="fw-bold text-warning">{{ $pending }}</h2>
                            </div>
                        </div>
                    </div>

                </div>

                {{-- DONUT CHART --}}
                <div class="row">
                    <div class="col-md-6 mx-auto">
                        <div class="card border-0 shadow-sm">
                            <div class="card-body">
                                <div class="row align-items-center">

                                    <div class="col-7">
                                        <h5 class="fw-semibold mb-3">
                                            Persentase Validasi
                                        </h5>

                                        <h3 class="fw-bold mb-2">
                                            {{ $percentage }}%
                                        </h3>

                                        <p class="text-muted mb-4">
                                            Data telah divalidasi
                                        </p>

                                        <div class="d-flex flex-column gap-2">
                                            <div>
                                                <span class="round-8 rounded-circle me-2 d-inline-block"
                                                    style="background:#5D87FF;width:10px;height:10px;"></span>
                                                <span class="fs-3">Valid ({{ $valid }})</span>
                                            </div>

                                            <div>
                                                <span class="round-8 rounded-circle me-2 d-inline-block"
                                                    style="background:#A0AEC0;width:10px;height:10px;"></span>
                                                <span class="fs-3">Tidak Valid ({{ $invalid }})</span>
                                            </div>

                                            <div>
                                                <span class="round-8 rounded-circle me-2 d-inline-block"
                                                    style="background:#E2E8F0;width:10px;height:10px;"></span>
                                                <span class="fs-3">Pending ({{ $pending }})</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-5">
                                        <div id="validationDonut" style="min-height:220px;"></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
@endsection


@push('scripts')
    <script>
        document.addEventListener("DOMContentLoaded", function() {

            var total = {{ max($total, 1) }};

            var options = {
                series: [{{ $valid }}, {{ $invalid }}, {{ $pending }}],

                chart: {
                    type: 'donut',
                    height: 220
                },

                labels: ['Valid', 'Tidak Valid', 'Pending'],

                colors: ['#5D87FF', '#A0AEC0', '#E2E8F0'],

                fill: {
                    type: 'solid'
                },

                stroke: {
                    width: 0
                },

                legend: {
                    show: false
                },

                dataLabels: {
                    enabled: false
                },

                plotOptions: {
                    pie: {
                        donut: {
                            size: '72%'
                        }
                    }
                },

                tooltip: {
                    y: {
                        formatter: function(val) {
                            var percent = ((val / total) * 100).toFixed(1);
                            return percent + "%";
                        }
                    }
                }
            };

            var chart = new ApexCharts(
                document.querySelector("#validationDonut"),
                options
            );

            chart.render();
        });
    </script>
@endpush
