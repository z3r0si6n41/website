$(document).on('click', '#register', function(e){
	e.preventDefault();
	
	var username = $('#registerUsername').val(),
		email = $('#registerEmail').val(),
		password = $('#registerPassword').val();
		
	var data = {
		username: username,
		email: email,
		password: password
	};
	
	new Ajax('user/register/', data, (result) => {
		modal('register-success', 'Success!', 'You have successfully registered and may now log in.');
	});
});

$(document).on('click', '#login', function(e){
	e.preventDefault();
	
	var username = $('#loginUsername').val(),
		password = $('#loginPassword').val();
	
	var data = {
		username: username,
		password: password
	};
	
	new Ajax('user/login', data, (result) => {
		window.localStorage.token = result.token;
		modal('login-success', 'Success!', 'You have successfully logged in.');
		var myModalEl = document.getElementById('login-success')
		myModalEl.addEventListener('hidden.bs.modal', function(event){
			window.location = 'https://z3r0sign41.com/blog/dashboard';
		});
	});
});

$(document).on('click', '#forgot-password', function(e){
	e.preventDefault();

});

$(document).on('click', '.close_page', function(){
	$('.page').remove();
});

$(document).on('click', '.terminal__line a', function(e){
	e.preventDefault();
	var id = $(this).data('id');
	handleNav(id);
});

$(document).on('submit', '.search__form', function(e){
	e.preventDefault();

	var command = $('input').val();
	handleNav(command);
});