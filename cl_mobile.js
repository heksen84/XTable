// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------
var local_text;
var local_data_id;
var local_tr_index;
var local_td_index;

/* ---- функция кнопки сохранить ---- */
function SaveActionValueFormData(data_id, tr_index, td_index)
{	
	$.ajax
	({
		url: "server.php",
		data: 
		{
			"func": "UpdateValue",									 
			"value": $("#mobile_enter_input_value").val(),
			"value_id": data_id,									
		},
		async: false,
		method: "POST",			
		success: function(data)
		{														    				
			obj = jQuery.parseJSON(cleanString(data));
			if (obj.answer == "warning") warning(obj.string);
			if (obj.answer == "error") error(obj.string);
			if (obj.answer == "success")
			{					
				$("#main_table tbody tr").eq(tr_index).find("td").eq(td_index).text($("#mobile_enter_input_value").val());				
			}
		}
	});
	
	/*
	---------------------
	сохранение
	заметки
	---------------------*/
	$.ajax
	({
		url:  "server.php",
		data: {"func":"SaveNote", "value_id": data_id, "note_input": $("#action_value_window_textarea").val()},
		method: "POST",
		async: false,
		success: function( data )
		{ 				
			var obj = jQuery.parseJSON( cleanString(data) );
			if (obj.answer == "error") error(obj.string);
			if (obj.answer == "success")
			{
				if ($("#action_value_window_textarea").val() != "")
				$("#main_table tbody tr").eq(tr_index).find("td").eq(td_index).css("color", "yellow");				
				else
				$("#main_table tbody tr").eq(tr_index).find("td").eq(td_index).css("color", "white");				
			}
		}
	});
	
	$("#close_action_value_window").trigger("click");
}
/*---------------------------------  
  окно ввода данных в ячейку 
  мобильной версии
 -----------------------------------*/
function ShowActionValueWindow(td_text, data_id, tr_index, td_index)
{						
	$("#wrapper").append("<div id='back_screen2'></div>");
	$("#action_value_window").remove();
	$("#wrapper").append("<div class='action_window' id='action_value_window'></div>");
	$("#action_value_window").append('<div id="close_action_value_window" class="close_window" title="закрыть окно">X</div>');                                						
	
	/* закрыть окно */
	$("#close_action_value_window").click(function()
	{
      $("#action_value_window").remove();
	  $("#back_screen2").remove();
      ActiveElement = "PersonasScreen";
    });		
	
	$("#action_value_window").append("<input type='text' id='mobile_enter_input_value' placeholder='значение'>");	
	
	/*----------------------------------------------------
	очистить поле ввода числа при фокусе
	 ----------------------------------------------------*/
	$("#mobile_enter_input_value").focus(function(event) 
	{				
		$(this).val("");
	});
	
	/*-----------------------------------------------------------------
	  потеря фокуса
	 ------------------------------------------------------------------*/
	$("#action_value_window input,textarea").keypress(function(event)
	{
		switch (event.keyCode) 
		{     
			case 13: $(this).blur(); break;					
		}
	});
			
	/* -------------------------------------------
	 1 - универсальный     (записи/группы)	 
	 2 - спортивная секция (ученики/группы)
	 3 - курсы 			   (ученики/группы)
	 4 - школа 			   (ученики/классы)
	 5 - университет 	   (студенты/группы)
	 6 - соревнования	   (участники/группы)
	 7 - кту		 	   (работники/группы)
	 8 - экперимент		   (объекты/группы)					   
	--------------------------------------------*/	
	
	$("#mobile_enter_input_value").val(td_text);	
	$("#action_value_window").append("<textarea placeholder='заметка' id='action_value_window_textarea'></textarea>");
	
	/* ---------------------
	   получаю заметку
	  ---------------------- */
	$.ajax
	({
		url:  "server.php",
		data: { "func": "GetNote", "value_id": data_id },
		async:false,
		success: function( data )
		{										 
		 var obj = jQuery.parseJSON( cleanString(data) );
		 if (obj.answer == "error") error(obj.string);
		 if (obj.answer == "success")
		 {										
			$("#action_value_window_textarea").val(obj.string[0].note);
		 }
		}
	});
		
	$("#action_value_window").append("<div><button class='green_button' id='close_action_value_window_button'>сохранить</button></div>");
	
	/* ----------------------------------
	   сохранить 
	   ----------------------------------*/
	$("#close_action_value_window_button").click(function() 		
	{					
		SaveActionValueFormData(data_id, tr_index, td_index);							
	});
	
	$("#back_screen2").show();
	$("#action_value_window").show();
	
	ActiveElement = "ActionValueWindow";
}

/*-----------------------------
   мобильные нажатия 
-----------------------------*/
function SetMobileListeners()
{						
	
	$(".col_number").click(function()
	{
		PersonaId = $(this).parent().data("id");
		tr_index  = $(this).parent().index();			
		cur_persona_name = $(this).parent().find("td:eq(1)").text();
	});
	
	// ------------------------
	// текущая запись
	// ------------------------
	$(".col_fio").click(function()
	{		
		tr_index  = $(this).parent().index();	
		ShowPersonaInfoWindow($(this).parent().data("id"));
	});
	
	// --------------------------------
	// текущий день
	// --------------------------------
	$(".active_day").click(function()
	{													
		local_this	   = $(this);
		local_text	   = $(this).text();
		local_data_id  = $(this).data("id");
		local_tr_index = $(this).parent().index();
		local_td_index = $(this).index();
		
		if ($(this).data("id")=="empty")
		{						
			$.ajax
			({
				url: "server.php",
				data: 
				{
					"func": "InsertValue",
					"current_date": CurrentDate,
					"persona_id": $(this).parent().data("id"),								
					"value": "0",								
				},
				async:false,
				method: "POST",				
				success: function(data) 
				{																	
					obj = jQuery.parseJSON(cleanString(data));
					if (obj.answer == "warning") warning(obj.string);
					if (obj.answer == "error") error(obj.string);
					if (obj.answer == "success")
					{																																																															
						local_this.data("id", obj.string);						
						ShowActionValueWindow(local_text, obj.string, local_tr_index, local_td_index);		
					}
				}								
			});
		}
		else ShowActionValueWindow(local_text, local_data_id, local_tr_index, local_td_index);
	});			
}