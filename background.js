chrome.browserAction.onClicked.addListener(function(request, sender, sendResponse) {
  let flag = localStorage.getItem("state")
  if (flag === "true" || flag === null) {
    chrome.browserAction.setIcon({path: "/img/off.png"});
    flag = "false"
  } else {
    flag = "true"
    chrome.browserAction.setIcon({path: "/img/on.png"});
  }
  localStorage.setItem("state", flag);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.method) {
    case 'getState':
      let state = localStorage.getItem("state");
      if (state == null) {
        state = "true"
      }
      sendResponse({data: state});
      break;
  }
});
