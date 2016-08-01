(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Knwl = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Date Parser */
function Dates(knwl) {
    
    this.languages = {
        'english': true,
    };
    
    this.year = {};
    this.year.lookForYear = function(pos) {
        
        /*
            Attempts to find year in string through ranking:
            1. Proximity to trigger source
            2. Punctuation syntax
        */
        
        var potential = [];
        
        var fall = 1.0; //ranking fall
        
        
        for (var ee = pos; ee > pos - 20; ee--) {
            if (dates.db.wordsWithPunc[ee] === undefined) {
                break;
            }
            if (dates.db.wordsWithPunc[ee].search(/[,;:]/g) !== -1) { //rank lower if comma seperates results
                fall += 4;
            } else if (dates.db.wordsWithPunc[ee].search(/[.?!]/g) !== -1) { //rank much lower if in another sentence
                fall += 72;
            }
            var curWord = dates.db.wordsWithPunc[ee].replace(/[.,!?\(\)]/g, ''); //cleanup
            if (isNaN(parseInt(curWord)) === false) {
                var parsedWord = parseInt(curWord);
                if (parsedWord.toString().length === 4) {
                    potential.push({
                        offset: (pos - ee) * fall,
                        year: parseInt(curWord)
                    });
                    break;
                }
            }
        };
        
        fall = 1.0; //reset ranking fall
        
        for (var ee = pos; ee < pos + 20; ee++) {
            if (dates.db.wordsWithPunc[ee] === undefined) {
                break;
            }
            var curWord = dates.db.wordsWithPunc[ee].replace(/[.,!?\(\)]/g, ''); //cleanup
            if (isNaN(parseInt(curWord)) === false) {
                var parsedWord = parseInt(curWord);
                if (parsedWord.toString().length === 4) {
                    potential.push({
                        offset: (ee - pos) * fall,
                        year: parseInt(curWord)
                    });
                    break;
                }
            }
            if (dates.db.wordsWithPunc[ee].search(/[,;:]/g) !== -1) { //rank lower if comma seperates results
                fall += 4;
            } else if (dates.db.wordsWithPunc[ee].search(/[.?!]/g) !== -1) { //rank much lower if in another sentence
                fall += 72;
            }
        }
        if (potential.length > 0) {
            var sortedByPotential = potential.sort(function(a,b) {
                return a.offset - b.offset;
            });
            return sortedByPotential[0].year;
        } else {
            return "unknown";
        }
    };
    
    this.day = {};
    this.day.prefix = ['twenty', 'thirty'];
    this.day.suffix = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'nineth', 'tenth','eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
    this.months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    this.monthAbbrs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];
    this.holidays = [
        ['thanksgiving'],
        ['christmas'],
        ['new', 'years'],
        ['july', '4th'],
        ['halloween'],
        ['april', 'fools']
    ];
    
    this.holidaysD = [
        [28, 11],
        [25, 12],
        [1, 1],
        [4, 7],
        [31, 10],
        [1, 4]
    ];
    this.dateObj = new Date();
    this.constructDateObj = function(year, month, day) {
        return {
            year: year,
            month: month,
            day: day,
            preview: null
        };
    };
    
    this.getDay = function(word) {
        if (word === undefined) {
            return "unknown";
        }
        //word (twenty-first)
        var pieces = word.toLowerCase().split('-');
        var numberStr = '';
        for (var ii = 0; ii < pieces.length; ii++) {
            var foundPrefix = false;
            if (ii === 0) {
                for (var ee = 0; ee < dates.day.prefix.length; ee++) {
                    if (pieces[ii] === dates.day.prefix[ee]) {
                        if (dates.day.prefix[ee] === 'twenty') {
                            numberStr += "2";   
                        } else if (dates.day.prefix[ee] === 'thirty') {
                            numberStr += "3";
                        }
                        foundPrefix = true;
                        break;
                    }
                }
                if (foundPrefix === false) {
                    for (var ee = 0; ee < dates.day.suffix.length; ee++) {
                        if (pieces[ii] === dates.day.suffix[ee]) {
                            numberStr += ee + 1;
                            break;
                        }
                    }
                    break;
                }
            } else {
                for (var ee = 0; ee < dates.day.suffix.length; ee++) {
                    if (pieces[ii] === dates.day.suffix[ee]) {
                        numberStr += ee + 1;
                        break;
                    }
                }    
            }
        }
        
        if (numberStr.length > 0) {
            return parseInt(numberStr);
        }
        //number (21st)
        if (parseInt(word.replace(/[^0-9\.]+/g, "")) > 0 && parseInt(word.replace(/[^0-9\.]+/g, "")) < 32) {
            var parsed = parseInt(word);
            if (isNaN(parsed) === true) {
                return "unknown";
            }
            return parsed;
        }
    };
    this.day.lookForDay = function(pos) {
        
         /*
            Attempts to find day in string through ranking:
            1. Proximity to trigger source
            2. Punctuation syntax
        */
        
        var potential = [];
        var fall = 1.0; //ranking fall
        for (var ee = pos; ee > pos - 10; ee--) {
            if (dates.db.wordsWithPunc[ee] === undefined) {
                break;
            }
            if (dates.db.wordsWithPunc[ee].search(/[?!.]/g) !== -1) { //if reached end of previous sentence
                break;
            }
            if (dates.db.wordsWithPunc[ee].search(/[,;:]/g) !== -1) { //rank lower if comma seperates results
                fall += 4;
            }
            var curWord = dates.db.wordsWithPunc[ee].replace(/[.,!?\(\)]/g, ''); //cleanup
            if (curWord.length - curWord.replace(/[^0-9\.]+/g, "").length === 2) {
                var testDay = dates.getDay(curWord);
                if (testDay !== "unknown" && testDay !== undefined) {
                    potential.push({
                        offset: (pos - ee) * fall,
                        day: testDay
                    });
                    break;
                }
            }
        };
        
        fall = 1.0; //reset ranking fall
        
        for (var ee = pos; ee < pos + 10; ee++) {
            if (dates.db.wordsWithPunc[ee] === undefined) {
                break;
            }
            var shouldBreak = false;
            if (dates.db.wordsWithPunc[ee].search(/[?!.]/g) !== -1) { //if reached end of previous sentence
                shouldBreak = true;
            }
            var curWord = dates.db.wordsWithPunc[ee].replace(/[.,!?\(\)]/g, ''); //cleanup
            if (curWord.length - curWord.replace(/[^0-9\.]+/g, "").length === 2) {
                var testDay = dates.getDay(curWord);
                if (testDay !== "unknown" && testDay !== undefined) {
                    potential.push({
                        offset: (ee - pos) * fall,
                        day: testDay
                    });
                    break;
                }
            }
            if (shouldBreak) {
                break;
            }
            if (dates.db.wordsWithPunc[ee].search(/[,;:]/g) !== -1) { //rank lower if comma seperates results
                fall += 4;
            }
        }
        if (potential.length > 0) {
            var sortedByPotential = potential.sort(function(a,b) {
                return a.offset - b.offset;
            });
            return sortedByPotential[0].day;
        } else {
            return "unknown";
//            return dates.dateObj.getFullYear();
        }
    };
    this.getMonth = function(word, typeD) {
        if (!isNaN(word) && typeD === 'mdy') {
            return parseInt(word);
        } else {
            for (var i = 0; i < dates.months.length; i++) {
                if (dates.months[i] === word) {
                    return i + 1;
                }
            }
            for (var i = 0; i < dates.monthAbbrs.length; i++) {
                if (dates.monthAbbrs[i] === word) {
                    return i + 1;
                }
            }
        }
    };
    
    this.db = {};
    this.db.words = [];
    this.db.wordsWithPunc = [];
    this.calls = function() {
    
    var words = knwl.words.get('words');
    var wordsWithPunc = knwl.words.get('linkWords');
    
    dates.db.words = words;
    dates.db.wordsWithPunc = wordsWithPunc;
    
    var results = [];
    
        //for dates like "july 16th 1999" one
        var dateObj = {};
        for (var i = 0; i < words.length; i++) {
    
            var month = dates.getMonth(words[i]);
            if (month !== undefined) {
                day = dates.getDay(words[i + 1]);
                if (day === undefined) {
                    day = dates.day.lookForDay(i);
                }
                var shouldContinue = true;
                if (day === undefined || day === "unknown") {
                    if (month === undefined || year === undefined) {
                        shouldContinue = false;
                    }
                    shouldContinue = false;
                }
                if (shouldContinue === true) {
                    var year = dates.year.lookForYear(i);
                    dateObj = dates.constructDateObj(year, month, day);
                    dateObj.preview = knwl.tasks.preview(i);
                    dateObj.found = i;
                    results.push(dateObj);
                }
            }
    
        }
    
        //for dates like "7/16/1999" two
        var dateObj = {};
        for (var i = 0; i < words.length; i++) {
            var word = words[i].replace("(", ""); //remove parenth--- if they are present
            var word = word.replace(")", ""); //remove parenth--- if they are present
            var testDate = word.split("/");
            if (testDate.length === 3) {
                var isAllNums = 0;
                for (var z = 0; z < testDate.length; z++) {
                    if (!isNaN(testDate[z]) && testDate[z] !== "") {
                        isAllNums++;
                    }
                }
                if (isAllNums === 3) {
                    var month = dates.getMonth(testDate[0], 'mdy');
                    var day = dates.getDay(testDate[1]);
                    var year = parseInt(testDate[2]);
                    if (month > 12) { //month cannot be over 12
                        break;
                    }
                    dateObj = dates.constructDateObj(year, month, day);
                    dateObj.preview = knwl.tasks.preview(i);
                    dateObj.found = i;
                    results.push(dateObj);
                }
            }
    
        }
        //for dates like "24th of december" three
        var dateObj = {};
        for (var i = 0; i < words.length; i++) {
            if (words[i + 1] === "of") {
                if (words[i + 2] !== undefined) {
    
                    var day = dates.getDay(words[i]);
                    var month = dates.getMonth(words[i + 2]);
                    var year = dates.dateObj.getFullYear();
    
                    if (month !== undefined && day !== undefined) { //make sure month and day defined
                        year = dates.year.lookForYear(i);
                        dateObj = dates.constructDateObj(year, month, day);
                        dateObj.preview =  knwl.tasks.preview(i);
                        dateObj.found = i;
                        results.push(dateObj);
                    }
                } //finish check if month and day defined
            }
        }
        
        //for dates like "thanksgiving", "christmas", or "new years"
        var dateObj = {};
        for (var i = 0; i < words.length; i++) {
            for (var e = 0; e < dates.holidays.length; e++) {
                var curHol = dates.holidays[e];
                var pos = i;
                if (words[pos] === curHol[0]) {
                    for (var x = 0; x < curHol.length; x++) {
                        if (words[pos] === curHol[x]) {
                            if (x === curHol.length - 1) {
                                if (dates.dateObj.getMonth() <= dates.holidaysD[e][1] + 1) {
                                    
                                    dateObj = dates.constructDateObj(dates.year.lookForYear(i), dates.holidaysD[e][1], dates.holidaysD[e][0]);
                                    dateObj.preview = knwl.tasks.preview(i);
                                    dateObj.found = i;
                                } else {
                                    dateObj = dates.constructDateObj(dates.year.lookForYear(i), dates.holidaysD[e][1], dates.holidaysD[e][0]);
                                    dateObj.preview = knwl.tasks.preview(i);
                                    dateObj.found = i;
                                }
                                results.push(dateObj);
                            }
                        } else {
                            break;
                        }
                        pos++;
                    }
                }
    
            }
        }
    
        //for dates like "2013-12-15" (YMD)
        var dateObj = {};
        for (var i = 0; i < words.length; i++) {
            var temp = words[i].split(/[-]+/);
            if (temp.length === 3) {
                var numSets = 0;
                for (var x = 0; x < temp.length; x++) {
                    if (isNaN(temp[x]) === false) {
                        numSets++;
    
                    }
                }
                if (numSets === 3) {
                    if (temp[0].length === 4 && (temp[1].length === 2 || temp[1].length === 1) && (temp[2].length === 2 || temp[2].length === 1)) {
                        for (var x = 0; x < temp.length; x++) {
                            temp[x] = parseInt(temp[x]);
                        }
                        if (temp[1] > 0 && temp[1] < 13) {
                            if (temp[2] > 0 && temp[2] < 32) {
                                if (temp[0] > 0) {
                                    dateObj = dates.constructDateObj(temp[0], temp[1], temp[2]);
                                    dateObj.preview = knwl.tasks.preview(i, words);
                                    dateObj.found = i;
                                    results.push(dateObj);
                                }
                            }
                        }
    
                    }
                }
    
            }
        }
        return results;
    };
    var dates = this;
};

