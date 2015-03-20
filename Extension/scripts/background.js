var vhtml = "";
var contexts = ["page", "selection", "link", "editable", "image", "video", "audio"];
var show_markIt = false;
var chrome;
var Image;
var alert;
var lastTabId=0;

//Add mark_it icon in whatever page
/*jslint unparam: true*/
function active_markit_icon(tabId, changeInfo, tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    this.lastTabId = tabs[0].id;
    chrome.pageAction.show(lastTabId);
  });
}
/*jslint unparam: false*/


//Changes icon when you add a markIt comemnt
function createSetIconAction(path, callback) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var image = new Image();
  image.onload = function() {
    ctx.drawImage(image,0,0,19,19);
    var imageData = ctx.getImageData(0,0,19,19);
    var action = new chrome.declarativeContent.SetIcon({imageData: imageData});
    callback(action);
  };
  image.src = chrome.runtime.getURL(path);
}

//Add listener to tabs
chrome.tabs.onUpdated.addListener(active_markit_icon);

chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
  createSetIconAction("images/markit.png", function (setIconAction) {
    chrome.declarativeContent.onPageChanged.addRules([
      // rule1
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

//click in pageAction
chrome.pageAction.onClicked.addListener(function () {
  alert(vhtml);
});

/*jslint unparam: true*/
function ensureSendMessage(tabId, message, callback) {
  chrome.tabs.sendMessage(tabId, {ping: true}, function (response) {
    vhtml = response.htmlcode.code_changed;
  });
}
/*jslint unparam: false*/

/*jslint unparam: true*/
function sendMarkItState(tabId, message, callback) {
  chrome.tabs.sendMessage(tabId, message);
}
/*jslint unparam: false*/

function sendMessage(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    sendMarkItState(tabs[0].id, message);
  });
}

/*jslint unparam: true*/
function genericOnClick(info, tab) {
  var message;
  if (info.menuItemId === "enabled") {
    if (!show_markIt) {
      var title;
      title = "Agregar MarkIt";
      chrome.contextMenus.create({
        "title" : title,
        "contexts" : contexts,
        "id" : "MarkIt"
      });
      title = "Guardar MarkIts";
      chrome.contextMenus.create({
        "title" : title,
        "contexts" : contexts,
        "id" : "Save"
      });
    } else {
      chrome.contextMenus.remove("MarkIt");
    }

    this.show_markIt = this.show_markIt === false;
    message = {MarkIt_state: show_markIt};
  } else if (info.menuItemId === "MarkIt") {
    message = {ping: true};
  } else if (info.menuItemId === "Save") {
    message = {save: true};
  }
  sendMessage(message);
}
/*jslint unparam: false*/

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    "title": "Habilitar",
    "type": "checkbox",
    "contexts" : contexts,
    "id": "enabled",
  });
});

chrome.contextMenus.onClicked.addListener(genericOnClick);

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "MarkIt");
  port.onMessage.addListener(function (msg) {
    if (msg.question === "Is MarkIt active?") {
      port.postMessage({answer : this.show_markIt});
    }
  });
});
