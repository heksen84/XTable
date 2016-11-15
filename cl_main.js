// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------
var date;						// javascript date object
var obj;						// глобальный объект данных ajax
var UserName;					// имя пользователя
var ActiveElement;				// активный элемент на экране
var PersonalCount;				// число персон
var StartList;					// указатель на первые данные в таблице
var LastNumberValue;			// последнее значение в ячейке
var TaskId;						// id задания
var GroupId;					// id группы
var PersonaId;					// id персоны
var LastGroupId;				// последнее id группы (только одно нажатие на группу в меню)
var CurrentDate;				// текущая дата в формате день/месяц/год
var cur_val;					// текущее значение
var cur_selected_group_index;	// текущий индекс группы
var cur_selected_group_name;	// текущее название группы
var cur_value_data_id;			// текущее id значения	
var cur_persona_name;			// текущее имя персоны
var cur_group;					// текущая группа
var tr_index 	  	 = null;	// индекс строки таблицы
var GroupTitle	  	 = null;	// заголовок перечня групп
var NameTitle	  	 = null;	// заголовок имён в таблице
var but_rec_title  	 = null;	// заголовок кнопки - добавить запись
var but_group_title	 = null;	// заголовок кнопки - добавить группу
var new_group_title  = null;	// заголовок новой группы
var new_record_title = null;    // заголовок новой записи
var AccountEntity 	 = null;	// объект учёта
var AuthKey		  	 = null;	// ключ авторизации в API
var journal			 = null;	// текущий журнал
var Archive 	  	 = false;	// режим работы обычный(false) / архивный(true)
var end_period		 = false;
var last_record   	 = 0;		// текущая запись
var FadeInSpeed   	 = 350;		// скорость появления
var FadeOutSpeed  	 = 350;		// скорость исчезновения
var MAX_GROUPS		 = 200;		// максимальное число групп
var MAX_RECORDS   	 = 200;		// максимальное число строк
var vk_id			 = 0;
 
/*
------------------------------------------
  основной обработчик таблицы		 
------------------------------------------
*/
function SetPersonalTableHandlers() 
{													
	
	/* срок лицензии закончен */		
	if (end_period==true) return;		
	
	/* --- мобильные обработчики --- */
	if (device.mobile())
    {		   		   
	   SetMobileListeners();
	   return;
    }
	
	/* --- обработчики таблицы для desktop --- */
	$("#main_table tbody td").off().on("click", function()
	{			  		
	  
	  var fio 		 = "";
	  var val 		 = "";		
	  var insert_day = "";		
	  var text 		 = "";
	  var write 	 = false;
	  var id 		 = $(this).attr("data-id");
	  
	  PersonaId = $(this).parent().data("id");
	  tr_index  = $(this).parent().index();
	  cur_persona_name = $(this).parent().find("td:eq(1)").text();
	  text=$(this).text();
	  
	  /* ---------------------------------
	     проверка на фамилию
	     ---------------------------------- */
	  if ($(this).hasClass("col_fio")) 			
	  {                          		  						
		
		$(this).html("<input type='text' title='Введите Ф.И.О. персоны.' class='input_wrapper' maxlength='30'/>");			
		$(".input_wrapper").val(text).css("font-size","100%").focus();			
					
		/*---------------------------------
		  потеря фокуса
		 ----------------------------------*/			
		$(".input_wrapper").blur(function()
		{	
			var this_cell=$(this);
			$(this).parent().hasClass("col_fio")
			{
				if ($(this).val() == "") $(this).parent().text(text)
				else
				{
					$(this).parent().attr("title",$(this).val()).text($(this).val());						
					$.ajax
					({
						url: "server.php",
						data: 
						{
							"func": "UpdateFio",
							"person_id": PersonaId,
							"fio": $(this).val()
						},						
						method: "POST",
						success: function(data) 
						{
							obj = jQuery.parseJSON(cleanString(data));
							if (obj.answer == "warning") warning(obj.string);
							if (obj.answer == "error") error(obj.string);
							if (obj.answer == "success")
							{
								$(this).remove();
							}
						}
					});
				}
			}				
		});
		
		ActiveElement = "ValueEditMode"; // активный режим редактирования				
	  }
	  
	  /* ------- текущий день ------- */
	  if ($(this).hasClass("active_day")) 			
	  {                          		  			
		var this_cell = $(this);
		$(this).html("<input type='text' title='Введите значение.' class='input_wrapper'/>");						
		
		$(".input_wrapper").css("text-align","center");			
		$(".input_wrapper").css("font-size","100%");
		$(".input_wrapper").focus();
		
		/*---------------------------------------
	  	  потеря фокуса
		 ---------------------------------------*/
		$(".input_wrapper").blur(function()
		{									
			$(this).parent().hasClass("active_day")
			{						
				if ($(this).val()=="") $(this).parent().text(text)
				else
				{
					$(this).parent().attr("title",$(this).val()).text($(this).val());						
					if (id != "empty")
					{
						$("body").append("<div id='informer'>вставка...</div>");
						$.ajax
						({
							url: "server.php",
							data: 
							{
								"func": "UpdateValue",									 
								"value": $(this).val(),
								"value_id": id,									
							},			
							method: "POST",
							success: function(data)
							{														    
								console.log(data);
								obj = jQuery.parseJSON(cleanString(data));
								if (obj.answer == "warning") warning(obj.string);
								if (obj.answer == "error") error(obj.string);
								if (obj.answer == "success")
								{										
									$(this).remove();
									$("#informer").remove();
								}
							}
						});
					}
					else
					{	
						var val = $(this).val();
						$("body").append("<div id='informer'>вставка...</div>");
						$.ajax
						({
							url: "server.php",
							data: 
							{
								"func": "InsertValue",
								"current_date": CurrentDate,
								"persona_id": PersonaId,								
								"value": val,								
							},
							method: "POST",								
							success: function(data) 
							{										
								console.log(data);
								obj = jQuery.parseJSON(cleanString(data));
								if (obj.answer == "warning") warning(obj.string);
								if (obj.answer == "error") error(obj.string);
								if (obj.answer == "success")
								{																																																		
									this_cell.attr("title",	val);										
									this_cell.attr("data-id", obj.string);																			
									$(this).remove();
									$("#informer").remove();
								}
							}								
						});
					}
				}
			}
			
			ActiveElement = "PersonasScreen"; 				
		});
		
		ActiveElement = "ValueEditMode"; 		// активный режим - режим редактирования				
	  }
	  
	  $(".input_wrapper").keypress(function(event)
	  {
		switch (event.keyCode) 
		{
			case 13: $(this).blur(); break;
		}
	  });		  		 		 
	});

	SetMouseMenuEvents();		
	
 } // SetPersonalTableHandlers
	
