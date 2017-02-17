<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_profession.php
// описание:	работа с ролями или прфессиями
// --------------------------------------------------------------------------------

/*
--------------------------------------------
 получить ставки
--------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetProfessionList" )
{ 

 if (isset($_GET['group_id'])) { $group_id = $mysqli->real_escape_string($_GET['group_id']);  if ($group_id == '')  unset($group_id); }
 
 $result = $mysqli->query("SELECT * FROM `profession` WHERE user_id='".$_SESSION["user_id"]."' ORDER BY profession_name");
 if (!$result) error($mysqli->error);
 $myArray=array();
 while($row = $result->fetch_assoc()) 
 {
   $myArray[] = $row;
 }
 success($myArray);
 $mysqli->close();   
}
/*
---------------------------------------------
 сохранить профессию
---------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "SaveProfession" )
{
 if (isset($_POST['profession_name']))  { $profession_name = $mysqli->real_escape_string($_POST['profession_name']);  if ($profession_name == '') unset($profession_name);} 
 
 $result = $mysqli->query( "SELECT * FROM `profession` WHERE profession_name='".$profession_name."' AND user_id='".$_SESSION["user_id"]."'" );
 if (!$result) error($mysqli->error);
 if ( $result->num_rows > 0 )
 {
  warning("роль существует!");
  ClearAll($result,$mysqli);	
 }
 $result = $mysqli->query( "INSERT INTO `profession` VALUES ( NULL,'".$profession_name."','".$_SESSION["user_id"]."')" );
 if (!$result) error($mysqli->error);
 success($mysqli->insert_id);
 $mysqli->close();   
}
/*
--------------------------------------------
 удалить профессию
--------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "DeleteProfession" )
{

 if (isset($_POST['id']))  { $id = $mysqli->real_escape_string($_POST['id']); if ($id == '')  { error("id - не указан"); unset($id); }}
 
 $result = $mysqli->query( "DELETE FROM `profession` WHERE id = ".$id );
 if (!$result) error($mysqli->error);
 success("роль удалена!");
 $mysqli->close();   
}
?>