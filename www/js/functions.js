var parsedString;
var now = moment();
var month = now.month();
var day = now.day();
var year = now.year();
var hour = 0;
var minute = 0;
var locationString = " ";
var datePresent = "no";
var monthPresent = "no";
var dayPresent = "no";
var yearPresent = "no";
var timePresent = "no";
var hourPresent = "no";
var minutePresent = "no";
var knwl = new Knwl("english");

// parse text for date
var parseDate = function(parsedString){
  knwl.init(parsedString);
  var dateArray = knwl.get('dates');
  var dateObject = dateArray[0];
  if(dateObject !== null){
    if(dateObject.month != "unknown"){
      month = dateObject.month;
    }
    if(dateObject.day != "unknown"){
      day = dateObject.day;
    }
    if(dateObject.year != "unknown"){
      year = dateObject.year;
    }
  }
};

var parseMonth = function(parsedString){
  parseDate(parsedString);
  return month;
};

var parseDay = function(parsedString){
  parseDate(parsedString);
  return day;
};

var parseYear = function(parsedString){
  parseDate(parsedString);
  return year;
};

// parse text for time
var parseTime = function(parsedString){
  knwl.init(parsedString);
  var timeArray = knwl.get('times');
  var timeObject = timeArray[0];
  var daynight = "AM";
  if(timeObject !== null){
    if(timeObject.hour != "unknown"){
      hour = timeObject.hour;
    }
    if(timeObject.minute != "unknown"){
      minute = timeObject.minute;
    }
    if(timeObject.daynight != "unknown"){
      daynight = timeObject.daynight;
    }
  }
  if(daynight == "AM" && hour == 12){
    hour = 0;
  }
  if(daynight == "PM" && hour !== 12){
    hour += 12;
  }
};

var parseHour = function(parsedString){
  parseTime(parsedString);
  return hour;
};

var parseMinute = function(parsedString){
  parseTime(parsedString);
  return minute;
};

var endTime = function(parsedString){
  parseTime(parsedString);
  var endHour = hour + 1;
  return endHour;
}

// parse text for location
var parseLocation = function(parsedString){
  var lowerCaseString = parsedString.toLowerCase();
  var shortParsedString = lowerCaseString.replace(/\ +/g, " ");
  var words = shortParsedString.split(" ");

  var indexAddress = -1;
  var streetTypes = ["street", "st", "avenue", "ave", "boulevard", "blvd", "drive", "driveway", "place", "pl", "parkway", "pkwy", "road", "rd", "square", "sq"];
  var indexRoom = -1;
  var roomTypes = ["room", "rm"];
  var indexSpecial = -1;
  var specialTypes = ["cafeteria", "gym", "gymnasium", "basement"];
  for(i = 0; i < words.length; i++){
    for(j = 0; j < streetTypes.length; j++){
      if(streetTypes[j] == words[i]){
        indexAddress = i;
      }
    }
    for(r = 0; r < roomTypes; r++){
      if(roomTypes[r] == words[i]){
        indexRoom = i;
      }
    }
    for(k = 0; k < specialTypes.length; k++){
      if(specialTypes[k] == words[i]){
        indexSpecial = i;
      }
    }
  }
  if(indexAddress !== -1){
    var eastWest = words[indexAddress -2];
    if(eastWest == "e" || eastWest == "w" || eastWest == "east" || eastWest == "west"){
      locationString = words[indexAddress - 3] + " " + words[indexAddress - 2] + " " + words[indexAddress - 1] + " " + words[indexAddress];
    }else{
      locationString = words[indexAddress - 2] + " " + words[indexAddress - 1] + " " + words[indexAddress];
    }
  }
  if(indexRoom !== -1){
    if(locationString.charAt(0) == " "){
      locationString = words[indexRoom] + " " + words[indexRoom + 1];
    }else{
      locationString = locationString + " " + words[indexRoom] + " " + words[indexRoom + 1];
    }
  }
  if(indexSpecial !== -1){
    if(locationString.charAt(0) == " "){
      locationString = words[indexSpecial];
    }else{
      locationString = locationString + " " + words[indexSpecial];
    }
  }
  return locationString;
};

var makeDescription = function(parsedString){
  var lowerCaseString = parsedString.toLowerCase();
  var shortParsedString = lowerCaseString.replace(/\ +/g, " ");
  var words = shortParsedString.split(" ");

}
