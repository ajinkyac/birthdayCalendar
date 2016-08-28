var BCAL = BCAL || {};

(function(){

  // Application bootstrap
  BCAL.dataServer = {
    path: "data/birthdays.json"
  };

  var calendar = BCAL.calendar;
	calendar.init();
})();
