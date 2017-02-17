<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_config.php
// описание:	конфигурация пользователя
// --------------------------------------------------------------------------------
if ( isset($_GET['func']) && $_GET["func"] == "GetConfig" )
{ 
 $result = $mysqli->query("SELECT name_title, group_title, but_group_title, but_rec_title, vk_id, journal FROM `users` WHERE id='".$_SESSION["user_id"]."'");
 if (!$result) error($mysqli->error);
 $row = $result->fetch_assoc();
 success($row);
 $mysqli->close(); 
}
?>