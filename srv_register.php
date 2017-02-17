<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_register.php
// описание:	модуль регистрации
// --------------------------------------------------------------------------------
include_once("class.mail.php");

/*
-------------------------------------
  Регистрация
-------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "RegUser" )
{	 

 //session_unset();

 if (isset($_POST['name']))     { $name     = trim($mysqli->real_escape_string($_POST['name']));     if ($name     == '')  unset($name);     }
 if (isset($_POST['email']))    { $email    = trim($mysqli->real_escape_string($_POST['email']));    if ($email    == '')  unset($email);    }
 if (isset($_POST['password'])) { $password = trim($mysqli->real_escape_string($_POST['password'])); if ($password == '')  unset($password); } 
 if (isset($_POST['journal']))  { $journal  = trim($mysqli->real_escape_string($_POST['journal']));  if ($journal  == '')  unset($journal);  }
 if (isset($_POST["g-recaptcha-response"])) $captcha = $_POST["g-recaptcha-response"]; 
  
 if (strlen($name) < 1) 
 {
  echo json_encode(array('answer' => 'warning', 'string' => "укажите имя"));
  exit();
 } 
 
 if (strlen($email) < 1) 
 {
  echo json_encode(array('answer' => 'warning', 'string' => "укажите почту"));
  exit();
 }
 
 $result = $mysqli->query("SELECT * FROM `users` WHERE email='".$email."'");

 if (!$result) error($mysqli->error); 
 
 if ($result->num_rows > 0)
 {
  echo json_encode(array('answer' => 'email_is_occupied'));
  $mysqli->close(); 
  exit();
 }
 
 if (!filter_var($email, FILTER_VALIDATE_EMAIL)) 
 {
  echo json_encode(array('answer' => 'warning', 'string' => "неверный формат email"));
  $mysqli->close(); 
  exit();
 }
 
 if (strlen($password) < 6) 
 {
  echo json_encode(array('answer' => 'warning', 'string' => "укажите пароль (минимум 6 знаков)"));
  $mysqli->close(); 
  exit();
 }

 if (!$captcha)
 {
  echo json_encode(array('answer' => 'warning', 'string' => "Подтвердите себя!"));
  $mysqli->close(); 
  exit;
 }
  
 /*
 ---------------------------------------------
  1 - универсальный     (записи/группы)
  2 - спортивная секция (ученики/группы)
  3 - курсы 		    (ученики/класс)
  4 - школа 		    (ученики/классы)
  5 - университет 	    (студенты/группы)
  6 - соревнования	    (участники/группы)
  7 - кту		 	    (работники/группы)
  8 - экперимент	    (объекты/группы)					   
 ---------------------------------------------
 */
   
 switch($journal)
 {
	
 	 /*
	 -----------------------
	 универсальный 
	 -----------------------*/
	 case 1:
	 {
		$name_title  	 =  "записи";
		$group_title 	 =  "группы";
		$but_group_title =  "группа";		
		$but_rec_title 	 =  "запись";		
		break;
	 }	
	 /*
	 -----------------------
	 спортивная секция
	 -----------------------*/
	 case 2:
	 {
		$name_title  	 =  "ученики";
		$group_title 	 =  "группы";
		$but_group_title =  "группа";		
		$but_rec_title 	 =  "ученик";		
		break;
	 }
	 /*	 
	 -----------------------
	 курсы
	 -----------------------*/
	 case 3:
	 {
		$name_title  	 =  "ученики";
		$group_title 	 =  "классы";
		$but_group_title =  "класс";		
		$but_rec_title 	 =  "ученик";		
		break;
	 }
	 /*
	 -----------------------
	 школа
	 -----------------------*/
	 case 4:
	 {
		$name_title  	 =  "ученики";
		$group_title 	 =  "классы";
		$but_group_title =  "класс";		
		$but_rec_title 	 =  "ученик";		
		break;
	 }
	 /*
	 -----------------------
	 университет
	 -----------------------*/
	 case 5:
	 {
		$name_title  	 =  "студенты";
		$group_title 	 =  "группы";
		$but_group_title =  "группа";		
		$but_rec_title 	 =  "студент";		
		break;
	 }
	 /*
	 -----------------------
	 соревнования
	 -----------------------*/
	 case 6:
	 {
		$name_title  	 =  "ученики";
		$group_title 	 =  "классы";
		$but_group_title =  "класс";		
		$but_rec_title 	 =  "ученик";		
		break;
	 }
	 /*
	 -----------------------
	 кту
	 -----------------------*/
	 case 7:
	 {
		$name_title  	 =  "работники";
		$group_title 	 =  "группы";
		$but_group_title =  "группа";		
		$but_rec_title 	 =  "работник";		
		break;
	 }
	 /*
	 -----------------------
	 эксперимент
	 -----------------------*/
	 case 8:
	 {
		$name_title  	 =  "объекты";
		$group_title 	 =  "группы";
		$but_group_title =  "группа";		
		$but_rec_title 	 =  "объект";		
		break;
	 }
 }
 	
	$auth_key 	= ""; // uniqid();
	$delete_key = "";
	
	$hash_password = password_hash($password, PASSWORD_BCRYPT);
	
	$result = $mysqli->query("INSERT INTO `users` VALUES ( NULL,'".$name."','".mb_strtolower($email)."','".$hash_password."',NOW(),NOW(),'".$_SERVER["REMOTE_ADDR"]."',0,'".$auth_key."','".$delete_key."','".$group_title."','".$name_title."','".$but_group_title."','".$but_rec_title."',".$journal.")");
 	if (!$result) error($mysqli->error);
 
 	$_SESSION["user_id"] 	   = $mysqli->insert_id;
 	$_SESSION["user_name"]     = $name;
 	$_SESSION["user_email"]    = $email; 
 	$_SESSION["user_password"] = $hash_password;
 	$_SESSION["user_auth"]     = "true";

	/* внести нулевую оплату - триальный режим работы - ok */	
	$now_date = new DateTime();
	$trial_date = $now_date->modify("15 day");				
	$result = $mysqli->query("INSERT INTO `oplata` (id, user_id, start_period, end_period, months, summa) VALUES ( NULL,".$_SESSION["user_id"].",NOW(),'".$trial_date->format("Y-m-d")."',0,0 )");
 	if (!$result) error($mysqli->error);
	
	$mail = new Mail("no-reply@turbouchet.ru");
	$mail->setFromName("ТурбоУчёт");
	$mail->send($email, "Данные регистрации в сервисе ТурбоУчёт", "<center><h1>Добро пожаловать в ТурбоУчёт!</h1><h2>Ваши данные регистрации:</h2><p>Имя пользователя: ".$name."</p><p>Email: ".$email."</p><p>Пароль: ".$password)."</p></center>";

    success($_SESSION["user_name"]);
    $mysqli->close();   
}
/*
----------------------------------------
 Удаление пользователя
----------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "DeleteUser" )
{
 
 /*
 -----------------------------------
  1) удалить все значения  
  2) удалить все персоны
  3) удалить все группы
  4) удалить пользователя
 -----------------------------------
 */
 
 $result = $mysqli->query("SELECT id FROM `groups` WHERE user_id='".$_SESSION["user_id"]."'");
 if (!$result) error($mysqli->error);
 
 while ($row_groups = $result->fetch_assoc()) 
 {
	$result = $mysqli->query("SELECT id,foto FROM `personal` WHERE group_id='".$row_groups['id']."'");
	if (!$result) error($mysqli->error);
	while ($row_personal = $result->fetch_assoc()) 
	{
		$result = $mysqli->query("SELECT id FROM `values` WHERE persona_id='".$row_personal['id']."'");
		if (!$result) error($mysqli->error);
	}	
 }
 
 success("учетная запись удалена!"); 
 $mysqli->close();   
}
?>