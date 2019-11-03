var locX;
var locY;
// This function will eventually prompt the beginning of create or delete
// processes, based on whether a user clicks close enough to an existing note
// (delete) or not (create).

function mouse_xy(event, aCvInfo){
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
  console.log("pointsEtc.xy.ma[1]:", pointsEtc.xy[ma[1]]);
}
