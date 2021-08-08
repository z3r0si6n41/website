function addIP(ip) {
	$('#ip').html(ip);
	$('.console').html(ip);
}

var addOS = function(str1, str2){
	var dir1 = $('span.directory1');
	var dir2 = $('span.directory2');
	dir1.html(str1);
	dir2.html(str2);
};

function init() {
	getIP(function(){
		addIP(Site.ip);
		initHeader();
  		initAnimation();
  		addListeners();
	});
}

function createPage(id){
	new Ajax("api/tpl/", 'id='+id, function(data){
		var pageDiv = $('div');
		pageDiv.html('<div class="page_container">'+ data.html +'<div class="close_page" href="">x</div></div>');
		pageDiv.addClass('page');
		$(document).append(pageDiv);
	});
}

function getOS(callback){
    var OSstring1 = '', OSstring2 = '';
        
	if (navigator.appVersion.indexOf("Win") != -1){
		OSstring1 = "C:\Users\\";
		OSstring2 = "C:\Users\Public\\";
	}
	if (navigator.appVersion.indexOf("Mac") != -1){
		OSstring1 = "/Users/";
		OSstring2 = "/Volume/Mac/Users/";
	}
	if (navigator.appVersion.indexOf("X11") != -1){
		OSstring1 = "/home/";
		OSstring2 = "/usr/share/";
	}
	if (navigator.appVersion.indexOf("Linux") != -1){
		OSstring1 = "/home/";
		OSstring2 = "/usr/share/";
	}
	callback(OSstring1, OSstring2);
}
    
function getIP(cb){
	let apiKey = '1269ee4bc80c6e38a86bda74c44af2ba8239b55d23671e6bd84368b4';
	var request = new XMLHttpRequest();
	request.open('GET', 'https://api.ipdata.co/?api-key='+apiKey);
	request.setRequestHeader('Accept', 'application/json');
	request.onreadystatechange = function () {
		if (this.readyState === 4) {
			var response = JSON.parse(this.responseText);
			Site.ip = response.ip;
			cb();
		}
	};
	request.send();
}

function modal(title, text){
	var html = '<div class="row"><div class="col-lg-12"><div class="well text-center"><fieldset style="height:400px;"><legend>'+title+'</legend><p>'+text+'</p></fieldset></div></div></div>';
	
	var pageDiv = $('<div></div>');
	pageDiv.html('<div class="page_container">'+ html +'<div class="close_page" href="">x</div></div>');
	pageDiv.addClass('page');
	$('body').append(pageDiv);
}

function createPage(id){
	new Ajax("api/tpl/", 'id='+id, function(data){
		var html = buildTemplate(data);
		var pageDiv = $('<div></div>');
		pageDiv.html('<div class="page_container">'+ html +'<div class="close_page" href="">x</div></div>');
		pageDiv.addClass('page');
		$('body').append(pageDiv);
	});
}

function handleNav(cmd){
	var acceptedCommands = ['aboutme', 'contact', 'getr00t', 'whoami', 'blog', 'uname -a'];

	var cmdEl = $('<p></p>');
	var tDiv = $('.terminal');
	$('.terminal').addClass("binding");

	if(acceptedCommands.includes(cmd)){
		cmdEl.html('Execute: '+cmd);
		cmdEl.addClass('terminal__line');
		$(cmdEl).appendTo(tDiv);
		if(cmd === 'blog'){
			window.location = `${Site.base}/blog/`;
		}else if(cmd === 'twitter'){
			window.open('http://twitter.com/z3rosign41');
		}else if(cmd === 'uname -a'){
			var cmdEl2 = $('<p></p>');
			cmdEl2.html('Linux z3r0 0.0.0 x86_64 GNU/Linux');
			cmdEl2.addClass('terminal__line');
			$(cmdEl2).appendTo(tDiv);
		}else if(cmd === 'whoami'){
			var cmdEl2 = $('<p></p>');
			cmdEl2.html(`${Site.ip}`);
			cmdEl2.addClass('terminal__line');
			$(cmdEl2).appendTo(tDiv);
		}else{
			createPage(cmd);
		}
	}else{
		cmdEl.html('Command "' +cmd+ '" not found.');
		cmdEl.addClass('terminal__line');
		$(cmdEl).appendTo(tDiv);
	}
	$('#search__input').val('');
}

function buildTemplate(data){
	var template = Handlebars.compile(data.html);
    return template(data.data);
}