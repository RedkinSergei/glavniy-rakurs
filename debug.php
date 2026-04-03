<?php
header('Content-Type: text/plain');
$raw = file_get_contents('php://input');
echo 'RAW: ' . $raw . PHP_EOL;
$decoded = json_decode($raw, true);
echo 'DECODED: ' . print_r($decoded, true) . PHP_EOL;
echo 'ERROR: ' . json_last_error_msg() . PHP_EOL;
