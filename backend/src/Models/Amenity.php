<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    protected $table = 'amenities';
    
    protected $fillable = [
        'name',
        'icon',
        'category'
    ];
    
    public $timestamps = false;
    
    public function properties()
    {
        return $this->belongsToMany(Property::class, 'property_amenities', 'amenity_id', 'property_id');
    }
} 