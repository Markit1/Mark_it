
var integer = 0;

function addDiv(tag) {	
	var title, comment, textQuantity;

	console.log(tag);      
	title = "comentario" + integer;
	
	console.log(title);
	integer++;
	
	idComment = title.replace(/\s+/g, '');
	idComment = idComment.toLowerCase();

	comment = prompt("Agrega un comentario");
	$(tag).append("<div id=" + idComment + " class=" + "markit-div" + "></div>")
	
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
  	sendResponse({pong: true});
  }
});

