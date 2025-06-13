<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RentalApplication extends Model
{
    protected $table = 'rental_applications';
    
    protected $fillable = [
        'property_id',
        'applicant_id',
        'move_in_date',
        'lease_duration',
        'monthly_income',
        'employment_status',
        'references',
        'additional_notes',
        'status'
    ];
    
    protected $casts = [
        'move_in_date' => 'date',
        'monthly_income' => 'float'
    ];
    
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
    
    public function applicant()
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }
} 