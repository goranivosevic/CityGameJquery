$(document).ready(function() {


  var result = (function() {
    //get paramether from url
    var url_string = window.location.href;
    var url = new URL(url_string);
    var percentage = url.searchParams.get("percentage");

    $("#proc").html(percentage);
    $("#bigger_proc").html(percentage);


    // create percentage green bar
    var elem = $("#myBar").get(0);
    var width = 1;
    var id = setInterval(frame, 10);

    function frame() {
      //animate to percentage from url
      if (width >= percentage) {
        clearInterval(id);
      } else {
        width++;
        elem.style.width = width + '%';
      }
    }
    return {

    }

  }());

});
