// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------
var timeout = 30000;
var Month = new Array("Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь");
var days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
--------------------------------
	назначить активный день
--------------------------------
*/
function SetActiveDay(td) 
{
  $(td).addClass("active_day");
}
/*
-------------------------------
 обновить таблицу
-------------------------------
*/
function UpdateMainTable() 
{        
	var i = 1; 
	var num_strings = $("#main_table tr").length;
    $(".col_num").each(function() 
	{
        if (i != num_strings) $(this).html(i);
        i++;
    });
    switch (GetWeekDayFromMoment(moment(CurrentDate,"DD/MM/YYYY").day())) 
	{
        case "Понедельник":                            
			SetActiveDay(".pn");
            break;
        case "Вторник":
            SetActiveDay(".vt");
            break;
        case "Среда":							
            SetActiveDay(".sr");
            break;
        case "Четверг":						    
            SetActiveDay(".cht");
            break;
        case "Пятница":
            SetActiveDay(".pt");
            break;
        case "Суббота":
            SetActiveDay(".sb");
            break;
        case "Воскресенье":
            SetActiveDay(".vs");
            break;
    }        
    $(".col_number:not(.active_day)").addClass("archive");		
}

/*
----------------------------------
  конвертировать
----------------------------------
*/
function cyrill_to_latin(text)
{
    for(var i=0; i<arrru.length; i++)
	{
        var reg = new RegExp(arrru[i], "g");
        text = text.replace(reg, arren[i]);
    }
    return text;
}

