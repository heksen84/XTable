<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_group.php
// описание:	работа с группами
// --------------------------------------------------------------------------------

/*
------------------------------------------
 список групп
------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetGroupFromYear" )
{ 
 if (isset($_GET['year'])) { $year = $mysqli->real_escape_string($_GET['year']);  if ($year == '')  unset($year); }
 
 $result = $mysqli->query( "SELECT * FROM `groups` WHERE user_id='".$_SESSION['user_id']."'" );
 if (!$result) error($mysqli->error); 
 while($row = $result->fetch_assoc())
 {
   $new_date = new DateTime($row["date_reg"]);
   $row["date_reg"] = $new_date->format("Y");
   $years[] = $row;   
 }
 $has = array(); $output = array();
 foreach ( $years as $data )
 {
    if ( !in_array($data["date_reg"], $has) )
    {
        $has[] = $data["date_reg"];
        $output[] = $data;
    }
 }
 success($output);
 $mysqli->close();   
}
/*
------------------------------------------
 список групп
------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetYears" )
{ 

 $result = $mysqli->query( "SELECT date_reg FROM `groups` WHERE user_id='".$_SESSION['user_id']."'" );

 if (!$result) error($mysqli->error); 
 while($row = $result->fetch_assoc())
 {
   $new_date = new DateTime($row["date_reg"]);
   $row["date_reg"] = $new_date->format("Y");
   $years[] = $row;   
 }
 $has = array(); $output = array();
 foreach ( $years as $data )
 {
    if ( !in_array($data["date_reg"], $has) )
    {
        $has[] = $data["date_reg"];
        $output[] = $data;
    }
 }
 success($output);
 $mysqli->close(); 
}
/*
------------------------------------------
 список групп
------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetGroupList" )
{
 $result = $mysqli->query("SELECT * FROM `groups` WHERE user_id='".$_SESSION['user_id']."'");
 if (!$result) error($mysqli->error);
 if ($result->num_rows > 0)
 {  
   while($row = $result->fetch_assoc())
   {
     $new_date = new DateTime($row["date_reg"]);
     $row["date_reg"] = $new_date->format("d/m/Y");
     $myArray[] = $row;
   }
   success($myArray);
 }
 else echo json_decode(array("answer"=>"empty"));
 $mysqli->close();   
}
/*
------------------------------------------
получить инфу
------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetGroupInfo" )
{
 if (isset($_GET['group_id'])) { $group_id = $mysqli->real_escape_string($_GET['group_id']); if ($group_id == '') unset($group_id); }
 
 $result = $mysqli->query( "SELECT * FROM `groups` WHERE id='".$group_id."'" );
 if (!$result) error($mysqli->error);  
 $row = $result->fetch_assoc();   
 $new_date = new DateTime($row["date_reg"]);
 $row['date_reg'] = $new_date->format("d/m/Y");
 $myArray[] = $row;   
 success($myArray);
 $mysqli->close();   
}
/*
------------------------------------------
сохранить инфу
------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "SaveGroupInfo" )
{
 if (isset($_POST['group_id']))   { $group_id   = $mysqli->real_escape_string($_POST['group_id']);   if ($group_id   == '') unset($group_id);   }
 if (isset($_POST['group_name'])) { $group_name = $mysqli->real_escape_string($_POST['group_name']); if ($group_name == '') unset($group_name); }
 if (isset($_POST['group_unit'])) { $group_unit = $mysqli->real_escape_string($_POST['group_unit']); if ($group_unit == '') unset($group_unit); }
 
 $result = $mysqli->query( "UPDATE groups SET name='".$group_name."', unit='".$group_unit."' WHERE id='".$group_id."'" );
 if (!$result) error($mysqli->error);
 
 success("изменения внесены");
 $mysqli->close();   
}
/*
------------------------------------------
 добавить группу
------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "AddGroup" )
{
 if (isset($_POST['group_name'])) { $group_name = $mysqli->real_escape_string($_POST['group_name']);  if ($group_name == '')  unset($group_name); }
 if (isset($_POST['group_unit'])) { $group_unit = $mysqli->real_escape_string($_POST['group_unit']);  if ($group_unit == '')  unset($group_unit); }
 
 $result = $mysqli->query("INSERT INTO `groups` VALUES ( NULL,'".$group_name."','".$group_unit."','".$_SESSION["user_id"]."',NOW())");
 if (!$result) error($mysqli->error);
 
 success($mysqli->insert_id);
 $mysqli->close();
}
/*
------------------------------------------
 удаление группы
------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "DeleteGroup" )
{

 if (isset($_POST['GroupId'])) { $group_id = $mysqli->real_escape_string($_POST['GroupId']); if ($group_id == '') unset($group_id); }
 
 $result = $mysqli->query("DELETE FROM `values` WHERE persona_id IN (SELECT id AS persona_id FROM `personal` WHERE group_id='".$group_id."')");
 if (!$result) error($mysqli->error);
 $result = $mysqli->query("DELETE FROM `groups` WHERE id=".$group_id);
 if (!$result) error($mysqli->error);
 $result = $mysqli->query("DELETE FROM `personal` WHERE group_id=".$group_id);
 if (!$result) error($mysqli->error);
 success("группа удалена");
 $mysqli->close();   
}
/*
------------------------------------------
 очистка группы
------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "CleanGroup" )
{

 if (isset($_POST['group_id'])) { $group_id = $mysqli->real_escape_string($_POST['group_id']);  if ($group_id == '') unset($group_id); }
 
 $result = $mysqli->query("DELETE FROM `values` WHERE persona_id IN (SELECT id AS persona_id FROM `personal` WHERE group_id='".$group_id."')");
 if (!$result) error($mysqli->error);  
 $result = $mysqli->query("DELETE FROM personal WHERE group_id=".$group_id);
 if (!$result) error($mysqli->error);
 
 success("группа очищена");
 $mysqli->close();
}
/*
------------------------------------------
 изменить группу
------------------------------------------*/
if (isset($_POST['func']) && $_POST["func"] == "ChangeGroup")
{

 if (isset($_POST['group_id'])) { $group_id = $mysqli->real_escape_string($_POST['group_id']);  if ($group_id == '')  unset($group_id); }
 if (isset($_POST['new_val']))  { $new_val  = $mysqli->real_escape_string($_POST['new_val']);   if ($new_val == '')   unset($new_val); }
 $result = $mysqli->query( "UPDATE groups SET name='".$new_val."' WHERE id='".$group_id."'" );
 if (!$result) error($mysqli->error);
 success("группа изменена");
 $mysqli->close();
}
/*
------------------------------------------
 получить заголовок групп
------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetGroupTitle" )
{  
  $result = $mysqli->query("SELECT group_title FROM `users` WHERE id='".$_SESSION["user_id"]."'");
  if (!$result) error($mysqli->error);
  $row = $result->fetch_assoc();
  success($row["group_title"]);
  $mysqli->close();   
}
/*
------------------------------------------
 установить заголовок групп
------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "SetGroupTitle" )
{
 if (isset($_POST['group_title']))  { $group_title = $mysqli->real_escape_string($_POST['group_title']); if ($group_title == '') unset($group_title); }
 $result = $mysqli->query( "UPDATE `users` SET group_title='".$group_title."' WHERE id='".$_SESSION["user_id"]."'" );
 if (!$result) error($mysqli->error);
 success("группа изменена");
 $mysqli->close();   
}
?>