function draw_axes_and_grid(aCvInfo){
  aCvInfo.context.fillStyle = "white";
  aCvInfo.context.font = "10px Verdana";
  aCvInfo.context.fillText(aCvInfo.xLab, 5, aCvInfo.context.canvas.height - 5);
  aCvInfo.context.save();
  aCvInfo.context.font = "18px Verdana";
  aCvInfo.context.rotate(-Math.PI/2);
  aCvInfo.context.fillText(aCvInfo.yLab, -(aCvInfo.context.canvas.height - 19), 23);
  aCvInfo.context.restore();

}

function clear_and_update_plot(aCvInfo){
  aCvInfo.context.clearRect(0, 0, aCvInfo.context.canvas.width, aCvInfo.context.canvas.height);
  draw_axes_and_grid(aCvInfo);
  if (aColourObj == undefined){
    var aColourObj = {
      "fill": "white"
    }
  }
  var wMultiplier = (aCvInfo.context.canvas.width - aCvInfo.wOffset)
  /(aCvInfo.maxX - aCvInfo.minX);
  var hMultiplier = (aCvInfo.context.canvas.height - aCvInfo.hOffset)
  /(aCvInfo.maxY - aCvInfo.minY);

  // Iterate over points and render to canvas.
  pointsEtc.xy.map(function(p, idx){
    var cvii = 0; // Index into aCvInfo
    var xLoc = wMultiplier*(p.x - aCvInfo.minX) + aCvInfo.wOffset;
    var yLoc = hMultiplier*(aCvInfo.maxY - p.y) + aCvInfo.hOffset;
    if (idx < 5){
      console.log("xLoc:", xLoc, "yLoc:", yLoc);
    }
    var r = 3;
    aCvInfo.context.fillStyle = aColourObj.fill;
    aCvInfo.context.beginPath();
    aCvInfo.context.arc(xLoc, yLoc, r, 0, 2*Math.PI);
    aCvInfo.context.fill();
  });
}

function hide_explanation(){
  var x = document.getElementById("explain");
  x.innerHTML = '<p><a onclick="show_explanation();">Show explanation</a></p>';
  return;
}

function show_explanation(){
  var x = document.getElementById("explain");
  x.innerHTML = '<p><a onclick="hide_explanation();">Hide explanation</a></p><p>Select a feature from the drop-down menu below, and then click on a dot in the resultant scatterplot to load the associated MP3 file. There are play etc. controls below the plot for listening to the song, which can be useful as some songs start with applause or silence.</p>';
  return;
}
