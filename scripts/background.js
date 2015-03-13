
var vhtml = "html";
var contexts = ["page","selection","link","editable","image","video",
                  "audio"];

//Agrega icono de mark_it en cualquier tab del navegador
var lastTabId = 0;
function active_markit_icon(tabId, changeInfo, tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  lastTabId = tabs[0].id;
  chrome.pageAction.show(lastTabId);
  });
};

//Agrega listener a tabs
chrome.tabs.onUpdated.addListener(active_markit_icon);

//Cambia icono cuando agregas un comentario mark_it
function createSetIconAction(path, callback) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var image = new Image();
  image.onload = function() {
    ctx.drawImage(image,0,0,19,19);
    var imageData = ctx.getImageData(0,0,19,19);
    var action = new chrome.declarativeContent.SetIcon({imageData: imageData});
    callback(action);
  }
  image.src = chrome.runtime.getURL(path);
}


chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
  createSetIconAction("images/markit.png", function(setIconAction) {
    chrome.declarativeContent.onPageChanged.addRules([
      /* rule1, */
      {
        conditions : [
          new chrome.declarativeContent.PageStateMatcher({
              css : [".markit-div"]
          })
        ],
        actions : [ setIconAction ]
      }
    ]);
  });
});

//click en pageAction
chrome.pageAction.onClicked.addListener(function(tab){
  alert(vhtml);
});

function ensureSendMessage(tabId, message, callback){
  chrome.tabs.sendMessage(tabId, {ping: true}, function(response){
  vhtml= response.htmlcode;
  });
}

var show_markIt = false;

function genericOnClick(info, tab) {
  if (info.menuItemId == "enabled") {
    if (!show_markIt) {
      var title = "Agregar MarkIt";
      chrome.contextMenus.create({
        "title" : title,
        "contexts" : contexts,
        "id" : "MarkIt"
      });

    }
    else {
      chrome.contextMenus.remove("MarkIt");
    }
    show_markIt = show_markIt == false;
  }
  else if (info.menuItemId == "MarkIt") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      ensureSendMessage(tabs[0].id, {greeting: "hello"});
    });
  }
};

chrome.contextMenus.onClicked.addListener(genericOnClick);

chrome.runtime.onInstalled.addListener(function() {
  var idContext;
  chrome.contextMenus.create({
    "title": "Habilitado",
    "type": "checkbox",
    "contexts" : contexts,
    "id": "enabled",
  });
});
