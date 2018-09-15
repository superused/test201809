<?php
// SheetsAPIのURL
$baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets/';

// APIキー
$apiKey = 'AIzaSyDwxpicDSa3GBcLJmgE1yxdtjYpIJFogcA';
// スプレッドシートID ※ https://docs.google.com/spreadsheets/d/ここの文字列/edit#gid=
$sheetId = '11BCnspCt2Mut3nhc4WMY6CYTd0zF9C3eCzsk1AEpKLM';
// シート名
$sheetName = 'sales';
// 取得するセルの範囲
$range = 'A1:E6';

// URL生成
$url = "{$baseUrl}{$sheetId}/values/{$sheetName}!{$range}?key={$apiKey}";
// APIからデータ取得
$jsonData = file_get_contents($url);
if (!$jsonData) exit('error');

$data = json_decode($jsonData, true);
if (!isset($data['values'])) exit('error');

$view = '';
foreach ($data['values'] as $values) {
    foreach ($values as $value) {
        $view .= "'{$value}',";
    }
    $view .= "\n";
}
echo $view;