module.exports = Dates;
},{}],2:[function(require,module,exports){
/* Email Parser */
function Emails(knwl) {
    
    this.languages = {
        'english': true,
    };

    this.test = /\b[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,4}|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\b/i;

    this.calls = function() {
        var results = [], match = "";
        var words = knwl.words.get('linkWordsCasesensitive');
        for (var i = 0; i < words.length; i++) {
            var word = words[i].split(/[\,\|\(\)\?]/g);
            for (var j = 0; j < word.length; j++) {
            	var temp = word[j].replace(/[()!]/g, '');
                temp = temp.replace(/[,]/g, '');
                if (emails.test.test(temp)) {
                    match = temp.match(emails.test)[0];
                    var emailObj = {
                        address: match,
                        preview: knwl.tasks.preview(i),
                        found: i
                    };
                    results.push(emailObj);
               }
            }
        }
        return results;
    };
    var emails = this;
};
module.exports = Emails;
},{}],3:[function(require,module,exports){
/* Link Parser */
function Links(knwl) {
    
    this.languages = {
        'english': true,
    };

    this.calls = function() {
        var results = [];
        var words = knwl.words.get('linkWords');

        for (var i = 0; i < words.length; i++) {
            var word = words[i].replace(/[\(\)!]/g, ""); // replaces every bracket ')' or '(' and every '!' with an empty character
            if (/^(https?|ftp):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i.test(word)) {
                var link = word;
                if (link[link.length - 1].search(/[?.!,]/g) !== -1) {
                    link = link.substr(0, link.length-1);
                }
                var linkObj = {
                    link: link,
                    preview: knwl.tasks.preview(i),
                    found: i
                };

                results.push(linkObj);
            }
        }
        return results;
    };
};

module.exports = Links;
},{}],4:[function(require,module,exports){
/* Phone Number Parser */
function Phones(knwl) {
    
    this.languages = {
        'english': true,
    };

    this.areaCodeLength = 3; // Hard code this assumption for now
    
    // IMPORTANT: This function makes the assumption that there is always 3 digits in an area code
    this.formatPhoneNumber = function(number) {
        var formattedNumber = number.slice(number.length - 7, number.length - 4) + "-" +
        number.slice(number.length - 4, number.length);
    
        formattedNumber = "(" + number.slice(number.length - (phones.areaCodeLength + 7), number.length - 7) + ") " +
        formattedNumber;
    
        if (number.length > (phones.areaCodeLength + 7)) {
            formattedNumber = "+" + number.slice(0, number.length - (phones.areaCodeLength + 7)) +
            " " + formattedNumber;
        }
        return formattedNumber;
    };
    
    this.calls = function() {
        var results = [];
        
        var words = knwl.words.get('words');
        var currWord = null;
        
        /* Phone Numbers can be as little as 7 digits per word,
           and as large as 13 if the word contains country code & area code & phone number
           note: this applies to North American area codes assuming 3 digits
           and is not applicable globally */
           var phoneRegexp = /^\d{7,13}$/;
        // North American Area Code's always have 3 digits
        // To make this universal, could use a dictionary keyed on Country
        var areaCodeRegExp = /^\d{3}$/;
        // Country Code's vary from 1 to 3 digits
        var countryCodeRegExp = /^\d{1,3}$/;
    
        for (var i = 0; i < words.length; i++) {
            currWord = knwl.tasks.removeCharacters(["-", "(", ")"], words[i]);
    
            if (phoneRegexp.test(currWord)) {
                /* At this point the word is thought to be a phone number.
                   If the current word is only of length 7 it's required that the previous word
                   is the area code, assuming there is a previous word. */
                   if (i > 0 && currWord.length === 7) {
                    var areaCode = knwl.tasks.removeCharacters(["(", ")"], words[i - 1]);
                    if (areaCodeRegExp.test(areaCode)) {
                        currWord = areaCode + currWord;
    
                        /* At this point the current word and previous word make up the area code
                           and phone number.
                           Check whether the 2 words back represents the country code */
                           if (i > 1) {
                            var countryCode = knwl.tasks.removeCharacters("+", words[i - 2]);
                            if (countryCodeRegExp.test(countryCode)) {
                                currWord = countryCode + currWord;
                            }
                        }
                    }
                    /* If the current word is not length 7, it's possible that the current word contains
                   both the phone number and area code and the previous word is the country code.
                   Once again, this is assuming that the areaCode length is 3 */
               } else if (i > 0 && currWord.length === (phones.areaCodeLength + 7)) {
                var countryCode = knwl.tasks.removeCharacters("+", words[i - 1]);
                if (countryCodeRegExp.test(countryCode)) {
                    currWord = countryCode + currWord;
                }
            }
    
                /* We needed the phoneRegex to accept a minimum of 7 digits in case the preceding words
                   made up the area code and possibly the country code, but if at this point there is
                   not at least 7 digits plus the areaCodeLength in the currWord then it is not likely
                   a phone number */
                   if (currWord.length >= (7 + phones.areaCodeLength)) {
                    var phoneObj = {
                        phone: phones.formatPhoneNumber(currWord),
                        preview: knwl.tasks.preview(i),
                        found: i
                    };
                    results.push(phoneObj);
                }
            }
        }
        return results;
    };
    var phones = this;
};

module.exports = Phones;

},{}],5:[function(require,module,exports){
/* Place Parser */
function Places(knwl) {
  
  this.languages = {
    'english': true,
  };
  
  this.countryList = [
    {name: 'Afghanistan', code: 'AF'},
    {name: 'Ã…land Islands', code: 'AX'},
    {name: 'Albania', code: 'AL'},
    {name: 'Algeria', code: 'DZ'},
    {name: 'American Samoa', code: 'AS'},
    {name: 'AndorrA', code: 'AD'},
    {name: 'Angola', code: 'AO'},
    {name: 'Anguilla', code: 'AI'},
    {name: 'Antarctica', code: 'AQ'},
    {name: 'Antigua and Barbuda', code: 'AG'},
    {name: 'Argentina', code: 'AR'},
    {name: 'Armenia', code: 'AM'},
    {name: 'Aruba', code: 'AW'},
    {name: 'Australia', code: 'AU'},
    {name: 'Austria', code: 'AT'},
    {name: 'Azerbaijan', code: 'AZ'},
    {name: 'Bahamas', code: 'BS'},
    {name: 'Bahrain', code: 'BH'},
    {name: 'Bangladesh', code: 'BD'},
    {name: 'Barbados', code: 'BB'},
    {name: 'Belarus', code: 'BY'},
    {name: 'Belgium', code: 'BE'},
    {name: 'Belize', code: 'BZ'},
    {name: 'Benin', code: 'BJ'},
    {name: 'Bermuda', code: 'BM'},
    {name: 'Bhutan', code: 'BT'},
    {name: 'Bolivia', code: 'BO'},
    {name: 'Bosnia and Herzegovina', code: 'BA'},
    {name: 'Botswana', code: 'BW'},
    {name: 'Bouvet Island', code: 'BV'},
    {name: 'Brazil', code: 'BR'},
    {name: 'British Indian Ocean Territory', code: 'IO'},
    {name: 'Brunei Darussalam', code: 'BN'},
    {name: 'Bulgaria', code: 'BG'},
    {name: 'Burkina Faso', code: 'BF'},
    {name: 'Burundi', code: 'BI'},
    {name: 'Cambodia', code: 'KH'},
    {name: 'Cameroon', code: 'CM'},
    {name: 'Canada', code: 'CA'},
    {name: 'Cape Verde', code: 'CV'},
    {name: 'Cayman Islands', code: 'KY'},
    {name: 'Central African Republic', code: 'CF'},
    {name: 'Chad', code: 'TD'},
    {name: 'Chile', code: 'CL'},
    {name: 'China', code: 'CN'},
    {name: 'Christmas Island', code: 'CX'},
    {name: 'Cocos (Keeling) Islands', code: 'CC'},
    {name: 'Colombia', code: 'CO'},
    {name: 'Comoros', code: 'KM'},
    {name: 'Congo', code: 'CG'},
    {name: 'Congo, The Democratic Republic of the', code: 'CD'},
    {name: 'Cook Islands', code: 'CK'},
    {name: 'Costa Rica', code: 'CR'},
    {name: 'Cote D\'Ivoire', code: 'CI'},
    {name: 'Croatia', code: 'HR'},
    {name: 'Cuba', code: 'CU'},
    {name: 'Cyprus', code: 'CY'},
    {name: 'Czech Republic', code: 'CZ'},
    {name: 'Denmark', code: 'DK'},
    {name: 'Djibouti', code: 'DJ'},
    {name: 'Dominica', code: 'DM'},
    {name: 'Dominican Republic', code: 'DO'},
    {name: 'Ecuador', code: 'EC'},
    {name: 'Egypt', code: 'EG'},
    {name: 'El Salvador', code: 'SV'},
    {name: 'Equatorial Guinea', code: 'GQ'},
    {name: 'Eritrea', code: 'ER'},
    {name: 'Estonia', code: 'EE'},
    {name: 'Ethiopia', code: 'ET'},
    {name: 'Falkland Islands (Malvinas)', code: 'FK'},
    {name: 'Faroe Islands', code: 'FO'},
    {name: 'Fiji', code: 'FJ'},
    {name: 'Finland', code: 'FI'},
    {name: 'France', code: 'FR'},
    {name: 'French Guiana', code: 'GF'},
    {name: 'French Polynesia', code: 'PF'},
    {name: 'French Southern Territories', code: 'TF'},
    {name: 'Gabon', code: 'GA'},
    {name: 'Gambia', code: 'GM'},
    {name: 'Georgia', code: 'GE'},
    {name: 'Germany', code: 'DE'},
    {name: 'Ghana', code: 'GH'},
    {name: 'Gibraltar', code: 'GI'},
    {name: 'Greece', code: 'GR'},
    {name: 'Greenland', code: 'GL'},
    {name: 'Grenada', code: 'GD'},
    {name: 'Guadeloupe', code: 'GP'},
    {name: 'Guam', code: 'GU'},
    {name: 'Guatemala', code: 'GT'},
    {name: 'Guernsey', code: 'GG'},
    {name: 'Guinea', code: 'GN'},
    {name: 'Guinea-Bissau', code: 'GW'},
    {name: 'Guyana', code: 'GY'},
    {name: 'Haiti', code: 'HT'},
    {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
    {name: 'Holy See (Vatican City State)', code: 'VA'},
    {name: 'Honduras', code: 'HN'},
    {name: 'Hong Kong', code: 'HK'},
    {name: 'Hungary', code: 'HU'},
    {name: 'Iceland', code: 'IS'},
    {name: 'India', code: 'IN'},
    {name: 'Indonesia', code: 'ID'},
    {name: 'Iran, Islamic Republic Of', code: 'IR'},
    {name: 'Iraq', code: 'IQ'},
    {name: 'Ireland', code: 'IE'},
    {name: 'Isle of Man', code: 'IM'},
    {name: 'Israel', code: 'IL'},
    {name: 'Italy', code: 'IT'},
    {name: 'Jamaica', code: 'JM'},
    {name: 'Japan', code: 'JP'},
    {name: 'Jersey', code: 'JE'},
    {name: 'Jordan', code: 'JO'},
    {name: 'Kazakhstan', code: 'KZ'},
    {name: 'Kenya', code: 'KE'},
    {name: 'Kiribati', code: 'KI'},
    {name: 'Korea, Democratic People\'S Republic of', code: 'KP'},
    {name: 'Korea, Republic of', code: 'KR'},
    {name: 'Kuwait', code: 'KW'},
    {name: 'Kyrgyzstan', code: 'KG'},
    {name: 'Lao People\'S Democratic Republic', code: 'LA'},
    {name: 'Latvia', code: 'LV'},
    {name: 'Lebanon', code: 'LB'},
    {name: 'Lesotho', code: 'LS'},
    {name: 'Liberia', code: 'LR'},
    {name: 'Libyan Arab Jamahiriya', code: 'LY'},
    {name: 'Liechtenstein', code: 'LI'},
    {name: 'Lithuania', code: 'LT'},
    {name: 'Luxembourg', code: 'LU'},
    {name: 'Macao', code: 'MO'},
    {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
    {name: 'Madagascar', code: 'MG'},
    {name: 'Malawi', code: 'MW'},
    {name: 'Malaysia', code: 'MY'},
    {name: 'Maldives', code: 'MV'},
    {name: 'Mali', code: 'ML'},
    {name: 'Malta', code: 'MT'},
    {name: 'Marshall Islands', code: 'MH'},
    {name: 'Martinique', code: 'MQ'},
    {name: 'Mauritania', code: 'MR'},
    {name: 'Mauritius', code: 'MU'},
    {name: 'Mayotte', code: 'YT'},
    {name: 'Mexico', code: 'MX'},
    {name: 'Micronesia, Federated States of', code: 'FM'},
    {name: 'Moldova, Republic of', code: 'MD'},
    {name: 'Monaco', code: 'MC'},
    {name: 'Mongolia', code: 'MN'},
    {name: 'Montserrat', code: 'MS'},
    {name: 'Morocco', code: 'MA'},
    {name: 'Mozambique', code: 'MZ'},
    {name: 'Myanmar', code: 'MM'},
    {name: 'Namibia', code: 'NA'},
    {name: 'Nauru', code: 'NR'},
    {name: 'Nepal', code: 'NP'},
    {name: 'Netherlands', code: 'NL'},
    {name: 'Netherlands Antilles', code: 'AN'},
    {name: 'New Caledonia', code: 'NC'},
    {name: 'New Zealand', code: 'NZ'},
    {name: 'Nicaragua', code: 'NI'},
    {name: 'Niger', code: 'NE'},
    {name: 'Nigeria', code: 'NG'},
    {name: 'Niue', code: 'NU'},
    {name: 'Norfolk Island', code: 'NF'},
    {name: 'Northern Mariana Islands', code: 'MP'},
    {name: 'Norway', code: 'NO'},
    {name: 'Oman', code: 'OM'},
    {name: 'Pakistan', code: 'PK'},
    {name: 'Palau', code: 'PW'},
    {name: 'Palestinian Territory, Occupied', code: 'PS'},
    {name: 'Panama', code: 'PA'},
    {name: 'Papua New Guinea', code: 'PG'},
    {name: 'Paraguay', code: 'PY'},
    {name: 'Peru', code: 'PE'},
    {name: 'Philippines', code: 'PH'},
    {name: 'Pitcairn', code: 'PN'},
    {name: 'Poland', code: 'PL'},
    {name: 'Portugal', code: 'PT'},
    {name: 'Puerto Rico', code: 'PR'},
    {name: 'Qatar', code: 'QA'},
    {name: 'Reunion', code: 'RE'},
    {name: 'Romania', code: 'RO'},
    {name: 'Russian Federation', code: 'RU'},
    {name: 'RWANDA', code: 'RW'},
    {name: 'Saint Helena', code: 'SH'},
    {name: 'Saint Kitts and Nevis', code: 'KN'},
    {name: 'Saint Lucia', code: 'LC'},
    {name: 'Saint Pierre and Miquelon', code: 'PM'},
    {name: 'Saint Vincent and the Grenadines', code: 'VC'},
    {name: 'Samoa', code: 'WS'},
    {name: 'San Marino', code: 'SM'},
    {name: 'Sao Tome and Principe', code: 'ST'},
    {name: 'Saudi Arabia', code: 'SA'},
    {name: 'Senegal', code: 'SN'},
    {name: 'Serbia and Montenegro', code: 'CS'},
    {name: 'Seychelles', code: 'SC'},
    {name: 'Sierra Leone', code: 'SL'},
    {name: 'Singapore', code: 'SG'},
    {name: 'Slovakia', code: 'SK'},
    {name: 'Slovenia', code: 'SI'},
    {name: 'Solomon Islands', code: 'SB'},
    {name: 'Somalia', code: 'SO'},
    {name: 'South Africa', code: 'ZA'},
    {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
    {name: 'Spain', code: 'ES'},
    {name: 'Sri Lanka', code: 'LK'},
    {name: 'Sudan', code: 'SD'},
    {name: 'Suriname', code: 'SR'},
    {name: 'Svalbard and Jan Mayen', code: 'SJ'},
    {name: 'Swaziland', code: 'SZ'},
    {name: 'Sweden', code: 'SE'},
    {name: 'Switzerland', code: 'CH'},
    {name: 'Syrian Arab Republic', code: 'SY'},
    {name: 'Taiwan, Province of China', code: 'TW'},
    {name: 'Tajikistan', code: 'TJ'},
    {name: 'Tanzania, United Republic of', code: 'TZ'},
    {name: 'Thailand', code: 'TH'},
    {name: 'Timor-Leste', code: 'TL'},
    {name: 'Togo', code: 'TG'},
    {name: 'Tokelau', code: 'TK'},
    {name: 'Tonga', code: 'TO'},
    {name: 'Trinidad and Tobago', code: 'TT'},
    {name: 'Tunisia', code: 'TN'},
    {name: 'Turkey', code: 'TR'},
    {name: 'Turkmenistan', code: 'TM'},
    {name: 'Turks and Caicos Islands', code: 'TC'},
    {name: 'Tuvalu', code: 'TV'},
    {name: 'Uganda', code: 'UG'},
    {name: 'Ukraine', code: 'UA'},
    {name: 'United Arab Emirates', code: 'AE'},
    {name: 'United Kingdom', code: 'GB'},
    {name: 'United States', code: 'US'},
    {name: 'United States Minor Outlying Islands', code: 'UM'},
    {name: 'Uruguay', code: 'UY'},
    {name: 'Uzbekistan', code: 'UZ'},
    {name: 'Vanuatu', code: 'VU'},
    {name: 'Venezuela', code: 'VE'},
    {name: 'Viet Nam', code: 'VN'},
    {name: 'Virgin Islands, British', code: 'VG'},
    {name: 'Virgin Islands, U.S.', code: 'VI'},
    {name: 'Wallis and Futuna', code: 'WF'},
    {name: 'Western Sahara', code: 'EH'},
    {name: 'Yemen', code: 'YE'},
    {name: 'Zambia', code: 'ZM'},
    {name: 'Zimbabwe', code: 'ZW'}
  ];
  
  this.falsePlaces = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'His', 'He', 'Her', 'Hers', 'Who', 'Whom', 'Whose', 'PM', 'AM', 'The'];
  this.triggers = [['at'], ['near'], ['close', 'to'], ['above'], ['below'], ['to'], ['leaving'], ['arriving', 'at']];
  this.calls = function() {
      var words = knwl.words.get('linkWordsCasesensitive');
      var triggers = places.triggers;
      var results = [];
  
      for (var i = 0; i < words.length; i++) {
          words[i] = words[i].replace(/[()!,.]/g, ''); //clean up
          var isMatch = false;
          for (var ee = 0; ee < triggers.length; ee++) {
              if (words[i] === triggers[ee][0]) {
                  if (triggers[ee].length > 0) {
                      var pos = i + 1;
                      isMatch = true;
                      for (var zz = 1; zz < triggers[ee].length; zz++) {
                          if (words[pos] !== triggers[ee][zz]) {
                              isMatch = false;
                          }
                          pos++;
                      }
                  } else {
                      isMatch = true;
                  }
              }
          }
          if (isMatch) {
              var word = [];
              var j = 1;
              while (words[i + j] !== 'at' && words[i + j] !== 'in' && words[i + j] !== 'near' && !/^.*(\.|\,|\?|\!)+$/.test(words[i + j - 1]) && i + j < words.length) {
                  var temp = words[i + j].replace(/[\,\.]/, '');
                  if (/^[A-Z](.*)$/.test(temp)) {
                      if (i + 4 > (i + j)) {
                          word.push(temp);
                      }
                  }
                  j++;
              }
              if (word.length > 0 && word.length < 3) {
                  var isFalsePlace = false;
  
                  //make sure place is not an invalid location
                  for (var y = 0; y < word.length; y++) {
                      for (var x = 0; x < places.falsePlaces.length; x++) {
                          if (word[y] === places.falsePlaces[x]) {
                              isFalsePlace = true;
                          } else if (word[y].length < 2) {
                              isFalsePlace = true;
                          }
                      }
                      word[y] = word[y].replace(/['’?!]/g, '');
                  }
                  if (isFalsePlace === false) {
                      var placeObj = {
                          place: word.join(' '),
                          preview: knwl.tasks.preview(i),
                          found: i
                      };
                      results.push(placeObj);
                  }
              }
              i += j - 1;
          }
          
          if (isMatch === false || isFalsePlace === true) {
            for (var ee = 0; ee < places.countryList.length; ee++) {
              var country = places.countryList[ee].name.split(' ');
              if (country[0].toLowerCase() === words[i].replace(/[()!,.]/g, '').toLowerCase()) {
                var isCountry = true;
                for (var zz = 0; zz < country.length; zz++) {
                  if (country[zz].length === 0) {
                    break;
                  }
                  if (words[i + zz] === undefined) {
                    isCountry = false;
                    break;
                  }
                  if (country[zz].toLowerCase() !== words[i + zz].replace(/[()!,.]/g, '').toLowerCase()) {
                    isCountry = false;
                    break;
                  }
                }
                if (isCountry) {
                  var placeObj = {
                      place: places.countryList[ee].name,
                      preview: knwl.tasks.preview(i),
                      found: i
                  };
                  results.push(placeObj);
                }
              }
            }
          }
      }
  
      return results;
  
  };
  
  var places = this;

};
module.exports = Places;

},{}],6:[function(require,module,exports){
/* Time Parser */
function Times(knwl) {
    
    this.languages = {
        'english': true,
    };
    
    this.calls = function() {

        var words = knwl.words.get('words'), times = [];
        for (var i = 0; i < words.length; i++) {
            var timeObj = {};
            var testTime = words[i].split(":");
            if (testTime.length === 2) {
                var daynight = false;
                if (testTime[1].search('am') !== -1) {
                    testTime[1] = testTime[1].slice(0, testTime[1].length - 2);
                    daynight = 'AM';
                } else if (testTime[1].search('pm') !== -1) {
                    testTime[1] = testTime[1].slice(0, testTime[1].length - 2);
                    daynight = 'PM';
                }
                if (!isNaN(testTime[0]) && !isNaN(testTime[1])) {
                    if (testTime[0] > 0 && testTime[0] < 13) {
                        if (testTime[1] >= 0 && testTime[1] < 61) {
                            if (words[i + 1] === "pm") {
                                timeObj.hour = testTime[0];
                                timeObj.minute = testTime[1];
                                timeObj.daynight = "PM",
                                timeObj.preview = knwl.tasks.preview(i);
                                timeObj.found = i;
                                times.push(timeObj);
                            } else if (words[i + 1] === "am") {
                                timeObj.hour = testTime[0];
                                timeObj.minute = testTime[1];
                                timeObj.daynight = "AM",
                                timeObj.preview = knwl.tasks.preview(i);
                                timeObj.found = i;
                                times.push(timeObj);
                            } else {
                                if (daynight !== false) {
                                    timeObj.hour = testTime[0];
                                    timeObj.minute = testTime[1];
                                    timeObj.daynight = "Unknown",
                                    timeObj.preview = knwl.tasks.preview(i);
                                    timeObj.found = i;
                                    times.push(timeObj);
                                }
                            }
                        }
                    }
                }
            }

        }
        var timeObj = {};
        for (var i = 0; i < words.length; i++) {
            if (words[i].split(":").length === 1) {
                if (isNaN(words[i]) !== true) { //is a number
                    var temp = parseInt(words[i]);
                    if (temp > 0 && temp < 13) {
                        if (words[i + 1] === "am" || words[i + 1] === "pm") {
                            timeObj.hour = temp;
                            timeObj.minute = '00';
                            timeObj.daynight = words[i + 1].toUpperCase(),
                            timeObj.preview = knwl.tasks.preview(i);
                            timeObj.found = i;
                            times.push(timeObj);
                        }
                    }
                } else if (words[i].search('am') !== -1) {
                    var temp = words[i];
                    temp = temp.slice(0, temp.length - 2);
                    temp = parseInt(temp);
                    if (isNaN(temp) !== true) {
                        if (temp > 0 && temp < 13) {
                            timeObj.hour = temp;
                            timeObj.minute = '00';
                            timeObj.daynight = 'AM',
                            timeObj.preview = knwl.tasks.preview(i);
                            timeObj.found = i;
                            times.push(timeObj);
                        }
                    }
                } else if (words[i].search('pm') !== -1) {
                    var temp = words[i];
                    temp = temp.slice(0, temp.length - 2);
                    temp = parseInt(temp);
                    if (isNaN(temp) !== true) {
                        if (temp > 0 && temp < 13) {
                            timeObj.hour = temp;
                            timeObj.minute = '00';
                            timeObj.daynight = 'PM',
                            timeObj.preview = knwl.tasks.preview(i);
                            timeObj.found = i;
                            times.push(timeObj);
                        }
                    }
                }
            }
        }
        return times;
    };
};
module.exports = Times;

},{}],7:[function(require,module,exports){
function Knwl(language) {
	this.language = 'unknown';
	if (language !== undefined)
		this.language = language;
	
	this.tasks = {};
	
	this.tasks.escapeRegExp = function(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	};
	
	this.tasks.removeCharacters = function(charArray, str) {
		for (var ii = 0; ii < charArray.length; ii++)
            str = str.replace(new RegExp(knwl.tasks.escapeRegExp(charArray[ii]), 'g'), '');
        return str;
	};
	
	this.tasks.search = function(terms, words) {
		var results = [];
        for (var i = 0; i < words.length; i++) {
            for (var e = 0; e < terms.length; e++) {
                var curHol = terms[e];
                var pos = i;
                if (words[pos] === curHol[0]) {
                    for (var x = 0; x < curHol.length; x++) {
                        if (words[pos] === curHol[x]) {
                            if (x === curHol.length - 1) {
                                results.push(curHol);
                            }
                        }
                        pos++;
                    }
                }
            }
        }
        return results;
	};
	
	this.tasks.preview = function(position) { // used to get the entire sentence or a portion of it (depending on size), in a human-readable format, from a position
		var words = knwl.words.linkWordsCasesensitive;
		var sentence = '';
		
		var startPos = position;
		var endPos = position;
		
		for (var ii = position; ii > -1; ii--) {
			startPos = ii;
			if (words[ii][words[ii].length - 1] !== undefined) {
				if (words[ii][words[ii].length - 1].search(/[?!.]/g) !== -1) {
					if (position - startPos > 0)
						startPos = ii + 1;
					break;
				} else if (position - startPos > 10) {
					break;
				}
			}
		}
		
		for (var ii = position; ii < words.length; ii++) {
			endPos = ii;
			if (words[ii][words[ii].length - 1] !== undefined) {
				if (words[ii][words[ii].length - 1].search(/[?!.]/g) !== -1) {
					break;
				} else if (endPos - position > 10) {
					break;
				}
			}
		}
		
		sentence += words[startPos];
		for (var ii = startPos + 1; ii <= endPos; ii++) {
			sentence += ' ' + words[ii];
		}
		return sentence;
	};
	
	this.words = {
		words: [],
		linkWords: [],
		linkWordsCasesensitive: []
	};
	this.words.get = function(typeStr) { //retrieve words from database
        if (knwl.words[typeStr] !== undefined) {
            return knwl.words[typeStr].concat([]);
        }
    };
	this.words.getSentence = function(pos, typeStr) { //used to get the entire sentence a position occurs in, in a specific format
		var fullWords = knwl.words.get('linkWordsCasesensitive');
		var typeWords = knwl.words.get(typeStr);
		
		var startPos = pos;
		var begin = 0;
		var sentence = [];
		for (var ii = startPos; ii > -1; ii--) {
			if (fullWords[ii][fullWords[ii].length - 1].search(/[?!.]/g) !== -1) {
				if (startPos - begin > 0)
					begin = ii + 1;
				break;
			}
		}
		var end = 0;
		for (var ii = startPos; ii < fullWords.length; ii++) {
			end = ii;
			if (fullWords[ii][fullWords[ii].length - 1].search(/[?!.]/g) !== -1) {
				break;
			}
		}
		
		for (var ii = begin; ii <= end; ii++) {
			sentence.push(typeWords[ii]);
		}
		console.log(sentence);
	};
	
	this.init = function(str) {
		var lowercase = str.toLowerCase();
		var linkWords = lowercase.split(/[ \n]+/);
		var linkWordsCaseSensitive = str.split(/[ \n]+/);
		lowercase = lowercase.split(/[\n ]+/);
		
		for (var ii = 0; ii < lowercase.length; ii++)
			lowercase[ii] = lowercase[ii].replace(/[ ,?!]/g, '').replace(/["]/g, "'");
		
		var words = [];
		for (var ii = 0; ii < lowercase.length; ii++)
			words[ii] = lowercase[ii].split(/[.,!?]+/)[0];
		
		knwl.words.linkWordsCasesensitive = linkWordsCaseSensitive;
		knwl.words.linkWords = linkWords;
		knwl.words.words = words;
		return knwl.words;
	};
	this.get = function(parser) {
		if (this.plugins[parser] !== undefined) {
            try {
                var args = arguments;
                var data = knwl.plugins[parser].calls(args);
                return data;
            } catch (error) {
                console.error('Knwl.js Error', 'Error running parser plugin "' + parser + '"', error);
                return false;
            }
        } else {
            console.error('Knwl.js Error', 'Parser plugin "' + parser + '" not found.');
            return false;
        }
	};
	
	this.plugins = {};
	this.register = function (name, Plugin) {
        knwl.plugins[name] = new Plugin(knwl);
        if (knwl.plugins[name].languages !== undefined && knwl.language !== 'unknown') {
            if (knwl.plugins[name].languages[knwl.language] === undefined || knwl.plugins[name].languages[knwl.language] === false) {
                return {'Knwl.js Error': 'Parser plugin does not seem to support the specified language.'};
            }
        }
        return knwl;  
    };
	
	var knwl = this;
	
	// load default plugins
    this.register('dates', require('./default_plugins/dates'));
    this.register('times', require('./default_plugins/times'));
    
    this.register('emails', require('./default_plugins/emails'));
    this.register('links', require('./default_plugins/links'));
    this.register('phones', require('./default_plugins/phones'));
    
    this.register('places', require('./default_plugins/places'));
};

module.exports = Knwl;
},{"./default_plugins/dates":1,"./default_plugins/emails":2,"./default_plugins/links":3,"./default_plugins/phones":4,"./default_plugins/places":5,"./default_plugins/times":6}]},{},[7])(7)
});