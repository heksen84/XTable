<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_task.php
// описание:	модуль для работы с заданиями
// --------------------------------------------------------------------------------
/*
--------------------------------------
 сохранить задание
--------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "SaveTask" )
{	
 
 if (isset($_POST['text']))     { $text     = $mysqli->real_escape_string($_POST['text']);      if ($text  	  == '') unset($text);     }
 if (isset($_POST['group_id'])) { $group_id = $mysqli->real_escape_string($_POST['group_id']);  if ($group_id  == '') unset($group_id); }
 if (isset($_POST['task_id']))  { $task_id  = $mysqli->real_escape_string($_POST['task_id']);   if ($task_id   == '') unset($task_id);  }
 if (isset($_POST['cur_date'])) { $cur_date = $mysqli->real_escape_string($_POST['cur_date']);  if ($cur_date  == '') unset($cur_date); }
 
 $ymd = DateTime::createFromFormat("d/m/Y", $cur_date)->format("Y-m-d");
 
 $result = $mysqli->query("SELECT * FROM `tasks` WHERE group_id='".$group_id."' AND date='".$ymd."'");
 
 if (!$result) error($mysqli->error);
 
 $row = $result->fetch_assoc(); 
 
 if ($result->num_rows == 0)
 {
  $result = $mysqli->query( "INSERT INTO `tasks` VALUES ( NULL,'".$text."','".$ymd."','".$group_id."')");
  if (!$result) error($mysqli->error);
  success("задание сохранено");  
 }
 else
 {  
  $result = $mysqli->query( "UPDATE `tasks` SET text='".$text."' WHERE id='".$task_id."'" );
  if (!$result) error($mysqli->error);
  success("задание обновлено");
 } 
 $mysqli->close();   
}
/*
---------------------------------
получить задание
---------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetTask" )
{	
 
 if (isset($_GET['group_id'])) { $group_id = $mysqli->real_escape_string($_GET['group_id']);  if ($group_id  == '')  unset($group_id); }
 if (isset($_GET['date']))     { $date     = $mysqli->real_escape_string($_GET['date']);      if ($date 	 == '')  unset($date);     }
 
 $ymd = DateTime::createFromFormat("d/m/Y", $date)->format("Y-m-d");

 $result = $mysqli->query("SELECT * FROM `tasks` WHERE group_id='".$group_id."' AND date='".$ymd."'");
 
 if (!$result) error($mysqli->error);
 
 if ($result->num_rows == 0) warning("нет задачи");
 else
 {  
   $row = $result->fetch_assoc();
   $myArray[] = $row;
   success($myArray);
 }
 $mysqli->close();   
}
/*
---------------------------------
получить предыдущее задание
---------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetLastTask" )
{  

 if (isset($_GET['group_id'])) { $group_id = $mysqli->real_escape_string($_GET['group_id']);  if ($group_id  == '')  unset($group_id); }
 if (isset($_GET['date']))     { $date     = $mysqli->real_escape_string($_GET['date']);      if ($date 		== '') 	unset($date);     } 

 /* выбрать все даты от начала до текущего дня и искать пред. уже там */
 
  $ymd = DateTime::createFromFormat("d/m/Y", $date);
  $new_date = $ymd->modify($i." -1 day");
  $result = $mysqli->query("SELECT * FROM `tasks` WHERE group_id='".$group_id."' AND date='".$new_date->format("Y-m-d")."'");
  if (!$result) error($mysqli->error);
  $row = $result->fetch_assoc();
  if (!empty($row["text"]))
  {	
	 $myArray[] = $row;
	 success($myArray);		
  }  
  $mysqli->close();   
}
/*
-------------------------------------------
  удалить задание
-------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "DeleteTask" )
{	

 if (isset($_POST['task_id'])) { $task_id = $mysqli->real_escape_string($_POST['task_id']);  if ($task_id == '') unset($task_id); }
 
 $result = $mysqli->query( "DELETE FROM `tasks` WHERE id = ".$task_id );
 if (!$result) error($mysqli->error);
 success("задание удалено!");
 $mysqli->close();   
}
?>