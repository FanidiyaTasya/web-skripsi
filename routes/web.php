<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ValidatorController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('pages.index');
})->name('dashboard');

Route::prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.index');
    Route::post('/upload', [AdminController::class, 'upload']);
    Route::get('/forms', [AdminController::class, 'listForms']);
    Route::get('/form/{id}', [AdminController::class, 'getForm']);
    Route::delete('/forms/{id}', [AdminController::class, 'delete']);
    Route::get('/{formId}/preview', [AdminController::class, 'preview']); // preview setelah validator submit

});

Route::get('/validator/{formId}', [ValidatorController::class, 'show']);
Route::get('/validator/{formId}/data', [ValidatorController::class, 'data']);
Route::post('/validator/save', [ValidatorController::class, 'save']);
Route::get('/validator/{formId}/success', [ValidatorController::class, 'success']);

