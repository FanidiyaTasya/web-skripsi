<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Form;
use App\Models\Child;
use App\Models\GrowthRecord;

class AdminController extends Controller
{
    public function index()
    {
        return view('pages.admin.validation');
    }

    // =========================
    // UPLOAD (Generate Form)
    // =========================
    public function upload(Request $request)
    {
        $rows = $request->rows;

        $formId = 'frm' . Str::random(8);

        Form::create([
            'form_id' => $formId,
            'total_rows' => count($rows)
        ]);

        foreach ($rows as $r) {

            $child = Child::firstOrCreate(
                ['child_nik' => $r['id_balita']],
                [
                    'name' => $r['nama'] ?? null,
                    'gender' => $r['jk'] ?? null,
                    'posyandu' => $r['posyandu'] ?? null
                ]
            );

            GrowthRecord::create([
                'form_id' => $formId,
                'child_id' => $child->id,
                'month' => $r['bulan'],
                'year' => $r['tahun'] ?? null,
                'age_months' => $r['usia_bln'],
                'weight' => $r['berat_kg'],
                'height' => $r['tinggi_cm'],
                'nutrition_status' => $r['status_bb_tb']
            ]);
        }

        return response()->json([
            'success' => true,
            'formId' => $formId
        ]);
    }

    // =========================
    // LIST FORMS (admin table)
    // =========================
    public function listForms()
    {
        $forms = Form::withCount('records') // total growth_records
            ->latest()
            ->get()
            ->map(function ($form) {
                $validatedCount = \App\Models\Validation::where('form_id', $form->form_id)
                    ->count();
                $form->validated_count = $validatedCount;

                return $form;
            });

        return response()->json([
            'success' => true,
            'forms' => $forms
        ]);
    }


    // =========================
    // GET DATA (preview / download)
    // =========================
    public function getForm($id)
    {
        $form = Form::with('records.child')
            ->where('form_id', $id)
            ->firstOrFail();

        return response()->json([
            'rows' => $form->records,
            'validation_map' => []
        ]);
    }

    // public function preview($formId)
    // {
    //     return view('form-wizard', [
    //         'formId' => $formId,
    //         'readonly' => true
    //     ]);
    // }

    // =========================
// DELETE FORM
// =========================
    public function delete($id)
    {
        $form = Form::where('form_id', $id)->firstOrFail();

        $form->delete(); // kalau relasi cascade aktif, otomatis hapus child & records

        return response()->json([
            'success' => true
        ]);
    }
}

