<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorklogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('worklogs')->name('worklogs.')->group(function () {
        Route::get('/', [WorklogController::class, 'index'])->name('index');
        Route::post('/', [WorklogController::class, 'store'])->name('store');
        Route::post('/{worklog}/process', [WorklogController::class, 'process'])
            ->middleware('throttle:10,1')
            ->name('process');
        Route::match(['get', 'post'], '/report', [WorklogController::class, 'generateReport'])
            ->middleware('throttle:5,1')
            ->name('report');
    });
});


require __DIR__.'/auth.php';
