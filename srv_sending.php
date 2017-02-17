<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_sending.php
// описание:	модуль рассылки
// --------------------------------------------------------------------------------
include("class.mail.php");

/*require "WhatsApp/whatsapp.class.php";
$wa = new WhatsApp("91XXXXXXXXXX", "XXX-XXX", "Nick Name");
$wa->Connect();
$t = $wa->Login();
$wa->Message("5","91XXXXXXXXXX","Good code");
error("!");*/

function InsertSendingText($mysql, $text)
{
 $result = $mysql->query("INSERT INTO `mailing` VALUES (NULL,'".$text."','".$_SESSION["user_id"]."')");
 if (!$result) error($mysql->error); 
}
/*
----------------------------------------------------------------
 рассылка сообщений
---------------------------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "SendMessage" )
{
 
 if (isset($_GET['group_id'])) { $group_id = $mysqli->real_escape_string($_GET['group_id']); if ($group_id == '') unset($group_id); }
 if (isset($_GET['message']))  { $message  = $mysqli->real_escape_string($_GET['message']);  if ($message  == '') unset($message); }
    
 if($group_id == "for_all") /* рассылка всем */
 {		
	$result = $mysqli->query("SELECT email FROM `personal` WHERE user_id='".$_SESSION["user_id"]."' AND email!=''");
	if (!$result) error($mysqli->error);
	if($result->num_rows==0)
	{
		warning("Ни одно поле email не заполнено!");
		$mysqli->close();
		exit;
	}
	
	$result = $mysqli->query("SELECT DISTINCT email FROM `personal` WHERE user_id='".$_SESSION["user_id"]."'");
	if (!$result) error($mysqli->error);

	$mail = new Mail("no-reply@turbouchet.ru");
	$mail->setFromName("ТурбоУчёт");

	InsertSendingText($mysqli,$message);
	
	while($row = $result->fetch_assoc())
	{
	  if (!empty($row["email"]))
	  {
		if (!$mail->send($row["email"], "Сообщение от ".$_SESSION["user_name"]." (https://www.turbouchet.ru)", $message))
		{
	        $mysqli->close();
	        error("невозможно отправить письмо");		     
		}		
	  }
	}		
 }
 else
 {	
	$result = $mysqli->query("SELECT group_id, email FROM `personal` WHERE group_id IN (".$group_id.") AND user_id='".$_SESSION["user_id"]."' AND email!=''");
	if (!$result) error($mysqli->error);
	if($result->num_rows == 0)
	{
		warning("Ни одно поле email в группе не заполнено!");
		$mysqli->close();
		exit();
	}
	
	/* рассылка всем персонам (записям) в указанной группе */
	$result = $mysqli->query("SELECT DISTINCT email FROM `personal` WHERE group_id IN (".$group_id.") AND user_id='".$_SESSION["user_id"]."'");
	if (!$result) error($mysqli->error);	

	$mail = new Mail("no-reply@turbouchet.ru");
	$mail->setFromName("ТурбоУчёт");
	
	InsertSendingText($mysqli,$message);
	
	while($row = $result->fetch_assoc())
	{	  	 
	  if (!empty($row["email"]))
	  {
		if (!$mail->send($row["email"], "Сообщение от ".$_SESSION["user_name"]." (https://www.turbouchet.ru)", $message))
		{
	        $mysqli->close();
	        error("невозможно отправить письмо");		     
		}		
	  }
	}	
 }
 
 success("Рассылка всем - завершена!");
 $mysqli->close(); 
}
?>