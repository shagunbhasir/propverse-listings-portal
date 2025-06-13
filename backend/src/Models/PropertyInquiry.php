<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyInquiry extends Model
{
    protected $table = 'property_inquiries';
    
    protected $fillable = [
        'property_id',
        'inquirer_id',
        'message',
        'inquiry_type',
        'status'
    ];
    
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
    
    public function inquirer()
    {
        return $this->belongsTo(User::class, 'inquirer_id');
    }
} 