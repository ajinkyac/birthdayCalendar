/*
 * The application module. The global namespace of the application is kept as BCAL to keep the JS global scope clean.
 */

var BCAL = BCAL || {};

(function(){

  // Application bootstrap, ideally this should not be here
  BCAL.dataServer = {
    path: "data/birthdays.json"
  };

  var calendar = BCAL.calendar;
	calendar.init();
})();
