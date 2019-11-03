function get_feature_data(aCvInfo){
  // Disable and wheel play.
  var pp = document.getElementById("playPause");
  var ppi = document.getElementById("playPauseIcon");
  ppi.setAttribute("class", "fa fa-spinner fa-pulse");
  pp.setAttribute("disabled", null);
  // Prepare to store requested data.
  pointsEtc.xy = [];
  // What's the feature?
  var featStr = document.getElementById("selectFeature").value;
  var featArr = featStr.split(",");
  // Grab it from each song.
  var stuffLoaded = 0;
  jsonFnames.map(function(fname, idx){
    var url = "./../research/data/eurovision/JSON/" + fname;
    $.getJSON(url, function(data){
      if (idx < 5){
        console.log("data:", data);
      }
      var featVal = data[featArr[0]];
      var i = 1;
      while (i < featArr.length){
        featVal = featVal[featArr[i]];
        i++;
      }
      if (idx < 5){
        console.log("featVal:", featVal);
      }
      pointsEtc.xy.push({
        "x": fname.slice(0, 4),
        "y": featVal,
        "fname": data.metadata.tags.file_name
      });
      stuffLoaded++;
    });
  });
  var myTimer = setInterval(function(){
    // console.log("Timer going!");
    // console.log("stuffLoaded:", stuffLoaded);
    if (stuffLoaded == jsonFnames.length){
      console.log("pointsEtc:", pointsEtc);
      var xmin = mu.min_argmin(pointsEtc.xy.map(function(pair){
        return pair.x;
      }));
      aCvInfo.minX = xmin[0];
      var xmax = mu.max_argmax(pointsEtc.xy.map(function(pair){
        return pair.x;
      }));
      aCvInfo.maxX = xmax[0];
      var ymin = mu.min_argmin(pointsEtc.xy.map(function(pair){
        return pair.y;
      }));
      aCvInfo.minY = ymin[0];
      var ymax = mu.max_argmax(pointsEtc.xy.map(function(pair){
        return pair.y;
      }));
      aCvInfo.maxY = ymax[0];
      aCvInfo.yLab = featArr[featArr.length - 1] + "... →";
      console.log("aCvInfo:", aCvInfo);
      // Redo plot here!
      clear_and_update_plot(aCvInfo);
      clearInterval(myTimer);
    }
  }, 500);
}
