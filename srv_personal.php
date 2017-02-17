<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_personal.php
// описание:	работа с записями
// --------------------------------------------------------------------------------
/*
------------------------------------------
 получить заголовок таблицы
------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetNameTitle" )
{  
  $result = $mysqli->query("SELECT name_title FROM `users` WHERE id='".$_SESSION["user_id"]."'");
  if (!$result) error($mysqli->error);
  $row = $result->fetch_assoc();
  success($row["name_title"]);
  $mysqli->close();   
}
/*
------------------------------------------
 установить заголовок таблицы
------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "SetNameTitle" )
{	

 if (isset($_POST['name_title']))  { $name_title = $mysqli->real_escape_string($_POST['name_title']); if ($name_title == '') unset($name_title); }
 
 $result = $mysqli->query("UPDATE `users` SET name_title='".$name_title."' WHERE id='".$_SESSION["user_id"]."'");
 if (!$result) error($mysqli->error);
 success("заголовок изменен");
 $mysqli->close();   
}

/*
-------------------------------------------
 Добавить новую персону
-------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "AddNewPerson" )
{

 if (isset($_POST['fio'])) 		{ $fio 		= $mysqli->real_escape_string($_POST['fio']); 		if ($fio 	   == '')  unset($fio); }
 if (isset($_POST['group_id'])) { $group_id = $mysqli->real_escape_string($_POST['group_id']);  if ($group_id  == '')  unset($group_id); }
 
 $key = "";
 $result = $mysqli->query("INSERT INTO `personal` VALUES ( NULL,'".$fio."',0,'','','',NOW(),'".$_SESSION["user_id"]."','".$group_id."',TRUE,'".$key."')");
 if (!$result) error($mysqli->error);
 success($mysqli->insert_id);
 $mysqli->close();   
}
/*
------------------------------------------
 Получить кол-во персон в группе
------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetPersonalCount" )
{

 if (isset($_GET['group_id'])) { $group_id = $mysqli->real_escape_string($_GET['group_id']); if ($group_id == '') unset($group_id); }
 
 $result = $mysqli->query( "SELECT * FROM `personal` WHERE group_id='".$group_id."'" );
 if (!$result) error($mysqli->error);
 success($result->num_rows);
 $mysqli->close();   
}
/*
-------------------------------------
 Обновить
-------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "UpdateFio" )
{ 

 if (isset($_POST['fio'])) 	 	 { $fio        = $mysqli->real_escape_string($_POST['fio']);       if ($fio 	   == '') unset($fio); 		}
 if (isset($_POST['person_id'])) { $person_id  = $mysqli->real_escape_string($_POST['person_id']); if ($person_id  == '') unset($person_id); }
 
 $result = $mysqli->query("UPDATE `personal` SET fio='".$fio."' WHERE id='".$person_id."'");
 if (!$result) error($mysqli->error);
 success("изменения в таблицу внесены");
 $mysqli->close();   
}
/*
---------------------------------------
 Список персонала
---------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetPersonal" )
{

 if (isset($_GET['group_id'])) { $group_id  = $mysqli->real_escape_string($_GET['group_id']);  if ($group_id == '')  unset($group_id); }
 if (isset($_GET['start']))    { $start     = $mysqli->real_escape_string($_GET['start']);     if ($start    == '')  unset($start);    }
 if (isset($_GET['end']))      { $end       = $mysqli->real_escape_string($_GET['end']);       if ($end      == '')  unset($end);      }
 
 $result = $mysqli->query("SELECT * FROM `personal` WHERE user_id='".$_SESSION['user_id']."' AND group_id='".$group_id."' LIMIT ".$start.",".$end);
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
 Получить информацию о персоне
--------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetPersonaInfo" )
{ 

 if (isset($_GET['persona_id'])) { $persona_id = $mysqli->real_escape_string($_GET['persona_id']); if ($persona_id == '') unset($persona_id); }
 
 $result = $mysqli->query( "SELECT * FROM `personal` WHERE user_id='".$_SESSION['user_id']."' AND id='".$persona_id."'" );
 if (!$result) error($mysqli->error);
 while($row = $result->fetch_assoc())
 {
  $new_date = new DateTime($row['data_reg']);
  $row['data_reg'] = $new_date->format('d/m/Y');
  $myArray[] = $row;
 }
 success($myArray);
 $mysqli->close();   
}
/*
----------------------------------------
 Сохранить информацию о персоне
----------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "SavePersonaInfo" )
{ 
 
 if (isset($_POST['persona_id']))      { $persona_id      = $mysqli->real_escape_string($_POST['persona_id']);      if ($persona_id      == '')  unset($persona_id);      }
 if (isset($_POST['persona_fio']))     { $persona_fio     = $mysqli->real_escape_string($_POST['persona_fio']);     if ($persona_fio     == '')  unset($persona_fio);     }
// if (isset($_POST['persona_prof']))    { $persona_prof    = $mysqli->real_escape_string($_POST['persona_prof']);    if ($persona_prof    == '')  unset($persona_prof);    }
 if (isset($_POST['persona_number']))  { $persona_number  = $mysqli->real_escape_string($_POST['persona_number']);  if ($persona_number  == '')  unset($persona_number);  }
 if (isset($_POST['persona_text']))    { $persona_text    = $mysqli->real_escape_string($_POST['persona_text']);    if ($persona_text    == '')  unset($persona_text);    }
 if (isset($_POST['persona_email']))   { $persona_email   = $mysqli->real_escape_string($_POST['persona_email']);   if ($persona_email   == '')  unset($persona_email);   } 
 
 if (!filter_var($persona_email, FILTER_VALIDATE_EMAIL) && !empty($persona_email)) error("неверный формат email!"); 

 $persona_prof=0;
 
 $result = $mysqli->query("UPDATE `personal` SET fio='".$persona_fio."',specialnost='".$persona_prof."', number='".$persona_number."',email='".mb_strtolower($persona_email)."',text='".$persona_text."' WHERE id=".$persona_id);
 if (!$result) error($mysqli->error); 
 success("данные сохранены!");
 $mysqli->close();   
}
/*
------------------------------------------
 Удалить работника
------------------------------------------*/
if (isset($_POST['func']) && $_POST["func"] == "DeletePerson")
{ 

 if (isset($_POST['person_id'])) { $person_id = $mysqli->real_escape_string($_POST['person_id']); if ($person_id == '') unset($person_id); }
 
 $result = $mysqli->query("DELETE FROM `values` WHERE persona_id=".$person_id);
 if (!$result) error($mysqli->error); 
 $result = $mysqli->query("DELETE FROM `personal` WHERE id=".$person_id);
 if (!$result) error($mysqli->error);
 success("персона удалена");
 $mysqli->close();   
}
?>