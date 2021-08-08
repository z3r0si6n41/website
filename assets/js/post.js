getIP(addIP);
getOS(addOS);

(function(){
	var theConsole = $('span.console');
	var texted = $("#ip").text();
	
	theConsole.html(texted);
});

var search_form = document.getElementsByClassName('search__form');

function createPage(id){
	new Ajax("api/tpl/", 'id='+id, function(data){
		var pageDiv = $('div');
		pageDiv.html('<div class="page_container">'+ data.html +'<div class="close_page" href="">x</div></div>');
		pageDiv.addClass('page');
		$(document).append(pageDiv);
	});
}

function handleNav(cmd){
	var acceptedCommands = ['aboutme', 'contact', 'getr00t', 'home', 'login', 'register', 'whoami', 'blog'];
	if(acceptedCommands.includes(cmd)){
		var tDiv = document.getElementsByClassName('terminal');
		$('.terminal').addClass("binding");
		
		var cmdEl = document.createElement('p');
		cmdEl.innerHTML = ('Execute: ' + binder);
		cmdEl.setAttribute('class', 'terminal__line');
		$(cmdEl).appendTo(tDiv);
		
		if(cmd === 'blog'){
			window.open(`http://blog.${Site.host}/`);
		}else if(cmd === 'twitter'){
			window.open('http://twitter.com/z3rosign41');
		}else{
			createPage(cmd);
		}
	}else{
		var tDiv = document.getElementsByClassName('terminal');
		$('.terminal').addClass("binding");
		
		var cmdEl = document.createElement('p');
		cmdEl.innerHTML = ('Command "' + binder +'" not found.');
		cmdEl.setAttribute('class', 'terminal__line');
		$(cmdEl).appendTo(tDiv);
	}
}

var navigationLink = $('.terminal__line a');

navigationLink.click(function(e){
	e.preventDefault();
	var id = $(this).data('id');
	handleNav(id);
});

$(search_form).submit(function(e){
	var command = $('input').val();
	handleNav(command);
	
	e.preventDefault();
});
init();