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
        BCAL.dataStore.preProcessData();
        BCAL.utils.putJSONInTextArea(response);
        BCAL.calendar.notifyDataAvailibility();
      }
    },
    preProcessData: function() {
      var data = BCAL.dataStore.calendarData,
          dataLength = data.length,
          i = 0;

      this.reinitializeProcessDataObject();

      for (; i < dataLength; i++) {
        var birthday = data[i].birthday.split("/");

        // In case of Sansa Stark, the birthdate was DD/MM/YYYY, we need MM, DD, YYYY
        if (birthday[0].length === 2 && birthday[0] > 12) {
          birthday.swap(0, 1);
          data[i].birthday = birthday.join();
        }

        var date = new Date(data[i].birthday),
            day = BCAL.utils.getDayOfTheWeek(date);

        BCAL.dataStore.processedData[day].push(data[i].name);
      }
    },

    processDataByYear: function(year) {
      var data = BCAL.dataStore.calendarData,
          dataLength = data.length,
          i = 0;

      this.reinitializeProcessDataObject();

      for (; i < dataLength; i++) {
        var birthday = data[i].birthday.split("/");

        // In case of Sansa Stark, the birthdate was DD/MM/YYYY, we need MM, DD, YYYY
        if (birthday[0].length === 2 && birthday[0] > 12) {
          birthday.swap(0, 1);
          data[i].birthday = birthday.join();
        }

        var birthYear = new Date(data[i].birthday).getFullYear();

        if (birthYear == year) {
          var date = new Date(data[i].birthday),
              day = BCAL.utils.getDayOfTheWeek(date);

          BCAL.dataStore.processedData[day].push(data[i].name);
        }
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
