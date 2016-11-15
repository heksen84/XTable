// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный электронный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------
var stat_type = null;

/*
---------------------------
 СТАТИСТИКА
---------------------------*/
function ShowStatistica()
{	
	$("#stat_block").remove();		
    $("#wrapper").append("<div id='stat_block'></div>");	
	$("#stat_block").append("<div id='stat_block_settings'></div>").append("<div id='stat_block_content'></div>");	
	$("#stat_block_settings").append('<div id="hide_stat_settings_window" class="hide_window" title="свернуть окно">_</div>');
	$("#stat_block_settings").append('<div id="close_stat_settings_window" class="close_window" title="закрыть окно">X</div>');
	
	/*
	---------------------------------------------------
	свернуть
	---------------------------------------------------
	*/	
	$("#hide_stat_settings_window").click(function()
	{ 
		$("#stat_block_settings").hide();
		$("#stat_settings_button").show();
	}).hide();	
	
	/*
	---------------------------------------------------
	закрыть
	---------------------------------------------------
	*/
	$("#close_stat_settings_window").click(function()
	{ 
		$("#stat_block").remove();		
	});	    	   	    	
	
	$("#stat_block_settings").append("<h1><ins>отчёт</ins></h1>").append("<table id='stat_block_table'></table>");
	$("#stat_block_table").append("<tr><td><img src='img/bar_chart_9772.png' id='icon_graph' class='stat_icon' title='график'></img></td></tr>");
	
	/*
	----------------------------------
	выбор типа отчётности
	----------------------------------
	*/
	$(".stat_icon").click(function() 
	{
	  $("#icon_graph, #icon_table").css("border", "2px solid rgb(150,100,100)");
	  $(this).css("border", "2px solid yellow");
	  stat_type=$(this).index();		
	}).eq(0).trigger("click");
	
	$("#stat_block_table").append("<tr><td><ins>"+but_group_title+"</ins></td></tr>");
	$("#stat_block_table").append("<tr><td><select id='stat_group_list'></select></td></tr>");		
	$("#stat_block_table").append("<tr><td><ins>год</ins></td></tr>");
	$("#stat_block_table").append("<tr><td><input type='text' id='stat_input_year' title='год отчетности' maxlength='4'></input></td></tr>");	
	$("#stat_input_year").keypress(function(event)
	{
	  switch (event.keyCode) 
	  {
	  	case 13: $(this).blur(); break;
	  }
	});
	$("#stat_block_table").append("<tr><td><ins>месяц</ins></td></tr>");
	$("#stat_block_table").append("<tr><td><select id='stat_input_month'></select></td></tr>");
	$("#stat_input_year").val(moment(CurrentDate,"DD/MM/YYYY").year()).ForceNumericOnly();
	
	for (var i=0;i<12;i++) $("#stat_input_month").append("<option value='"+(i+1)+"' title='пробная версия сервиса'>"+Month[i]+"</option>");	
	
	$("#stat_input_month option[value='"+(moment(CurrentDate,"DD/MM/YYYY").month()+1)+"']").attr("selected",true);		
	$("#stat_block_table").append("<tr><td><button id='stat_report_button' title='сформировать отчёт' class='green_button'>отчёт</button></td></tr>");	
	
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
					$("#stat_group_list").append("<option value='"+item.id+"'>"+item.name+"</option>");
				});				
				$("#stat_group_list option[value='"+GroupId+"']").attr( "selected", true );				
			}
		}
    });			
	
	/*--------------------------------------------
	  статистика - график
	--------------------------------------------*/
	function ShowReportGraph(sub_title, data)
	{												
		var myAjaxChart = new Highcharts.Chart
		({
			title: 
			{			
				text: "отчёт"
			},
			subtitle: 
			{				
				text: sub_title
			},			
			chart: 
			{
				renderTo: "stat_block_content",
				type: "line"				
			},
			credits: 
			{			
				href: "https://www.turbouchet.ru",
				text: "ТурбоУчёт"
			},			
			legend: 
			{
				itemStyle: 
				{
					color: 'rgb(100,100,100)',
					fontWeight: 'bold',
					fontSize: '11px'
				},
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 2,				
			},						
			yAxis: 
			{
				title: 
				{ 
					text: 'значение'
				},
				plotLines: 
				[{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			plotOptions: 
			{
				column: 
				{
					pointPadding: 0.2,
					borderWidth: 0
				}
			},								
			series: data			
		});		
	}
        							
	/*------------------------------------------
	  отчетность
	 ------------------------------------------*/
	$("#stat_report_button").click(function() 
	{		
        if ($("#stat_input_year").val()=="") 
		{
			warning("год не указан");
		}
		else
		{
			NProgress.start();
			$("#stat_block_content").empty();			
			switch(stat_type)
			{				
				case 0:
				{	
					$.ajax
					({
						url: "server.php",
						data: 
						{
							"func": 	"GetValuesFromMonth",
							"group_id": $("#stat_group_list").val(),
							"month": 	$("#stat_input_month").val(),
							"year": 	$("#stat_input_year").val(),
							"start": 	0,
							"end": 		500,				
						},
						async:false,
						success: function(data) 
						{							
							obj = jQuery.parseJSON(cleanString(data));
							if (obj.answer == "warning") warning(obj.string);
							if (obj.answer == "error") error(obj.string);
							if (obj.answer == "success") 
							{						
								/*
								--------------------------
								заголовок отчёта
								--------------------------
								*/
								var sub_title=but_group_title+": "+$("#stat_group_list option:selected").text()+"<br>За "+$("#stat_input_month option:selected").text()+", "+$("#stat_input_year").val()+" г.</br>";
								var data=[];
								
								/*
								-----------------------------------------------------------
								заполняю инфо блок статистики именами и суммами итого
								-----------------------------------------------------------
								*/
								$.each(obj.string, function(i, item) 
								{									
								  data.push({"name": (i+1)+") "+item.fio+" [итого: "+item.summa+"]", "data": item.values})
								});								
								
								/*
								-----------------------------------
								показать график
								-----------------------------------
								*/
								ShowReportGraph(sub_title, data);
								$("#stat_block_settings").hide();
								$("#stat_block_content").append("<button class='green_button' id='stat_settings_button'>настройки</button>");								
								
								/*
								----------------------------------------------
								кнопка отчёт
								----------------------------------------------
								*/								
								$("#stat_settings_button").click(function()
								{										
									$(this).hide();
									$("#stat_block_settings").show();
									$("#hide_stat_settings_window").show();
								});
							}
						}
					});									
					break;
				}
			}		              			
			NProgress.done();
		}
	});		
	
    ActiveElement = "Statistica";
}