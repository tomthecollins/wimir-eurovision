var playerBaseUrl = "./../../research/data/eurovision/MP3/";
var yearAndFname = "2008/Andorra_Casanova_Gisela.mp3";

var player;

function reset_player(){
  player = new Tone.Player(playerBaseUrl + yearAndFname, function(){
    console.log("Player loaded!");
    player.sync().start(0);
    var pp = document.getElementById("playPause");
    var ppi = document.getElementById("playPauseIcon");
    ppi.setAttribute("class", "fa fa-play");
    pp.removeAttribute("disabled");
  }).toMaster();
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
  }
  else {
    console.log("Starting Transport!");
    Tone.Transport.start();
    // player.start();
    var s = document.getElementById("stop");
    s.removeAttribute("disabled");
    var rw = document.getElementById("rewind");
    rw.removeAttribute("disabled", null);
    var ff = document.getElementById("fastForward");
    ff.removeAttribute("disabled", null);

  }

}

function rewind(){
  Tone.Transport.seconds =- 5;
}

function fast_forward(){
  Tone.Transport.seconds =+ 5;
}
