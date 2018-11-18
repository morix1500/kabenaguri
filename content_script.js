const hibiImg = chrome.extension.getURL('/img/hibi.png')
const panchiImg = chrome.extension.getURL('/img/panchi.png')
const panchi1Audio = chrome.extension.getURL('/audio/panchi1.mp3')
const panchi2Audio = chrome.extension.getURL('/audio/panchi2.mp3')
const panchi3Audio = chrome.extension.getURL('/audio/panchi3.mp3')

$(function () {
  let style = '<style type="text/css">'
  style += '@-webkit-keyframes scaleout {';
  style += '  0% { -webkit-transform: scale(0.0) }';
  style += '  100% {';
  style += '    -webkit-transform: scale(1.0);';
  style += '    opacity: 0;';
  style += '  }';
  style += '}';
  style += '@keyframes scaleout {';
  style += '  0% {';
  style += '    transform: scale(0.0);';
  style += '    -webkit-transform: scale(0.0);';
  style += '  } 100% {';
  style += '    transform: scale(1.0);';
  style += '    -webkit-transform: scale(1.0);';
  style += '    opacity: 0;';
  style += '  }';
  style += '}';
  style += '</style>';
  $("body").prepend(style);

  let overlay = $('<div id="naguri"></div>');
  $("body").prepend(overlay);
  $("#naguri").css({
    "position": "relative",
    "top": "0",
    "left": "0"
  });

  let index = 1;
  let scale = 10;
  let intervalId;

  $("body").on("mousedown", function(e) {
    chrome.runtime.sendMessage({method: 'getState'}, function (response) {
      if (response.data) {
        if (response.data === "true") {
          addPowerGauge()
          intervalId = setInterval(function() {
            scale += 1;
            console.log(scale);
            $("#naguri-gauge .naguri-power").html(Math.floor(scale * 10) + "%");
          }, 100);
        }
      }
    });
  }).on("mouseup", function(e) {
    clearInterval(intervalId);
    chrome.runtime.sendMessage({method: 'getState'}, function (response) {
      if (response.data) {
        if (response.data === "true") {
          $("#naguri-gauge").remove()
          panchi(index, e.pageX, e.pageY, scale)
          index += 1;
          scale = 10;
        }
      }
    });
  });
});

function addPowerGauge() {
  let gauge = $('<div id="naguri-gauge">Power: <span class="naguri-power">100%</span></div>');
  $("body").append(gauge);
  $("#naguri-gauge").css({
    "position": "fixed",
    "left": "0",
    "bottom": "0",
    "padding": "10px",
    "font-size": "2rem",
    "color": "#fff",
    "z-index": "1001",
    "background-color": "rgb(0,0,0,0.5)"
  });
}

function panchi(index, x, y, scale) {
  let panchiSize = 200 * scale / 10;
  let hibiSize   = 300 * scale / 10;

  if (scale >= 50) {
    new Audio(panchi3Audio).play();
  } else if (scale >= 30) {
    new Audio(panchi2Audio).play();
  } else {
    new Audio(panchi1Audio).play();
  }
  let panchi = $('<img id="panchi'+ index +'" src="'+ panchiImg +'" />');
  $("#naguri").append(panchi);
  $("#panchi" + index).css({
    "position": "absolute",
    "width": panchiSize + "px",
    "z-index": "1000",
    "top": y - (panchiSize / 2),
    "left": x - (panchiSize / 2),
    "-webkit-animation": "scaleout 0.5s infinite ease-in-out",
    "animation": "scaleout 0.5s infinite ease-in-out"
  });

  setTimeout(function() {
    $("#panchi" + index).remove();

    let hibi = $('<img id="hibi'+ index +'" src="'+ hibiImg +'" />');
    $("#naguri").append(hibi);
    $("#hibi" + index).css({
      "position": "absolute",
      "width": hibiSize + "px",
      "z-index": "1000",
      "top": y - (hibiSize / 2),
      "left": x - (hibiSize / 2)
    });
  }, 500);
}
