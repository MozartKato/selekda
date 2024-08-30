<?php
namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    // Menampilkan semua blog beserta komentarnya
    public function getBlogs()
    {
        $blogs = Blog::with('comments')->get();
        return response()->json($blogs);
    }

    // Menambahkan blog baru
    public function addBlog(Request $request)
    {
        // Validasi input
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        // Membuat blog baru
        $blog = Blog::create($validatedData);

        return response()->json([
            'message' => 'Blog successfully added',
            'blog' => $blog
        ], 201); // Status 201 menunjukkan bahwa resource berhasil dibuat
    }
}
