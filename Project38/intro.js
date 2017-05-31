function getIntroVals() {
  var introSelectSubject = $("#introSelectSubjects").val();
  var introSelectTerm = $("#introSelectTerm").val();

  if (introSelectSubject != null && introSelectTerm != null) {
    console.log(introSelectSubject, introSelectTerm)
    window.location.href = "courses.html?subject=" + introSelectSubject + "&term=" + introSelectTerm + "&autoref=none";
  }
}
//new
//window.onload = init;
