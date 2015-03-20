var vhtml = "";
var contexts = ["page", "selection", "link", "editable", "image", "video", "audio"];
var show_markIt = false;
var chrome;
var Image;
var alert;
var lastTabId=0;

//Add mark_it icon in whatever page
function active_markit_icon(tabId, changeInfo, tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  lastTabId = tabs[0].id;
  chrome.pageAction.show(lastTabId);
  });
};


//Changes icon when you add a markIt comemnt
/*
function createSetIconAction(path, callback) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var image = new Image();
  image.onload = function () {
    ctx.drawImage(image, 0, 0, 19, 19);
    var imageData = ctx.getImageData(0, 0, 19, 19);
    var action = new chrome.declarativeContent.SetIcon({imageData: imageData});
    callback(action);
  };
  image.src = chrome.runtime.getURL(path);
}
*/

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
  }
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

function ensureSendMessage(tabId) {
  chrome.tabs.sendMessage(tabId, {ping: true}, function (response) {
    vhtml = response.htmlcode.code_changed;
  });
}

function sendMarkItState(tabId, message) {
  chrome.tabs.sendMessage(tabId, message);
}

function sendMessage(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    sendMarkItState(tabs[0].id, message);
  });
}

function genericOnClick(info) {
  var message;
  if (info.menuItemId === "enabled") {
    if (!show_markIt) {

      var title = "Agregar MarkIt";
      chrome.contextMenus.create({
        "title" : title,
        "contexts" : contexts,
        "id" : "MarkIt"
      });
    } else {
      chrome.contextMenus.remove("MarkIt");
    }

    this.show_markIt = this.show_markIt === false;
    message = {MarkIt_state: show_markIt};
    sendMessage(message);
  } else if (info.menuItemId === "MarkIt") {
    message = {ping: true};
    sendMessage(message);
  }
}

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
