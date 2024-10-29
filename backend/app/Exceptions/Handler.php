<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [
        // pengecualian yang tidak dilaporkan
    ];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return response()->json([
            'error' => 'Unauthenticated',
            'message' => 'You need to log in to access this resource'
        ], 401);
    }

    public function render($request, Throwable $exception)
    {
        if ($request->is('api/*')) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }

        if ($exception instanceof AuthenticationException) {
            return $this->unauthenticated($request, $exception);
        }

        if ($exception instanceof RouteNotFoundException) {
            return response()->json([
                'error' => 'Route Not Found',
                'message' => 'The requested route is not defined.'
            ], 404);
        }

        // Tangani MethodNotAllowedHttpException secara khusus
        if ($exception instanceof MethodNotAllowedHttpException) {
            $allowedMethods = $exception->getHeaders()['Allow'] ?? [];
            $allowedMethodsString = is_array($allowedMethods) ? implode(', ', $allowedMethods) : 'POST';

            return response()->json([
                'error' => 'Method Not Allowed',
                'message' => 'The ' . $request->method() . ' method is not supported for this route. Supported methods: ' . $allowedMethodsString
            ], 405);
        }

        return parent::render($request, $exception);
    }
}