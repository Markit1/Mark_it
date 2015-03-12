//se muestra page Action cuando agregar un comentario
var vhtml = "html";
var contexts = ["page","selection","link","editable","image","video",
                  "audio"];


/*
//chrome.pageAction.show(tabId: tab.id);

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [

        new chrome.declarativeContent.PageStateMatcher({
            css: [".markit-div"]
          })
      ],

      actions: [new chrome.pageAction.setIcon({tabId: tab.id, path: 'images/markit.png'}) ]
      new chrome.declarativeContent.ShowPageAction()
    }]);
  });
});




//click en pageAction
chrome.pageAction.onClicked.addListener(function(tab){
  alert(vhtml);
});
*/

var lastTabId = 0;
function active_markit_icon(tabId, changeInfo, tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  lastTabId = tabs[0].id;
  chrome.pageAction.show(lastTabId);
  });
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(active_markit_icon);



chrome.runtime.onInstalled.addListener(function(tab) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [

        new chrome.declarativeContent.PageStateMatcher({
            css: [".markit-div"]
          })
      ],
      //chrome.pageAction.setIcon({path: "icon" + (clicks + 1) + ".png",
      //                       tabId: tab.id});

      //actions: [new chrome.declarativeContent.ShowPageAction() ]
      actions: [new chrome.pageAction.setIcon({path: "images/markit.png"})]
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
