var locX;
var locY;
// This function will eventually prompt the beginning of create or delete
// processes, based on whether a user clicks close enough to an existing note
// (delete) or not (create).

function mouse_xy(event, aCvInfo){
  if (Tone.Transport.state !== "stopped"){
    Tone.Transport.stop();
  }
  var pp = document.getElementById("playPause");
  pp.setAttribute("disabled", null);
  var s = document.getElementById("stop");
  s.setAttribute("disabled", null);
  var rw = document.getElementById("rewind");
  rw.setAttribute("disabled", null);
  var ff = document.getElementById("fastForward");
  ff.setAttribute("disabled", null);
  locX = event.offsetX;
  locY = event.offsetY;
  console.log("locX:", locX, "locY:", locY);
  console.log("thing:", (locX - aCvInfo.wOffset)
  /(aCvInfo.context.canvas.width - aCvInfo.wOffset));
  // Identify closest song to click.
  // Convert location of click to (x, y) values underlying plot.
  var clickX = parseFloat(aCvInfo.minX) + (aCvInfo.maxX - aCvInfo.minX)
  *(locX - aCvInfo.wOffset)
  /(aCvInfo.context.canvas.width - aCvInfo.wOffset);
  var clickY = aCvInfo.minY + (aCvInfo.maxY - aCvInfo.minY)
  *((aCvInfo.context.canvas.height - locY) - aCvInfo.hOffset)
  /(aCvInfo.context.canvas.height - aCvInfo.hOffset);
  console.log("clickX:", clickX, "clickY:", clickY);
  var ma = mu.min_argmin(pointsEtc.xy.map(function(p){
    return Math.sqrt(
      Math.pow(p.x - clickX, 2) + Math.pow(p.y - clickY, 2)
    );
  }));
  console.log("ma:", ma);
  var p = pointsEtc.xy[ma[1]];
  console.log("p:", p);
  // Convert them back to draw a nice golden dot!
  var wMultiplier = (aCvInfo.context.canvas.width - aCvInfo.wOffset)
  /(aCvInfo.maxX - aCvInfo.minX);
  var hMultiplier = (aCvInfo.context.canvas.height - aCvInfo.hOffset)
  /(aCvInfo.maxY - aCvInfo.minY);
  var xLoc = wMultiplier*(p.x - aCvInfo.minX) + aCvInfo.wOffset;
  var yLoc = hMultiplier*(aCvInfo.maxY - p.y) + aCvInfo.hOffset;
  // Highlight the clicked dot.
  clear_and_update_plot(aCvInfo);
  aCvInfo.context.fillStyle = "#eebf3f";
  aCvInfo.context.beginPath();
  aCvInfo.context.arc(xLoc, yLoc, 6, 0, 2*Math.PI);
  aCvInfo.context.fill();
  // Write the year and country.
  ctx.font = "24px Verdana";
  ctx.textAlign = "center";
  ctx.fillText(
    p.fname,
    aCvInfo.context.canvas.width/2,
    aCvInfo.context.canvas.height/2
  );
  // Setup music file.
  var newFname = p.fname;
  yearAndFname = p.x + "/" + newFname;
  // alert("yearAndFname: " + yearAndFname);
  // yearAndFname =
  reset_player();
}
