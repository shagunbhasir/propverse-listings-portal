<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';
    
    protected $fillable = [
        'email',
        'password_hash',
        'first_name',
        'last_name',
        'phone',
        'profile_image',
        'user_type',
        'is_verified',
        'is_active'
    ];
    
    protected $hidden = [
        'password_hash'
    ];
    
    public function properties()
    {
        return $this->hasMany(Property::class, 'owner_id');
    }
    
    public function inquiries()
    {
        return $this->hasMany(PropertyInquiry::class, 'inquirer_id');
    }
    
    public function applications()
    {
        return $this->hasMany(RentalApplication::class, 'applicant_id');
    }
    
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
    
    public function reviews()
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }
} 