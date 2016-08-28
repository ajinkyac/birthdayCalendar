var BCAL = BCAL || {};

(function(){
	BCAL.utils = {

    getDataFromServer: function(dataPath, callback) {
      this.makeXHRCall(dataPath, callback);
    },

    getXHRObject: function() {
      var xhr;

      if (typeof XMLHttpRequest !== 'undefined') {
        xhr = new XMLHttpRequest();
      }
      else {
        var versions = ["Microsoft.XMLHTTP", "Msxml2.XMLHTTP", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.6.0"],
            i = 0,
            versionsLength = versions.length;

        for (; i < versionsLength; i++) {
          try {
            xhr = new ActiveXObject(versions[i]);
            break;
          }
          catch(e) {
            console.error(e);
          }
        }
      }
      return xhr;
    },

    makeXHRCall: function(dataPath, callback) {
      var ajaxObj = this.getXHRObject();

      ajaxObj.overrideMimeType("application/json");
      ajaxObj.open("GET", dataPath, true);

      ajaxObj.onreadystatechange = assertXHR;

      function assertXHR() {
        if (ajaxObj.readyState == 4) {
           if (ajaxObj.status == 200) {
               callback(ajaxObj.responseText);
           }
           else if (ajaxObj.status == 400) {
              console.error('There was an error 400');
           }
           else {
              console.info('something else other than 200 was returned');
           }
        }
      };

      ajaxObj.send(null);
    },

    putJSONInTextArea: function(data) {
      var textArea = document.getElementsByClassName("calendar-live-data")[0].children[0];
      textArea.value = "";
      textArea.value = data;
    },

    getDayOfTheWeek: function(date) {
      var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return week[date.getDay()];
    },

    getRandomTileClass: function() {
      var tileClasses = ["tile-color-1", "tile-color-2", "tile-color-3", "tile-color-4", "tile-color-5", "tile-color-6", "tile-color-7"];

      var maximum = tileClasses.length - 1;
      var minimum = 0;

      return tileClasses[Math.floor(Math.random() * (maximum - minimum + 1)) + minimum];
    }
	};

  var utils = BCAL.utils;
	// Based on the type event handler supported by browser assign appropriate methods
	if (typeof window.addEventListener === 'function') {
		utils.addListener = function (el, type, fn) {
			el.addEventListener(type, fn, false);
		};

		utils.removeListener = function (el, type, fn) {
			el.removeEventListener(type, fn, false);
		};

	} else if (typeof document.attachEvent === 'function') { // IE
		utils.addListener = function (el, type, fn) {
			el.attachEvent('on' + type, fn);
		};

		utils.removeListener = function (el, type, fn) {
			el.detachEvent('on' + type, fn);
		};
	} else { // older browsers
		utils.addListener = function (el, type, fn) {
			el['on' + type] = fn;
		};

		utils.removeListener = function (el, type, fn) {
			el['on' + type] = null;
		};
	}

  Array.prototype.swap = function(indexA, indexB) {
    var placeholder = this[indexA];
    this[indexA] = this[indexB];
    this[indexB] = placeholder;
  }
})();
