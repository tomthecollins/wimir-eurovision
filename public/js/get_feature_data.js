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
  // Grab the file.
  var url = "./../research/data/eurovision/JSON_features/" + featStr + ".json";
  $.getJSON(url, function(data){
    console.log("data:", data);
    data.map(function(d){
      pointsEtc.xy.push({
        "x": d.year,
        "y": d.val,
        "fname": d.mp3Name
      });
    });
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
  });
}
