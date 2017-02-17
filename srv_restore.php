<?php

// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_restore.php
// описание:	модуль восстановления пароля
// --------------------------------------------------------------------------------

/*
-------------------------------------------
 Регистрация
-------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "RestorePassword" )
{

 if (isset($_GET['email'])) { $email = $mysqli->real_escape_string($_GET['email']); if (empty($email)) { unset($email); warning("email не указан"); } } 
 if (!filter_var($email, FILTER_VALIDATE_EMAIL)) error("неверный формат email!");
 
 $result = $mysqli->query( "SELECT name, password FROM users WHERE email='".mb_strtolower($email)."'" );
 if (!$result) error($mysqli->error);
 
 if($result->num_rows==0)
 {
	$mysqli->close();
    error("Почта не обнаружена!"); 
 }
 else
 {		
	
	$row = $result->fetch_assoc(); 
	$chars	   = "qazxswedcvfrtgbnhyujmkiolp1234567890QAZXSWEDCVFRTGBNHYUJMKIOLP";
	$max	   = 8; 
	$size	   = StrLen($chars)-1; 
	$password  = null;                                                
 
	while($max--) 
	{
	 $password.=$chars[rand(0,$size)]; 
	}
	
	$hash_password = password_hash($password, PASSWORD_BCRYPT);
    
	$mail = new Mail("no-reply@turbouchet.ru"); // Создаём экземпляр класса
	$mail->setFromName("ТурбоУчёт"); // Устанавливаем имя в обратном адресе

	if (!$mail->send($email, "Восстановление пароля к сервису ТурбоУчёт", "<center>Пользователь: ".$row["name"]."<p>Почта: ".$email."</p><p> Новый пароль: <b>".$password."</b></p></center>"))
	{
		$mysqli->close();
		error("невозможно отправить письмо");		     
	}	   
	else
	{    
		$result = $mysqli->query("UPDATE users SET password='".$hash_password."' WHERE email='".$email."'");
		if (!$result) error($mysqli->error);		
		success("проверьте почту"); 
		$mysqli->close();
	}
  }
}
?>