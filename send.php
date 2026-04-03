<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$name = trim($input['name'] ?? '');
$phone = trim($input['phone'] ?? '');
$email = trim($input['email'] ?? '');
$message = trim($input['message'] ?? '');

if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and phone required']);
    exit;
}

$to = 'redkin-sergey@mail.ru';
$subject = 'Glavniy Rakurs - Novaya zayavka';

$body = "Novaya zayavka s sayta Glavniy Rakurs\n\n";
$body .= "Imya: $name\n";
$body .= "Telefon: $phone\n";
$body .= "Email: " . ($email ?: 'Ne ukazan') . "\n";
$body .= "Soobshenie: " . ($message ?: 'Net soobsheniya') . "\n";

$headers = "From: noreply@glavniy-rakurs.ru\r\n";
$headers .= "Reply-To: " . ($email ?: 'redkin-sergey@mail.ru') . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error sending']);
}
