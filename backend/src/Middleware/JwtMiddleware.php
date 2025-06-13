<?php
namespace App\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use App\Models\User;

class JwtMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): Response
    {
        $response = new \Slim\Psr7\Response();
        
        $authHeader = $request->getHeaderLine('Authorization');
        
        if (empty($authHeader)) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'Authorization header is missing'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }
        
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'Invalid authorization format'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }
        
        $jwt = $matches[1];
        
        try {
            $secretKey = $_ENV['JWT_SECRET'] ?? 'propverse_secret_key';
            $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
            
            // Get user from database
            $user = User::find($decoded->user_id);
            
            if (!$user) {
                $response->getBody()->write(json_encode([
                    'error' => true,
                    'message' => 'User not found'
                ]));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }
            
            if (!$user->is_active) {
                $response->getBody()->write(json_encode([
                    'error' => true,
                    'message' => 'User account is inactive'
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }
            
            // Add user to request attributes
            $request = $request->withAttribute('user', $user);
            
            return $handler->handle($request);
            
        } catch (ExpiredException $e) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'Token has expired'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => true,
                'message' => 'Invalid or malformed token',
                'error_details' => $e->getMessage()
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }
    }
} 