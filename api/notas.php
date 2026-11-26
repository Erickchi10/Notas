<?php
// API de notas (Práctica 6).
// GET lee data/notas.json. POST, PUT y DELETE validan y responden
// como si guardaran, pero NO modifican el archivo (simulación).
header('Content-Type: application/json; charset=utf-8');

$notas  = json_decode(file_get_contents(__DIR__ . '/../data/notas.json'), true);
$metodo = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int) $_GET['id'] : null;
$cuerpo = json_decode(file_get_contents('php://input'), true) ?? [];

function responder($codigo, $datos) {
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

function validar($d) {
    $errores = [];
    $texto = trim($d['texto'] ?? '');
    $largo = mb_strlen($texto);
    if ($largo < 3 || $largo > 200) $errores[] = 'La nota debe tener entre 3 y 200 caracteres.';
    if (empty($d['usuarioId'])) $errores[] = 'Falta el usuario.';
    if (!preg_match('/^#[0-9a-fA-F]{6}$/', $d['color'] ?? '')) $errores[] = 'Color no válido.';
    return $errores;
}

switch ($metodo) {
    case 'GET':
        if ($id === null) responder(200, $notas);
        foreach ($notas as $n) if ($n['id'] === $id) responder(200, $n);
        responder(404, ['error' => 'Nota no encontrada.']);

    case 'POST':
        $errores = validar($cuerpo);
        if ($errores) responder(422, ['errores' => $errores]);
        responder(201, [
            'id'        => (int) round(microtime(true) * 1000),
            'usuarioId' => (int) $cuerpo['usuarioId'],
            'texto'     => trim($cuerpo['texto']),
            'color'     => $cuerpo['color'],
            'fecha'     => date('c'),
        ]);

    case 'PUT':
        if ($id === null) responder(400, ['error' => 'Falta el id.']);
        $errores = validar($cuerpo);
        if ($errores) responder(422, ['errores' => $errores]);
        responder(200, [
            'id'        => $id,
            'usuarioId' => (int) $cuerpo['usuarioId'],
            'texto'     => trim($cuerpo['texto']),
            'color'     => $cuerpo['color'],
            'fecha'     => $cuerpo['fecha'] ?? date('c'),
        ]);

    case 'DELETE':
        if ($id === null) responder(400, ['error' => 'Falta el id.']);
        responder(200, ['mensaje' => 'Nota eliminada.', 'id' => $id]);

    default:
        responder(405, ['error' => 'Método no permitido.']);
}