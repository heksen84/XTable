// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------
var spec_name 	     = "";
var profession_index = 0;
var profession_id    = 0;

function SetProfessionTableHandlers()
{
 $("#profession_table .selected").click( function()
 {
  profession_id = $(this).data("id");
  profession_index = $(this).index();
  spec_name = $(this).children().eq(1).text();
  $("#profession_table .selected").css("background", "");
  $(this).css("background", "rgb(200,200,100)");
 });
}
function UpdateProfessionTable()
{
 for (var i=0;i<$("#profession_table .selected").length;i++)
 $("#profession_table .selected td:first-child").eq(i).text(i+1);
}
function ShowProfessionWindow(parent)
{
	  var i=1;
      var last_num = 0;

      $("#wrapper").append("<div id='profession_window'></div>");      
      $("#profession_window").empty();
      $("#profession_window").append('<div id = "close_profession_window" class = "close_window" title="закрыть окно">X</div>');      
      $("#profession_window").append("<h1><ins>роли</ins></h1>");
      $("#profession_window").append("<input type='text' id='input_profession_name'  placeholder='новая роль' title='наименование роли'></input>");
      $("#profession_window").append("<button class='green_button' id='add_profession_button' title='добавить роль'>+</button>");
      $("#profession_window").append("<button class='green_button' id='remove_profession_button' title='удалить роль'>-</button>");
	  AutoClick("#close_profession_window");
	  
	  /* закрытие окна */
	  $("#close_profession_window").click( function()
      {        
        switch(parent)
        {
          case "PARENT_SETTINGS":
          {				
           ActiveElement="WND_Settings";
           break;
          }
          case "PARENT_PERSONA_INFO": 
          { 
            GetProfessionList();
            ActiveElement="PersonaInfoWindow";
			break;
          }
        }			
        $("#profession_window").fadeOut(FadeOutSpeed);
      });
	  
	  if (device.mobile())
	  {
			$("#profession_window input").focus(function(event) 
			{				
				$("#profession_window").css("position","relative");
			}).blur(function(event) 
			{				
				$("#profession_window").css("position","fixed");
			});
			
			/* hover auto-click */
			$("#close_profession_window").hover(function(event) 
			{
				$(this).click();
			});
	  }
      
	  /* потеря фокуса */
	  $("#profession_window input").keydown(function(event)
      {
        switch (event.keyCode) 
        {     
          case 13:
          {
           if ( i == $("#profession_window input").length )
           {                 
			 i=1;
             $(this).blur(); 
             $("#add_profession_button").trigger("click");                
             break;
           }
           $("#profession_window input").eq(i).focus(); i++; 
           break;
		  }
        }
      });     
	  // -------------------------------------------	  
	  // добавить профессию
	  // -------------------------------------------
      $("#add_profession_button").click( function()
      {           
       if ($("#input_profession_name").val()!="")
	   $.ajax
       ({
        url:  "server.php",
        data: { "func": "SaveProfession", "profession_name": $("#input_profession_name").val() },
        method: "POST",			
        success: function( data )
        {	
         obj = jQuery.parseJSON(cleanString(data));
		 if (obj.answer == "error") error(obj.string);
		 if (obj.answer == "warning") warning(obj.string);
		 if (obj.answer == "success") 
		 {
            $("#profession_table").append("<tr class='selected' data-id="+obj.string+"><td>"+(last_num=last_num+1)+"</td><td>"+$("#input_profession_name").val()+"</td></tr>");                
			$("#input_profession_name").val("");
			SetProfessionTableHandlers(); 
			UpdateProfessionTable();				
		 }
	    }
       });
      });
	  /*------------------------------------------------
		 удаление роли
		------------------------------------------------*/
      $("#remove_profession_button").click( function()
      {
        if (spec_name == "") warning("Выберите роль из списка.")
	    else
	    swal
           ({ title: "Удалить роль?",  
	       text:  spec_name,   
	       type: "warning",   
	       showCancelButton: true,   
	       confirmButtonColor: "#DD6B55",   
	       confirmButtonText: "Да",   
	       cancelButtonText: "Нет",   
	       closeOnConfirm: true,   
	       closeOnCancel: true,
		   allowEscapeKey: true		   
	    }, 
	    function(isConfirm)
		{   
		 if (isConfirm) 
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
		 }  
      	});
      });
	  
	  $("#profession_window").append("<div id='profession_wrapper'></div>");
      $("#profession_wrapper").append("<table id='profession_table'></table>");
      $("#profession_table").append("<thead><tr><th id='profession_num'>№</th><th id='profession_name' title='наименование должности, профессии или роли'>наименование</th></tr></thead>");
	  
	  // -----------------------------------
	  // получить список профессий / ролей
	  // -----------------------------------
	  $.ajax
      ({
		url:  "server.php",
		data: {"func": "GetProfessionList", "group_id": GroupId},
		async:false,	   
		success: function( data )
		{	
			obj = jQuery.parseJSON( cleanString(data) );
			if (obj.answer == "warning") warning(obj.string);
			if (obj.answer == "error") error(obj.string);
			if (obj.answer == "success") 
			{	                
				$.each(obj.string, function(i, item) 
				{
					last_num=i+1;
					$("#profession_table").append("<tr data-id="+item.id+" class='selected'><td>"+last_num+"</td><td title='"+item.id+"'>"+item.profession_name+"</td></tr>");
				});			
				UpdateProfessionTable();
				SetProfessionTableHandlers();				
			}
        }
	   });          
	   $("#profession_window").fadeIn(FadeInSpeed);
	   ActiveElement = "ProfessionWindow";
}