<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $table = 'properties';
    
    protected $fillable = [
        'owner_id',
        'title',
        'description',
        'property_type',
        'location',
        'city',
        'state',
        'pincode',
        'latitude',
        'longitude',
        'built_up_area',
        'carpet_area',
        'bedrooms',
        'bathrooms',
        'floor_number',
        'total_floors',
        'facing',
        'property_age',
        'furnishing_status',
        'monthly_rent',
        'security_deposit',
        'maintenance_charges',
        'preferred_tenants',
        'available_from',
        'is_available',
        'is_featured'
    ];
    
    protected $casts = [
        'available_from' => 'date',
        'is_available' => 'boolean',
        'is_featured' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
        'monthly_rent' => 'float',
        'security_deposit' => 'float',
        'maintenance_charges' => 'float'
    ];
    
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
    
    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }
    
    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'property_amenities', 'property_id', 'amenity_id');
    }
    
    public function inquiries()
    {
        return $this->hasMany(PropertyInquiry::class);
    }
    
    public function applications()
    {
        return $this->hasMany(RentalApplication::class);
    }
    
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
    
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    
    public function getCoverImage()
    {
        return $this->images()->where('is_cover_image', true)->first();
    }
} 