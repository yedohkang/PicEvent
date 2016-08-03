var parsedString;
var now = moment();
var month;
var day;
var year;
var hour;
var minute;
var locationString = " ";
var knwl = new Knwl("english");

// parse text for date
var parseDate = function(parsedString){
  knwl.init(parsedString);
  var dateArray = knwl.get('dates');
  var dateObject = dateArray[0];
  if(dateObject == null){
    month = now.month();
    day = now.day();
    year = now.year();
  }else{
    if(dateObject.month == "unknown"){
      month = now.month();
    }else{
      month = dateObject.month;
    }
    if(dateObject.day == "unknown"){
      day = now.day();
    }else{
      day = dateObject.day;
    }
    if(dateObject.year == "unknown"){
      year = now.year();
    }else{
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
  var daynight;
  if(timeObject == null){
    hour = now.hour();
    minute = now.minute();
    daynight = "AM";
  }else{
    if(timeObject.hour == "unknown"){
      hour = 12;
    }else{
      hour = timeObject.hour - 1;
    }
    if(timeObject.minute == "unknown"){
      minute = 00;
    }else{
      minute = timeObject.minute;
    }
    if(timeObject.daynight == "unknown"){
      daynight = "AM";
    }else{
      daynight = timeObject.daynight;
    }
  }
  if(daynight == "PM"){
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
