// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------
var isCtrl = false;
var isAlt  = false;

function SetKeydown()
{			
	$(document).keydown(function(event)
	{		
	
		if(event.keyCode == 17)
		{
			isAlt=false;		
			isCtrl=true;
		}
		if(event.keyCode == 18)
		{
			isAlt=true;		
			isCtrl=false;
		}		
				
		/*
		-------------------------------------
		удалить переменные пользователя
		-------------------------------------
		*/		
		if(event.keyCode == 67 && isAlt == true)
		{					
			SRV_DeleteVars();
			swal("переменные удалены","","info");
		}				
		/*
		-------------------------------------
		ctrl+Q - о сервисе
		-------------------------------------
		*/		
		if(event.keyCode == 81 && isCtrl == true && ActiveElement == "MainScreen")
		{		
			swal("РАЗРАБОТЧИК","Бобков И.Н.\nКазахстан г.Аксу\n2015-2017 г.","info");
		}			
		/*
		-------------------------------------
		alt+R - разрешение экрана
		-------------------------------------
		*/		
		if(event.keyCode == 82 && isAlt == true)
		{		
			swal("РАЗРЕШЕНИЕ",$(window).width()+"x"+$(window).height(),"info");
		}		
		/*
		-------------------------------------
		ctrl+Q - показать ключ авторизации
		-------------------------------------
		*/		
		if(event.keyCode == 81 && isCtrl == true && ActiveElement == "WND_Settings")
		{		
			
			$("#wrapper").append("<div id='authkey_window'/>");	
			$("#authkey_window").append("<div id='authkey_title'><ins>ключ</ins></div>");
			$("#authkey_window").append("<input type='text' value='"+AuthKey+"' readonly></input>");
			$("#authkey_window").append("<button id='authkey_window_close'>закрыть</button>");
			
			/* x */
			$("#authkey_window_close").click(function()
			{
				$("#authkey_window").remove();
				ActiveElement="WND_Settings";		  
			});
			
			$("#authkey_window").show();
			ActiveElement="AuthKeyWindow";			
		}
		
        switch (event.keyCode) {					
			case 27:				
				 if (ActiveElement == "OplataWindow") {					 
                    $("#close_oplata_window").trigger("click");
                    break;
                }
                if (ActiveElement == "ValueEditMode") {
                    $("#main_table input").blur();
                    ActiveElement = "PersonasScreen";
                    break;
                }
                if (ActiveElement == "WelcomeMessageScreen") {
                    $("#close_welcome_window").trigger("click");
                    ActiveElement = "PersonasScreen";
                    break;
                }
                if (ActiveElement == "ProfessionWindow") {
                    $("#close_profession_window").trigger("click");
                    break;
                }
                if (ActiveElement == "PersonaInfoWindow") {
                    $("#close_persona_info_window").trigger("click");
                    ActiveElement = "PersonasScreen";
                    break;
                }              
                if (ActiveElement == "MakeANoteWindow") {
                    $("#close_make_a_note_window").trigger("click");
                    ActiveElement = "PersonasScreen";
                    break;
                }
                if (ActiveElement == "RestoreWindow") {
                    $("#password_restore_window_close").trigger("click");
                    ActiveElement = "MainScreen";
                    break;
                }
                if (ActiveElement == "Statistica") {
					$("#close_stat_settings_window").trigger("click");
                    ActiveElement = "PersonasScreen";
                    break;
                }
                if (ActiveElement == "Calendar") {
                    $("#calendar_window_close").trigger("click");
                    ActiveElement = "PersonasScreen";
                    break;
                }
                if (ActiveElement == "TaskWindow") {
                    $("#task_window_close").trigger("click");
                    ActiveElement = "PersonasScreen";
                    break;
                }
                if (ActiveElement == "FeedBack_Window") {
                    $("#feedback_window_close").trigger("click");                    
                    ShowMainScreen();                    
                    ActiveElement = "MainScreen";
                }
                if (ActiveElement == "MobileGroupWindow") {
                    $("#mobile_group_window_close").trigger("click");
                    ActiveElement = "PersonasScreen";
                    break;
                }
                if (ActiveElement == "NewGroupWindow") {
                    $("#new_group_window_close").trigger("click");
                    ActiveElement = "BigGroupMenu";
                    break;
                }
                if (ActiveElement == "WND_Settings") {					
					$("#close_set_window").trigger("click");                                        
                    break;
                }               
                if (ActiveElement == "GroupMenu") { 					
                    $("#group_menu .group_item_name input").blur();                   
                    ActiveElement = "PersonasScreen";
                    break;
                }
                if (ActiveElement == "RegWindow") {                                        
                    $("#reg_window_close").trigger("click");
                    break;
                }
				if (ActiveElement == "ActionValueWindow") {					
                    $("#close_action_value_window").trigger("click");
					ActiveElement = "PersonasScreen";                    
                    break;
                }
				if (ActiveElement == "AuthKeyWindow") {					
                    $("#authkey_ok").trigger("click");					
                    break;
                }
				if (ActiveElement == "GroupSettings") {					
					$("#group_settings_wnd_close").trigger("click");
                    break;
                }
				if (ActiveElement == "SendingMessagesWindow") {					
					$("#sending_messages_window_close").trigger("click");
                    break;
                }
				if (ActiveElement == "Doc") {						
					$("#return_from_doc").trigger("click");
					ActiveElement = "MainScreen";					
                    break;
                }								
        }
    }).keyup(function(event) 
	{
	  if(event.which == 17) isCtrl=false;
	  if(event.which == 18) isAlt=false;
	});			
}