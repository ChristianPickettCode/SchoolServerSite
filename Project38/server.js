
var subjectList = [];
var subjectColorList = {};
var todaysData = true;

DayNums = {

  1 : "Mon",
  2 : "Tues",
  3 : "Wed",
  4 : "Thurs",
  5 : "Fri",
  6 : "Sat",
  0 : "Sun"

}

files = {
  "arts fall" : "./JSONData/ArtsFall2017JSONData.json",
  "science fall" : "./JSONData/ScienceFall2017JSONData.json",
  "management fall" : "./JSONData/ManagementFall2017JSONData.json",
  "engineering fall" : "./JSONData/EngineeringFall2017JSONData.json"
}

var getUrlParams = function getUrlParams(param) {
  var sPageUrl = decodeURIComponent(window.location.search.substring(1));
  var sURLVars = sPageUrl.split('&');
  var sParamName;

  for (var i = 0; i < sURLVars.length; i++) {
    sParamName = sURLVars[i].split('=');
    if(sParamName[0] === param) {
      return sParamName[1] === undefined ? true : sParamName[1];
    }
  }

}


function init() {

  var subject = getUrlParams('subject');
  var term = getUrlParams('term');

  getJsonData(subject, term);


}

function getJsonData(subject, term) {

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {

      coursesData = JSON.parse(this.responseText);
      coursesDataJustLectures  = []
      for (i = 0; i < coursesData.length; i++) {
        //console.log(coursesData[i].Type)
        if (coursesData[i].Type == "Lecture"  && coursesData[i].Days != "TBA" && coursesData[i].Time != "TBA") {
          coursesDataJustLectures.push(coursesData[i]);
        }
      }
      coursesData = coursesDataJustLectures;

      addCoursesToPage(coursesData, true);
    }
  }

  var fileKey = subject + " " + term;
  var inputFileName = files[fileKey]
  //console.log(inputFileName)

  // ArtsFall2017JSONData.json
  // ScienceFall2017JSONData.json
  // TestJSONData.json
  //var inputFileName = "ScienceFall2017JSONData.json"
  xhttp.open("GET", inputFileName, true);
  xhttp.send();

}


function toggleData() {
  if (todaysData) {
    todaysData = false;
  }else {
    todaysData = true
  }
  addCoursesToPage(coursesData, todaysData, null);
  //console.log("Pressed")
}

function searchCourseBasedOnSubject() {
  var x = document.getElementById('courseSuggestions').selectedIndex;
  var searchVal = document.getElementsByTagName("option")[x].value;
  //console.log(searchVal)
  addCoursesToPage(coursesData, false, searchVal);
}

function addCoursesToPage(coursesData, today, search) {

  var coursesToday = [];
  var specifiedSubjectArr = [];

  for (var i = 0; i < coursesData.length; i++) {

    if (subjectList.indexOf(coursesData[i].Subject) <= -1) {
      subjectList.push(coursesData[i].Subject);

      subjectColorList[coursesData[i].Subject] = randomColor();

    }

    if (isCourseToday(coursesData[i].Days) == true) {
      coursesToday.push(coursesData[i]);
    }

    if (search != null && isCourseToday(coursesData[i].Days) == true) {
      if (search === coursesData[i].Subject) {
        specifiedSubjectArr.push(coursesData[i])
        //console.log("ok")
      }
    }
    else if (search != null) {
      if (search === coursesData[i].Subject) {
        specifiedSubjectArr.push(coursesData[i])

      }
    }

  }
  document.getElementById('courseSuggestions').options.length = 0;
  var courseSuggSelect = document.getElementById('courseSuggestions');

  for (var i = 0; i < subjectList.length; i++) {
    var option = document.createElement("option");
    option.text = subjectList[i];
    courseSuggSelect.add(option);
  }

  var strOut = ""
  //console.log(specifiedSubjectArr)

  if (search != null) {
    strOut = htmlOutput(specifiedSubjectArr);
  } else {
    if (today) {
      strOut = htmlOutput(coursesToday, today);

    } else {
      strOut = htmlOutput(coursesData, today);
    }
  }

  document.getElementById('output').innerHTML = strOut;

}

