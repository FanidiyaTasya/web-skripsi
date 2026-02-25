<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Growlytics</title>
    <link rel="shortcut icon" type="image/png" href="{{ asset('assets/images/logos/favicon.png') }}" />
    <link rel="stylesheet" href="{{ asset('assets/css/styles.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/form-wizard.css') }}">
</head>

<body>

    <div class="container py-5 main-wrapper">
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                @yield('content.validator')
            </div>
        </div>

    </div>
    <script>
        const FORM_ID = "{{ $formId }}";
    </script>

    <script src="https://cdn.jsdelivr.net/npm/signature_pad/dist/signature_pad.umd.min.js"></script>
    <script src="{{ asset('assets/js/validator.js') }}?v={{ time() }}"></script>
</body>

</html>