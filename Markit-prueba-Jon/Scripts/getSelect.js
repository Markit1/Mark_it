var htmlcode = "sin html";


function getTag(){
	var tagSearch;
		if(window.getSelection){
			range = window.getSelection().getRangeAt(0);
			tagSearch = range.endContainer.parentNode;
			addDiv(tagSearch);
		} 
		else if (document.selection){
			alert("No haz seleccionado un texto");
		}
	}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
	if(request.ping){
		getTag();
		save_codepage();
		sendResponse({htmlcode: localStorage.htmlcode});
	}
});

var integer = 0;

function save_codepage(){
	htmlcode = document.getElementsByTagName('html')[0].innerHTML;
	localStorage.htmlcode = "<!DOCTYPE html>" + htmlcode + "</html>";
}

function addDiv(tagSearch){
	var markit, comment, textQuantity;

	console.log(tagSearch);
	markit = "comentario" + integer;
	console.log(markit);
	integer++;

	$(tagSearch).append("<div contenteditable="+true+" id=" + markit + " class=" + "markit-div" + "></div>");
	document.getElementById(markit).setAttribute('ContentEditable', 'true');
	$("#" + markit + "").draggable();
	$("#" + markit + "").focus();
}

function deleteDiv(){
	
	
}


/*
	var posicion = this.getBoundingClientRect();
	console.log(posicion.top, posicion.right, posicion.bottom, posicion.left);
	console.log(window.innerWidth);
	var width = window.innerWidth;
	var left = posicion.left;

	if( left < 0){
		$(this).remove();
	}
	});
*/
