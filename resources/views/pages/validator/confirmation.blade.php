<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Growlytics</title>
    <link rel="shortcut icon" type="image/png" href="{{ asset('assets/images/logos/favicon.png') }}" />
    <link rel="stylesheet" href="{{ asset('assets/css/styles.min.css') }}" />

    <style>
        body {
            background: #f4f6f9;
        }

        .success-wrapper {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .success-card {
            max-width: 420px;
            border-radius: 16px;
            animation: fadeIn 0.6s ease;
        }

        /* SVG Animation */
        .checkmark {
            width: 90px;
            height: 90px;
            display: block;
            margin: 0 auto 20px;
        }

        .checkmark-circle {
            stroke-dasharray: 283;
            stroke-dashoffset: 283;
            animation: draw-circle 0.6s ease-out forwards;
        }

        .checkmark-check {
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: draw-check 0.4s 0.6s ease-out forwards;
        }

        @keyframes draw-circle {
            to {
                stroke-dashoffset: 0;
            }
        }

        @keyframes draw-check {
            to {
                stroke-dashoffset: 0;
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(15px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>

<body>

    <div class="success-wrapper">
        <div class="card shadow-sm text-center p-5 success-card">

            <!-- Animated SVG -->
            <svg class="checkmark" viewBox="0 0 52 52">
                <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" stroke="#28a745"
                    stroke-width="2" />

                <path class="checkmark-check" fill="none" stroke="#28a745" stroke-width="3" d="M14 27l7 7 16-16" />
            </svg>

            <h4 class="fw-bold">Validasi Berhasil</h4>

            <p class="text-muted mt-2">
                Terima kasih, data berhasil disimpan.
            </p>

        </div>
    </div>

</body>

</html>
