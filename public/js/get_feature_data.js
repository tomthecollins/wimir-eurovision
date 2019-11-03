function get_feature_data(){
  // Prepare to store requested data.
  var pointsEtc = {};
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
        "fname": fname
      });
      stuffLoaded++;
    });
  });
  var myTimer = setInterval(function(){
    // console.log("Timer going!");
    // console.log("stuffLoaded:", stuffLoaded);
    if (stuffLoaded == jsonFnames.length){
      console.log("pointsEtc:", pointsEtc);
      // Redo plot here!
      // ...
      clearInterval(myTimer);
    }
  }, 500);
}
