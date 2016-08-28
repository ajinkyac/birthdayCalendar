var BCAL = BCAL || {};

BCAL.calendar = (function () {

    var birthdayTilesTemplate = document.getElementById("tiles-template").innerHTML,
        noBirthdays = "<span class='no-birthday'>:(</span>";

    function init() {
        BCAL.dataStore.setupDataStore();
        attachEvents();
    }

    function attachEvents() {
      var button = document.getElementsByClassName("updateBtn")[0];
      BCAL.utils.addListener(button, 'click', function(e) {
        destroyAndRebuild();
      });

      var yearInputBox = document.getElementsByClassName("birthYear")[0];

      BCAL.utils.addListener(yearInputBox, 'keypress', function(e) {
        if (event.which == 13 || event.keyCode == 13) {
          //code to execute here
          destroyAndRebuild();
          return false;
        }
        return true;

      });
    }

    function dataAvailable() {
      renderDefaultBirthdays();
    }

    function renderDefaultBirthdays(isReRendered) {
      var birthdayData = BCAL.dataStore.processedData;

      if (isReRendered) {
        destroyRenderedBirthdays();
      }

      for (day in birthdayData) {

        var numOfBirthdays = birthdayData[day].length,
            fluidBoxBody = document.getElementsByClassName(day)[0].children[1],
            html = "",
            i = 0;

        for (; i < numOfBirthdays ; i++) {
          var name = birthdayData[day][i].split(" "),
              firstName = name[0],
              lastName = name[1],
              initials = firstName.substring(0,1) + lastName.substring(0,1);

          html += birthdayTilesTemplate.replace(/{{initials}}/g, initials);
          html = html.replace(/{{tileclass}}/g, BCAL.utils.getRandomTileClass());
        }

        if (numOfBirthdays !== 0) {
            fluidBoxBody.innerHTML = html;
        }
        else {
          fluidBoxBody.innerHTML = noBirthdays;
        }
      }
    }

    function destroyAndRebuild() {
      var inputtedYear = document.getElementsByClassName("birthYear")[0].value;

      if (inputtedYear.length > 0) {
        BCAL.dataStore.processDataByYear(inputtedYear);

        var isReRendered = true;
        renderDefaultBirthdays(isReRendered);
      }
    }

    function destroyRenderedBirthdays() {
      var birthdayData = BCAL.dataStore.processedData;

      for (day in birthdayData) {
        var fluidBoxBody = document.getElementsByClassName(day)[0].children[1].innerHTML = "";
      }
    }

    return {
        init: init,
        notifyDataAvailibility: dataAvailable
    };

})();
