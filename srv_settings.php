<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_settings.php
// описание:	модуль настроек
// --------------------------------------------------------------------------------

/*
------------------------------------------------------------------
 получить настройки
------------------------------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetUserSettings" )
{ 
 
 $result = $mysqli->query("SELECT * FROM personal WHERE user_id='".$_SESSION["user_id"]."'");
 
 if (!$result) error($mysqli->error);
 $_SESSION["personal_count"] = $result->num_rows;
 
 $result = $mysqli->query("SELECT * FROM groups WHERE user_id='".$_SESSION["user_id"]."'");
 if (!$result) error($mysqli->error);
 
 $_SESSION["group_count"] = $result->num_rows; 
 
 
 success( array( "id"			=> $_SESSION["user_id"], 
				 "auth_key"		=> $_SESSION["user_auth_key"], 
				 "name"		    => $_SESSION["user_name"],
				 "email"		=> $_SESSION["user_email"],
				 "group_count"	=> $_SESSION["group_count"]
				));
				
 $mysqli->close();   
}
/*
------------------------
 сохранить настройки
------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "SaveUserSettings" )
{
	
 $captcha = "";
 
 if (isset($_POST['name']))              	{ $user_name         = $mysqli->real_escape_string($_POST['name']);             if ($user_name 	     == '')  unset($user_name);  }
 if (isset($_POST['email']))    	 	 	{ $user_email        = $mysqli->real_escape_string($_POST['email']);            if ($user_email       == '')  unset($user_email); }
 if (isset($_POST['current_password']))  	{ $current_password  = $mysqli->real_escape_string($_POST['current_password']); if ($current_password == '')  unset($current_password); }
 if (isset($_POST['new_password']))  	 	{ $new_password      = $mysqli->real_escape_string($_POST['new_password']);     if ($new_password     == '')  unset($new_password); }
 
 if (isset($_POST["g-recaptcha-response"])) $captcha = $_POST["g-recaptcha-response"];
 
 $user_name    	   = stripslashes($user_name);
 $user_name    	   = htmlspecialchars($user_name);
 $user_email   	   = stripslashes($user_email);
 $user_email   	   = htmlspecialchars($user_email);
 $current_password = stripslashes($current_password);
 $current_password = htmlspecialchars($current_password);
 $new_password 	   = stripslashes($new_password);
 $new_password 	   = htmlspecialchars($new_password);

 /* --- удаляем лишние пробелы --- */
 $user_name        = trim($user_name);
 $user_email       = trim($user_email);
 $current_password = trim($current_password);
 $new_password     = trim($new_password);
 
 if (!password_verify($current_password, $_SESSION["user_password"]))
 {  
  echo json_encode(array("answer"=>"error","string"=>"неверный текущий пароль!"));  
  exit;
 }
 if (strlen($new_password) < 1)
 {  
  echo json_encode(array("answer"=>"error","string"=>"укажите новый пароль!"));  
  exit;
 }

 if (!$captcha)
 {
  echo json_encode(array("answer"=>"error","string"=>"Подтвердите себя!"));
  exit;
 }
 
 $result = $mysqli->query("UPDATE users SET name='".$user_name."', email='".$user_email."', password='".password_hash($new_password, PASSWORD_BCRYPT)."' WHERE id=".$_SESSION["user_id"] );
 if (!$result) error($mysqli->error);

 $_SESSION["user_id"]    	= $mysqli->insert_id;
 $_SESSION["user_name"]  	= $user_name;
 $_SESSION["user_email"] 	= $user_email;
 $_SESSION["user_password"] = password_hash($new_password, PASSWORD_BCRYPT);

 echo json_encode(array("answer"=>"success","new_password"=>$new_password));
 $mysqli->close();   
} 
?>