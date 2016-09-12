/*
 * The calendar module that takes care of building UI, attaching events and eventually destroying them.
 */

var BCAL = BCAL || {};

BCAL.calendar = (function () {

    // --------------------------- Private members -----------------------------------
    var birthdayTilesTemplate = document.getElementById("tiles-template").innerHTML,
        noBirthdays = "<span class='no-birthday'>:(</span>";
    // -------------------------------------------------------------------------------

    /**
     * Initiates the application by setting up the data store, attaching the events.
     * The datastore will notify once the data is processed and available.
     *
     * @private
     * @param {none} - doesn't accept parameters
     * @return {undefined} - returns nothing
     */
    function init() {
        BCAL.dataStore.setupDataStore();
        attachEvents();
    }

    /**
     * Attach events to the UI components.
     * In our case it's just the button and the input field.
     *
     * @private
     * @param {none} - doesn't accept parameters
     * @return {undefined} - returns nothing
     */
    function attachEvents() {
      var button = document.getElementsByClassName("updateBtn")[0];
      BCAL.utils.addListener(button, 'click', function(e) {
        destroyAndRebuild();
      });

      var yearInputBox = document.getElementsByClassName("birthYear")[0];

      BCAL.utils.addListener(yearInputBox, 'keypress', function(event) {
        if (event.which == 13 || event.keyCode == 13) {
          destroyAndRebuild();
          return false;
        }
        return true;

      });
    }

    /**
     * Remove the attached events as part of destroy function.
     *
     * @private
     * @param {none} - doesn't accept parameters
     * @return {undefined} - returns nothing
     */
    function detachEvents() {
      var button = document.getElementsByClassName("updateBtn")[0];
      BCAL.utils.removeListener(button, 'click', function(e) {
        destroyAndRebuild();
      });

      var yearInputBox = document.getElementsByClassName("birthYear")[0];

      BCAL.utils.removeListener(yearInputBox, 'keypress', function(event) {
        if (event.which == 13 || event.keyCode == 13) {
          destroyAndRebuild();
          return false;
        }
        return true;

      });
    }

    /**
     * Notification service to handle post data availability operations.
     * TODO - This could have been a promise or a pubsub function.
     *
     * @private
     * @param {none} - doesn't accept parameters
     * @return {undefined} - returns nothing
     */
    function dataAvailable() {
      renderBirthdays();
    }

    /**
     * Renders the birthday tiles to the calendar day view.
     *
     * @private
     * @param {none} - doesn't accept parameters
     * @return {undefined} - returns nothing
     */
    function renderBirthdays() {
      var birthdayData = BCAL.dataStore.processedData;

      destroyRenderedBirthdays();

      for (day in birthdayData) {

        var numOfBirthdays = birthdayData[day].length,
            fluidBoxBody = document.getElementsByClassName(day)[0].children[1],
            html = "",
            i = 0;

        for (; i < numOfBirthdays; i++) {
          var name = birthdayData[day][i].split(" "),
              firstName = name[0],
              lastName = name[1],
              initials = firstName.substring(0,1) + lastName.substring(0,1);

          html += birthdayTilesTemplate.replace(/{{initials}}/g, initials);
          html = html.replace(/{{fullname}}/g, birthdayData[day][i]);
          html = html.replace(/{{tileclass}}/g, BCAL.utils.getRandomTileClass());
          if (numOfBirthdays === 1) {
              html = html.replace(/{{styles}}/g, "width: 100%; height: 100%;");
          }
        }

        if (numOfBirthdays !== 0) {
            fluidBoxBody.innerHTML = html;
        }
        else {
          fluidBoxBody.innerHTML = noBirthdays;
        }
      }
    }

    /**
     * Destroys the old birthday tiles from the day view, detaches the events. Also rebuilds the UI again.
     * Not really refreshing the HTML since the re-rendering would be expensive if the application data grows.
     *
     * @private
     * @param {none} - doesn't accept parameters
     * @return {undefined} - returns nothing
     */
    function destroyAndRebuild() {
      var inputtedYear = document.getElementsByClassName("birthYear")[0].value;

      if (inputtedYear.length > 0) {
        detachEvents();

        BCAL.dataStore.processData(inputtedYear);

        renderBirthdays();
      }
      else {
        init();
      }
    }

    /**
     * Private utility that refreshes the birthday tiles to the original state.
     *
     * @private
     * @param {none} - doesn't accept parameters
     * @return {undefined} - returns nothing
     */
    function destroyRenderedBirthdays() {
      var birthdayData = BCAL.dataStore.processedData;

      for (day in birthdayData) {
        var fluidBoxBody = document.getElementsByClassName(day)[0].children[1].innerHTML = "";
      }
    }

    /**
     * The facade exposes the functionality as an API to the outside world in the closurised pattern.
     *
     * @public
     * @param {none} - doesn't accept parameters
     * @return {undefined} - returns nothing
     */
    return {
        init: init,
        notifyDataAvailibility: dataAvailable
    };
})();


var BCAL = BCAL || {};
