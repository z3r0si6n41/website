function modal(id, title, html) {
	if(id == "error"){
		console.log(html);
	}

	var modalHtml = `<div class="modal" id="${id}" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">${title}</h5><a class="btn-close" data-bs-dismiss="modal">X</a></div><div class="modal-body">${html}</div></div></div></div>`;
	
	$('body').append(modalHtml);
	var myModal = new bootstrap.Modal(document.getElementById(id), {backdrop: 'static'});
	myModal.show();

}

function buildTemplate(data){
	var template = Handlebars.compile(data.html);
	return template(data.data);
}