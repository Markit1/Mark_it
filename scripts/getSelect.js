
var integer;
var htmlcode_original = document.getElementsByTagName('html')[0].innerHTML;
var htmlcode_changed = "";
URL = document.URL;

var is_markIt_activate;
var markIt_localStorage;

var port = chrome.runtime.connect({name: "MarkIt"});

knowIfMarkItIsActive(port);

function knowIfMarkItIsActive(port) {
	port.postMessage({question: "Is MarkIt active?"});
	port.onMessage.addListener(function (msg) {
	  if (msg.answer) {
	  	this.is_markIt_activate = true;
	  }
	  else if (!msg.answer){
	  	this.is_markIt_activate = false;
		}
		makingChangesWithMarkIt();
	});
}

function making_coments_draggrable(id) {
	$(function() {
    $("#" + id + "").draggable();
  });
}

function save_codepage() {
	htmlcode_changed = document.getElementsByTagName('html')[0].innerHTML;
	localStorage.markIt = JSON.stringify({
		url: URL,
		code_changed: htmlcode_changed,
		code_original: htmlcode_original,
		integer: integer
	});
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
  	sendResponse({htmlcode: JSON.parse(localStorage.markIt)});
  } else if (request.MarkIt_state != undefined) {
  	this.is_markIt_activate = request.MarkIt_state;
  	makingChangesWithMarkIt();
  }
});

function makingChangesWithMarkIt() {
	if (localStorage.markIt != undefined) {
		this.markIt_localStorage = JSON.parse(localStorage.markIt);
		this.integer = markIt_localStorage.integer;

		if (URL == markIt_localStorage.url) {
			if (this.is_markIt_activate) {
				document.getElementsByTagName('html')[0].innerHTML = markIt_localStorage.code_changed;

				for(var number_current = 0; number_current < integer; number_current += 1) {
					var title_current, idComment_current;

					title_current = "comentario" + number_current;
					idComment_current = title_current.replace(/\s+/g, '');
					idComment_current = idComment_current.toLowerCase();

					making_coments_draggrable(idComment_current);
				}
			} else {
				document.getElementsByTagName('html')[0].innerHTML = markIt_localStorage.code_original;
			}
		}
	} else {
		this.integer = 0;
	}

}