Date.prototype.daysInMonth = function() 
{
 return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

/*
----------------------------------
 очистить строку
----------------------------------
*/
function cleanString(input) 
{
 var output = "";
 for ( var i = 0; i < input.length; i++ ) 
 {
   if (input.charCodeAt(i) <= 127) 
   {
     output += input.charAt(i);
   }
 }
  return output;
}
/*
----------------------------------
 таймаут запроса
----------------------------------
*/
function TimeOutError()
{
 NProgress.done();
 swal("таймаут операции","неполадки на сервере или отсутсвует подключение к интернету");
}
/*
-----------------------------
 сообщение о доступе
-----------------------------
*/
function UseCalendar()
{
  swal("ВНИМАНИЕ","Доступ к ячейке запрещён! Используйте календарь.","warning");					 
}
/*
-----------------------------
 восстановление капчи
-----------------------------
*/
function CaptchaRestore() 
{
 $("body").append($("#captcha"));		// переместить в тело документа
 $("#captcha").css("display", "none");   // и скрыть
}
/*
-----------------------------------------
 получить число пользователей в группе
-----------------------------------------
*/
function GetPersonalCount(group_id)
{
 var ret = 0;
 $.ajax
 ({
	url: "server.php",
    data:
	{
     "func": "GetPersonalCount",
     "group_id": group_id
    },
    async: false,
    success: function(data)
	{
     obj = jQuery.parseJSON(cleanString(data));
     if (obj.answer == "error") error(obj.string);
     if (obj.answer == "success") ret = obj.string;
    }
});
 return ret;
}

/*
----------------------------------
 установить фокус
----------------------------------
*/
function SetFocus(object)
{
 if (device.mobile() == false) $(object).focus();
}

/*
----------------------------------
получить день недели из moment lib
----------------------------------
*/
function GetWeekDayFromMoment(day) 
{ 
 return days[day];
}

/*
----------------------------------
  получить день недели
----------------------------------
*/
function GetWeekDay(date) 
{
 var new_date = new Date(date);
 var day  = new_date.getDay();
 return days[day];
}

/*
-----------------------------------------
 только числа
-----------------------------------------
*/
jQuery.fn.ForceNumericOnly = function()
{
 return this.each(function()
 {
  $(this).keydown(function(e)
  {            
    var key = e.charCode || e.keyCode || 0;
    return(key == 8  || key == 27 ||  key == 13 || key == 9  || key == 46 || (key >= 37 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
  })
 })
};

/*
----------------------------------
 проверка на число
----------------------------------
*/
function IsNumeric(input)
{
 return (input-0) == input && (''+input).trim().length > 0;
}

/*
----------------------------------
 проверка на email
----------------------------------
*/
function isEmail(email) 
{
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

/*
----------------------------------
 автонажатие
----------------------------------
*/
function AutoClick(element)
{
  var timeAlert;
  $( element ).mouseenter(function()
  {
    timeAlert = setTimeout(function()
    {
      $(element).trigger("click");
    }, 1200);  	
  });
  $( element ).mouseleave(function()
  {
    clearTimeout(timeAlert);	
  });
}

/*
----------------------------------
автофокус
----------------------------------
*/
function AutoFocus(element)
{
  var timeAlert;
  $( element ).mouseenter(function()
  {
    timeAlert = setTimeout(function()
    {
      $(element).trigger("focus");
    }, 1200);  	
  });
  $( element ).mouseleave(function()
  {
    clearTimeout(timeAlert);	
  });
}
/*
-------------------------------------------
 получить список ролей / профессий 
-------------------------------------------
*/
function GetProfessionList()
{
	$.ajax
	({
		url:  "server.php",
		data: { "func": "GetProfessionList", "group_id": GroupId },
		async:false,
		success: function( data )
		{	
			obj = jQuery.parseJSON( cleanString(data) );
			if (obj.answer == "error") error(obj.string);			
			if (obj.answer == "success") 
			{
				$("#persona_role_select").empty();
				$.each(obj.string, function(i, item) 
				{
					$("#persona_role_select").append("<option value='"+item.id+"' title='"+item.id+"'>"+item.profession_name+"</option>");
				});
			}
		}
	});             
}
/*
----------------------------------
 ДАННЫЕ ПЕРСОНЫ  
-----------------------------------
*/
function ShowPersonaInfoWindow(id)
{			
	
	$("#back_screen1").fadeIn(FadeInSpeed);
	$("#wrapper").append("<div id='persona_info_window'></div>");      
		
	$("#persona_info_window").empty();
	$("#persona_info_window").append("<div id='close_persona_info_window' class='close_window' title='закрыть окно'>X</div>");
	$("#persona_info_window").append("<h1 id='persona_info_title'><ins>информация</ins></h1>");			
	$("#persona_info_window").append("<div id='persona_data_register'>дата регистрации: <ins id='persona_data_register_value'></ins></div>");			
	$("#persona_info_window").append("<input type='text' placeholder='Ф.И.О.' id='persona_info_input' title='Ф.И.О. персоны' maxlength='30'></input>");            			 		

	/* закрытие окна */
	$("#close_persona_info_window").click( function()
	{
		$("#persona_info_window").fadeOut(FadeOutSpeed);
		$("#back_screen1").fadeOut(FadeOutSpeed);
		ActiveElement="PersonasScreen";
	});
	
	AutoClick("#close_persona_info_window");		
	$("#persona_info_window").append("<textarea id='persona_info_text' title='некоторая информация о персоне' placeholder='дополнительная информация'></textarea>");
	
	/* -------------------------------------------
	  1 - универсальный     (записи/группы)
	  2 - спортивная секция (ученики/группы)
	  3 - курсы 			(ученики/класс)
	  4 - школа 			(ученики/классы)
	  5 - университет 		(студенты/группы)
	  6 - соревнования		(участники/группы)
	  7 - кту		 		(работники/группы)
	  8 - экперимент		(объекты/группы)					   
	------------------------------------------*/
			   
	/* --- записи --- */
	if (journal == 1)
	{						
	 $("#persona_info_input").attr("placeholder","заголовок");
	 $("#persona_info_text").attr("placeholder","дополнительная информация");
	 $("#persona_info_window").append("<input type='text' placeholder='номер телефона' id='persona_number' title='номер телефона'></input>");	
	 $("#persona_info_window").append("<div><input type='text' placeholder='email' id='persona_email'></input></div>");		 
	}
	else	
	/* --- объекты --- */	
	if (journal == 8) 
	{						
	 $("#persona_info_input").attr("placeholder","имя объекта");
	 $("#persona_info_text").attr("placeholder","дополнительная информация");	
	}	
	else /* остальное */
	{
	 $("#persona_info_window").append("<input type='text' placeholder='номер телефона' id='persona_number' title='номер телефона'></input>");	
	 $("#persona_info_window").append("<div><input type='text' placeholder='email' id='persona_email'></input></div>");	
	}
			
	if (device.mobile())
	{
		var pos = $(window).scrollTop();
		$("#persona_info_window input[type='text'], textarea").focus(function(event) 
		{				
			$("#persona_info_window").css("position","relative");
		}).blur(function(event) 
		{				
			$("#persona_info_window").css("position","fixed");
			$( "body, html" ).scrollTop( pos );
		});
		
		/* hover auto-click */
		$("#close_persona_info_window").hover(function(event) 
		{
			$(this).click();
		});
	}

	GetProfessionList();

	$("input, textarea").keypress(function(event)
	{
		switch (event.keyCode) 
		{     
			case 13: $(this).blur(); break;					
		}
	});
	
	$.ajax
	({
		url:  "server.php",
		data: { func:"GetPersonaInfo", "persona_id": id },
		async:false,
		success: function( data )
		{			
			obj = jQuery.parseJSON( cleanString(data) );
			if (obj.answer == "warning") warning(obj.string);
			if (obj.answer == "error") 	 error(obj.string);
			if (obj.answer == "success")
			{																
				$("#persona_data_register_value").text(obj.string[0].data_reg+" г.");
				$("#persona_key").val(obj.string[0].key);
				$("#persona_info_input").val(obj.string[0].fio);
				$("#persona_role_select option[value='"+obj.string[0].specialnost+"']").attr("selected", "selected");								
				$("#persona_number").val(obj.string[0].number);
				$("#persona_email").val(obj.string[0].email);				
				$("#persona_info_text").text(obj.string[0].text);				
			}
		}
	});
	
	$("#persona_info_window").append("<div><button class='green_button' id='persona_save_info_button' title='сохранить информацию о персоне'>сохранить</button></div>");	
	$("#persona_info_window").fadeIn(FadeInSpeed);
	ActiveElement="PersonaInfoWindow";

	/*-------------------------------------------------
	  сохранение
	-------------------------------------------------*/		
	$("#persona_save_info_button").click( function()
	{
		if ( $("#persona_info_input").val() == "" )	warning("Ф.И.О. должны быть указаны!")				
		else
		if (!isEmail($("#persona_email").val()) && $("#persona_email").val() !="") warning("неккоректный email!")
		else						
		$.ajax
		({
			url:  "server.php",
			data: 
			{ 
				"func": "SavePersonaInfo", 
				"persona_id": id, 
				"persona_fio": $("#persona_info_input").val(), 
				"persona_prof": $("#persona_role_select").val(), 
				"persona_number": $("#persona_number").val(), 								
				"persona_email": $("#persona_email").val(), 								
				"persona_text": $("#persona_info_text").val(),				
			},
			method: "POST",
			success: function( data )
			{	               	   						
				obj = jQuery.parseJSON(cleanString(data));
				if (obj.answer == "error") error(obj.string);
				if (obj.answer == "success")
				{
					$("#main_table tr").eq(tr_index+1).children().eq("1").text($("#persona_info_input").val());
					$("#close_persona_info_window").trigger("click");							
				}
			}
		});
	});
}