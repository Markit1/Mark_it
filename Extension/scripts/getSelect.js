var integer;
var htmlcode_original = document.getElementsByTagName('html')[0].innerHTML;
var htmlcode_changed = "";
var URL = document.URL;
var chrome;
var localStorage;
var window;

var is_markIt_activate;
var markIt_localStorage;
var port = chrome.runtime.connect({name: "MarkIt"});

function making_coments_draggrable(id) {
  $(function () {
    $("#" + id).draggable();
  });
}

function makingChangesWithMarkIt() {
  if (localStorage.markIt !== undefined) {
    this.markIt_localStorage = JSON.parse(localStorage.markIt);
    this.integer = markIt_localStorage.integer;

    if (URL === markIt_localStorage.url) {
      if (this.is_markIt_activate) {
        var number_current;
        var title_current;
        document.getElementsByTagName('html')[0].innerHTML = markIt_localStorage.code_changed;

        for (number_current = 0; number_current < integer; number_current += 1) {
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

function deleteMarkIt() {
  $(".delete").on('click', function () {
    var parenDiv;
    parenDiv = this.parentNode;
    $(parenDiv).remove();
  });
}

function knowIfMarkItIsActive(port) {
  port.postMessage({question: "Is MarkIt active?"});
  port.onMessage.addListener(function (msg) {
    if (msg.answer) {
      this.is_markIt_activate = true;
    } else if (!msg.answer) {
      this.is_markIt_activate = false;
    }
    makingChangesWithMarkIt();
    deleteMarkIt();
  });
}

knowIfMarkItIsActive(port);

function saveCodePage() {
  this.htmlcode_changed = document.getElementsByTagName('html')[0].innerHTML;
  localStorage.markIt = JSON.stringify({
    url: URL,
    code_changed: this.htmlcode_changed,
    code_original: this.htmlcode_original,
    integer: integer
  });
}

var global = "markit";

function addDiv(tag) {
  var title;
  title = "comentario" + integer;
  integer++;
  $(tag).append("<div class=" + "markit-global" + " id=" + title + "><button contenteditable=" + false + " class=" + '"delete"' + ">X</button><div id=" + global + " contenteditable=" + true + " class=" + "markit-div" + "></div></div>");
  document.getElementById(global).setAttribute('ContentEditable', 'true');
  $("#" + title).draggable();
  $(".markit-div").focus();
}

function getTag() {
  var tag;
  var range;
  if (window.getSelection) {
    range = window.getSelection().getRangeAt(0);
    tag = range.endContainer.parentNode;
    addDiv(tag);
  }
}
/*jslint unparam: true*/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.ping) {
    getTag();
    deleteMarkIt();
  } else if (request.MarkIt_state !== undefined) {
    this.is_markIt_activate = request.MarkIt_state;
    makingChangesWithMarkIt();
    deleteMarkIt();
  } else if (request.save) {
    saveCodePage();
  }
});
/*jslint unparam: false*/
