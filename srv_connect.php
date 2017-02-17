<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_connect.php
// описание:	соединение с бд
// --------------------------------------------------------------------------------
include_once "srv_message.php";
session_start();
//$mysqli= new mysqli('127.0.0.1', 'root', '', 'turbouchet');
$mysqli= new mysqli('node26619-env-9505999.j.dnr.kz', 'tbuser', 'dxpTCwQDQP2CAeEE', 'turbouchet');
if ($mysqli->connect_error) error($mysqli->connect_error);
$result = $mysqli->query( "SET character_set_results='utf8',character_set_client='utf8',character_set_connection='utf8',character_set_database='utf8',character_set_server='utf8'" );
if (!$result) error($mysqli->error);
 
?>