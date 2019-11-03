function draw_axes_and_grid(aCvInfo){
  aCvInfo.context.fillStyle = "white";
  aCvInfo.context.font = "10px Verdana";
  aCvInfo.context.fillText(aCvInfo.xLab, 5, aCvInfo.context.canvas.height - 5);
  aCvInfo.context.save();
  aCvInfo.context.rotate(-Math.PI/2);
  aCvInfo.context.fillText(aCvInfo.yLab, -(aCvInfo.context.canvas.height - 19), 13);
  aCvInfo.context.restore();

}

// Draw notes at appropriate times.
function draw_points(points){
  if (aColourObj == undefined){
    aColourObj = {
      "fill": "white", // "halo": undefined
    }
  }

  if (typeof aTimeMode == "number"){
    aTimeWin = nosBeats;
  }

  // Sort out offsets and multipliers.
  // This is the horizontal (w = width) offset (to allow axis label) and space
  // we have to work with for visualizing the notes.
  aCvInfo.map(function(ci){
    ci.wMultiplier = (ci.context.canvas.width - ci.wOffset)/aTimeWin;
    ci.hMultiplier = (ci.context.canvas.height - ci.hOffset)/ci.rngMnn;
  });

  // Iterate over points and render to canvas.
  points.map(function(p, idx){
    var cvii = 0; // Index into aCvInfo
    if (n.isPerc){ cvii = 1; }
    // Condition on time mode.
    if (aTimeMode == "instant"){ // Called when edits need rendering.
      var xLoc = wMultiplier*(p.x - lStart) + wOffset;
      var yLoc = hMultiplier*(sth - p.y) + hOffset;
      var w = 15;
      if (aColourObj.halo !== undefined){
        aCvInfo[cvii].context.fillStyle = aColourObj.halo;
        aCvInfo[cvii].context.fillRect(
          xLoc - 1.5,
          // xLoc - 0.05*h,
          yLoc - 1.5,
          w + 3,
          // 1.10*w,
          h + 3
        );
      }
      if (aColourObj.fill !== undefined){
        aCvInfo[cvii].context.fillStyle = aColourObj.fill;
        aCvInfo[cvii].context.fillRect(xLoc, yLoc, w, h);
      }
      return;
    }

    // If we get here then it's for playback ("synced with sounds") or opening
    // visualization, where aTimeMode is a number specifying the duration for
    // which the opening visualization should last.
    if (aTimeMode == "synced with sounds"){
      var startTime = "0:0:" + (4*(p.x + 0.05)).toString();
    }
    else if (typeof aTimeMode == "number"){
      // Make sure all drawing happens proportionally and within aTimeMode sec.
      var tempOntime = (aTimeMode*bpm/60)*(idx/aComp.notes.length);
      var startTime = "0:0:" + (4*(tempOntime + 0.05)).toString();
    }
    Tone.Transport.schedule(function(time){
      Tone.Draw.schedule(function(){
        var xLoc = aCvInfo[cvii].wMultiplier*(p.x - lStart) + aCvInfo[cvii].wOffset;
        var yLoc = aCvInfo[cvii].hMultiplier*(aCvInfo[cvii].rngMnn - (n.MNN - aCvInfo[cvii].minMnn)) + aCvInfo[cvii].hOffset;
        var w = 0.90*aCvInfo[cvii].wMultiplier*n.duration;
        var h = 0.90*aCvInfo[cvii].hMultiplier;
        if (aColourObj.halo !== undefined){
          aCvInfo[cvii].context.fillStyle = aColourObj.halo;
          aCvInfo[cvii].context.fillRect(
            xLoc - 1.5,
            yLoc - 1.5,
            w + 3,
            h + 3
          );
        }
        if (aColourObj.fill !== undefined){
          aCvInfo[cvii].context.fillStyle = aColourObj.fill;
          aCvInfo[cvii].context.fillRect(xLoc, yLoc, w, h);
        }
      }, time);
    }, startTime);
  });

  if (typeof aTimeMode == "number"){
    // Switch openingVisDone at end of opening visualization.
    var finishTime = "0:0:" + (4*aTimeMode*bpm/60).toString();
    Tone.Transport.schedule(function(time){
      openingVisDone = true;
      // Stop, clear all, and reset the Transport.
      Tone.Transport.stop();
      Tone.Transport.cancel();

      // Fill in any that weren't rendered.
      aCvInfo.map(function(ci){
        ci.context.clearRect(0, 0, ci.context.canvas.width, ci.context.canvas.height);
        draw_axes_and_grid(ci);
      });
      draw_notes(aComp, aCvInfo, "instant", aTimeWin, aColourObj);
      if (loadCounter == loadCounterLimit){
        ready_for_playback();
      }
    }, finishTime);
    // Start the opening visualization.
    Tone.Transport.start();
  }
  // (Could do something here too for the end of regular playback, but right
  // now everything is looped, so not relevant.)
}

