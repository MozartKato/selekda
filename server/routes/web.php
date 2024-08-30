<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;

Route::get('/api/blogs', [BlogController::class, 'getBlogs']);
Route::post('/api/blogs', [BlogController::class, 'addBlog']);
Route::get('/', function () {
    return view('welcome');
});
