var playerBaseUrl = "./../../research/data/eurovision/MP3/";
var yearAndFname = "2008/Andorra_Casanova_Gisela.mp3";

var player = new Tone.Player(playerBaseUrl + yearAndFname, function(){
  console.log("Initial player setup!");
}).toMaster();

function reset_player(){
  player.load(playerBaseUrl + yearAndFname, function(){
    console.log("New buffer loaded!");
    player.sync().start(0);
    Tone.Transport.seconds = 0;
    Tone.Transport.stop();
    var pp = document.getElementById("playPause");
    var ppi = document.getElementById("playPauseIcon");
    ppi.setAttribute("class", "fa fa-play");
    pp.removeAttribute("disabled")
  });
}

function play_pause(){
  console.log("Got to play/pause!");
  var pp = document.getElementById("playPause");
  var ppi = document.getElementById("playPauseIcon");
  if (pp.hasAttribute("disabled")){
    return;
  }
  if (Tone.Transport.state == "started"){
    Tone.Transport.pause();
    ppi.setAttribute("class", "fa fa-play");
  }
  else {
    console.log("Starting Transport!");
    Tone.Transport.start();
    ppi.setAttribute("class", "fa fa-pause");
    var s = document.getElementById("stop");
    s.removeAttribute("disabled");
    var rw = document.getElementById("rewind");
    rw.removeAttribute("disabled", null);
    var ff = document.getElementById("fastForward");
    ff.removeAttribute("disabled", null);
  }
}

function stop(){
  var s = document.getElementById("stop");
  if (s.hasAttribute("disabled")){
    return;
  }
  Tone.Transport.stop();
  s.setAttribute("disabled", null);
  var pp = document.getElementById("playPause");
  var ppi = document.getElementById("playPauseIcon");
  pp.removeAttribute("disabled");
  ppi.setAttribute("class", "fa fa-play");
}

function rewind(){
  Tone.Transport.seconds = Tone.Transport.seconds - 5;
}

function fast_forward(){
  Tone.Transport.seconds = Tone.Transport.seconds + 5;
}
