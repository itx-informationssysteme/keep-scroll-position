<?php

return [
    'backend' => [
        'itx/keep-scroll-position' => [
            'target' => \Itx\KeepScrollPosition\Middleware\KeepScrollPositionMiddleware::class,
            'after' => [
                'typo3/cms-backend/response-headers',
            ],
        ],
    ],
];
