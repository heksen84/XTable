// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------
function warning(string)
{
 swal( "ВНИМАНИЕ", string, "warning" );
}
function success(string)
{
 swal( string, "", "success" );
}
function error(string)
{
 swal( "ОШИБКА", string, "error" );
}