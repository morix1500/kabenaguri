const hibiImg = chrome.extension.getURL('/img/hibi.png')
const panchiImg = chrome.extension.getURL('/img/panchi.png')

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
  $("#naguri").css("position", "relative");
  $("#naguri").css("top", "0");
  $("#naguri").css("left", "0");

  let index = 1;
  let scale = 1;
  let intervalId;

  $("body").on("mousedown", function(e) {
    chrome.runtime.sendMessage({method: 'getState'}, function (response) {
      if (response.data) {
        if (response.data === "true") {
          addPowerGauge()
          intervalId = setInterval(function() {
            scale += 0.1;
            $("#naguri-gauge .naguri-power").html(Math.floor(scale * 100) + "%");
          }, 100);
        }
      }
    });
  }).on("mouseup", function(e) {
    chrome.runtime.sendMessage({method: 'getState'}, function (response) {
      if (response.data) {
        if (response.data === "true") {
          $("#naguri-gauge").remove()
          panchi(index, e.pageX, e.pageY, scale)
          index += 1;
          scale = 1;
        }
      }
    });
    clearInterval(intervalId);
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
  let panchiSize = 200 * scale;
  let hibiSize   = 300 * scale;

  let panchi = $('<img id="panchi'+ index +'" src="'+ panchiImg +'" />');
  $("#naguri").append(panchi);
  $("#panchi" + index).css("position", "absolute");
  $("#panchi" + index).css("width", panchiSize + "px");
  $("#panchi" + index).css("z-index", "1000");
  $("#panchi" + index).css("top", y - (panchiSize / 2));
  $("#panchi" + index).css("left", x - (panchiSize / 2));
  $("#panchi" + index).css("-webkit-animation", "scaleout 0.5s infinite ease-in-out");
  $("#panchi" + index).css("animation", "scaleout 0.5s infinite ease-in-out");

  setTimeout(function() {
    $("#panchi" + index).remove();

    let hibi = $('<img id="hibi'+ index +'" src="'+ hibiImg +'" />');
    $("#naguri").append(hibi);
    $("#hibi" + index).css("position", "absolute");
    $("#hibi" + index).css("width", hibiSize + "px");
    $("#hibi" + index).css("z-index", "1000");
    $("#hibi" + index).css("top", y - (hibiSize / 2));
    $("#hibi" + index).css("left", x - (hibiSize / 2));
  }, 500);
}
