
var contexts = ["page","selection","link","editable","image","video",
                  "audio"];

function ensureSendMessage(tabId, message, callback){
  chrome.tabs.sendMessage(tabId, {ping: true}, function(response){
  });
}

var show_markIt = false;

function genericOnClick(info, tab) {
  if (info.menuItemId == "enabled") {
    if (!show_markIt) {
      chrome.contextMenus.create({
                                    "title" : "Agregar MarkIt",
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
  var title, idContext;

  title = "Mark_it";
  chrome.contextMenus.create({
                              "title": "Habilitado",
                              "type": "checkbox",
                              "contexts" : contexts,
                              "id": "enabled",
                            });
});