<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_values.php
// описание:	работа со значениями
// --------------------------------------------------------------------------------

/*
------------------------------------------
 Вставить значение
------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "InsertValue" )
{
 
 if (isset($_POST['persona_id'])) 	  { $persona_id   = $mysqli->real_escape_string($_POST['persona_id']);   if ($persona_id   == '') 	 unset($persona_id); } 
 if (isset($_POST['value']))      	  { $value        = $mysqli->real_escape_string($_POST['value']);        if ($value 	   == '') unset($value); }
 if (isset($_POST['current_date']))       { $current_date = $mysqli->real_escape_string($_POST['current_date']); if ($current_date == '')	 unset($current_date); } 
 
 $ymd = DateTime::createFromFormat('d/m/Y', $current_date)->format('Y-m-d');
 
 $result = $mysqli->query("INSERT INTO `values` (id, persona_id, value, note, date) VALUES ( NULL,'".$persona_id."','".$value."','','".$ymd."')");
 if (!$result) error($mysqli->error);
 
 success($mysqli->insert_id);
 $mysqli->close();   
}
/*
------------------------------------------
 Обновить значение
------------------------------------------*/
if ( isset($_POST['func']) && $_POST["func"] == "UpdateValue" )
{  
 
 if (isset($_POST['value']))     { $value    = $mysqli->real_escape_string($_POST['value']);     if ($value    == '') unset($value);    }
 if (isset($_POST['value_id']))  { $value_id = $mysqli->real_escape_string($_POST['value_id']);  if ($value_id == '') unset($value_id); }
 
 $result = $mysqli->query("UPDATE `values` SET value='".$value."' WHERE id=".$value_id);
 if (!$result) error($mysqli->error);
 success("значение обновлено!");
 $mysqli->close();   
}

/*
------------------------------------------
 Получить значение
------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetValue" )
{  

 if (isset($_GET['persona_id'])) { $persona_id = $mysqli->real_escape_string($_GET['persona_id']); if ($persona_id == '') unset($persona_id); } 
 if (isset($_GET['start_date'])) { $start_date = $mysqli->real_escape_string($_GET['start_date']); if ($start_date == '') unset($start_date); }
 if (isset($_GET['day_name']))   { $day_name   = $mysqli->real_escape_string($_GET['day_name']);   if ($day_name   == '') unset($day_name);   }
 
 switch($day_name)
 {
	 case "Понедельник": $min_day = "0 day";  $plus_day = "6 day"; break;
	 case "Вторник": 	 $min_day = "-1 day"; $plus_day = "5 day"; break;
	 case "Среда": 		 $min_day = "-2 day"; $plus_day = "4 day"; break;
	 case "Четверг": 	 $min_day = "-3 day"; $plus_day = "3 day"; break;
	 case "Пятница": 	 $min_day = "-4 day"; $plus_day = "2 day"; break;
	 case "Суббота": 	 $min_day = "-5 day"; $plus_day = "1 day"; break;
	 case "Воскресенье": $min_day = "-6 day"; $plus_day = "0 day"; break;
 }
 
 $date2 = clone $date1 = DateTime::createFromFormat('d/m/Y', $start_date); 
 
 $new_date1 = $date1->modify($min_day); 
 $new_date2 = $date2->modify($plus_day);
 
 $result = $mysqli->query( "SELECT * FROM `values` WHERE persona_id='".$persona_id."' AND date BETWEEN '".$new_date1->format("Y-m-d")."' AND '".$new_date2->format("Y-m-d")."'");
 if (!$result) error($mysqli->error);
 
 if ( $result->num_rows > 0 )
 {
	while($row = $result->fetch_assoc())
	{
		$myArray[] = $row;
	}
	success($myArray);
 }
 $mysqli->close();
}
?>