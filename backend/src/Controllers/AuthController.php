<?php
namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\User;
use Firebase\JWT\JWT;

class AuthController
{
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function register(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        
        // Validate input
        $errors = $this->validateInput($data);
        
        if (!empty($errors)) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'Validation failed',
                'errors' => $errors
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
        
        // Check if user already exists
        $existingUser = User::where('email', $data['email'])
            ->orWhere('phone', $data['phone'] ?? null)
            ->first();
            
        if ($existingUser) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'User already exists with this email or phone'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
        
        // Create user
        $user = new User();
        $user->email = $data['email'];
        $user->first_name = $data['first_name'];
        $user->last_name = $data['last_name'] ?? '';
        $user->phone = $data['phone'] ?? null;
        $user->password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
        $user->user_type = $data['user_type'] ?? 'tenant';
        $user->save();
        
        // Generate token
        $token = $this->generateToken($user);
        
        $response->getBody()->write(json_encode([
            'error' => false,
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ]));
        
        return $response->withHeader('Content-Type', 'application/json');
    }
    
    public function login(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        
        // Find user by email
        $user = User::where('email', $data['username'])->first();
        
        if (!$user) {
            // Try by phone
            $user = User::where('phone', $data['username'])->first();
        }
        
        if (!$user || !password_verify($data['password'], $user->password_hash)) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'Invalid credentials'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }
        
        // Check if user is active
        if (!$user->is_active) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'Account is inactive. Please contact support.'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }
        
        // Generate token
        $token = $this->generateToken($user);
        
        $response->getBody()->write(json_encode([
            'error' => false,
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]));
        
        return $response->withHeader('Content-Type', 'application/json');
    }
    
    private function validateInput($data): array
    {
        $errors = [];
        
        if (empty($data['email'])) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email format';
        }
        
        if (empty($data['password'])) {
            $errors['password'] = 'Password is required';
        } elseif (strlen($data['password']) < 6) {
            $errors['password'] = 'Password must be at least 6 characters long';
        }
        
        if (empty($data['first_name'])) {
            $errors['first_name'] = 'First name is required';
        }
        
        return $errors;
    }
    
    private function generateToken($user): string
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + ($_ENV['JWT_EXPIRATION'] ?? 86400); // Default: 1 day
        
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'user_id' => $user->id,
            'email' => $user->email,
            'user_type' => $user->user_type
        ];
        
        return JWT::encode($payload, $_ENV['JWT_SECRET'] ?? 'propverse_secret_key', 'HS256');
    }
} 