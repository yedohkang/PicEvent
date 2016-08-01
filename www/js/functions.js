var parsedString;
var dateString = "";
var now = moment();
var timeString = "";
var locationString = " ";
var knwl = new Knwl("english");

// parse text for date
var parseDate = function(parsedString){
  knwl.init(parsedString);
  var dateArray = knwl.get('dates');
  var dateObject = dateArray[0];
  var month;
  var day;
  var year;
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
  dateString = month + "/" + day + "/" + year;
};

// parse text for time
var parseTime = function(parsedString){
  knwl.init(parsedString);
  var timeArray = knwl.get('times');
  var timeObject = timeArray[0];
  timeString = timeObject.hour + ":" + timeObject.minute + " " + timeObject.daynight;
};

// parse text for location
var parseLocation = function(parsedString){
  var lowerCaseString = parsedString.toLowerCase();
  var shortParsedString = lowerCaseString.replace(/\ +/g, " ");
  var words = shortParsedString.split(" ");

  var indexAddress = -1;
  var streetTypes = ["street", "st", "avenue", "ave", "boulevard", "blvd", "drive", "driveway", "place", "pl", "parkway", "pkwy", "road", "rd"];
  var indexRoom = words.indexOf("room");
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
  console.log(locationString);
};

var parseString = function(parsedString){
  parseDate(parsedString);
  parseTime(parsedString);
  parseLocation(parsedString);
  console.log("Date: " + dateString);
  console.log("Time: " + timeString);
  console.log("Location: " + locationString);
};
