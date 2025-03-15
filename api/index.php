<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once('./class-PBS-Media-Manager-API-Client.php');

require 'vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$client = new PBS_Media_Manager_API_Client(
    $client_id = $_ENV['CLIENT_ID'], 
    $client_secret = $_ENV['CLIENT_SECRET'], 
    $base_endpoint = $_ENV['BASE_URL']);

$pageNumber = rand(1, 20);

try {

    $shows = $client->get_shows(array('page-size' => 20, 'page' => $pageNumber));

    echo json_encode($shows, JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode(value: ['error' => 'Error Retrieving Show: ' . $e->getMessage()]);
}

?>
