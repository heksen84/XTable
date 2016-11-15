// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------
function ShowSettings()
{
	$("#back_screen1").fadeIn(FadeInSpeed);
    $("#wrapper").append("<div id='settings_wnd'></div>");    
    $("#settings_wnd").fadeIn(FadeInSpeed);
    $("#settings_wnd").empty();
    $("#settings_wnd").append("<div id='close_set_window' class='close_window' title='закрыть окно'>X</div>");       
    AutoClick("#close_set_window");
	
	/* закрытие окна */
	$("#close_set_window").click(function() 
	{		        
		$("html, body").animate({scrollTop:0}, 0);
		$("#settings_wnd").fadeOut(FadeOutSpeed);
        $("#back_screen1").fadeOut(FadeOutSpeed);
        ActiveElement = "PersonasScreen";
		CaptchaRestore();		
    });	

    $("#settings_wnd").append("<h1><ins>настройки</ins></h1>");			          
	$("#settings_wnd").append("<input type='text'     placeholder='имя' 		   id='user_name' 		 title='имя пользователя'></input>");
    $("#settings_wnd").append("<input type='email'    placeholder='email' 	   	   id='user_email'       title='email пользователя'></input>");
    $("#settings_wnd").append("<input type='password' placeholder='текущий пароль' id='current_password' title='текущий пароль пользователя'></input>");
    $("#settings_wnd").append("<input type='password' placeholder='новый пароль'   id='new_password'     title='новый пароль пользователя'></input>");
	
	// отобразить роли
	if (journal=="0")
	{
		$("#settings_wnd").append("<div class='link' id='profession_link_settings' title='управление ролями'>роли</div>");
	}
	
	if (device.mobile())
	{
		$("#settings_wnd input").focus(function(event) 
		{							
			$("#settings_wnd").css("position","relative");			
		}).blur(function(event) 
		{				
			$("#settings_wnd").css("position","fixed");
		});
		
		/* hover auto-click */
		$("#close_set_window").hover(function(event) 
		{
			$(this).click();
		});
	}
	// --------------------------------------------------
	// ENTER
	// --------------------------------------------------
	$("#settings_wnd input").keypress(function(event)
	{
		switch (event.keyCode) 
		{     
			case 13: $(this).blur(); break;					
		}
	});	
	/*----------------------------------
	  показать настройки
	  ----------------------------------*/
    $.ajax
	({
        url: "server.php",
        data: { "func": "GetUserSettings" },
		async:false,
        success: function(data) 
		{					
            obj = jQuery.parseJSON(cleanString(data));
            if (obj.answer == "error") error(obj.string);
            if (obj.answer == "success") 
			{   																		
				$("#user_name").val(obj.string.name);
				$("#user_email").val(obj.string.email);								
				AuthKey=obj.string.auth_key;
				console.log("ключ: "+obj.string.auth_key);
            }
        }
    });
	/*----------------------------------
	  обработка ролей
	  ----------------------------------*/	
	$("#profession_link_settings").click(function() 
	{                
        ShowProfessionWindow("PARENT_SETTINGS");
    });

    $("#settings_wnd").append($("#captcha"));    
    $("#settings_wnd").append("<br><button id='save_settings' title='сохранить настройки'>сохранить</button></br>");			
	$("#captcha").css("display", "block");
    AutoClick("#save_settings");
	
	/* 
	-------------------------------------
	сохранить настройки
	-------------------------------------
	*/	
    $("#save_settings").click(function() 
	{
        $.ajax
		({
            url: "server.php",
            data: 
			{
                "func": 				"SaveUserSettings",
                "name": 				$("#user_name").val(),
                "email": 				$("#user_email").val(),
                "current_password": 	$("#current_password").val(),
                "new_password": 		$("#new_password").val(),
                "g-recaptcha-response": grecaptcha.getResponse()
            },
            method: "POST",
            success: function(data) 
			{
                obj = jQuery.parseJSON(cleanString(data));
                if (obj.answer == "error") error(obj.string);                
                if (obj.answer == "success") 
				{
                    $("#settings_wnd").fadeOut(FadeOutSpeed);
                    $("#back_screen1").fadeOut(FadeOutSpeed);
                    localStorage.setItem("password", obj.new_password);
                    CaptchaRestore();
                }
            }
        });
    });
	ActiveElement = "WND_Settings";
}