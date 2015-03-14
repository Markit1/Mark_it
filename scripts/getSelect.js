
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
	this.htmlcode_changed = document.getElementsByTagName('html')[0].innerHTML;
	localStorage.markIt = JSON.stringify({
		url: URL,
		code_changed: this.htmlcode_changed,
		code_original: this.htmlcode_original,
		integer: integer
	});
}

$( "html" ).on( "click", function() {
  if (is_markIt_activate) {
	  save_codepage();
	}
});

function addDiv(tag) {
	var title;

	title = "comentario" + integer;

	integer++;
	$(tag).append("<div contenteditable="+true+" id=" + title + " class=" + "markit-div" + "></div>");
	document.getElementById(title).setAttribute('ContentEditable', 'true');
	$("#" + title + "").draggable();
	$("#" + title + "").focus();
}

function getTag() {
	var tag;
	if (window.getSelection) {
    range = window.getSelection().getRangeAt(0);
    tag = range.endContainer.parentNode;
	  addDiv(tag);
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
					var title_current;

					title_current = "comentario" + number_current;
					making_coments_draggrable(title_current);
				}
			} else {
				document.getElementsByTagName('html')[0].innerHTML = markIt_localStorage.code_original;
			}
		}
	} else {
		this.integer = 0;
	}

}