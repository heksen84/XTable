<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_auth.php
// описание:	модуль авторизации
// --------------------------------------------------------------------------------
include_once("class.mail.php");

/*
----------------------------------------------------------------
 Авторизация через VK
----------------------------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "AuthVKUser" )
{	
	
	if (isset($_POST['vk_id'])) { $vk_id = trim($mysqli->real_escape_string($_POST['vk_id'])); if ($vk_id == '') unset($vk_id); }	
	if (isset($_POST['login'])) { $login = trim($mysqli->real_escape_string($_POST['login'])); if ($login== '')  unset($login); }	
			
	$result = $mysqli->query("SELECT * FROM `users` WHERE vk_id=".$vk_id);
	if (!$result) error($mysqli->error);
	$row = $result->fetch_assoc();
	
	if ($result->num_rows == 0)
	{				
		$result = $mysqli->query("INSERT INTO `users` VALUES ( NULL,'".$login."','no-reply@turbouchet.ru','',NOW(),NOW(),'".$_SERVER["REMOTE_ADDR"]."','".$vk_id."','','','группы','записи','группа','запись',1)");
		if (!$result) error($mysqli->error);		
		
		$_SESSION["user_id"] 	   = $mysqli->insert_id;
		$_SESSION["user_name"]     = $name;
		$_SESSION["user_email"]    = ""; 
		$_SESSION["user_password"] = "";
		$_SESSION["user_auth"]     = "true";

		/* внести нулевую оплату - триальный режим работы - ok */	
		$now_date = new DateTime();
		$trial_date = $now_date->modify("15 day");				
		$result = $mysqli->query("INSERT INTO `oplata` (id, user_id, start_period, end_period, months, summa) VALUES ( NULL,".$_SESSION["user_id"].",NOW(),'".$trial_date->format("Y-m-d")."',0,0 )");
		if (!$result) error($mysqli->error);				
		success($row["name"]);
	}
	else
	{			
		$_SESSION["user_id"]   = $row["id"];				
		$_SESSION["user_name"] = $row["name"];				
		$_SESSION["user_auth"] = "true";
		success($row["name"]);
	}
	
	$mysqli->close();	
}

/*
-----------------------------------------------------------

 Авторизация

 ----------------------------------------------------------
*/
if ( isset($_GET['func']) && $_GET["func"] == "AuthUser" )
{   
 
 if (isset($_GET['email']))    { $email    = $mysqli->real_escape_string($_GET['email']);    if ($email    == '') unset($email); }
 if (isset($_GET['password'])) { $password = $mysqli->real_escape_string($_GET['password']); if ($password == '') unset($password); }

 $email    = stripslashes($email);
 $email    = htmlspecialchars($email);
 $password = stripslashes($password);
 $password = htmlspecialchars($password);
 $email    = trim($email);
 $password = trim($password);
  
 $hash_password = password_hash($password, PASSWORD_BCRYPT); 
 
 $result = $mysqli->query("SELECT * FROM `users` WHERE email='".$email."'");
 if (!$result) error($mysqli->error);
 $row = $result->fetch_assoc();
 
 /* проверить пароль */
 if ( password_verify($password, $row["password"]) )
 {	 			
	
	/* записываю данные в сессию */
	$_SESSION["user_id"]        = $row["id"];
	$_SESSION["user_name"]      = $row["name"];
	$_SESSION["user_email"]     = $row["email"];   
	$_SESSION["user_auth_key"]  = $row["auth_key"];      
	$_SESSION["user_password"]  = $hash_password;
	$_SESSION["user_auth"]      = "true";       

	/* обновить последний визит  */
	$result = $mysqli->query("UPDATE `users` SET last_visit=NOW() WHERE id='".$row["id"]."'");
	if (!$result) error($mysqli->error);    
	success($_SESSION["user_name"]);
 } 
 else
 {
	echo json_encode(array( "answer" => "auth_input_data_error" ));
 }
 
 $mysqli->close();
}
?>