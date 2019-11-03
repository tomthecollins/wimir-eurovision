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

// Draw notes at appropriate times.
function clear_and_update_plot(aCvInfo){
  aCvInfo.context.clearRect(0, 0, aCvInfo.context.canvas.width, aCvInfo.context.canvas.height);
  draw_axes_and_grid(aCvInfo);
  if (aColourObj == undefined){
    var aColourObj = {
      "fill": "white"
    }
  }
  wMultiplier = (aCvInfo.context.canvas.width - aCvInfo.wOffset)
  /(aCvInfo.maxX - aCvInfo.minX);
  hMultiplier = (aCvInfo.context.canvas.height - aCvInfo.hOffset)
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
