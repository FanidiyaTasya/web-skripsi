<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\ChildController;
use App\Http\Controllers\ValidatorController;
use Illuminate\Support\Facades\Route;


Route::middleware('guest')->group(function () {
    Route::get('/', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return view('pages.index');
    })->name('dashboard');

    Route::get('/children', [ChildController::class, 'index'])->name('children.index');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/validation', [AdminController::class, 'index'])->name('validation.index');
        Route::post('/upload', [AdminController::class, 'upload']);
        Route::get('/forms', [AdminController::class, 'listForms']);
        Route::get('/form/{id}', [AdminController::class, 'getForm']);
        Route::delete('/forms/{id}', [AdminController::class, 'delete']);
        Route::get('/{formId}/preview', [AdminController::class, 'preview'])->name('preview');
        Route::get('/{formId}/summary', [AdminController::class, 'summary'])->name('summary');
    });
});

Route::prefix('validator')->group(function () {
    Route::get('/{formId}', [ValidatorController::class, 'show']);
    Route::get('/{formId}/data', [ValidatorController::class, 'data']);
    Route::post('/save', [ValidatorController::class, 'save']);
    Route::get('/{formId}/success', [ValidatorController::class, 'success']);
});