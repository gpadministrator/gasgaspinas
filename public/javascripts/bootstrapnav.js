
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
});
