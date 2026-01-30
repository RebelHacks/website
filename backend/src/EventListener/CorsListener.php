<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * CORS Event Listener
 * Handles Cross-Origin Resource Sharing for API requests
 */
class CorsListener
{
    private array $allowedOrigins;

    public function __construct()
    {
        // Get allowed origins from environment or use defaults
        $origins = $_ENV['CORS_ALLOWED_ORIGINS'];
        $this->allowedOrigins = array_map('trim', explode(',', $origins));
    }

    #[AsEventListener(event: KernelEvents::REQUEST, priority: 256)]
    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        
        // Handle preflight OPTIONS requests
        if ($request->getMethod() === 'OPTIONS') {
            $response = new Response();
            $response->setStatusCode(204);
            $this->addCorsHeaders($response, $request->headers->get('Origin'));
            $event->setResponse($response);
        }
    }

    #[AsEventListener(event: KernelEvents::RESPONSE, priority: 0)]
    public function onKernelResponse(ResponseEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $response = $event->getResponse();
        $origin = $event->getRequest()->headers->get('Origin');
        
        $this->addCorsHeaders($response, $origin);
    }

    private function addCorsHeaders(Response $response, ?string $origin): void
    {
        // Check if origin is allowed
        if ($origin && (in_array('*', $this->allowedOrigins) || in_array($origin, $this->allowedOrigins))) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        } elseif (in_array('*', $this->allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', '*');
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
        $response->headers->set('Access-Control-Max-Age', '3600');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
    }
}

