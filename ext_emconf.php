<?php

/** @var string $_EXTKEY */
$EM_CONF[$_EXTKEY] = [
    'title' => 'Keep Scroll Position',
    'description' => 'Restores the scroll position of the backend module body after a full page reload (e.g. after hide/delete/move actions), instead of jumping back to the top.',
    'category' => 'misc',
    'author' => 'it.x informationssysteme gmbh',
    'state' => 'stable',
    'version' => '1.0.0',
    'constraints' => [
        'depends' => [
            'typo3' => '13.4.0-13.4.99',
        ],
    ],
];
