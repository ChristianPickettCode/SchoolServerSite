$(document).ready(function() {

  var database = firebase.database();
  var suggestionsRef = firebase.database().ref('/suggestions');

  suggestionsRef.on('child_added', function(data) {
    //console.log(data.val().url)
    $("#suggestionsSelector").append("<option value='" + data.val().url + "' ispodcast='" + data.val().isPodcast + "' isjson='" + data.val().isJSON + "' >" + data.val().url + "</option>")
  });


  $("#save").click(function() {
    var feed = $("#in").val();

    var isPodcast = false
    var isJSON = false

    if ($('input.podcast').prop('checked')) { isPodcast = true}
    if ($('input.json').prop('checked')) { isJSON = true}

    if (feed != "") {
      var newSuggest = suggestionsRef.push();
      newSuggest.set({
        url: feed,
        isPodcast:isPodcast,
        isJSON: isJSON
      });
      $("#in").val("");
      $(".json").prop('checked', false);
      $(".podcast").prop('checked', false);
    }else {
      alert("Nothing To Save");
    }

  });


    //feed to parse

    $("#button").click(function(){

      $("#list").empty();

      var feed = $("#in").val();

      var ispodcast = false;
      var isjson = false;

      if (feed == "") {
        feed = $("select#suggestionsSelector").val();

        //console.log("pod: " + $("option:selected").attr("ispodcast"));
        //console.log("json: " + $("option:selected").attr("isjson"));

        ispodcast = ($("option:selected").attr("ispodcast") == 'true');
        //console.log(ispodcast)
        isjson = ($("option:selected").attr("isjson") == 'true');
        //console.log(isjson)
      }

      if ($('input.podcast').prop('checked')) { ispodcast = true}

      if ($('.suggestions').is(':hidden')) {

        $('.suggestions').show('slide',{direction:'right'},1000);
      } else {

         $('.suggestions').hide('slide',{direction:'right'},1000);
      }

      //$('input.json').prop('checked')
      if (isjson){
        //console.log('jason');
        showJSON(feed);
      } else {
        showXML(feed, ispodcast);
      }


    });

    function showXML (feed, ispodcast) {

      $.ajax(feed, {
          accepts:{
              xml:"application/rss+xml"
          },
          dataType:"xml",
          success:function(data) {
              //Credit: http://stackoverflow.com/questions/10943544/how-to-parse-an-rss-feed-using-javascript
              /*
              $(data).find("entry").each(function() {
                var el = $(this);
                var title = el.find("title").text()

                var linkHtml = el.find("link")[0];
                var href = linkHtml.outerHTML.match(/href="([^"]*)/)[1];
                console.log(href);

                var link = href;
                $(".container ul").append("<li> <a href='" + link + "'>" + title + "</a></li>")


                //console.log(linkHtml.outerHTML)
                //$.each(linkHtml, function(key, el){
                  //console.log(key + " : " + el)
                //});
              });*/
              console.log(data)
              $(data).find("item").each(function () {

                  var el = $(this);

                  var title = el.find("title").text()
                  //title.replace(/%20/g, " ")
                  var link = el.find("link").text()

                  if (ispodcast) {

                    var url = el.find("enclosure")[0].outerHTML

                    link = findUrls(url)[0];

                  }

                  //console.log(el.find("title").text())
                  $(".container ul").append("<li> <a target='_blank' href='" + link + "'>" + title + "</a></li>")

              });
              $(".podcast").prop('checked', false);

          }
      });

    }

    $('#json').click(function() {
      var feed = $("#in").val();
      showJSON(feed);
    });

    function showJSON(feed) {

      $.getJSON(feed, function(result) {
        //console.log(result.data.children)
        $.each(result.data.children, function(i){
          var title = result.data.children[i].data.title
          var url = result.data.children[i].data.url

          //console.log(title + " : " + url)
          $(".container ul").append("<li> <a href='" + url + "'>" + title + "</a></li>")
        });


      });
      $(".json").prop('checked', false);

    }

    $("#suggestionsSelector").click(function(){
      //$("#in").val(this.innerHTML);
      console.log($("option:selected", this).attr("ispodcast"));
      console.log($("option:selected", this).attr("isjson"));

    });

    $("#suggestions").click(function() {
      if ($('.suggestions').is(':hidden')) {

        $('.suggestions').show('slide',{direction:'right'},1000);
      } else {

         $('.suggestions').hide('slide',{direction:'right'},1000);
      }
    });


    function findUrls( text ) {
        var source = (text || '').toString();
        var urlArray = [];
        var url;
        var matchArray;

        // Regular expression to find FTP, HTTP(S) and email URLs.
        var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

        // Iterate through any URLs in the text.
        while( (matchArray = regexToken.exec( source )) !== null )
        {
            var token = matchArray[0];
            urlArray.push( token );
        }

        return urlArray;
    }


});
