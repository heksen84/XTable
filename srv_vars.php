<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_vars.php
// описание:	работа с переменными пользователя на стороне сервера
// --------------------------------------------------------------------------------

/* 
--------------------------------------
уставновить переменную
--------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "SRV_SetVar" )
{
	
 if (isset($_POST['variable'])) { $variable = $mysqli->real_escape_string($_POST['variable']); if ($variable == '') unset($variable); } 
 if (isset($_POST['value']))    { $value    = $mysqli->real_escape_string($_POST['value']);    if ($value 	== '') unset($value); 	 }
 

 $result = $mysqli->query("SELECT * FROM `vars` WHERE user_id='".$_SESSION["user_id"]."' AND variable='".$variable."'"); 
 
 if (!$result) error($mysqli->error);
 if ($result->num_rows==0) /* добавить если такой переменной нет */
 {	
	$result = $mysqli->query("INSERT INTO `vars` (user_id, variable, value) VALUES ('".$_SESSION["user_id"]."','".$variable."','".$value."')"); 
	if (!$result) error($mysqli->error);
	success($mysqli->insert_id);	
 }
 else /* иначе просто обновить */
 {	
	$result = $mysqli->query("UPDATE `vars` SET value='".$value."' WHERE user_id='".$_SESSION["user_id"]."' AND variable='".$variable."'");
	if (!$result) error($mysqli->error); 
	warning("Переменная ".$variable." обновлена!");
 }
 $mysqli->close();
}

/*
--------------------------------------
 получить переменную
--------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "SRV_GetVar" )
{
 if (isset($_GET['variable'])) { $variable = $mysqli->real_escape_string($_GET['variable']);  if ($variable == '') unset($variable);  }
 
 $result = $mysqli->query("SELECT value FROM `vars` WHERE user_id='".$_SESSION["user_id"]."' AND variable='".$variable."'"); 
 if (!$result) error($mysqli->error);
 if ($result->num_rows > 0)
 {
	$row = $result->fetch_assoc();
	success($row);
 }
 else warning("Переменная: [".$variable."] отсутсвует");
 $mysqli->close();   
}
/*
--------------------------------------
 удалить все переменный пользователя
--------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "SRV_ShowVars" )
{	
 $result = $mysqli->query("SELECT variable,value FROM `vars` WHERE user_id='".$_SESSION["user_id"]."'"); 
 if (!$result) error($mysqli->error);
 while($row = $result->fetch_assoc())
 {
	$myArray[] = $row;
 }
 success($myArray);
 $mysqli->close();   
}
/*
--------------------------------------
 удалить все переменный пользователя
--------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "SRV_DeleteVars" )
{	
 /*$result = $mysqli->query("DELETE FROM `vars` WHERE user_id='".$_SESSION["user_id"]."'"); 
 if (!$result) error($mysqli->error);*/
 success("SRV_DeleteVars: OK");
 $mysqli->close();
}
?>