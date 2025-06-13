<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $table = 'favorites';
    
    protected $fillable = [
        'user_id',
        'property_id'
    ];
    
    public $timestamps = false;
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
} 