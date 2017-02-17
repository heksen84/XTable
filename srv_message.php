<?php
// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// имя файла:	srv_message.php
// описание:	функции статуса возврата 
// --------------------------------------------------------------------------------
function success( $string )
{
 $arr = array('answer' => 'success', 'string' => $string);
 echo json_encode($arr); 
}
function error( $string )
{
 $arr = array('answer' => 'error', 'string' => $string); 
 echo json_encode($arr);
 exit();
}
function warning( $string )
{
 $arr = array('answer' => 'warning', 'string' => $string);
 echo json_encode($arr);
 exit();
}
?>