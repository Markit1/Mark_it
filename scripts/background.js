
function ensureSendMessage(tabId, message, callback){
  chrome.tabs.sendMessage(tabId, {ping: true}, function(response){
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