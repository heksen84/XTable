// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------			
var month_summ = 240;
/*
----------------------------------
 ОПЛАТА
----------------------------------*/
function ShowOplataWindow(title)
{	
	
	$("#wrapper").append("<div id='oplata_window'></div>");
	$("#oplata_window").empty().append("<div id='close_oplata_window' class='close_window' title='закрыть окно'>X</div>").show();	
		
	/* закрыть окно */
	$("#close_oplata_window").click(function()
	{
	  $("#oplata_window").hide();
	  ActiveElement="PersonasScreen";	  
    });	
	
	$("#oplata_window").append("<table id='oplata_table'></table>");	
	if (title == "")
	{
		$("#oplata_table").append("<tr><td colspan='2'><ins><h2>продлить</h2></ins></td></tr>");
	}
	else
	$("#oplata_table").append("<tr><td colspan='2'><ins><h2>"+title+"</h2></ins></td></tr>");
    $("#oplata_table").append("<tr><td>№ ордера</td><td style='color:rgb(200,250,250)'>###</td></tr>");
	$("#oplata_table").append("<tr><td>№ магазина</td><td style='color:rgb(200,250,250)'>###</td></tr>");
	$("#oplata_table").append("<tr><td>срок продления</td><td><select id='srok_oplaty'></select></tr>");
	$("#oplata_table").append("<tr><td>сумма</td><td style='color:yellow' id='service_price'></td></tr>");
    $("#srok_oplaty").append("<option value='1'>1 месяц</option>");
	$("#srok_oplaty").append("<option value='2'>2 месяца</option>");
	$("#srok_oplaty").append("<option value='3'>3 месяца</option>");
	$("#srok_oplaty").append("<option value='4'>4 месяца</option>");
	$("#srok_oplaty").append("<option value='5'>5 месяцев</option>");
	$("#srok_oplaty").append("<option value='6'>6 месяцев</option>");
	$("#srok_oplaty").append("<option value='7'>7 месяцев</option>");
	$("#srok_oplaty").append("<option value='8'>8 месяцев</option>");
	$("#srok_oplaty").append("<option value='9'>9 месяцев</option>");
	$("#srok_oplaty").append("<option value='10'>10 месяцев</option>");
	$("#srok_oplaty").append("<option value='11'>11 месяцев</option>");
	$("#srok_oplaty").append("<option value='12'>12 месяцев</option>");
	
	$("#srok_oplaty").change(function(){
		$("#service_price").text($(this).val()*month_summ+" руб.");
	}).trigger("change");
	
	$("#oplata_table").append("<tr><td colspan='2'><input type='radio' name='paymentType' value='PC'><b>Оплата кошельком</b></td></tr>");	
	$("#oplata_table").append("<tr><td colspan='2'><input type='radio' name='paymentType' value='AC'><b>Оплата с помощью любой кредитной карты</b></td></tr>");	
	$("#oplata_table").append("<tr><td colspan='2'><input type='radio' name='paymentType' value='MC'><b>Оплата со счета мобильного телефона</b></td></tr>");	
	$("#oplata_table").append("<tr><td colspan='2'><input type='radio' name='paymentType' value='GP'><b>Оплата через кассы и банкоматы</b></td></tr>");	
	$("#oplata_table").append("<tr><td colspan='2'><input type='radio' name='paymentType' value='WM'><b>Оплата кошелька WebMoney в системе</b></td></tr>");	
	$("#oplata_table").append("<tr><td colspan='2'><input type='radio' name='paymentType' value='SB'><b>Интернет Оплата через Сбербанк</b></td></tr>");	
	$("#oplata_table").append("<tr><td colspan='2'><input type='radio' name='paymentType' value='AB'><b>Оплата через Интернет AlphaClick</b></td></tr>");	
	$("#oplata_table").append("<tr><td colspan='2'><button type='submit' class='green_button' id='buy'>оплата</button></td></tr>");	

	
    /*------------------------------
		оправка формы
	 ------------------------------*/	
	$("#buy").click(function()
	{
		$.ajax
		({
			url: "server.php",
			data: { "func": "UserBuy", "months": $("#srok_oplaty").val() },
			method: "POST",
			async:false,
			success: function(data) 
			{					
				obj = jQuery.parseJSON(cleanString(data));
				if (obj.answer == "error") error(obj.string);
				if (obj.answer == "success") 
				{  										
					$("#header_buy_button").remove();
					$("#close_oplata_window").trigger("click");
					$("#zadanie").show();
					$( ".header_block_button" ).not("#show_main_screen").removeAttr('disabled');					
					end_period=false;					
					SetPersonalTableHandlers();
					success(obj.string);					
				}
			}
		});	
	});		

	ActiveElement="OplataWindow";
	//SetKeydown();
}