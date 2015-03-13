
var integer;
var htmlcode = "";

var is_markIt_activate = true;

if (localStorage.markIt_integer != undefined) {
	integer = localStorage.markIt_integer;
} else {
	integer = 0;
}

if (is_markIt_activate) {
	if (localStorage.markIt_htmlcode != undefined) {
		document.getElementsByTagName('html')[0].innerHTML = localStorage.markIt_htmlcode;

		for(var number_current = 0; number_current < integer; number_current += 1) {
			var title_current, idComment_current;

			title_current = "comentario" + number_current;
			idComment_current = title_current.replace(/\s+/g, '');
			idComment_current = idComment_current.toLowerCase();

			making_coments_draggrable(idComment_current);
		  console.log(idComment_current);
		}
	}
}

function making_coments_draggrable(id) {
	$(function() {
    $("#" + id + "").draggable();
  });
}

function save_codepage() {
	htmlcode = document.getElementsByTagName('html')[0].innerHTML;
	localStorage.markIt_htmlcode = htmlcode;
	localStorage.markIt_integer = integer;
}

function addDiv(tag) {
	var title, comment, textQuantity;

	console.log(tag);
	title = "comentario" + integer;

	console.log(title);
	integer++;

	idComment = title.replace(/\s+/g, '');
	idComment = idComment.toLowerCase();

	comment = prompt("Agrega un comentario");
	$(tag).append( "<div id=" + idComment + " class=" + "markit-div" + "></div>")

	textQuantity = comment.length;
	if (textQuantity <= 140) {

	  $("#" + idComment + "").text(comment);
	  $(function() {
	    $( "#" + idComment + "").draggable();
	  });

	} else {
	  alert("No se pueden usar tantas palabras");
	}

	comment = undefined;
	textQuantity = 0;
}

function getTag() {
	var tag;
	if (window.getSelection) {
    range = window.getSelection().getRangeAt(0);
    tag = range.endContainer.parentNode;
	  addDiv(tag);

	} else if (document.selection) {
	    alert("No haz seleccionado un texto");
	}
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.ping) {
  	getTag();
		save_codepage();
  	sendResponse({htmlcode: localStorage.htmlcode});
  }
});
