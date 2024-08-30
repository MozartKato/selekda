<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = ['title', 'author', 'content'];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}