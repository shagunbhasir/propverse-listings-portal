<?php
namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\Amenity;

class PropertyController
{
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function getAll(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        
        // Start building the query
        $query = Property::query()->with(['owner', 'images']);
        
        // Apply filters if provided
        if (!empty($queryParams['city'])) {
            $query->where('city', 'like', '%' . $queryParams['city'] . '%');
        }
        
        if (!empty($queryParams['property_type'])) {
            $query->where('property_type', $queryParams['property_type']);
        }
        
        if (!empty($queryParams['min_price'])) {
            $query->where('monthly_rent', '>=', (float)$queryParams['min_price']);
        }
        
        if (!empty($queryParams['max_price'])) {
            $query->where('monthly_rent', '<=', (float)$queryParams['max_price']);
        }
        
        if (!empty($queryParams['bedrooms'])) {
            $query->where('bedrooms', '>=', (int)$queryParams['bedrooms']);
        }
        
        if (!empty($queryParams['bathrooms'])) {
            $query->where('bathrooms', '>=', (int)$queryParams['bathrooms']);
        }
        
        if (!empty($queryParams['furnishing_status'])) {
            $query->where('furnishing_status', $queryParams['furnishing_status']);
        }
        
        if (!empty($queryParams['available_from'])) {
            $query->where('available_from', '<=', $queryParams['available_from']);
        }
        
        if (isset($queryParams['is_available']) && $queryParams['is_available'] !== '') {
            $query->where('is_available', (bool)$queryParams['is_available']);
        }
        
        if (!empty($queryParams['owner_id'])) {
            $query->where('owner_id', (int)$queryParams['owner_id']);
        }
        
        // Apply sorting
        $sortBy = $queryParams['sort_by'] ?? 'created_at';
        $sortOrder = $queryParams['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);
        
        // Apply pagination
        $page = (int)($queryParams['page'] ?? 1);
        $limit = (int)($queryParams['limit'] ?? 10);
        $properties = $query->paginate($limit, ['*'], 'page', $page);
        
        $response->getBody()->write(json_encode([
            'error' => false,
            'properties' => $properties->items(),
            'pagination' => [
                'total' => $properties->total(),
                'per_page' => $properties->perPage(),
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'from' => $properties->firstItem(),
                'to' => $properties->lastItem()
            ]
        ]));
        
        return $response->withHeader('Content-Type', 'application/json');
    }
    
    public function getOne(Request $request, Response $response, array $args): Response
    {
        $id = $args['id'];
        
        $property = Property::with(['owner', 'images', 'amenities'])->find($id);
        
        if (!$property) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'Property not found'
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }
        
        $response->getBody()->write(json_encode([
            'error' => false,
            'property' => $property
        ]));
        
        return $response->withHeader('Content-Type', 'application/json');
    }
    
    public function create(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        
        // Get the current user from the request
        $user = $request->getAttribute('user');
        
        // Validate input
        $errors = $this->validatePropertyInput($data);
        
        if (!empty($errors)) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'Validation failed',
                'errors' => $errors
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
        
        // Create property
        $property = new Property();
        $property->owner_id = $user->id;
        $property->title = $data['title'];
        $property->description = $data['description'] ?? '';
        $property->property_type = $data['property_type'];
        $property->location = $data['location'];
        $property->city = $data['city'];
        $property->state = $data['state'];
        $property->pincode = $data['pincode'] ?? null;
        $property->latitude = $data['latitude'] ?? null;
        $property->longitude = $data['longitude'] ?? null;
        $property->built_up_area = $data['built_up_area'];
        $property->carpet_area = $data['carpet_area'] ?? null;
        $property->bedrooms = $data['bedrooms'];
        $property->bathrooms = $data['bathrooms'];
        $property->floor_number = $data['floor_number'] ?? null;
        $property->total_floors = $data['total_floors'] ?? null;
        $property->facing = $data['facing'] ?? null;
        $property->property_age = $data['property_age'] ?? null;
        $property->furnishing_status = $data['furnishing_status'] ?? 'unfurnished';
        $property->monthly_rent = $data['monthly_rent'];
        $property->security_deposit = $data['security_deposit'];
        $property->maintenance_charges = $data['maintenance_charges'] ?? 0;
        $property->preferred_tenants = $data['preferred_tenants'] ?? 'any';
        $property->available_from = $data['available_from'];
        $property->is_available = true;
        $property->save();
        
        // Handle images
        if (!empty($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $index => $imageUrl) {
                $image = new PropertyImage();
                $image->property_id = $property->id;
                $image->image_url = $imageUrl;
                $image->is_cover_image = ($index === 0); // First image is the cover
                $image->image_order = $index;
                $image->save();
            }
        } else {
            // Add a placeholder image
            $image = new PropertyImage();
            $image->property_id = $property->id;
            $image->image_url = '/placeholder.svg';
            $image->is_cover_image = true;
            $image->image_order = 0;
            $image->save();
        }
        
        // Handle amenities
        if (!empty($data['amenities']) && is_array($data['amenities'])) {
            $property->amenities()->sync($data['amenities']);
        }
        
        $response->getBody()->write(json_encode([
            'error' => false,
            'message' => 'Property created successfully',
            'property' => Property::with(['owner', 'images', 'amenities'])->find($property->id)
        ]));
        
        return $response->withHeader('Content-Type', 'application/json');
    }
    
