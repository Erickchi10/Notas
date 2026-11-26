<?php
// API de usuarios (Práctica 6). Solo lectura: GET.
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido.'], JSON_UNESCAPED_UNICODE);
    exit;
}
echo file_get_contents(__DIR__ . '/../data/usuarios.json');