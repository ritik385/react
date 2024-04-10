<?php
// index.php

// Allow CORS (Cross-Origin Resource Sharing)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

// Sample messages (you would typically store messages in a database)
$messages = [
//   "Hello!",
//   "How are you?",
//   "I'm fine, thank you!",
];

// Get messages endpoint
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/getMessages') {
  echo json_encode(['messages' => $messages]);
  exit();
}

// Send message endpoint
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/sendMessage') {
  $data = json_decode(file_get_contents('php://input'), true);
  if (isset($data['message'])) {
    array_push($messages, $data['message']);
    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['error' => 'Message not provided']);
  }
  exit();
}

// Default response if endpoint not found
echo json_encode(['error' => 'Endpoint not found']);