/*
---------------------------------------------
 
  начало кода jquery
 
---------------------------------------------*/
$(document).ready(function() 
{			

   sweetAlertInitialize();
	
    $("#captcha").css("display", "none");
    $("body").append("<div id='wrapper'></div>");					
	
	function InsertPersona(id, fio) 
	{
      if ($("#main_table tr").length < MAX_RECORDS) $("#main_table").append("<tr data-id="+id+"><td class='col_num'></td><td class='col_fio' title='"+fio+"'>"+fio+"</td><td class='col_number pn' title='не указано'>0</td><td class='col_number vt' title='не указано'>0</td><td class='col_number sr' title='не указано'>0</td><td class='col_number cht' title='не указано'>0</td><td class='col_number pt' title='не указано'>0</td><td class='col_number sb' title='не указано'>0</td><td class='col_number vs' title='не указано'>0</td></tr>");
    }	
		
	/*-------------------------------
	  отобразить таблицу
	  -------------------------------*/
    function ShowTable(start, end) 
	{
		NProgress.start();        				
        $.ajax
		({
            url: "server.php",
            data: 
			{
                "func": "GetPersonal",
                "group_id": GroupId,
                "start": start,
                "end": end,        
            },
			error: function(jqXHR, textStatus)
			{
				if(textStatus == 'timeout') TimeOutError();												
			},
            success: function(data) 
			{				
				obj = jQuery.parseJSON(cleanString(data));			// разбор json массива	
                if (obj.answer == "warning") warning(obj.string);	// предупреждение
                if (obj.answer == "error") error(obj.string);		// ошибка
                if (obj.answer == "success")						// добро
				{																					
					var last_num = 0; var cur_val  = 0;
					
					$("#wrapper").append("<div id='table_block'></div>");							                    													
					$("#table_block").append("<table width='100%' border='1' id='main_table'></table>");
                    $("#main_table").empty().append("<thead><tr><th title='порядковый номер'>№</th><th id='fio' title='фамилия имя и отчество'><input type='text' id='name_title'></input></th><th title='понедельник'>пн</th><th title='вторник'>вт</th><th title='среда'>ср</th><th title='четверг'>чт</th><th title='пятница'>пт</th><th class='out_day_sb' title='суббота'>сб</th><th class='out_day_vs' title='воскресенье'>вс</th></tr></thead>");					
					
					$.ajax
					({
						url: "server.php",
						data: { "func": "GetNameTitle" },						
						success: function(data) 
						{				
							obj = jQuery.parseJSON(cleanString(data));
							if (obj.answer == "error") error(obj.string);
							if (obj.answer == "success") 
							{					
								$("#name_title").val(obj.string).blur(function()
								{						
									$.ajax
									({
										url: "server.php",
										data: { "func": "SetNameTitle", "name_title": $("#name_title").val()},
										method: "POST",
										success: function(data) 
										{				
											obj = jQuery.parseJSON(cleanString(data));
											if (obj.answer == "error") error(obj.string);
											if (obj.answer == "success") 
											{
												console.log(obj.string);
											}
										}			
									});																		
								});																		  		 		 									
							}
						}
					});
		
					$("#name_title").keypress(function(event)
					{
						switch (event.keyCode) 
						{
							case 13: $(this).blur(); break;
						}
					});
						
					$.each(obj.string, function(i, item) 
					{
						last_num = i;
						InsertPersona(item.id, item.fio);
					});
				
					$(".col_number").attr("data-id", "empty");
				
					$("#main_table tbody tr").each(function() 
					{
						GetValues($(this).data("id"), $(this).index());
					});										
				
					UpdateMainTable();				/* обновить таблицу */
					SetPersonalTableHandlers();		/* поставить обработчики */																		
				}
			}, timeout: timeout
        });		
		
		NProgress.done();		
    }
	/*-------------------------------------
	  обработчики для групп
	  -------------------------------------*/
    function SetGroupMenuHandlers() 
	{	
        var timeoutId, input_val, clicks = 0;
		$(".group_item_name").css("width", "83%");
        
        /*  фильтр	*/
		$("#filter_group_menu").keyup(function(e) 
		{
            $("#group_menu li .group_item_name").each(function() 
			{
                if ($("#filter_group_menu").val().toLowerCase() != $(this).text().substr(0,$("#filter_group_menu").val().length).toLowerCase())
                    $(this).parent().fadeOut(FadeOutSpeed);                
				else 				
                    $(this).parent().fadeIn(FadeInSpeed);                
            });
        });
		
		/*--------------------------------------------
		  CLICKS
		 --------------------------------------------*/
        function OneClickGroup(menu_element_index) 
		{			            
			GroupId = $("#group_menu li").eq(menu_element_index).data("id");			
			if (GroupId == LastGroupId) return; 
			LastGroupId=GroupId;                
            $("#group_menu li .group_item_name").css("text-decoration", "none");
            $("#group_menu li .group_item_name").eq(menu_element_index).css("text-decoration", "underline");                        
            ShowTable(0, MAX_RECORDS);
        }
		
		$("#group_menu li").off().click(function() 
		{
            clicks++;
            cur_selected_group_name  = $(this).find(".group_item_name").text();
            cur_selected_group_index = $(this).index();			
			SRV_SetVar("group_index", cur_selected_group_index);
            timeoutId = setTimeout(OneClickGroup($(this).index()), 1500);			
        }).dblclick(function()
		{            
            var text = $(this).find(".group_item_name").text();
			clearTimeout(timeoutId);
			cur_selected_group_name  = $(this).find(".group_item_name").text();
            cur_selected_group_index = $(this).index();
			GroupId = $("#group_menu li").eq($(this).index()).data("id");
            $("#group_menu li input").remove();            
			$(this).find(".group_item_name").html("<input type='text' value='"+text+"'title='введите новое имя'/>");
            $("#group_menu li .group_item_name").css("width", "83%");		
            $("#group_menu .group_item_name input").focus();
            $("#group_menu .group_item_name input").val(text);
			
			/*---------------------------------------------------
			  потеря фокуса
			 ----------------------------------------------------*/			
            $("#group_menu .group_item_name input").blur(function() 
			{                
				$("#group_menu li").eq(cur_selected_group_index).find(".group_item_name").text($(this).val());				
				$("#group_menu li").eq(cur_selected_group_index).find(".group_item_name").attr("title", "Группа:&nbsp;"+$(this).val());
				if ($("#group_menu li").eq(cur_selected_group_index).find(".group_item_name").text() == "")
					$("#group_menu li").eq(cur_selected_group_index).find(".group_item_name").text("без названия");
				
					$.ajax
					({
						url: "server.php",
						data: 
						{
							"func": "ChangeGroup",
							"group_id": GroupId,
							"new_val": $("#group_menu li").eq(cur_selected_group_index).find(".group_item_name").text()
						},
						method: "POST",
						success: function(data) 
						{
							obj = jQuery.parseJSON(cleanString(data));
							if (obj.answer == "error") error(obj.string);
							if (obj.answer == "success") 
							{
								cur_selected_group_name = $("#group_menu li").eq(cur_selected_group_index).find(".group_item_name").text();								
							}
						}
					});
					ActiveElement = "PersonasScreen";				
            });
			
            $("#group_menu input").keydown(function(event) 
			{
                switch (event.keyCode) 
				{
                    case 13: $(this).blur(); break;
                }
            });
            ActiveElement = "GroupMenu";
        });
    }
	
	/*---------------------------------------------------
	  вставить группу
	 ---------------------------------------------------*/	
    function InsertGroup(id, GroupName, GroupDateReg) 
	{
	  $("#group_menu").append("<li data-id="+id+" title='дата создания:&nbsp;"+GroupDateReg+"'><div class='group_item_name'>"+GroupName+"</div><div class='personal_count'>0</div></li>");	
    }
	
	/*------------------------------
	  добавить группу
	 ------------------------------*/
    function AddGroup(GroupName) 
	{        
		var ret;
        $.ajax
		({
            url: "server.php",
            data: 
			{
                "func": "AddGroup",
                "group_name": GroupName,
				"group_unit": ""
            },
			async: false,
            method: "POST",            
            success: function(data) 
			{
				obj = jQuery.parseJSON(cleanString(data));
                if (obj.answer == "error") error(obj.string);
                if (obj.answer == "success") 
				{					
					$("#group_menu").append("<li data-id="+obj.string+" title='группа:&nbsp;"+GroupName+"'><div class='group_item_name'>"+GroupName+"</div><div class='personal_count' title='Число персон в группе:0'>0</div></li>");
                    $("#group_count").text(parseInt($("#group_count").text())+1);
                    SetGroupMenuHandlers();
                    GroupId = obj.string;
                    ret = obj.string;
                }
            }
        });
        return ret;
    }
	
	/*-------------------------
	  удалить группу
	 -------------------------*/
    function DeleteGroup() 
	{				
		if( $("#group_menu li").length > 0 )
		{			
			swal({	
					title: "Удалить?",
					text: cur_selected_group_name,
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Да",
					cancelButtonText: "Нет",
					closeOnConfirm: true,
					closeOnCancel: true,
					allowEscapeKey:	true
				},
				function(isConfirm) 
				{
					if (isConfirm) 
					{					
						$.ajax
						({
							url: "server.php",
							data:
							{
								"func": "DeleteGroup",
								"GroupId": GroupId
							},
							method: "POST",
							async:false,
							success: function(data) 
							{																							
								obj = jQuery.parseJSON(cleanString(data));
								if (obj.answer == "warning") warning(obj.string);
								if (obj.answer == "error") error(obj.string);
								if (obj.answer == "success")
								{								
									$("#group_menu li").eq(cur_selected_group_index).remove();									
									$("#group_menu li").eq(cur_selected_group_index).trigger("click");
									$("#group_count").text(parseInt($("#group_count").text())-1);																			
									
									/* если меню пустое - очистить основную таблицу */
									if ($("#group_menu li").length == 0)
									{
										$("#main_table tbody").empty();										
									}
								}
							}
						});					
					}
				});
			}
    }
       
	/*----------------------------------
	  добавить персону
	 ----------------------------------*/
    function AddPersona(fio) 
	{		
		cur_val++;
		$("body").append("<div id='informer'>вставка...</div>");		
        $.ajax
		({
            url: "server.php",
            data: 
			{
                "func": "AddNewPerson",
                "fio": fio,
                "group_id": GroupId
            },
            method: "POST",
			async:false,
            success: function(data) 
			{                		
				obj = jQuery.parseJSON(cleanString(data));
                if (obj.answer == "error") error(obj.string);
                if (obj.answer == "success") 
				{    						
						if ( cur_selected_group_index==undefined ) cur_selected_group_index = 0;																		
						if ($("#main_table tbody tr").length==0) count=0;						
						else
						count = parseInt($("#group_menu li").eq(cur_selected_group_index).find(".personal_count").text());																																			
						count=count+1;					
					
						$("#group_menu li").eq(cur_selected_group_index).find(".personal_count").text(count);
						$("#group_menu li").eq(cur_selected_group_index).find(".personal_count").attr("title", "Число записей в группе:&nbsp;"+count);					
										
						if ($("#main_table tbody tr").length < MAX_RECORDS)
						{
							$("#main_table").append("<tr data-id="+obj.string+"><td class='col_num' title='ID:&nbsp;"+obj.string+"'>"+cur_val+"</td><td class='col_fio'>"+fio+"</td><td class='col_number pn'>0</td><td class='col_number vt'>0</td><td class='col_number sr'>0</td><td class='col_number cht'>0</td><td class='col_number pt'>0</td><td class='col_number sb'>0</td><td class='col_number vs'>0</td></tr>");
							$("#main_table tr").eq($("#main_table tbody tr").length).find(".col_number").attr("title","не указано");						
							$("#main_table tr").eq($("#main_table tbody tr").length).find(".col_number").attr("data-id","empty");						
							$("#personal_count").text(parseInt($("#personal_count").text())+1);                        
							UpdateMainTable();
							SetPersonalTableHandlers();                       						
						}										
					
						$("body").scrollTop($(document).height()); // пролистать вниз
						$("#informer").remove(); // удалить информер
                }
            }
        });
    }
	/*-----------------------------------------------
	  ИЗВЛЕЧЬ ЗНАЧЕНИЯ
	 -----------------------------------------------*/
    function GetValues(persona_id, string_index) 
	{
        $.ajax
		({
            url: "server.php",
            data: 
			{
                "func": "GetValue",
                "persona_id": persona_id,
				"start_date": CurrentDate,
				"day_name":	GetWeekDayFromMoment(moment(CurrentDate,"DD/MM/YYYY").day())
            },			
            success: function(data) 
			{		
				if (cleanString(data)!="")
				{
					obj = jQuery.parseJSON(cleanString(data));
					if (obj.answer == "error") error(obj.string);
					if (obj.answer == "success") 
					{
						var mtr = "#main_table tbody tr";
						$.each(obj.string, function(i, item) 
						{												                        
							switch (GetWeekDay(item.date)) 
							{ 
								case "Понедельник":
                                {                                    
									$(mtr).eq(string_index).find(".pn").text(item.value);
                                    $(mtr).eq(string_index).find(".pn").attr("data-id", item.id);
                                    $(mtr).eq(string_index).find(".pn").attr("title", item.value);																	    
									if (item.note != "") $(mtr).eq(string_index).find(".pn").css("color", "yellow");									
                                    break;
                                }
								case "Вторник":
                                {
                                    $(mtr).eq(string_index).find(".vt").text(item.value);
                                    $(mtr).eq(string_index).find(".vt").attr("data-id", item.id);
                                    $(mtr).eq(string_index).find(".vt").attr("title", item.value);
									if (item.note != "") $(mtr).eq(string_index).find(".vt").css("color", "yellow");									
                                    break;
                                }
								case "Среда":
                                {
                                    $(mtr).eq(string_index).find(".sr").text(item.value);
                                    $(mtr).eq(string_index).find(".sr").attr("data-id", item.id);
                                    $(mtr).eq(string_index).find(".sr").attr("title", item.value);									
									if (item.note != "") $(mtr).eq(string_index).find(".sr").css("color", "yellow");									
                                    break;
                                }
								case "Четверг":
                                {
                                    $(mtr).eq(string_index).find(".cht").text(item.value);
                                    $(mtr).eq(string_index).find(".cht").attr("data-id", item.id);
                                    $(mtr).eq(string_index).find(".cht").attr("title", item.value);
									if (item.note != "") $(mtr).eq(string_index).find(".cht").css("color", "yellow");									
                                    break;
                                }
								case "Пятница":
                                {
                                    $(mtr).eq(string_index).find(".pt").text(item.value);
                                    $(mtr).eq(string_index).find(".pt").attr("data-id", item.id);
                                    $(mtr).eq(string_index).find(".pt").attr("title", item.value);
									if (item.note != "") $(mtr).eq(string_index).find(".pt").css("color", "yellow");									
                                    break;
                                }
								case "Суббота":
                                {
                                    $(mtr).eq(string_index).find(".sb").text(item.value);
                                    $(mtr).eq(string_index).find(".sb").attr("data-id", item.id);
                                    $(mtr).eq(string_index).find(".sb").attr("title", item.value);
									if (item.note != "") $(mtr).eq(string_index).find(".sb").css("color", "yellow");									
                                    break;
                                }
								case "Воскресенье":
                                {
                                    $(mtr).eq(string_index).find(".vs").text(item.value);
                                    $(mtr).eq(string_index).find(".vs").attr("data-id", item.id);
                                    $(mtr).eq(string_index).find(".vs").attr("title", item.value);
									if (item.note != "") $(mtr).eq(string_index).find(".vs").css("color", "yellow");									
                                    break;
                                }
							}
						});					
					}                
				}
			}
        });		
    }
	
	/*-------------------------------
	  отобразить экран с персонами
	  -------------------------------*/	
    function ShowPersonasScreen()
	{        				
		NProgress.start();											
		$.ajax
		({
			url: "server.php",
			data: {"func": "GetConfig"},
			async:false,
			success: function(data) 
			{												
				obj = jQuery.parseJSON(cleanString(data));
				if (obj.answer == "warning") warning(obj.string);
				if (obj.answer == "error") error(obj.string);
				if (obj.answer == "success")
				{																								
					/* -------------------------------------------
					   1 - универсальный     (записи/группы)					   
					   2 - спортивная секция (ученики/группы)
					   3 - курсы 			 (ученики/класс)
					   4 - школа 			 (ученики/классы)
					   5 - университет 		 (студенты/группы)
					   6 - соревнования		 (участники/группы)
					   7 - кту		 		 (работники/группы)
					   8 - экперимент		 (объекты/группы)					   
					 --------------------------------------------*/					
					 
					switch(obj.string.journal)
					{
					 case "1": new_group_title = "НОВАЯ ГРУППА";  new_record_title="новая запись"; 	 break;					 
					 case "2": new_group_title = "НОВЫЙ КЛАСС";   new_record_title="новый ученик"; 	 break;
					 case "3": new_group_title = "НОВЫЙ КЛАСС";   new_record_title="новый ученик"; 	 break;
					 case "4": new_group_title = "НОВЫЙ КЛАСС";   new_record_title="новый ученик";	 break;
					 case "5": new_group_title = "НОВАЯ ГРУППА";  new_record_title="новый студент";  break;
					 case "6": new_group_title = "НОВАЯ ГРУППА";  new_record_title="новый участник"; break;
					 case "7": new_group_title = "НОВАЯ ГРУППА";  new_record_title="новый работник"; break;
					 case "8": new_group_title = "НОВАЯ ГРУППА";  new_record_title="новый объект"; 	 break;
					}
					
					/* --- глобально --- */					
					journal			= obj.string.journal;
					but_group_title = obj.string.but_group_title;
					but_rec_title 	= obj.string.but_rec_title;
					vk_id			= obj.string.vk_id;			
				}
			}								
		});			
		
		cur_val=0; LastGroupId=null;				
        
		$("body").css("background", "rgb(100,100,100)");
        $("#wrapper").empty();				
        $("#wrapper").append("<div id='back_screen1'></div>");
        $("#wrapper").append("<div id='header_block'></div>");              
        $("#header_block").append("<div id='screen_resolution'></div>");
		
		/*-------------------------
		   ресайз окна
		  -------------------------*/
		$(window).resize(function()
		{
        //  $("#screen_resolution").text($(window).width()+"x"+$(window).height());
        }).trigger("resize");
		
		/*
		----------------------------------------
		дата
		----------------------------------------
		*/
		date = new Date();		
        CurrentDate = moment().format("DD/MM/YYYY");
        $("#header_block").append("<ins class='link' title='рабочая дата' id='cur_date'><h3>"+CurrentDate+" г.</h3></ins>");
        $("#header_block").append("<div class='link' id='zadanie' title='текущая задача'>задача</div>");      
        
		/*------------------------------
		  задание
		 -------------------------------*/
		$("#zadanie").click(function() 
		{
            $("#back_screen1").fadeIn(FadeInSpeed);
            $("#the_task_window").empty();
            $("#wrapper").append("<div id='the_task_window'></div>");
            $("#the_task_window").append('<div id = "task_window_close" title="закрыть окно">X</div>');
            $("#the_task_window").fadeIn(FadeInSpeed);
			
			/* закрытие окна */
            $("#task_window_close").click(function() 
			{
                $("#the_task_window").fadeOut(FadeOutSpeed);
                $("#back_screen1").fadeOut(FadeOutSpeed);
				$("html, body").animate({scrollTop:0}, 0);
            });			
            
			AutoClick("#task_window_close");						

            $("#the_task_window").append("<h1 id='task_title'>Задача на <ins>"+CurrentDate+" г.</ins></h1>");			
			$("#the_task_window").append("<div class='link' id='copy_last_task' title='скопировать предыдущую задачу'>предыдущая</div>");
			
			/*-----------------------------------------
			   получить предыдущее задание
			 ------------------------------------------*/
			$("#copy_last_task").click(function() 
			{
                $.ajax 
				({
                    url: "server.php",
                    data: 
					{
                        "func": "GetLastTask",                        
                        "group_id": GroupId,
						"date":	CurrentDate						
                    },                    
                    success: function(data) 
					{                        
						obj = jQuery.parseJSON(cleanString(data));
                        if (obj.answer == "warning") warning(obj.string);
                        if (obj.answer == "error") error(obj.string);
                        if (obj.answer == "success") 
						{
							$("#task_text_area").val(obj.string[0].text);
                        }
                    }
                });
            });

            var task_change = 0;
			$("#the_task_window").append("<textarea id='task_text_area' title='текст задачи' maxlength='512'></textarea>");			
									
			/*-----------------------------------------------
			   изменения в задании
			 -------------------------------------------------*/
            $("#task_text_area").val("").keydown(function(e)
			{
                switch (e.keyCode)
				{
                    case 13: $(this).blur(); break;
                }
            });
			
			if (device.mobile())
			{
				$("#the_task_window textarea").focus(function(event) 
				{				
					$("#the_task_window").css("position","relative");
				}).blur(function(event) 
				{				
					$("#the_task_window").css("position","fixed");
				});
				
				/* hover auto-click */
				$("#task_window_close").hover(function(event) 
				{
					$(this).click();
				});
			}
			
			/*----------------------------
			  получить задание
			  ----------------------------*/
            $.ajax
			({
                url: "server.php",
                data: 
				{
                    "func": "GetTask",
                    "group_id": GroupId,
                    "date":	CurrentDate
                },				
                success: function(data) 
				{					
                    obj = jQuery.parseJSON(cleanString(data));
                    if (obj.answer == "error") error(obj.string);
					if (obj.answer == "warning") $("#task_text_area").attr("placeholder", obj.string);					
                    if (obj.answer == "success")
					{
                        TaskId = obj.string[0].id;
						$("#task_text_area").val(obj.string[0].text);						
						$("#task_text_area").keydown(function() 
						{
							task_change = 1;
						});
                    }                    
                }
            });
			
            $("#the_task_window").append("<button id='save_task' class='red_button' title='сохранить задачу'>сохранить</button>");
			
			/*-----------------------------------
			  сохранить заметку
			  -----------------------------------*/
            $("#save_task").click(function() 
			{                    					
				$.ajax 
				({
                    url: "server.php",
                    data: 
					{
                        "func": "SaveTask",
                        "text": $("#task_text_area").val(),
                        "cur_date": CurrentDate,
						"group_id": GroupId,
						"task_id": TaskId,
                    },
                    method: "POST",
                    success: function(data) 
					{						
                        obj = jQuery.parseJSON(cleanString(data));
                        if (obj.answer == "warning") warning(obj.string);
                        if (obj.answer == "error") error(obj.string);
                        if (obj.answer == "success") 
						{                                
                            $("#task_window_close").trigger("click");
                        }
                    }
                });
            });
            ActiveElement = "TaskWindow";
        });
		
		/*---------------------------------------
		 текущая дата / календарь
		 ---------------------------------------*/
        $("#cur_date").click(function() 
		{            
			$("#back_screen1").fadeIn(FadeInSpeed);
            $("#wrapper").append("<div id='calendar'></div>");
            $("#calendar").html("<table id='calendar_table' width='100%'></table>");
			$("#calendar_table").append("<tr><td id='calendar_header'>рабочая дата</td><td id='calendar_close'></td></tr>");
			$("#calendar_close").append("<div id='calendar_window_close' title='закрыть календарь'>X</div>");
			$("#calendar_table").append("<tr><td id='calendar_body' colspan='2'></td></tr>");
			$("#calendar_body").append("<div class='myCalendar' id='TheCalendar'></div>");
			
			/*--------------------------------
			  календарь
			 --------------------------------*/
			$("#TheCalendar").ionCalendar
			({
                lang: "ru", 			 // язык календаря
                sundayFirst: false, 	 // первый день недели
                years: "10", 			 // кол-во лет в списке
                format: "DD/MM/YYYY", 	 // формат возвращаемой даты
				startDate: CurrentDate,  // начальная дата
                onClick: function(_date) 
				{																			
					var NowDate = moment().format("DD/MM/YYYY");					
					if (_date != NowDate)
					{
						Archive = true; // установить архивный режим
					}
					else						
					Archive = false;										
					CurrentDate = _date;									
					$("#cur_date").html("<h3>"+CurrentDate+"&nbsp;г.</h3>");
					$("#calendar").fadeOut(FadeOutSpeed);
					$("#back_screen1").fadeOut(FadeOutSpeed);                    
					ShowTable(0, MAX_RECORDS);                    
                }
            });
			
			/* закрытие окна */
            $("#calendar_window_close").click(function() 
			{
                $("#calendar").fadeOut(FadeOutSpeed);
                $("#back_screen1").fadeOut(FadeOutSpeed);
            });
			
			AutoClick("#calendar_window_close");			
			$("#calendar").fadeIn(FadeInSpeed);			
            ActiveElement = "Calendar";
        });
		
		/*-----------------------------------
		   ВЕРХНИЕ КНОПКИ
		 ------------------------------------*/
        $("#header_block").append("<div class='time' id='clock' title='текущее время'></div>");        		
		$("#header_block").append("<div class='link' id='forum_link' title='перейти на форум'>форум</div>");		
        $("#header_block").append("<input type='text' placeholder='фильтр' id='filter' title='Укажите данные для фильтрации данных'></input>");
		
		/*
		------------------------------------
		переход на форум
		------------------------------------
		*/
		$("#forum_link").click(function() 
		{
			SRV_SetVar("noty_forum_visit", "true");
			window.open('/forum/', '_blank');						
		});
		
		/*-----------------------------------
		  ФИЛЬТР ЗАПИСЕЙ
		  -----------------------------------*/
		$("#filter").keydown(function(event) 
		{
            switch (event.keyCode) 
			{
                case 13: $(this).blur(); break;
            }
        });
		
		/*-----------------------------------------------
		
		  ПАНЕЛЬ КНОПОК
		  
		  -----------------------------------------------*/
        $("#header_block").append("<button class='header_block_button' id='add_persona' title='+&nbsp;"+but_rec_title+"'><span class='op_symbol'>+</span>&nbsp;"+but_rec_title+"</button>");
        $("#header_block").append("<button class='header_block_button' id='del_persona' title='-&nbsp;"+but_rec_title+"'><span class='op_symbol'>-</span>&nbsp;"+but_rec_title+"</button>");
		$("#header_block").append("<button class='header_block_button' id='show_mobile_group'></button>");
        $("#header_block").append("<button class='header_block_button' id='add_group' title='+&nbsp;"+but_group_title+"'><span class='op_symbol'>+</span>&nbsp;"+but_group_title+"</button>");
        $("#header_block").append("<button class='header_block_button' id='del_group' title='-&nbsp;"+but_group_title+"'><span class='op_symbol'>-</span>&nbsp;"+but_group_title+"</button>");                
		$("#header_block").append("<button class='header_block_button' id='statistica' title='отчёт'>отчёт</button>");
		$("#header_block").append("<button class='header_block_button' id='sending_messages' title='рассылка по email'>рассылка</button>");
		if (vk_id==0)
		{
			$("#header_block").append("<button class='header_block_button' id='settings' title='настройки'>настройки</button>");
		}
        $("#header_block").append("<button class='header_block_button' id='show_main_screen' title='выйти'>выход</button>");																		
		
		/*------------------------------------------
		   рассылка
		 ---------------------------------------------*/
		$("#sending_messages").click(function() 
		{
			$("#back_screen1").fadeIn(FadeInSpeed);
            $("#sending_messages_window").remove();
            $("#wrapper").append("<div id='sending_messages_window'></div>");
            $("#sending_messages_window").fadeIn(FadeInSpeed);
            $("#sending_messages_window").append("<div class='close_window' id='sending_messages_window_close' title='закрыть окно'>X</div>");            
			$("#sending_messages_window").append("<h2><ins>рассылка</ins></h2>");									
			$("#sending_messages_window").append("<select id='send_message_target'><option value='1'>всем</option><option value='2'>"+but_group_title+"</option></select>");
			$("#sending_messages_window").append("<div id='sending_messages_group_div'></div>");
			$("#sending_messages_window").append("<textarea id='sending_messages_textarea' placeholder='текст рассылки' maxlength='512'></textarea>");
			$("#sending_messages_window").append("<button class='green_button' id='send_message'>разослать</button>");						
			
			/* автозакрытие */
			AutoClick("#sending_messages_window_close");			
			
			/* сделать элемент текущим (для esc) */
			ActiveElement="SendingMessagesWindow";
			
			/* закрытие окна */
            $("#sending_messages_window_close").click(function() 
			{
                $("#sending_messages_window").fadeOut(FadeOutSpeed);
                $("#back_screen1").fadeOut(FadeOutSpeed);
            });
			
			/* enter textarea */
			$("#sending_messages_textarea").keypress(function(event)
			{
				switch (event.keyCode) 
				{
					case 13: $(this).blur(); break;
				}
			});		  		 		 
			
			/* выбор элемента из списка */
			$("#send_message_target").change(function() 
			{							
				if ($(this).prop("selectedIndex")==1)
				{
					/* добавить группы в список расссылок */
					$("#sending_messages_group_div").append("<select id='sending_messages_group_list'></select>");					
					
					$.ajax
					({
						url: "server.php",
						data: { "func": "GetGroupList" },
						async: false,
						success: function(data) 
						{							
							obj = jQuery.parseJSON(cleanString(data));
							if (obj.answer == "error") error(obj.string);
							if (obj.answer == "success") 
							{
								$.each(obj.string, function(i, item) 
								{                                                      
									$("#sending_messages_group_list").append("<option data-id='"+item.id+"'>"+item.name+"</option>");							
								});
							}
						}
					});
				}
				else $("#sending_messages_group_div").empty();
			});
			
			/*
			-------------------------------------------
			  рассылка сообщений
			--------------------------------------------*/
            $("#send_message").click(function() 
			{				
				if ($("#sending_messages_textarea").val()=="") warning("введите текст сообщения");												
				else
				{
					if( $("#send_message_target").prop("selectedIndex") == 0 )
					{					
						send_message_group_id = "for_all";
					}
					else				
					{
						send_message_group_id = $("#sending_messages_group_list option:selected").data("id");
					}
					
					$("#sending_messages_window_close").trigger("click");											
					$.ajax
					({
						url: "server.php",
						data: { "func": "SendMessage", "group_id": send_message_group_id, "message": $("#sending_messages_textarea").val() },			
						success: function(data) 
						{
							obj = jQuery.parseJSON(cleanString(data));
							if (obj.answer == "error") error(obj.string);
							if (obj.answer == "warning") warning(obj.string);															
							if (obj.answer == "success")
							{							 
							}
						}
					});
				}				
            });			
		});
		
		/*
		----------------------------------------------------- 
		
		  МОБИЛЬНЫЕ ОБРАБОТЧИКИ
		  
		-----------------------------------------------------*/	
        function SetMobileGroupMenuHandlers()
		{			
			/* выбор элемента */
            $(".menu_input").click(function()
			{                				
				GroupId = $(this).parent().parent().data("id");												
				SRV_SetVar("group_index", $(this).parent().parent().index());				
                $("#mobile_group_window").fadeOut(FadeOutSpeed);
                $("#back_screen1").fadeOut(FadeOutSpeed);
                ShowTable( 0, MAX_RECORDS );
            });

			/*
			-----------------------------------------
			ФИЛЬТР ГРУПП ДЛЯ МОБИЛЬНОГО МЕНЮ
			-----------------------------------------*/
            $("#filter_group").keyup(function(e) 
			{
                $(".menu_input").each(function() 
				{
                    if ($("#filter_group").val().toLowerCase() != $(this).val().substr( 0, $("#filter_group").val().length).toLowerCase() )
						$(this).parent().parent().fadeOut(FadeOutSpeed);					
                    else
                        $(this).parent().parent().fadeIn(FadeInSpeed);
                });
				
                switch (e.keyCode) 
				{
                    case 13: $(this).blur(); break;
                }
            });						           
           
		    /*-----------------------------------------------------
			 (МОБИЛЬНОЕ УСТРОЙСТВО) Редактировать группу
			 -----------------------------------------------------*/
           $(".mobile_edit_group_button").click(function()
			{					
				var idx = $(this).parent().index();
                var text = $("#group_menu_list li input").eq(idx).val();          							
				
				GroupId=$(this).parent().data("id");				
				
				$(".menu_input").eq(idx).prop("readonly", false);
                $(".menu_input").eq(idx).focus();
                $(".menu_input").eq(idx).val(text);

				/* обработчик потери фокуса в input для mobile версии */
                $(".menu_input").eq(idx).blur(function() 
				{
                    $(".menu_input").eq(idx).prop("readonly", true);
                    
					$.ajax
					({
                        url: "server.php",
                        data: 
						{
                            "func": "ChangeGroup",
                            "group_id": GroupId,
                            "new_val": $(this).val()
                        },
						async:false,
                        method: "POST",
                        success: function(data) 
						{
                            obj = jQuery.parseJSON(cleanString(data));
                            if (obj.answer == "error") error(obj.string);
                        }
                    });
                });
				
                $(".menu_input").eq(idx).keydown(function(event) 
				{
                    switch (event.keyCode) 
					{
                        case 13: $(this).blur(); break;
                    }
                });
            });
			
			/*-----------------------------------------------------
			 (МОБИЛЬНОЕ УСТРОЙСТВО) Удалить группу
			 -----------------------------------------------------*/           
            $(".mobile_delete_group_button").click(function()
			{				
				var this_index 	= $(this).parent().index();
				var this_id 	= $(this).parent().data("id");
				
                swal({
                        title: "Удалить?",
                        text: $(".menu_input").eq(this_index).val(),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Да",
                        cancelButtonText: "Нет",
                        closeOnConfirm: true,
                        closeOnCancel: true,
						allowEscapeKey:	true
                    },
                    function(isConfirm) 
					{
                        if (isConfirm) 
						{
                            $.ajax
							({
                                url: "server.php",
                                data: 
								{
                                  "func": "DeleteGroup",
                                  "GroupId": this_id
                                },								
                                method: "POST",
                                success: function(data) 
								{
                                    obj = jQuery.parseJSON(cleanString(data));
                                    if (obj.answer == "error") error(obj.string);
									if (obj.answer == "success")
									{
										$("#group_menu_list li").eq(this_index).remove();										
										if ($("#group_menu_list li").length == 0)
										{
											$("#main_table tbody").empty();										
										}
									}
                                }
                            });                            
                        }
                    }
                );
            });
        }
		
		/*------------------------------------------
		   МЕНЮ ДЛЯ МОБИЛЬНОГО УСТРОЙСТВА
		 ---------------------------------------------*/
		$("#show_mobile_group").click(function() 
		{
            $("#back_screen1").fadeIn(FadeInSpeed);
            $("#mobile_group_window").remove();
            $("#wrapper").append("<div id='mobile_group_window'></div>");
            $("#mobile_group_window").fadeIn(FadeInSpeed);
            $("#mobile_group_window").append("<div id='mobile_group_window_close' title='закрыть окно'>X</div>");
			
            AutoClick("#mobile_group_window_close");
            
			/* закрытие окна */
            $("#mobile_group_window_close").click(function() 
			{
                $("#mobile_group_window").fadeOut(FadeOutSpeed);
                $("#back_screen1").fadeOut(FadeOutSpeed);
            });

            $("#mobile_group_window").append("<h1><ins>"+GroupTitle+"</ins></h1>");            
            $("#mobile_group_window").append("<input type='text' placeholder='добавить' id='mobile_group_name_input' size='18'/>");									
			$("#mobile_group_window").append("<button id='mobile_add_new_group_button' class='green_button'>+</button>");
									
			$("#mobile_group_name_input").keypress(function(event)
			{
				switch (event.keyCode) 
				{
					case 13: $(this).blur(); break;
				}
			});		  		 		 
			
			/* добавить новую группу (для мобилы) */
			$("#mobile_add_new_group_button").click(function() 
			{
                if ($("#mobile_group_name_input").val() == "") warning("укажите название!");
                else 
				{
                    $.ajax
					({
                        url: "server.php",
                        data: 
						{
                            "func": "AddGroup",
                             group_name: $("#mobile_group_name_input").val(),							
                        },
						async:false,
                        method: "POST",
                        success: function(data) 
						{
                            obj = jQuery.parseJSON(cleanString(data));
                            if (obj.answer == "error") error(obj.string);
                            if (obj.answer == "success") 
							{                              																								
								$("#group_menu_list").append("<li data-id='"+obj.string+"'><div class='mobile_menu_input_wrapper'><input type='text' value='"+$("#mobile_group_name_input").val()+"' class='menu_input' readonly='readonly'/></div><button class='mobile_edit_group_button'>правка</button><button class='mobile_delete_group_button'>удалить</button></li>");						    							                           
								$("#mobile_group_name_input").val("");
								SetMobileGroupMenuHandlers();																
                            }
                        }
                    });
				}
            });
			
			$("#mobile_group_window").append("<input type='text' placeholder='фильтр' id='filter_group'/>");						
            $("#mobile_group_window").append("<menu id='group_menu_list'></menu>");
			
			AutoFocus("#filter_group");
			
			/*-------------------------------------------
				вывести список групп
			---------------------------------------------*/
           $.ajax
			({
                url: "server.php",
                data: { "func": "GetGroupList" },
				async:false,
                success: function(data) 
				{					
                    obj = jQuery.parseJSON(cleanString(data));
                    if (obj.answer == "error") error(obj.string);
                    if (obj.answer == "success") 
					{                        
						$.each(obj.string, function(i, item) 
						{
							$("#group_menu_list").append("<li data-id='"+item.id+"'><div class='mobile_menu_input_wrapper'><input type='text' value='"+item.name+"' class='menu_input' readonly='readonly'/></div><button class='mobile_edit_group_button'>правка</button><button class='mobile_delete_group_button'>удалить</button></li>");						    							                            
                        });																	
						
						$("#group_menu_list li").eq(SRV_GetVar("group_index")).css("background","grey");						
						$("#group_menu_list li").eq(SRV_GetVar("group_index")).find("input").css("background","grey").css("border","none");						
						
						SetMobileGroupMenuHandlers(); /* обработчики меню */						
                    }
                }
            });
			
            ActiveElement = "MobileGroupWindow";
        });
		
		/*---------------------------------
		  статистика
		 ----------------------------------*/
        $("#statistica").click(function()
		{
			ShowStatistica();
        });
		
		/*-----------------------------------------------------
	   	  настройки
		  -----------------------------------------------------*/
        $("#settings, .mobile_settings").click(function()
		{            
			ShowSettings();
        });		               
       	
		/*-------------------------------------
		  новая персона
		  -------------------------------------*/
        $("#add_persona").click(function() 
		{			
			var count;
            $.ajax
			({
                url: "server.php",
                data: { "func": "GetUserSettings" },
				async: false,
                success: function(data)
                {						
                    obj = jQuery.parseJSON(cleanString(data));
                    if (obj.string.group_count == 0)
					{                                                
					 GroupId = AddGroup(new_group_title);
					 count = parseInt($("#group_menu li").eq(0).find(".personal_count").text());                        
                     $("#group_menu li").eq(0).find(".personal_count").text(count);
                     $("#group_menu li").eq(0).find(".personal_count").attr("title", "Количество записей:&nbsp;"+count);				
                    }
                }
            });			
            if (GetPersonalCount(GroupId) < MAX_RECORDS) AddPersona(new_record_title);				            
			else 
			warning("максимальное количество записей: "+(MAX_RECORDS-1));		
            UpdateMainTable();
        });
		
		// ---------------------------------------------
		// предварительное удаление персоны / записи 
		// ---------------------------------------------
		function Extern_DeletePerson()
		{			
			var count = parseInt($("#group_menu li").eq(cur_selected_group_index).find(".personal_count").text());
            count=count-1
            $("#group_menu li").eq(cur_selected_group_index).find(".personal_count").text(count);
            $("#group_menu li").eq(cur_selected_group_index).find(".personal_count").attr("title", "Число записей: "+count);                        
            $("#main_table tr").eq(tr_index+1).remove();			
			UpdateMainTable();			
		}
	
		/* -----------------------
		  удаление персоны
		  ------------------------*/
        function DeletePerson()
		{            	            			
			Extern_DeletePerson(); /* предварительное удаление записи из таблицы (скрытие записи) */
			
			$.ajax
			({
                url: "server.php",
                data: 
				{
                    "func": "DeletePerson",
                    "person_id": PersonaId
                },
                method: "POST",
                success: function(data) 
				{
                    obj = jQuery.parseJSON(cleanString(data));
                    if (obj.answer == "error") error(obj.string);
                    if (obj.answer == "success"){ /* ничего ... */ }
                }
            });			
        }
		
		/*------------------------------------
		  удалить персону
		 -------------------------------------*/
        $("#del_persona").click(function() 
		{
            if (tr_index == null) warning("Выберите запись!")
            else
            if (GetPersonalCount(GroupId) == 0) warning("ничего нет!");
            else
            swal
			({
                    title: "Удалить?",
                    text: cur_persona_name,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Да",
                    cancelButtonText: "Нет",
                    closeOnConfirm: true,
                    closeOnCancel: true,
					allowEscapeKey:	true
                },
                function(isConfirm) 
				{
                    if (isConfirm) 
					{
                        DeletePerson();
                    }
				});
        });
		
		// --------------------------------
		// добавить группу
		// --------------------------------
        $("#add_group").click(function() 
		{            
			GroupId = AddGroup(new_group_title);
        });
		
		// --------------------------------
		// удалить группу
		// --------------------------------
        $("#del_group").click(function() 
		{
            DeleteGroup();
        });
		
		/* -----------------------------------------------------------------
		
		 главный экран
		
		 -------------------------------------------------------------------*/
        $("#show_main_screen, .mobile_show_main_screen").click(function() { ShowMainScreen(); });
		
        $("#table_block").empty();		
        $("#wrapper").append("<div id='table_block'></div>");
        $("#main_table").empty();
		
		/* добавить таблицу */
        $("#table_block").append("<table width='100%' border='1' id='main_table'/>");        
		
		/* создать заголовок */
		$("#main_table").append("<thead><tr><th title='порядковый номер'>№</th><th id='fio' title='фамилия имя и отчество'><input type='text' id='name_title' value=':)'></input></th><th title='понедельник'>пн</th><th title='вторник'>вт</th><th title='среда'>ср</th><th title='четверг'>чт</th><th title='пятница'>пт</th><th class='out_day_sb' title='суббота'>сб</th><th class='out_day_vs' title='воскресенье'>вс</th></tr></thead>");											
		
		/* добавить меню */
        $("#wrapper").append("<div id='group_block'></div>");		
				
        $("#group_block").append("<div id='group_menu_block'></div>");				
		$("#group_menu_block").append("<div id='group_menu_block_title' title='заголовок списка'><b class='group_title'><input type='text' id='group_title_input_wrapper' maxlength='15'/></b></div>");
		
		/*---------------------------------
		   получить заголовок групп
		  ---------------------------------*/
		$.ajax
		({
            url: "server.php",
            data: { "func": "GetGroupTitle" },			
            success: function(data) 
			{				
				obj = jQuery.parseJSON(cleanString(data));
                if (obj.answer == "error") error(obj.string);
                if (obj.answer == "success") 
				{										
					GroupTitle = obj.string;
					$("#show_mobile_group").text(obj.string);
					$("#group_title_input_wrapper").val(obj.string).blur(function()
					{						
						$.ajax
						({
							url: "server.php",
							data: { "func": "SetGroupTitle", "group_title": $("#group_title_input_wrapper").val() },
							method: "POST",
							success: function(data) 
							{				
								obj = jQuery.parseJSON(cleanString(data));
								if (obj.answer == "error") error(obj.string);
								if (obj.answer == "success") 
								{
									GroupTitle = $("#group_title_input_wrapper").val();
									$("#show_mobile_group").text(GroupTitle);
									console.log(obj.string);
								}
							}
						});																		
					});												  		 		 									
				}
			}
		});
		
		/* enter blur */
		$("#group_title_input_wrapper").keypress(function(event)
		{
			switch (event.keyCode) 
			{
				case 13:
				{					
					$(this).blur(); 
					break;
				}
			}
		});	
		
        $("#group_menu_block").append("<input type='text' placeholder='фильтр' id='filter_group_menu' title='фильтр групп'/>");		
        $("#group_menu_block").append("<menu id='group_menu'></menu>");
        
		AutoFocus("#filter_group_menu");				
		
		// ----------------------------------
		// получить список групп
		// ----------------------------------
        $.ajax
		({
            url: "server.php",
            data: {"func": "GetGroupList"},
			async:false,
            success: function(data) 
			{
                obj = jQuery.parseJSON(cleanString(data));
                if (obj.answer == "error") error(obj.string);
                if (obj.answer == "success") 
				{														
					$.each(obj.string, function(i, item) 
					{
                        InsertGroup(item.id, item.name, item.date_reg);
                    });										
					
					/*----------------------------------------
					  перебор персонала
					 -----------------------------------------*/
					$(".personal_count").each(function() 
					{						
						var this_item = $(this);
						var data_id   = $(this).parent().data("id");
						
						if ($("#group_menu li").length < MAX_GROUPS) 
						{
							$.ajax
							({
								url: "server.php",
								data: 
								{
									"func": "GetPersonalCount",
									"group_id": data_id
								},							
								success: function(data) 
								{								
									obj = jQuery.parseJSON(cleanString(data));
									if (obj.answer == "error") error(obj.string);
									if (obj.answer == "success") 
									{
										this_item.html(obj.string);
										this_item.attr("title","Число записей: "+obj.string);
									}
								}
							});
						}
					});
					
					/* назначить обработчики меню */
		                        SetGroupMenuHandlers();										
					$("#group_menu li").eq(SRV_GetVar("group_index")).trigger("click");
                }
            }
        });

		/*--------------------------------
		  фильтр
		  --------------------------------*/
        $("#filter").keyup(function(e) 
		{
            $("#main_table td:nth-child(2)").each(function() 
			{
                if ($("#filter").val().toLowerCase() != $(this).text().substr(0, $("#filter").val().length).toLowerCase()) 
				$(this).parent().fadeOut(FadeOutSpeed);
                else 
				$(this).parent().fadeIn(FadeInSpeed);               
            });					
        });	

		/* кнопка продления лицензии */
		function ShowBuyButton()
		{
			$("#header_block").append("<button class='header_block_button' id='header_buy_button' title='продлить'>продлить</button>");					
			$("#header_buy_button").click(function() 
			{
				ShowOplataWindow("");
			});			
		}
		
		$.ajax
		({
			url: "server.php",
			data: { "func": "GetOplataEndDays" },
			async: false,
			success: function(data) 
			{							
				obj = jQuery.parseJSON(cleanString(data));
				if (obj.answer == "error") error(obj.string);
				if (obj.answer == "success") 
				{											
					//obj.string=3;
					if (obj.string==0)
					{ 
						end_period=true;												
						ShowBuyButton();						
						$( ".header_block_button" ).not("#show_main_screen, #header_buy_button").attr("disabled", "true");													
						$("#zadanie").hide();
						ShowOplataWindow("лицензия окончена!") 
					}
					else
					if (obj.string <= 3)
					{
						switch(obj.string)
						{
							case 3: case 2: str1='осталось'; str2="дня"; break;							
							default: str1='осталcя'; str2="день"; break;
						}
						noty 
						({
							text         : 'До окончания работы лицензии '+str1+' '+obj.string+' '+str2,
							type         : 'warning',
							dismissQueue : true,
							killer       : true,
							layout       : 'topCenter',
							theme        : 'defaultTheme',
							timeout		 : 10000,
							animation: 
							{
								open:  'animated bounceInRight',
								close: 'animated bounceOutLeft',
							},
							callback: 
							{
								onShow: function() 
								{					
									ShowBuyButton();
								},
								onCloseClick: function()
								{
									ShowOplataWindow("");
								}
							}
						});						
					}					
				}
			}
		});
		
		AutoFocus("#filter");
		ShowClock();
		
		/*
		----------------------------------------------
		первое приветствие
		----------------------------------------------
		*/
		if (SRV_GetVar("noty_welcome_msg")!="true")
		{
			noty 
			({
				text         : 'Добро пожаловать в ТурбоУчёт! Регистрируйтесь на форуме и получайте всю необходимую информацию.',
				type         : 'information',
				dismissQueue : true,
				killer       : true,
				layout       : 'topCenter',
				theme        : 'defaultTheme',
				timeout		 : 7000,
				animation: 
				{
					open:  'animated bounceInRight',   // Animate.css class names
					close: 'animated bounceOutLeft',   // Animate.css class names				
				},
				callback: 
				{
					onShow: function() 
					{					
						SRV_SetVar("noty_welcome_msg","true");
					}
				}
			});	
		}
		
		if (SRV_GetVar("noty_forum_visit")!="true")
		{
			if(getRandomInt(0,10)==0)
			{
				noty 
				({
					text         : 'Регистрируйтесь на форуме и получайте всю необходимую информацию!',
					type         : 'information',
					dismissQueue : true,
					killer       : true,
					layout       : 'topCenter',
					theme        : 'defaultTheme',
					timeout		 : 7000,
					animation: 
					{
						open:  'animated bounceInRight',   // Animate.css class names
						close: 'animated bounceOutLeft',   // Animate.css class names				
					}				
				});				
			}
		}
		
		ActiveElement = "PersonasScreen";	
        NProgress.done();
    }
    /*
	----------------------------
	  ГЛАВНЫЙ ЭКРАН
	----------------------------
	*/
    function ShowMainScreen() 
	{							
		
		NProgress.start();				
		CaptchaRestore();	/* восстановить капчу */		
		$.noty.closeAll();	/* закрыть все нотификации */											
				
		//SRV_ShowVars();	/* вывести в консоль все серверные переменные пользователя */				
				
		$("#wrapper").empty();
		$("#wrapper").append("<div id='auth_window'></div>");
        $("#wrapper").append("<div id='reg_window'></div>");
		
		/* 
		-------------------------------
		оптимизация фона
		-------------------------------
		*/
		switch($(window).width())
		{
			case 1280: image="moscow_1280x875.jpg"; break;
			case 1024: image="moscow_1024x700.jpg"; break;
			case 980:  image="moscow_980x670.jpg";  break;
			case 800:  image="moscow_800x547.jpg";  break;
			case 640:  image="moscow_640x438.jpg";  break;
			case 480:  image="moscow_480x329.jpg";  break;
			case 360:  image="moscow_800x547.jpg";  break;
			default:   image="moscow_1280x875.jpg"; break;
		}
		
        $("#wrapper").append("<img src='img/background/"+image+"' id='back_screen'></img>");		
		$("#wrapper").append("<div id='location'></div>");		
        $("#wrapper").append("<div id='title_block'></div>");
        $("#title_block").append("<div id='service_title'><ins>ТурбоУчёт</ins><span style='font-size:40%'>&reg;</span></div>");
        $("#title_block").append("<div id='service_desc'>универсальный электронный журнал</div>");				               		
				 
        $("#auth_window").fadeIn(FadeInSpeed);
		$("#auth_window").append("<h1><ins>вход</ins></h1>");
		
        if (localStorage.getItem("email") 	 == null) localStorage.setItem("email", "");
        if (localStorage.getItem("password") == null) localStorage.setItem("password", "");
        if (localStorage.getItem("email") 	 == "undefined") localStorage.setItem("email", "");
        if (localStorage.getItem("password") == "undefined") localStorage.setItem("password", "");
		
		/* поля авторизации */
        $("#auth_window").append("<div><input type='email' placeholder='email' id='auth_email' value='"+localStorage.getItem("email")+"' title='электронный адрес'></input></div>");
        $("#auth_window").append("<div><input type='password' placeholder='пароль' id='auth_password' value='"+localStorage.getItem("password")+"' title='пароль от системы'></input></div>");        
		$("#auth_window").append("<div class='link' id='open_restore_password_window' title='восстановить доступ'>забыли пароль?</div>");			
      
	    /*-----------------------------------------------------
		  восстановление пароля
		  -----------------------------------------------------*/	
        $("#open_restore_password_window").click(function() 
		{
            $("#auth_window").fadeOut(FadeOutSpeed);
            $("#password_restore_window").remove();
            $("#wrapper").append("<div id='password_restore_window'></div>");
            $("#back_screen1").fadeIn(FadeInSpeed);
            $("#password_restore_window").fadeIn(FadeInSpeed);
            $("#password_restore_window").append("<div id='password_restore_window_close' class='close_window' title='закрыть окно'>X</div>");
            $("#password_restore_window").append("<h2><ins>восстановление доступа</ins></h2>");
            $("#password_restore_window").append("<input type='email' placeholder='ваш email' title='укажите свой email' id='email_restore_input'/>");
            $("#password_restore_window").append("<br><button id='restore_password_button' class='green_button' title='восстановить пароль'>восстановить</button></br>");            
            AutoClick("#password_restore_window_close");
			
			/*-----------------------------------------------
			   enter
			 -----------------------------------------------*/
			$("#email_restore_input").keydown(function(event)
			{
				switch (event.keyCode) 
				{
					case 13: $(this).blur(); break;
				}
			});
           
			/* закрытие окна */
            $("#password_restore_window_close").click(function() 
			{
                $("#password_restore_window").fadeOut(FadeOutSpeed);
                $("#back_screen1").fadeOut(FadeOutSpeed);
                $("#auth_window").fadeIn(FadeInSpeed);
            });
         
		    /*------------------------------------------------
			  восстановить пароль
			  ------------------------------------------------*/	
            $("#restore_password_button").click(function() 
			{
                $.ajax
				({
                    url: "server.php",
                    data: 
					{
                        "func": "RestorePassword",
                        "email": $("#email_restore_input").val()
                    },
                    success: function(data) 
					{
                        obj = jQuery.parseJSON(cleanString(data));
                        if (obj.answer == "error") error(obj.string);
                        if (obj.answer == "warning") warning(obj.string);
                        if (obj.answer == "success") 
						{
                            success(obj.string);
                            $("#password_restore_window_close").trigger("click");
                        }
                    }
                });
            });
			ActiveElement = "RestoreWindow";
        });

        $("#auth_window").append("<div><table id='auth_table' width='100%'></table></div>");
        $("#auth_table").css("text-align", "center");
        $("#auth_table").css("border", "0");

        $("#auth_window input").keydown(function(event)
		{
            switch (event.keyCode) 
			{
                case 13: $(this).blur(); break;
            }
        });
		
        $("#auth_window").append("<div class='link' id='register'>регистрация</div>");       
		
		/*----------------------------------
		   регистрация
		  ----------------------------------*/
        $("#register").click(function() 
		{
            $("#back_screen1").fadeIn(FadeInSpeed);
            $("#auth_window").fadeOut(FadeOutSpeed);
            $("#reg_window").fadeIn(FadeInSpeed);
            $("#reg_window").empty();
            $("#reg_window").append("<div id='reg_window_close' class='close_window' title='закрыть окно'>X</div>");			
            
			/* закрытие окна */
			$("#reg_window_close").click(function()
			{
                $("#reg_window").fadeOut(FadeOutSpeed);
                CaptchaRestore();                                                
                ShowMainScreen();                
            });
			
			AutoClick("#reg_window_close");

            $("#reg_window").append("<h1><ins>регистрация</ins></h1>");
            $("#reg_window").append("<div id='reg_rect'></div>");
            $("#reg_rect").css("position", "absolute");
            $("#reg_rect").css("top", "21%");
			
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
            $("#reg_rect").append("<div>журнал<select id='reg_journal'></select></div>");
			$("#reg_journal").append("<option value='1' title='шаблон: универсальный'>универсальный</option>");			
			$("#reg_journal").append("<option value='2' title='шаблон: спортивная секция'>спортивная секция</option>");						
			$("#reg_journal").append("<option value='3' title='шаблон: курсы'>курсы</option>");
			$("#reg_journal").append("<option value='4' title='шаблон: школа'>школа</option>");            
			$("#reg_journal").append("<option value='5' title='шаблон: университет'>университет</option>");						
			$("#reg_journal").append("<option value='6' title='шаблон: соревнования'>соревнования</option>");
			$("#reg_journal").append("<option value='7' title='шаблон: кту работников'>кту</option>");			
//			$("#reg_journal").append("<option value='8' title='шаблон: эксперимент'>эксперимент</option>");		

			/*----------------------------
			  поля регистрации
			 ----------------------------*/
			$("#reg_rect").append("<input type='text' placeholder='ваше имя' id='reg_name' title='ваше имя'></input>");            
            $("#reg_rect").append("<input type='email' placeholder='email' id='reg_email' title='укажите личный email'></input>");
            $("#reg_rect").append("<input type='password' placeholder='пароль' id='reg_password' title='укажите пароль (минимум 5 символов)'></input>");
			$("#reg_rect").append("<div style='font-size:100%'>пробная версия - 15 дней</div>");            
            $("#reg_name").val(localStorage.getItem("UserName"));			
            $("#reg_rect").append($("#captcha"));
            $("#captcha").css("display", "block").css("margin", "2%");
            $("#reg_rect").append("<button id='reg' title='завершить регистрацию'>регистрация</button>");
						
			/* восстановить положение при потере фокуса */
            if (device.mobile() && device.portrait())
			{				
				$("#reg_window input").focus(function(event) 
				{				
					$("#reg_window").css("position","relative");
				}).blur(function(event) 
				{				
					$("#reg_window").css("position","fixed");
				});				
				
				/* закрыть при наведении пальцем */
				$("#reg_window_close").hover(function(event) 
				{
					$(this).click();
				});
			}
						
			/* потеря фокуса в регистрации */
            $("#reg_window input").keydown(function(event) 
			{
                switch (event.keyCode) 
				{
                    case 13:
					{						
						$(this).blur(); 
						break;
					} 
                }
            });

			/*-------------------------------------
			  РЕГИСТРАЦИЯ
			  -------------------------------------*/
            $("#reg").click(function() 
			{								
                $.ajax
				({
                    url: "server.php",
                    data: 
					{
                        "func": "RegUser",
                        "name":	$("#reg_name").val(),
                        "email": $("#reg_email").val(),
                        "password": $("#reg_password").val(),                       
						"journal": $("#reg_journal").val(),                        
                        "g-recaptcha-response": grecaptcha.getResponse()
                    },
                    method: "POST",
					error: function(jqXHR, textStatus)
					{
						if(textStatus == 'timeout') TimeOutError();												
					},					
                    success: function(data) 
					{						
                        obj = jQuery.parseJSON(cleanString(data));
                        if (obj.answer == "email_is_occupied") warning("эта почта занята!");
                        if (obj.answer == "warning") warning(obj.string);
                        if (obj.answer == "error") error(obj.string);
                        if (obj.answer == "success") 
						{							                            
							localStorage.clear();
                            localStorage.setItem("email",    $("#reg_email").val());
                            localStorage.setItem("password", $("#reg_password").val());
							UserName = $("#reg_name").val();
                            CaptchaRestore();
							ShowPersonasScreen();        
                        }
                    }, timeout:timeout
                });
            });
			ActiveElement = "RegWindow";
        });
		
		$("#auth_window").append("<img src='img/vk_hor.png' title='Вход через соц.сеть ВКонтакте' id='vk_auth'></img>");
				
		
		/*
		--------------------------------------------
		авторизация через соц. сеть ВКонтакте
		--------------------------------------------*/		
		function authInfo(response)
		{			
			if (response.session) 
			{				
				VK.Api.call('users.get', { uids: response.session.mid, fields: 'contacts' }, 
				function(r) 
				{             
					if (r.response) 
					{                 
						if (r.response[0].first_name) 
						{							
							$.ajax
							({
								url: "server.php",
								data: 
								{
									"func": "AuthVKUser",
									"vk_id": response.session.mid,
									"login": r.response[0].first_name+" "+r.response[0].last_name
								},
								method: "POST",
								async: false,
								error: function(jqXHR, textStatus)
								{
									if(textStatus == 'timeout') TimeOutError();												
								},					
								success: function(data) 
								{						
									obj = jQuery.parseJSON(cleanString(data));                        
									if (obj.answer == "warning") warning(obj.string);
									if (obj.answer == "error") error(obj.string);
									if (obj.answer == "success") 
									{																	
										NProgress.done();														
										SRV_SetVar("resolution", $(window).width()+"x"+$(window).height());
										UserName = obj.string;																		
										ShowPersonasScreen();
										noty 
										({
											text         : 'Вы вошли через ВКонтакт',
											type         : 'information',
											dismissQueue : true,
											killer       : true,
											layout       : 'topCenter',
											theme        : 'defaultTheme',
											timeout		 : 4000,
											animation: 
											{
												open:  'animated bounceInRight',   // Animate.css class names
												close: 'animated bounceOutLeft',   // Animate.css class names				
											},
											callback: 
											{
												onShow: function() 
												{															
												}
											}
										});
									}
								}, timeout:timeout
							});														
						}         
					}         
				});																
			}
			else 
			{
				warning("Для продолжения требуется авторизация в ВКонтакте!");
			}
		}
		
		/* --- вход через VK --- */
		$("#vk_auth").click(function() 
		{									
			VK.init({ apiId: 5040581 });
			VK.Auth.login(authInfo);			
		});
		
		$("#auth_window").append("<br><button id='auth' title='войти в систему'>войти</button></br>");		
        AutoClick("#auth");
		
		/*------------------------------
		  авторизация
		  ------------------------------*/		
        $("#auth").click(function() 
		{
			NProgress.start();
			
			localStorage.clear();
			localStorage.setItem("email", 	 $("#auth_email").val());
			localStorage.setItem("password", $("#auth_password").val());
			
            if ($("#auth_email").val().length == 0)
			{
				NProgress.done();				
				warning("укажите почту");
			}
            else
            if ($("#auth_password").val().length == 0)
			{
				NProgress.done();				
				warning("укажите пароль");
			}
            else
                $.ajax
				({
                    url: "server.php",
                    data: 
					{
                        "func": "AuthUser",
                        "email": $("#auth_email").val(),
                        "password": $("#auth_password").val()
                    },					
					error: function(jqXHR, textStatus)
					{
						if(textStatus == 'timeout')	TimeOutError();													
					},
                    success: function(data) 
					{    						                        						
						obj = jQuery.parseJSON(cleanString(data));						
                        if (obj.answer == "error")
						{								
							NProgress.done();
							error(obj.string);							
						}                     
						if (obj.answer == "success") 
						{                                                        
							NProgress.done();														
							SRV_SetVar("resolution", $(window).width()+"x"+$(window).height());
							UserName = obj.string;								
                            ShowPersonasScreen();
                        }                        												            
						if (obj.answer == "auth_input_data_error")
						{ 
							NProgress.done();							
							error("указаны не верные данные");							
						}
                    }, timeout: timeout
                });								
        });

		$("#wrapper").append("<div class='link' id='doc' title='дополнительная информация'>подробнее</div>");				

	$("#doc").click(function()
        {		  	
			$("body").append("<div class='full_screen_block' id='doc_wrapper'></div>");
			$("#doc_wrapper").load( "/doc/index.php", function() 
			{  												
				$("#return_from_doc").click(function()
				{
					$("#doc_wrapper").remove();				
				});				
				
				$("#dogovor").click(function()
				{
					window.open('/doc/dogovor_oferta.pdf', '_blank');
				});
				
				SetKeydown();
				ActiveElement="Doc";
			});			
	});                             



		ActiveElement = "MainScreen";
		NProgress.done();		
    }
	
	ShowMainScreen(); 	// отобразить главный экран
	SetKeydown(); 		// установить обработчики нажатия
	
});