$(document).ready(function() {

  var game = (function() {

    var cities = [];

    // our variables
    var correctAnswers = [];
    var choosenAnswers = [];
    var choosenCities = $("#choosen").get(0);
    var percentage;


    // timer variables
    var minutesLabel = $("#minutes").get(0);
    var secondsLabel = $("#seconds").get(0);

    var totalSeconds;
    var stopTimer = false;
    var handle;

    var input = $("#value").get(0);

    $.getJSON('data/podaci.json', function(data) {
      var jsonData = {};
      jsonData = data;
      cities = data.ponudjene;
      $("#value").autocomplete({
        source: data.ponudjene,
        minLength: 1,
        select: function(event, element) {
          $("#value").val(element.item.value);
        }
      }).autocomplete("widget").addClass("city-autocomplete");
      $("#area").append(data.oblast);
      //$("#area").html(data.oblast);-more elegant way,maybe...

      totalSeconds = data.vreme;
      correctAnswers = data.tacno;

    });

    // start time countdown
    startTimer();

    function addValue(text, val) {
      var createOptions = document.createElement('option');
      optionsVal.appendChild(createOptions);
      createOptions.text = text;
      createOptions.value = val;
    }

    // add choosen city to array
    function addToChoosen() {
      if (choosenAnswers.indexOf(input.value) !== -1) {
        alert("Vec postoji naziv grada.");
        return false;
      } else if (input.value == "") {
        alert('Unesite naziv grada.');
        return false;
      } else if (cities.indexOf(input.value) === -1) {
        alert("Ovaj grad ne postoji u Srbiji.");
        return false;
      }

      choosenAnswers.push(input.value);
      emptyInput();
      emptyTable();
      reloadArray();

    }


    // function inArray(needle, haystack) {
    //   var count = haystack.length;
    //   for (var i = 0; i < count; i++) {
    //     if (haystack[i] === needle) {
    //       return true;
    //     }
    //   }
    //   return false;
    // }

    // write array in table with id - choosen
    function reloadArray() {

      for (var i = 0, len = choosenAnswers.length; i < len; i++) {
        var row = choosenCities.insertRow(choosenCities.rows.length);
        var cell = row.insertCell(0);
        cell.innerHTML = choosenAnswers[i] + "<button class='del'>X</button>";
      }
    }

    // remove old data from table
    function emptyTable() {
      while (choosenCities.rows.length > 0) {
        choosenCities.deleteRow(0);
      }
    }

    // remove choosen city from array of choosen cities
    function removeFromChoosen(element) {

      if (confirm('Da li stavrno zelite da obriste grad?')) {
        var row = element.parentNode.parentNode;
        var listIndex = row.rowIndex;
        choosenAnswers.splice(listIndex, 1);
        emptyTable();
        reloadArray();
      }
    }

    // empty input field
    function emptyInput() {
      input.value = "";
    }

    function endGame() {
      percentage = calculateProcentage();
      redirect();
    }

    function calculateProcentage() {

      var sameElements = choosenAnswers.filter(function(val) {
        return correctAnswers.indexOf(val) != -1;
       
      });
      redirect();
      p = (sameElements.length / correctAnswers.length) * 100;

      return p;
    }

    // redirect to result page
    function redirect() {
      localStorage.setItem('', '');
      window.location.href = 'result.html?percentage=' + percentage;
    }


    // timer functions
    function startTimer() {
      if (!stopTimer) {
        handle = setInterval(setTime, 1000);
      } else {
        alert('Kraj Igre');
        clearInterval(handle);
        handle = 0
        percentage = calculateProcentage();
        redirect();
      }
    }

    // timer functions
    function setTime() {

      if (totalSeconds == 0) {
        stopTimer = true;
        startTimer();
        return false;
      }

      --totalSeconds;

      minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
      secondsLabel.innerHTML = pad(totalSeconds % 60);
    }

    // timer functions
    function pad(val) {
      var valString = val + "";
      if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
    }

    function on(elSelector, eventName, selector, fn) {
      var element = document.querySelector(elSelector);

      element.addEventListener(eventName, function(event) {
        var possibleTargets = element.querySelectorAll(selector);
        var target = event.target;

        for (var i = 0, len = possibleTargets.length; i < len; i++) {
          var el = target;
          var p = possibleTargets[i];

          while (el && el !== element) {
            if (el === p) {
              return fn.call(p, event);
            }

            el = el.parentNode;
          }
        }
      });
    }

    // adding delegate event listener
    on('#choosen', 'click', '.del', function(e) {
      // this function is only called, when a list item with 'del' class is called
      //console.log(e.target); // this is the clicked list item
      removeFromChoosen(e.target);
    });


    return {
      addToChoosen: addToChoosen,
      endGame: endGame
    }

  }());



  $("#dodajUListu").on('click', game.addToChoosen);
  $("#zavrsiIgru").on('click', game.endGame);

});
