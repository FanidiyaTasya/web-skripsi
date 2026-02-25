<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\Validation;
use Illuminate\Http\Request;

class ValidatorController extends Controller
{
    public function show($formId)
    {
        return view('pages.validator.form-wizard', compact('formId'));
    }

    public function data($formId)
    {
        $form = Form::with([
            'records.child',
            'records.validation'
        ])
            ->where('form_id', $formId)
            ->firstOrFail();

        return response()->json([
            'rows' => $form->records,
            'meta' => [
                'name' => $form->validator_name,
                'role' => $form->validator_role,
                'signature' => $form->signature
            ]
        ]);
    }

    public function save(Request $request)
    {
        try {
            $formId = $request->formId;

            /* ================= UPDATE META HANYA JIKA ADA ================= */
            if ($request->filled('name')) {

                Form::where('form_id', $formId)->update([
                    'validator_name' => $request->name,
                    'validator_role' => $request->role,
                    'signature' => $request->signature
                ]);
            }

            /* ================= SIMPAN VALIDASI PER BARIS ================= */
            if (!empty($request->rows)) {
                foreach ($request->rows as $row) {
                    Validation::updateOrCreate(
                        [
                            'form_id' => $formId,
                            'record_id' => $row['data_id']
                        ],
                        [
                            'status' => strtolower($row['status'])
                        ]
                    );
                }
            }
            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function success($formId)
    {
        return view('pages.validator.confirmation', compact('formId'));
    }
}
