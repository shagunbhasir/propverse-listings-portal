<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';
    
    protected $fillable = [
        'property_id',
        'reviewer_id',
        'rating',
        'comment'
    ];
    
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
    
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
} 