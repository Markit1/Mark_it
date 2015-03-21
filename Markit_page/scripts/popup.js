/*jslint unparam: true*/
var chrome;
$(document).ready(function () {
  $("input[id=markit_page], a, button")
    .button()
    .click(function (event) {
      chrome.tabs.executeScript(null, {code: "alert('hola Markit');"});
    });

  var content = $('#txt_name').val();
  $(function () {
    $('#txt_name').keyup(function () {
      if ($('#txt_name').val() !== content) {
        content = $('#txt_name').val();
      }
    });
  });

  $("input[id=share], a, button")
    .button()
    .click(function (event) {
      //alert(content);
      chrome.tabs.executeScript(null, {code: "location.href = 'https://mark-it.herokuapp.com/'"});
    });
});
