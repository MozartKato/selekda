<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['blog_id', 'commenter_name', 'commenter_email', 'comment'];

    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }
}
