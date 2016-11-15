// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------
function ShowGroupSettingsWindow(parent, group_id, group_element, group_date_reg)
{
	var title = "";
	
	$("#wrapper").append("<div class='group_settings_wnd' id='group_settings'></div>")
	$("#group_settings").empty();
	$("#group_settings").append("<div id='group_settings_wnd_close' title='закрыть окно' class='close_window'>X</div>");						
	
	/* закрытие окна */
	$("#group_settings_wnd_close").click(function()
	{
		$("#group_settings").fadeOut(FadeOutSpeed);
		$("#back_screen1").fadeOut(FadeOutSpeed);		
	});
	
	AutoClick("#group_settings_wnd_close");
	
	switch(parent)
	{
		case "MOUSE": 		title="свойства группы";  break;
		case "NEW_GROUP": 	title="новая группа"; 	  break;
	}
	$("#group_settings").append("<h2><ins>"+title+"</ins></h2>")
	$("#group_settings").append("<h4 class='no_margin_no_padding'>"+group_date_reg+"</h4>")
	$("#group_settings").append("<div><input type='text' placeholder='имя группы' id='group_settings_name' title='имя группы'></input></div>")
	$("#group_settings").append("<div><input type='text' placeholder='ед.изм.' id='group_settings_unit' title='название единицы измерения данных в группе'></input></div>")
	$("#group_settings").append("<div><button class='green_button' id='save_group_changes'>сохранить</button></div>")
	// -------------------------------------------------------------------
	// потеря фокуса
	// -------------------------------------------------------------------
	$("#group_settings_name, #group_settings_unit").keydown(function(e)
	{
		switch (e.keyCode)
		{
			case 13: $(this).blur(); break;
		}
	});	
	/*-------------------------------------------
	  сохранить инфу
	  -------------------------------------------*/
	$("#save_group_changes").click(function() 
	{
		$.ajax
		({		
			url: "server.php",
			data: 
			{	
				"func": "SaveGroupInfo",
				"group_id": group_id,
				"group_name": $("#group_settings_name").val(),
				"group_unit": $("#group_settings_unit").val(),
			},
			method: "POST",							
			success: function(data) 
			{
				obj = jQuery.parseJSON(cleanString(data));
				if (obj.answer == "error") error(obj.string);
				if (obj.answer == "success") 
				{																					
					$("#group_settings_wnd_close").trigger("click");
					group_element.find(".group_item_name").text($("#group_settings_name").val());
					$("#back_screen1").fadeOut(FadeOutSpeed);
				}
			}
		});						
	});
	/*-------------------------------------------
	  получить инфу
	  -------------------------------------------*/
	$.ajax
	({		
		url: "server.php",
		data: 
		{
			"func": "GetGroupInfo",
			"group_id": group_id,
		},				
		success: function(data) 
		{
			obj = jQuery.parseJSON(cleanString(data));
			if (obj.answer == "error") error(obj.string);
			if (obj.answer == "success") 
			{													
				$("#group_settings_name").val(obj.string[0].name);
				$("#group_settings_unit").val(obj.string[0].unit);
				$("#back_screen1").fadeIn(FadeInSpeed);
				$("#group_settings").show();
				ActiveElement="GroupSettings";
			}
		}
	});	
}
		