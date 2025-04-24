<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Include the PBS Media Manager Client
require_once('./class-PBS-Media-Manager-API-Client.php');

$env = require __DIR__ . '/.env.php';

$client = new PBS_Media_Manager_API_Client(
    $client_id = $env['CLIENT_ID'], 
    $client_secret = $env['CLIENT_SECRET'], 
    $base_endpoint = $env['BASE_URL']
);

// Handle preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Read and decode the input data from the frontend
$inputData = file_get_contents("php://input");
$input = json_decode($inputData, true);
// file_put_contents("inputs.txt", json_encode($input));

// Access the recommendations array
$recommendationIds = $input['recommendations'] ?? null;

if (!$recommendationIds || !is_array($recommendationIds)) {
    echo json_encode(['error' => 'No valid recommendation IDs provided']);
    exit();
}

$showDetailsArray = []; // Array to hold the show details

// Loop through the recommendation IDs
foreach ($recommendationIds as $recommendationId) {
    try {
        // Fetch the asset using the recommendation ID
        $asset = $client->get_asset($recommendationId);

        // Extract the show ID from the asset's parent tree
        $showId = $asset["data"]["attributes"]["parent_tree"]["attributes"]["season"]["attributes"]["show"]["id"];

        // Fetch the show details using the extracted show ID
        $show = $client->get_show($showId);

        // Add the show details to the array
        $showDetailsArray[] = $show; # used to be $show
    } catch (Exception $e) {
        // Log any errors encountered while fetching the asset or show
        $showDetailsArray[] = ['error' => 'Error fetching show for recommendation ID: ' . $recommendationId . ' - ' . $e->getMessage()];
    }
}

// file_put_contents("json.txt", json_encode($showDetailsArray));

// Return the array of show details (or error messages) to the frontend
echo json_encode($showDetailsArray);

?>