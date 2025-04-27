<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once('./class-PBS-Media-Manager-API-Client.php');
$env = require __DIR__ . '/.env.php';

$client = new PBS_Media_Manager_API_Client(
    $env['CLIENT_ID'],
    $env['CLIENT_SECRET'],
    $env['BASE_URL']
);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$inputData = file_get_contents("php://input");
$input = json_decode($inputData, true);
$recommendationIds = $input['recommendations'] ?? null;

if (!$recommendationIds || !is_array($recommendationIds)) {
    echo json_encode(['error' => 'No valid recommendation IDs provided']);
    exit();
}

// Build multi-cURL asset requests
$mh = curl_multi_init();
$handles = [];
$responses = [];
$showRequests = [];

$basicAuthHeader = 'Authorization: Basic ' . $env['BASIC_AUTH_KEY'];

foreach ($recommendationIds as $id) {
    $url = "https://media.services.pbs.org/api/v1/assets/$id/";

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            $basicAuthHeader,
            "Accept: application/json"
        ]
    ]);

    $handles[$id] = $ch;
    curl_multi_add_handle($mh, $ch);
}

$running = null;
do {
    curl_multi_exec($mh, $running);
    curl_multi_select($mh);
} while ($running > 0);

// Collect asset responses and prepare show requests in parallel
foreach ($handles as $id => $ch) {
    $response = curl_multi_getcontent($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($httpCode === 200) {
        $asset = json_decode($response, true);
        $responses[$id] = $asset;

        // Extract the show ID and prepare a parallel request
        $assetData = $asset['data']['attributes'];
        $showId = $assetData["parent_tree"]["attributes"]["season"]["attributes"]["show"]["id"]
            ?? $assetData["parent_tree"]["attributes"]["show"]["id"]
            ?? null;

        if ($showId) {
            $showRequests[$id] = $showId;
        }
    } else {
        $responses[$id] = ['error' => "Asset fetch failed ($httpCode) for ID: $id"];
    }

    curl_multi_remove_handle($mh, $ch);
    curl_close($ch);
}
curl_multi_close($mh);

// Fetch shows in parallel using multi-cURL
$mhShows = curl_multi_init();
$showHandles = [];
$showResponses = [];

foreach ($showRequests as $recommendationId => $showId) {
    $url = "{$env['BASE_URL']}/shows/$showId/";

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            $basicAuthHeader,
            "Accept: application/json"
        ]
    ]);

    $showHandles[$showId] = $ch;
    curl_multi_add_handle($mhShows, $ch);
}

$running = null;
do {
    curl_multi_exec($mhShows, $running);
    curl_multi_select($mhShows);
} while ($running > 0);

// Collect show responses
foreach ($showHandles as $showId => $ch) {
    $response = curl_multi_getcontent($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($httpCode === 200) {
        $showResponses[$showId] = json_decode($response, true);
    } else {
        $showResponses[$showId] = ['error' => "Show fetch failed ($httpCode) for ID: $showId"];
    }

    curl_multi_remove_handle($mhShows, $ch);
    curl_close($ch);
}
curl_multi_close($mhShows);

// Combine asset + show data and return results
$results = [];
foreach ($responses as $recommendationId => $asset) {
    if (isset($asset['error'])) {
        $results[] = ['error' => $asset['error']];
        continue;
    }

    $assetData = $asset['data']['attributes'];
    $episodeTitle = $assetData["title"] ?? null;
    $episodeDuration = $assetData["duration"] ?? null;
    $episodePremiered = $assetData["premiered_on"] ?? null;

    $showId = $showRequests[$recommendationId] ?? null;
    if ($showId && isset($showResponses[$showId]) && !isset($showResponses[$showId]['error'])) {
        $showData = $showResponses[$showId]['data']['attributes'];
        $showName = $showData["title"] ?? null;

        $showImage = null;
        if (isset($showData["images"])) {
            foreach ($showData["images"] as $imageObj) {
                if ($imageObj["profile"] === "show-mezzanine16x9") {
                    $showImage = $imageObj["image"];
                    break;
                }
            }
        }

        $genreField = $showData["genre"] ?? null;
        $showGenre = is_array($genreField) && isset($genreField["title"])
            ? $genreField["title"]
            : (is_string($genreField) ? $genreField : null);

        // Add combined result
        $results[] = [
            "show_name" => $showName,
            "show_image" => $showImage,
            "show_genre" => $showGenre,
            "episode_name" => $episodeTitle,
            "episode_duration" => $episodeDuration,
            "episode_premiered_on" => $episodePremiered
        ];
    } else {
        $results[] = ["error" => "Show data fetch failed for ID: $showId"];
    }
}

echo json_encode($results);