<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use DI\Container;
use Illuminate\Database\Capsule\Manager as Capsule;

// Set CORS headers for all responses
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS requests immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables if .env file exists
if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->safeLoad();
}

// Create Container
$container = new Container();
AppFactory::setContainer($container);

// Create App
$app = AppFactory::create();
$app->setBasePath('/api');
$app->addBodyParsingMiddleware();

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// Register database service
$container->set('db', function () {
    $capsule = new Capsule;
    
    $capsule->addConnection([
        'driver'    => 'mysql',
        'host'      => $_ENV['DB_HOST'] ?? 'localhost',
        'database'  => $_ENV['DB_NAME'] ?? 'propverse',
        'username'  => $_ENV['DB_USER'] ?? 'root',
        'password'  => $_ENV['DB_PASS'] ?? '',
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci',
        'prefix'    => '',
    ]);
    
    // Make this Capsule instance available globally
    $capsule->setAsGlobal();
    
    // Setup the Eloquent ORM
    $capsule->bootEloquent();
    
    return $capsule;
});

// Register controllers
require __DIR__ . '/../src/Controllers/AuthController.php';
require __DIR__ . '/../src/Controllers/PropertyController.php';

// Define routes
$app->group('/auth', function ($group) {
    $group->post('/register', 'App\Controllers\AuthController:register');
    $group->post('/login', 'App\Controllers\AuthController:login');
});

$app->group('/properties', function ($group) {
    $group->get('', 'App\Controllers\PropertyController:getAll');
    $group->get('/{id}', 'App\Controllers\PropertyController:getOne');
    $group->post('', 'App\Controllers\PropertyController:create')->add(new App\Middleware\JwtMiddleware());
    $group->put('/{id}', 'App\Controllers\PropertyController:update')->add(new App\Middleware\JwtMiddleware());
    $group->delete('/{id}', 'App\Controllers\PropertyController:delete')->add(new App\Middleware\JwtMiddleware());
});

// Run app
$app->run(); 