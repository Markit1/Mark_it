
var integer = 0;
var htmlcode = "sin html";


function save_codepage() {
      htmlcode = document.getElementsByTagName('html')[0].innerHTML;
			localStorage.htmlcode = "<!DOCTYPE html>" + htmlcode + "</html>";
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
		//chrome.runtime.sendMessage({htmlcode: "htmlcodeeeee"}, function(response) {
		//	alert("enviando");
		//});


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
