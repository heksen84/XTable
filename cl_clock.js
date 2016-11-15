// --------------------------------------------------------------------------------
// ТурбоУчёт(R)
// универсальный журнал
// Copyright 2015-2017(c)
// Developed by Ilya Bobkov
// AksuSoftworks(C)
// --------------------------------------------------------------------------------
function ShowClock() 
{
	var tag = 'div.time';
	var dots = digits = '';
	var digit = tag+' span';
	var span = digit+':nth-child';
	for (i=1; i<6; i++) for (k=1; k<6; k++) dots += '<b class="c'+i+k+'"/>';
	for (i=0; i<8; i++) digits += '<span/>';
	$(tag).append(digits);
	$(digit).append(dots);
	$(span+'(3), '+span+'(6)').removeAttr('class').addClass('colon');
	function time() {
		var date = new Date();
		var hou = date.getHours().toString();
		var min = date.getMinutes().toString();
		var sec = date.getSeconds().toString();
		hou = (hou<10)?0+hou:hou;
		min = (min<10)?0+min:min;
		sec = (sec<10)?0+sec:sec;
		$(digit+'.colon').css({opacity: 1}).each(function() {
			$(this).delay(400).animate({opacity: 0},250);
		})
		$(digit).removeAttr('class');
		$(span+'(1)').addClass('d'+hou.slice(0,1));
		$(span+'(2)').addClass('d'+hou.slice(1,2));
		$(span+'(3)').addClass('colon');
		$(span+'(4)').addClass('d'+min.slice(0,1));
		$(span+'(5)').addClass('d'+min.slice(1,2));
		$(span+'(6)').addClass('colon');
		$(span+'(7)').addClass('d'+sec.slice(0,1));
		$(span+'(8)').addClass('d'+sec.slice(1,2));
		setTimeout(time,1000);
	}
	time();
}