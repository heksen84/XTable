<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_report.php
// описание:	модуль отчётности
// --------------------------------------------------------------------------------

/*
------------------------------------------
 Получить отчет за месяц
------------------------------------------*/
if ( isset($_GET['func']) && $_GET["func"] == "GetValuesFromMonth" )
{ 

 if (isset($_GET['group_id'])) { $group_id  = $mysqli->real_escape_string($_GET['group_id']);  if ($group_id == '')  unset($group_id); }
 if (isset($_GET['month']))    { $month     = $mysqli->real_escape_string($_GET['month']);     if ($month 	== '')  unset($month); 	  }
 if (isset($_GET['year']))     { $year   	= $mysqli->real_escape_string($_GET['year']);      if ($year     == '')  unset($year);  	  }  
 if (isset($_GET['start']))    { $start     = $mysqli->real_escape_string($_GET['start']);     if ($start    == '')  unset($start);    }
 if (isset($_GET['end']))      { $end       = $mysqli->real_escape_string($_GET['end']);       if ($end      == '')  unset($end);      }
  
 $result = $mysqli->query("SELECT * FROM `personal` WHERE user_id='".$_SESSION['user_id']."' AND group_id='".$group_id."' LIMIT ".$start.",".$end);
 if (!$result) error($mysqli->error);
 
 while($row = $result->fetch_assoc())
 {   
   $prof_result = $mysqli->query("SELECT profession_name FROM `profession` WHERE id='".$row['specialnost']."'");
   if (!$prof_result) error($mysqli->error);
   $prof_row = $prof_result->fetch_assoc();
   $row['specialnost'] = $prof_row['profession_name'];  
   $numbers=array();
   $summa=0;
   
   for ($i=1;$i<31;$i++)
   {	    
		$val_result = $mysqli->query("SELECT * FROM `values` WHERE persona_id='".$row["id"]."' AND date='".$year."-".$month."-".$i."'");
		if (!$val_result) error($mysqli->error);
		while($val_row = $val_result->fetch_assoc())
		{	    
		 if (empty($val_row["value"])) $numbers[]=0;
		 else
		 $numbers[]=(float)$val_row["value"];
		 $summa = $summa + (float)$val_row["value"];
		}
   }
   
   $arr["values"] = $numbers;
   $arr["summa"]  = $summa;
   
   $myArray[] = $row+$arr;      
 }
 
 success($myArray);
 $mysqli->close();
}
?>