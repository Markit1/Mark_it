//se muestra page Action cuando agregar un comentario
var vhtml = "html";

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [

        new chrome.declarativeContent.PageStateMatcher({
            css: [".markit-div"]
          })
      ],

      actions: [new chrome.declarativeContent.ShowPageAction() ]
    }]);
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

function genericOnClick(info, tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    ensureSendMessage(tabs[0].id, {greeting: "hello"});
  });
};



chrome.contextMenus.onClicked.addListener(genericOnClick);

chrome.runtime.onInstalled.addListener(function() {
  var contexts, title, idContext;

  contexts = ["page","selection","link","editable","image","video",
                  "audio"];
  title = "Mark_it";
  idContext = chrome.contextMenus.create({
                                          "title": title,
                                          "contexts":contexts,
                                          "id": "context" + 1
                                        });
  console.log("'" + title + "' item:" + idContext);
});
