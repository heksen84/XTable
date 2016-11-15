// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------
var SavedValue = null;
var new_image_loaded = 0;
var image_file_name	 = "";

/* обработчики меню через мышь */
function SetMouseMenuEvents()
{				   
	/* группы */
    $.contextMenu
    ({
        selector: "#group_menu li",
        callback: function(key, options) 
		{								
			var group_index     = $(this).index();
			var group_id 	    = $("#group_menu li").eq(group_index).data("id");
			var group_date_reg 	= $("#group_menu li").eq(group_index).attr("title");
			var group_element 	= $("#group_menu li").eq(group_index);
			
			switch(key)
			{														
				case "edit":
				{
					$("#group_menu li").eq(group_index).trigger("dblclick");
					break;
				}										
				case "delete":
				{																		
					swal({
					title: "Удалить?",
					text: $("#group_menu li").eq(group_index).find(".group_item_name").text(),
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
								"GroupId": group_id
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
									$("#group_menu li").eq(group_index).remove();
									$("#group_menu li").eq(localStorage.getItem("last_selected_punkt")).css("text-decoration", "underline");
									$("#group_menu li").eq(group_index).trigger("click");
									$("#group_count").text(parseInt($("#group_count").text())-1);										
									localStorage.setItem("last_selected_punkt", group_index);
									if ($("#group_menu li").length == 0)
									{
										$("#main_table tbody").empty();
										localStorage.setItem("last_selected_punkt", 0);
									}									
								}
							}
						});
					}
				});									
				break;
				}																	
			    case "clear":
				{
					if ( $("#group_menu li").eq(group_index).find(".personal_count").text() == "0" ) error("группа пустая");
					else
					swal({
					title: "Очистить?",
					text: $("#group_menu li").eq(group_index).find(".group_item_name").text(),
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
							url:  "server.php",
							data: {func:"CleanGroup", "group_id": group_id},
							method: "POST",
							success: function( data )
							{
								obj = jQuery.parseJSON( cleanString(data) );
								if (obj.answer == "warning") warning(obj.string);
								if (obj.answer == "error") error(obj.string);
								if (obj.answer == "success")
								{				
									$("#group_menu li").eq(group_index).find(".personal_count").text("0");					
									$("#main_table tbody tr").remove();
								}
							}
						});
					}
				});							
					break;						
				}
				case "settings":
				{					
					ShowGroupSettingsWindow( "MOUSE", group_id, group_element, group_date_reg );					
					break;
				}
			}
		},
        items: 
        {
            "edit":   	 { name: "Переименовать", icon: "edit"},            
			//"settings":  { name: "Свойства", 	  icon: "edit"},
			"clear":  	 { name: "Очистить", 	  icon: "cut"},
			"delete": 	 { name: "Удалить",  	  icon: "delete"},
            "sep1":"---------",
            "quit":   	 { name: "Отмена", icon: function()
            {
                return 'context-menu-icon context-menu-icon-quit';
            }}
        }
    });
	
	$.contextMenu
	({
        selector: "#profession_table .selected",
        callback: function(key, options) 
		{
            var profession_id    = $(this).data("id"); 
            var profession_index = $(this).index();
			switch(key)
			{
			 case "delete":
             { 
              $.ajax
			  ({
        	     url:  "server.php",
        	     data: { "func": "DeleteProfession", "id": profession_id },
        	     method: "POST",
        	     success: function( data )
        	     {	
					obj = jQuery.parseJSON( cleanString(data) );
					if (obj.answer == "warning") warning(obj.string);
					if (obj.answer == "error") error(obj.string);
					if (obj.answer == "success") 
					{
						$(".selected").eq(profession_index).remove();
						UpdateProfessionTable();
						spec_name = "";
					}
				}
               });		   
			   break; 
             }
            }

        },
        items: 
        {
            "delete": { name: "Удалить", icon: "delete"},
            "sep1":"---------",
            "quit":   { name: "Отмена", icon: function()
            {
                return 'context-menu-icon context-menu-icon-quit';
            }}
        }
    });
	
	/* записи */
    $.contextMenu
    ({
        selector: '#main_table .col_fio',
        callback: function(key, options) 
		{
			PersonaId = $(this).parent().data("id");
			tr_index = $(this).parent().index();
			cur_persona_name = $("#main_table tr").eq(tr_index+1).find("td:eq(1)").text();
			
			switch(key)
			{
				case "edit": $(this).trigger("click"); break;
				case "delete": $("#del_persona").trigger("click"); break;
				case "info": ShowPersonaInfoWindow(PersonaId); break;
			}
        },
        items: 
        {
            "edit":    { name: "Переименовать", icon: "edit"},
            "delete":  { name: "Удалить", 	    icon: "delete"},
            "info":    { name: "Данные", 	    icon: "add"},			
            "sep1":"---------",
            "quit":   { name: "Отмена", icon: function()
            {
                return "context-menu-icon context-menu-icon-quit";
            }}
        }
    });
	
	/*---------------------------------------------------
	 сохранить заметку
	 ----------------------------------------------------*/
	function SaveNote(cell,type,value_id,note_input)
	{			
		$.ajax
		({
			url:  "server.php",
			data: {"func":"SaveNote", "value_id": value_id, "note_input": note_input},
			method: "POST",
			success: function( data )
			{   					
				var obj = jQuery.parseJSON( cleanString(data) );
				if (obj.answer == "error") error(obj.string);
				if (obj.answer == "success")
				{	
					switch(type)
					{
						case "NoteEmpty": cell.css("color", "white");  break;
						case "NoteFull":  cell.css("color", "yellow"); break;
					}						
				}
			}
		}); 						
	}
	/*-------------------------------------
	  показать заметку
	 --------------------------------------*/
	function ShowNotyWindow(cell,value_id)
	{
		$.ajax
			({
				url:  "server.php",
				data: { "func": "GetNote", "value_id": value_id },				
				success: function( data )
				{						
				 var obj = jQuery.parseJSON( cleanString(data) );
				 if (obj.answer == "error") error(obj.string);
				 if (obj.answer == "success")
				 {
					$("#back_screen1").fadeIn(FadeInSpeed);
					$("#make_a_note_window").remove();
					$("#wrapper").append("<div id='make_a_note_window'></div>");				
					$("#make_a_note_window").append("<div id = 'close_make_a_note_window' class = 'close_window' title='закрыть окно'>X</div>");
					$("#make_a_note_window").append("<h1><ins>заметка</ins></h1>");
					$("#make_a_note_window").append("<div id='zam_small_text'>"+CurrentDate+"</div>");
					$("#make_a_note_window").append("<textarea placeholder='текст заметки' id='note_input' title='текст заметки' maxlength='255'></textarea>");
					
					/* закрытие окна */
					$("#close_make_a_note_window").click( function()
					{
						$("#make_a_note_window").fadeOut(FadeOutSpeed);
						$("#back_screen1").fadeOut(FadeOutSpeed);
					});
					
					$("#make_a_note_window").append("<div><button class='green_button' id='save_note' title='сохранить заметку'>сохранить</button></div>");
					
					// ------------------------------------
					// OK
					// ------------------------------------
					$("#note_input").keydown(function(e)
					{
						switch (e.keyCode)
						{
							case 13: $(this).blur(); break;
						}
					});
			
					$("#save_note").click( function()
					{								
						if ($("#note_input").val() == "")
						{							
							SaveNote(cell,"NoteEmpty",value_id, $("#note_input").val());
							$("#close_make_a_note_window").trigger("click");
						}
						else
						{
							SaveNote(cell,"NoteFull",value_id, $("#note_input").val());
							$("#close_make_a_note_window").trigger("click");
						}
					});
					$("#note_input").val(obj.string[0].note);
					$("#make_a_note_window").fadeIn(FadeInSpeed);                   
					AutoClick("#close_make_a_note_window");
					AutoClick("#save_note");
					SetFocus("#make_input");
					ActiveElement="MakeANoteWindow";
				 }
				}
			});			
	}
    $.contextMenu
    ({
		selector: ".col_number",
		callback: function(key, options) 
		{	         	        	                        					
			var this_cell	 = $(this);						            
            var field_index  = $(this).index();			
			var tr_index 	 = $(this).parent().index();			
			var ValueId      = $(this).attr("data-id");			
			var PersonaId    = $(this).parent().data("id");						
			
			switch(key)
			{		 
				case "copy":
				{
					SavedValue = $(this).text();
					break;
				}		 
				case "paste":
				{			 								
					if ($(this).hasClass("archive"))	// если ячейка в архиве...
					{
						UseCalendar();					// ... сказать об этом						
						break;
					}
					if (SavedValue == undefined)
					{
						warning("отсуствует значение в буфере обмена");
						break;
					}					
					if (ValueId == "empty")
					{						
						$("body").append("<div id='informer'>вставка...</div>");
						$.ajax
						({
							url: "server.php",
							data: 
							{
								"func": 		"InsertValue",                        
								"value": 		SavedValue,
								"current_date": CurrentDate,
								"persona_id": 	PersonaId,
							},
							method: "POST",							
							success: function(data) 
							{								
								obj = jQuery.parseJSON(cleanString(data));
								if (obj.answer == "warning") 	warning(obj.string);
								if (obj.answer == "error") 		error(obj.string);
								if (obj.answer == "success") 
								{																																		
									this_cell.attr("data-id", obj.string);								
									this_cell.attr("title", SavedValue);                                                                        
									this_cell.text(SavedValue);
									$("#informer").remove();
								}
							}
						});				
						break;
					}
		
		if (this_cell.text() != SavedValue)
		{
			$("body").append("<div id='informer'>вставка...</div>");
			$.ajax
			({
                url: "server.php",
                data:
				{
                    "func": 	"UpdateValue",
					"value_id": $(this).data("id"), 
                    "value": 	SavedValue,
                },
                method: "POST",
                success: function(data) 
				{						
					obj = jQuery.parseJSON(cleanString(data));
					if (obj.answer == "warning") warning(obj.string);
					if (obj.answer == "error") error(obj.string);
					if (obj.answer == "success")
					{							
						this_cell.attr("title", SavedValue);
						this_cell.text(SavedValue);						
						$("#informer").remove();
						console.log("Вставлено :"+SavedValue);
					}
				}
            });
		}
		break;
	 }
	 case "edit":
	 { 
	   if ($(this).hasClass("archive"))
	   {
			UseCalendar();
			break;
	   }
	   $(this).trigger("click"); break;
	 }		 
	 case "note":
     {			   
               if ($(this).hasClass("archive"))
			   {
				   UseCalendar();
				   break;
			   }				   			   			   
			   if (ValueId == "empty")
			   {
				   $("body").append("<div id='informer'>вставка...</div>");
				   $.ajax
					({
						url: "server.php",
						data: 
						{
							"func": 		"InsertValue",
							"current_date": CurrentDate,
							"persona_id": 	PersonaId,								
							"value":		"0",								
						},
						method: "POST",
						success: function(data) 
						{																	
							obj = jQuery.parseJSON(cleanString(data));
							if (obj.answer == "warning") warning(obj.string);
							if (obj.answer == "error")   error(obj.string);
							if (obj.answer == "success")
							{										
								this_cell.text("0");
								this_cell.attr("title", "0");
								this_cell.attr("data-id", obj.string);
								ShowNotyWindow(this_cell, obj.string);
								$("#informer").remove();
							}
							console.log(data);
						}								
					});
			   }
			   else ShowNotyWindow(this_cell,ValueId);			   													
               break;
            }
        }		
        },
        items: 
        {
            "copy":   { name: "Копировать", icon: "copy" },
			"paste":  { name: "Вставить", 	icon: "paste"},
			"edit":   { name: "Изменить", 	icon: "edit" },
            "note":   { name: "Заметка",  	icon: "paste"},				
            "sep1":"---------",
            "quit":   { name: "Отмена", icon: function()
            {
              return 'context-menu-icon context-menu-icon-quit';
            }}
        }
    });		
}