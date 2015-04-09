
$(document).ready(function(){

	
	$(".nav").children('li').each(function() {
		var pathname = window.location.pathname;
		if(pathname == $(this).children('a').attr("href")) {
			$(this).addClass("active");
		}
		
	});

	$(".nav a").on("click", function(){
	   $(".nav").find(".active").removeClass("active");
	   $(this).parent().addClass("active");
	});
	alert('ready');
	
	
	$("div.useritem").click(function() {
		alert('trest');
		console.log("test");
		$(this).addClass('itemSelected');	
	});
		
});