function clear_and_redraw_notes(aTime){
  console.log("clear_and_redraw_notes() called!");
  // Here's a workaround for struggling to get this function to fire at time
  // zero. This solves innaccurate highlighting of yet-to-be-played notes that
  // have zero ontime.
  if (Math.abs(aTime - lStartSec) < 0.01){
    aTime = lStartSec;
  }
  var val = document.getElementById("createOrDestroy").value;
  // console.log("val:", val);
  // console.log("timeWin:", timeWin);
  // Clear everything.
  Tone.Transport.cancel();
  schedule_notes();
  var beforeNotes = compObj.notes.filter(function(n){
    var t = p.x*60/bpm;
    return t >= lStartSec && t < aTime;
  });
  // console.log("beforeNotes:", beforeNotes);
  var afterNotes = compObj.notes.filter(function(n){
    var t = p.x*60/bpm;
    return t < lEndSec && t >= aTime;
  });
  // console.log("afterNotes:", afterNotes);
  var loneNote;
  if (val == "create"){
    loneNote = newNote;
  }
  else if (val == "destroy"){
    loneNote = compObj.notes[delNoteIdx];
  }
  if (Tone.Transport.state == "started"){
    Tone.Transport.schedule(function(time){
      Tone.Draw.schedule(function(){
        // Instant.
        canvasInfo.map(function(ci){
          ci.context.clearRect(0, 0, ci.context.canvas.width, ci.context.canvas.height);
          draw_axes_and_grid(ci);
        });
        // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
        draw_notes(
          { notes: beforeNotes },
          canvasInfo,
          "instant",
          timeWin,
          { fill: "white", halo: "#17baef" }
        );
        draw_notes({ notes: afterNotes }, canvasInfo, "instant", timeWin);
        // Handle to-be-created or to-be-destroyed note.
        if (loneNote !== undefined){
          if (loneNote.ontime*60/bpm < aTime){ // Treat as "before note".
            draw_notes(
              { notes: [loneNote] },
              canvasInfo,
              "instant",
              timeWin,
              { fill: "#eebf3f", halo: "#17baef" }
            );
          }
          else { // Treat as "after note".
            draw_notes(
              { notes: [loneNote] },
              canvasInfo,
              "instant",
              timeWin,
              { fill: "#eebf3f" }
            );
          }
        }
      }, time)
    }, aTime + 0.01);
    // Synced.
    draw_notes(
      { notes: afterNotes },
      canvasInfo,
      "synced with sounds",
      timeWin,
      { fill: "white", halo: "#17baef" }
    );
    if (loneNote !== undefined && loneNote.ontime*60/bpm > aTime){
      draw_notes(
        { notes: [loneNote] },
        canvasInfo,
        "synced with sounds",
        timeWin,
        { fill: "#eebf3f", halo: "#17baef" }
      );
    }
    // At top of playhead.
    if (aTime !== lStartSec){
      Tone.Transport.schedule(function(time){
        // NB, there is no Tone.Transport.cancel() or schedule_notes() here.
        Tone.Draw.schedule(function(){
          // Instant.
          canvasInfo.map(function(ci){
            ci.context.clearRect(0, 0, ci.context.canvas.width, ci.context.canvas.height);
            draw_axes_and_grid(ci);
          });
          // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          // ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
          draw_notes(
            { notes: beforeNotes.concat(afterNotes) },
            canvasInfo,
            "instant",
            timeWin,
          );
          // Handle to-be-created or to-be-destroyed note.
          if (loneNote !== undefined){
            draw_notes(
              { notes: [loneNote] },
              canvasInfo,
              "instant",
              timeWin,
              { fill: "#eebf3f" }
            );
          }
        }, time);
        // Synced
        draw_notes(
          { notes: beforeNotes.concat(afterNotes) },
          canvasInfo,
          "synced with sounds",
          timeWin,
          { fill: "white", halo: "#17baef" }
        );
        if (loneNote !== undefined){
          draw_notes(
            { notes: [loneNote] },
            canvasInfo,
            "synced with sounds",
            timeWin,
            { fill: "#eebf3f", halo: "#17baef" }
          );
        }
      }, lStartSec);
    }
  }
  else { // Paused or stopped.
    // Instant.
    canvasInfo.map(function(ci){
      ci.context.clearRect(0, 0, ci.context.canvas.width, ci.context.canvas.height);
      draw_axes_and_grid(ci);
    });
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
    draw_notes(
      { notes: beforeNotes },
      canvasInfo,
      "instant",
      timeWin,
      { fill: "white", halo: "#17baef" }
    );
    draw_notes({ notes: afterNotes }, canvasInfo, "instant", timeWin);
    // Handle to-be-created or to-be-destroyed note.
    if (loneNote !== undefined){
      draw_notes(
        { notes: [loneNote] },
        canvasInfo,
        "instant",
        timeWin,
        { fill: "#eebf3f" }
      );
    }
  }
}
