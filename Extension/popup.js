$(document).ready(function(){
  $( "input[id=markit_page], a, button" )
    .button()
    .click(function( event ) {
     chrome.tabs.executeScript( null, {code:"alert('hola Markit');"}
     //,function(results){ alert("hola"); }
     );

    });

    var content = $('#txt_name').val();
    $(function() {

    $('#txt_name').keyup(function() {
        if ($('#txt_name').val() != content) {
            content = $('#txt_name').val();
        }
    });
    });

    $( "input[id=share], a, button" )
      .button()
      .click(function( event ) {
        //var name = value = $("#txt_name").attr('value');
        alert(content);
       //chrome.tabs.executeScript( null, {code:"alert(content);"}
       //,function(results){ alert("hola"); }
       //);
      });
  });
