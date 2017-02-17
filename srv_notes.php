<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_notes.php
// описание:	работа с заметками
// --------------------------------------------------------------------------------
/*
----------------------------------
 Получить заметку
----------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetNote" )
{ 

 if (isset($_GET['value_id'])) { $value_id = $mysqli->real_escape_string($_GET['value_id']); if ($value_id == '') unset($value_id); } 

 $result = $mysqli->query( "SELECT note FROM `values` WHERE id='".$value_id."'" );
 if (!$result) error($mysqli->error);
 while($row = $result->fetch_assoc())
 {
  $myArray[] = $row;
 }
 success($myArray);
 $mysqli->close();   
}

/*
------------------------------------
 Сохранить заметку
------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "SaveNote" )
{

 if (isset($_POST['value_id']))   { $value_id   = $mysqli->real_escape_string($_POST['value_id']);   if ($value_id   == '')  unset($value_id); } 
 if (isset($_POST['note_input'])) { $note_input = $mysqli->real_escape_string($_POST['note_input']); if ($note_input == '') 	unset($note_input); }

 $result = $mysqli->query( "UPDATE `values` SET note='".$note_input."' WHERE id='".$value_id."'" );
 if (!$result) error($mysqli->error);
 success("заметка сохранена!");
 $mysqli->close();   
}
?>