function randomColor () {
  var letters = 'BCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

function randomColor2() {
  var hue = Math.floor(Math.random() * 360);
  var pastel = 'hsl(' + hue + ', 100%, 87.5%)';
  return pastel;
}

function changeTo(x) {
  console.log("enter")
  if (x.getAttribute('courseData') === "nill") {
    x.setAttribute('courseData', x.innerHTML);
  }
  var capacity = x.getAttribute('capacity');
  var location = x.getAttribute('location');
  x.innerHTML = "<p class='item'> Location: " + location + "<br>\
                Capacity: " + capacity+ "</p>"

}
function changeBack(x) {
  x.innerHTML = x.getAttribute('courseData');

}

function htmlOutput(coursesArr, today) {

  var year = "2017-2018"
  var url = "https://www.mcgill.ca/study/" + year + "/courses/"
  var strOut = "<ul>";

  for (i = 0; i < coursesArr.length; i++) {
    var timeTillStarts = timeTillClass(coursesArr[i].Time, "start");
    var timeTillEnd = timeTillClass(coursesArr[i].Time, "end");
    //console.log("TimeStart: " + timeTillStarts)
    //console.log("TimeEnd: " + timeTillEnd)
    var phrase = ""
    var color = subjectColorList[coursesArr[i].Subject];
    var fontColor = '';


    if (today) {
      fontColor = 'white';
      if (timeTillStarts > 0) {
        phrase =  "Starts At: "
        var hours = Math.floor(timeTillStarts / 60);
        var minutes = timeTillStarts % 60;
        var time = hours + ":" + minutes
        phrase += parseTime(coursesArr[i].Time)[0]

        if (hours <= 0) {
          phrase += "<br>In " + minutes + " minute(s)"
        } else {
          phrase += "<br>In " + hours + " hour(s)"
        }
        color = "#b8d095" // Green
      } else {

        if (timeTillEnd > 0) {

          var hours = Math.floor(timeTillEnd / 60);
          var minutes = timeTillEnd % 60;
          var time = hours + ":" + minutes
          var timePhrase = "";
          if (hours <= 0) {
            timePhrase += "in " + minutes + " minute(s)"
          } else {
            timePhrase += "in " + hours + " hour(s)"
          }

          phrase = "Class In Progress <br>Started At: " + parseTime(coursesArr[i].Time)[0] + "<br>Ends "
          phrase += timePhrase
          color = "#f4d48a" // Yellow
        } else {
          phrase = "Started At: "
          phrase += parseTime(coursesArr[i].Time)[0]
          color = "#f2b2a6" // Red
        }
      }
      strOut += "<li style='background-color: " + color + ";' \
                subject='" + coursesArr[i].Subject + "'\
                course='" + coursesArr[i].Course + "'\
                title='" + coursesArr[i].Title + "'\
                capacity='" + coursesArr[i].Capacity + "'\
                location='" + coursesArr[i].Location + "'\
                courseData='nill'>\
                <a style='color: " + fontColor + ";' class='item' target='_blank' \
                href='" + url  + coursesArr[i].Subject + "-" + coursesArr[i].Course + "'> \
                <u>" +  coursesArr[i].Title + "</u><br>\
                " + coursesArr[i].Subject + " - " + coursesArr[i].Course + " <br> \
                Cap: " +  coursesArr[i].Capacity + " - \
                " +  coursesArr[i].Location + " <br>\
                "  + phrase + "\
                </a>\
                </li>"
    }else {
      fontColor = 'black';
      strOut += "<li style='background-color: " + color + ";' \
                subject='" + coursesArr[i].Subject + "'\
                course='" + coursesArr[i].Course + "'\
                title='" + coursesArr[i].Title + "'\
                capacity='" + coursesArr[i].Capacity + "'\
                location='" + coursesArr[i].Location + "'\
                courseData='nill'>\
                <a style='color: " + fontColor + ";' class='item' target='_blank' \
                href='" + url  + coursesArr[i].Subject + "-" + coursesArr[i].Course + "'> \
                <u>" +  coursesArr[i].Title + "</u><br>\
                " + coursesArr[i].Subject + " - " + coursesArr[i].Course + " <br> \
                Cap: " +  coursesArr[i].Capacity + " - \
                " +  coursesArr[i].Location + " <br>\
                " +  coursesArr[i].Days + " <br> \
                " +  coursesArr[i].Time + " <br>\
                </a>\
                </li>"
    }

  }
  strOut += "</ul>"

  return strOut
}

function isCourseToday(days) {

  var isToday = false;

  var d = new Date();
  var day = d.getDay()

  for (i = 0; i < days.length; i++) {
    if (DayNums[day] === days[i]) {
      isToday = true;
    }

  }
  //console.log(isToday)
  return isToday
}

function timeTillClass(time, startOrEnd) {

  var timeArr = parseTime(time)
  var d = new Date();

  var currentTime12 = (d.getHours() - 12) + ":" + d.getMinutes()
  var currentTime24= (d.getHours()) + ":" + d.getMinutes()
  if (startOrEnd === "end") {
    minutes = parseDiffTime24(timeArr, startOrEnd) - parseDiffTime(currentTime24);
  } else {
    minutes = parseDiffTime24(timeArr, startOrEnd) - parseDiffTime(currentTime24);
  }

  return minutes

}

function parseTime(time) {
  var timeArr = []
  timeArr = time.split("-")

  if (time.indexOf('AM') > -1 ) {
    timeArr.push("AM")
  }else {
    timeArr.push("PM")
  }

  return timeArr
}

function parseDiffTime(s) {
  var c = s.split(':');
  return parseInt(c[0]) * 60 + parseInt(c[1]);
}

function parseDiffTime24(s, startOrEnd) {
  if (startOrEnd === "end") {
    var c = s[1].split(':');
  } else {
    var c = s[0].split(':');
  }

  var minutes = 0;
  //console.log(parseInt(s[1].split(':')[0]));
  if (s[0].split(':')[0] === "12") {
    minutes = ((parseInt(c[0])) * 60) + parseInt(c[1]);
    //console.log(s)
  }
  else if (s[2] === "AM") {
    minutes = ((parseInt(c[0])) * 60) + parseInt(c[1]);
  }
   else {
    minutes = ((parseInt(c[0]) + 12) * 60) + parseInt(c[1]);
  }
  //console.log(minutes)
  return minutes
}

window.onload = init;

function refresh(time) {
  setTimeout(function() {
    location.reload();
  }, time * 1000);
}

var timeVal = {
  "5s" : 5,
  "30s" : 30,
  "1m" : 60,
  "5m" : 300,
  "10m" : 600
}

var checkboxChecked = false;
var time = 30

var timeRef = document.URL.split('&')[2].split('=')[1]
time = timeVal[timeRef];
var docURL = document.URL.split('&')[0] + "&" + document.URL.split('&')[1];

if (timeRef != "none") {
  var refOption = $('#autoRefreshSelect').children('option[value="' + timeRef + '"]');
  refOption.attr('selected', true);
}


function selectChange(info) {
  if (info.value !== "none") {
    console.log(info.value);

    window.location.href = docURL + "&autoref=" + info.value;
  } else {
    window.location.href = docURL + "&autoref=none";
    clearTimeout(timer);
  }

}

if (timeRef !== "none") {
  var timer = setTimeout(function() {
    location.reload();
    console.log(time);

  }, time * 1000);
}
//console.log(document.URL);
