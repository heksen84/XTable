// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------

/*
-------------------------------------------
установить значение переменной на сервере
-------------------------------------------
*/
function SRV_SetVar(variable,value)
{		
	$.ajax
	({
        url: "server.php",
        data: { "func": "SRV_SetVar", "variable": variable, "value": value },
		method: "POST",
		async:false,
        success: function(data) 
		{							
			obj = jQuery.parseJSON(cleanString(data));
            if (obj.answer == "error") error(obj.string);
			if (obj.answer == "warning") console.log(obj.string);
            if (obj.answer == "success") {}
		}
	});	
}

/*
-------------------------------------------
получить значение переменной на сервере
-------------------------------------------
*/
function SRV_GetVar(variable)
{
	var ret=null;
	$.ajax
	({
        url: "server.php",
        data: { "func": "SRV_GetVar", "variable": variable },
		async:false,
        success: function(data) 
		{				
			obj = jQuery.parseJSON(cleanString(data));
            if (obj.answer == "error") error(obj.string);
            if (obj.answer == "warning") 
			{
				console.warn(obj.string);
			}
			if (obj.answer == "success") 
			{
				ret = obj.string.value;
			}
		}
	});
	return ret;	
}

/*
-------------------------------------------
 отобразить все переменные пользователя
-------------------------------------------
*/
function SRV_ShowVars()
{		
	$.ajax
	({
        url: "server.php",
        data: { "func": "SRV_ShowVars" },		
        success: function(data) 
		{							
			obj = jQuery.parseJSON(cleanString(data));
            if (obj.answer == "error") error(obj.string);
			if (obj.answer == "warning") console.log(obj.string);
            if (obj.answer == "success") 
			{
				console.clear();
				console.log("------------------------[ переменные "+UserName+"]------------------------");
				$.each(obj.string, function(i, item) 
				{
					console.log(item.variable+" = "+item.value);
                });
			}
		}
	});	
}

/*
-------------------------------------------
 удалить все переменный пользователя
-------------------------------------------
*/
function SRV_DeleteVars()
{		
	$.ajax
	({
        url: "server.php",
        data: { "func": "SRV_DeleteVars" },
		async:false,		
        success: function(data) 
		{							
			obj = jQuery.parseJSON(cleanString(data));
            if (obj.answer == "error") error(obj.string);
			if (obj.answer == "warning") console.log(obj.string);
            if (obj.answer == "success") {console.log(obj.string);}
		}
	});	
}