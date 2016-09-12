/*
 * The data store object fetches the data, processes it and keeps it handy for app's use.
 * We also do custom processing here which is a TODO item.
 */

var BCAL = BCAL || {};

(function(){
	BCAL.dataStore = {
    calendarData: '',

    processedData: {},

    setupDataStore: function(response) {
      if (!response) {
        BCAL.utils.getDataFromServer(BCAL.dataServer.path, BCAL.dataStore.setupDataStore);
      }
      else {
        BCAL.dataStore.reinitializeProcessDataObject();
        BCAL.dataStore.calendarData = JSON.parse(response);
        BCAL.dataStore.processData();
        BCAL.utils.putJSONInTextArea(response);
        BCAL.calendar.notifyDataAvailibility();
      }
    },

		processData: function(yearToProcess) {
			var data = BCAL.dataStore.calendarData,
          dataLength = data.length,
          i = 0,
					forYear = yearToProcess || new Date().getFullYear();

      this.reinitializeProcessDataObject();

      for (; i < dataLength; i++) {
        var date = BCAL.utils.getDateForYear(data[i].birthday, forYear),
            day = BCAL.utils.getDayOfTheWeek(date);

        BCAL.dataStore.processedData[day].push(data[i].name);
      }
		},

    reinitializeProcessDataObject: function() {
      BCAL.dataStore.processedData = {
        "Monday": [],
        "Tuesday": [],
        "Wednesday": [],
        "Thursday": [],
        "Friday": [],
        "Saturday": [],
        "Sunday": []
      }
    }
	};
})();
