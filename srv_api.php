<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_api.php
// описание:	работа с api сервиса
// --------------------------------------------------------------------------------
include_once "srv_connect.php";

/* http://debug.idhost.kz/php/api.php?func=API_Auth */
if ( $_GET["func"] == "API_Auth" )
{
 if (isset($_GET['AuthKey'])){ $AuthKey = $_GET['AuthKey']; if ($AuthKey == '') unset($AuthKey); }
 else error("AuthKey need");

 $result = $mysqli->query( "SELECT * FROM `users` WHERE code='".$AuthKey."'" );
 if (!$result) error($mysqli->error);
 if ($result->num_rows > 0)
 {
//  $row = $result->fetch_assoc();
//  $_SESSION["user_id"] = $row["id"];
  success("ok");
 }
 else
 {
  error("user not found");
 }
 $mysqli->close();
}
/* http://debug.idhost.kz/php/api.php?func=API_GetValuesFromPeriod */
if ( $_GET["func"] == "API_GetValuesFromPeriod" )
{
 echo "HI! I'm TurboUchet API!";
}

?>