    public function update(Request $request, Response $response, array $args): Response
    {
        $id = $args['id'];
        $data = $request->getParsedBody();
        
        // Get the current user from the request
        $user = $request->getAttribute('user');
        
        // Find the property
        $property = Property::find($id);
        
        if (!$property) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'Property not found'
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }
        
        // Check if the user is the owner
        if ($property->owner_id !== $user->id) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'You do not have permission to update this property'
            ]));
            return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
        }
        
        // Update property fields
        if (!empty($data['title'])) $property->title = $data['title'];
        if (isset($data['description'])) $property->description = $data['description'];
        if (!empty($data['property_type'])) $property->property_type = $data['property_type'];
        if (!empty($data['location'])) $property->location = $data['location'];
        if (!empty($data['city'])) $property->city = $data['city'];
        if (!empty($data['state'])) $property->state = $data['state'];
        if (isset($data['pincode'])) $property->pincode = $data['pincode'];
        if (isset($data['latitude'])) $property->latitude = $data['latitude'];
        if (isset($data['longitude'])) $property->longitude = $data['longitude'];
        if (!empty($data['built_up_area'])) $property->built_up_area = $data['built_up_area'];
        if (isset($data['carpet_area'])) $property->carpet_area = $data['carpet_area'];
        if (!empty($data['bedrooms'])) $property->bedrooms = $data['bedrooms'];
        if (!empty($data['bathrooms'])) $property->bathrooms = $data['bathrooms'];
        if (isset($data['floor_number'])) $property->floor_number = $data['floor_number'];
        if (isset($data['total_floors'])) $property->total_floors = $data['total_floors'];
        if (isset($data['facing'])) $property->facing = $data['facing'];
        if (isset($data['property_age'])) $property->property_age = $data['property_age'];
        if (isset($data['furnishing_status'])) $property->furnishing_status = $data['furnishing_status'];
        if (!empty($data['monthly_rent'])) $property->monthly_rent = $data['monthly_rent'];
        if (!empty($data['security_deposit'])) $property->security_deposit = $data['security_deposit'];
        if (isset($data['maintenance_charges'])) $property->maintenance_charges = $data['maintenance_charges'];
        if (isset($data['preferred_tenants'])) $property->preferred_tenants = $data['preferred_tenants'];
        if (!empty($data['available_from'])) $property->available_from = $data['available_from'];
        if (isset($data['is_available'])) $property->is_available = (bool)$data['is_available'];
        
        $property->save();
        
        // Handle images update if provided
        if (!empty($data['images']) && is_array($data['images'])) {
            // Remove existing images
            PropertyImage::where('property_id', $property->id)->delete();
            
            // Add new images
            foreach ($data['images'] as $index => $imageUrl) {
                $image = new PropertyImage();
                $image->property_id = $property->id;
                $image->image_url = $imageUrl;
                $image->is_cover_image = ($index === 0); // First image is the cover
                $image->image_order = $index;
                $image->save();
            }
        }
        
        // Handle amenities update if provided
        if (!empty($data['amenities']) && is_array($data['amenities'])) {
            $property->amenities()->sync($data['amenities']);
        }
        
        $response->getBody()->write(json_encode([
            'error' => false,
            'message' => 'Property updated successfully',
            'property' => Property::with(['owner', 'images', 'amenities'])->find($property->id)
        ]));
        
        return $response->withHeader('Content-Type', 'application/json');
    }
    
    public function delete(Request $request, Response $response, array $args): Response
    {
        $id = $args['id'];
        
        // Get the current user from the request
        $user = $request->getAttribute('user');
        
        // Find the property
        $property = Property::find($id);
        
        if (!$property) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'Property not found'
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }
        
        // Check if the user is the owner
        if ($property->owner_id !== $user->id) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'You do not have permission to delete this property'
            ]));
            return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
        }
        
        // Delete property (related records will be deleted by foreign key constraints)
        $property->delete();
        
        $response->getBody()->write(json_encode([
            'error' => false,
            'message' => 'Property deleted successfully'
        ]));
        
        return $response->withHeader('Content-Type', 'application/json');
    }
    
    private function validatePropertyInput($data): array
    {
        $errors = [];
        
        if (empty($data['title'])) {
            $errors['title'] = 'Title is required';
        }
        
        if (empty($data['property_type'])) {
            $errors['property_type'] = 'Property type is required';
        }
        
        if (empty($data['location'])) {
            $errors['location'] = 'Location is required';
        }
        
        if (empty($data['city'])) {
            $errors['city'] = 'City is required';
        }
        
        if (empty($data['state'])) {
            $errors['state'] = 'State is required';
        }
        
        if (empty($data['built_up_area']) || $data['built_up_area'] <= 0) {
            $errors['built_up_area'] = 'Valid built-up area is required';
        }
        
        if (empty($data['bedrooms']) || $data['bedrooms'] < 0) {
            $errors['bedrooms'] = 'Valid number of bedrooms is required';
        }
        
        if (empty($data['bathrooms']) || $data['bathrooms'] < 0) {
            $errors['bathrooms'] = 'Valid number of bathrooms is required';
        }
        
        if (empty($data['monthly_rent']) || $data['monthly_rent'] <= 0) {
            $errors['monthly_rent'] = 'Valid monthly rent is required';
        }
        
        if (empty($data['security_deposit']) || $data['security_deposit'] <= 0) {
            $errors['security_deposit'] = 'Valid security deposit is required';
        }
        
        if (empty($data['available_from'])) {
            $errors['available_from'] = 'Available from date is required';
        }
        
        return $errors;
    }
} 