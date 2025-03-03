<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once('./class-PBS-Media-Manager-API-Client.php');

$env = require __DIR__ . '/.env.php';

$client = new PBS_Media_Manager_API_Client(
    $client_id = $env['CLIENT_ID'], 
    $client_secret = $env['CLIENT_SECRET'], 
    $base_endpoint = $env['BASE_URL']);

$pageNumber = rand(1, 20);

try {

    $histories = $client->get_shows(array('page-size' => 20, 'page' => $pageNumber, 'genre-slug' => 'history'));
    
    // file_put_contents('histories.json', json_encode($histories, JSON_PRETTY_PRINT));

    echo json_encode($histories);

} catch (Exception $e) {
    echo json_encode(['error' => 'Error Retrieving Show: ' . $e->getMessage()]);
}

?>