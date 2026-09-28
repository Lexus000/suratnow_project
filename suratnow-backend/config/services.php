<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'api_url' => env('GEMINI_API_URL'),
        'global_rate_limit' => (int) env('GEMINI_GLOBAL_RATE_LIMIT', 120),
    ],

    'suratnow' => [
        'frontend_url' => env('FRONTEND_URL', env('APP_URL', 'http://localhost:5173')),
    ],

    'letter_requests' => [
        'daily_limit' => (int) env('LETTER_REQUEST_DAILY_LIMIT', 100),
        'max_data_bytes' => (int) env('LETTER_REQUEST_MAX_DATA_BYTES', 32768),
        'max_list_items' => (int) env('LETTER_REQUEST_MAX_LIST_ITEMS', 500),
    ],

];
