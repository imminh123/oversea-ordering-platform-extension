chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "knockknock");
  port.onMessage.addListener(function(msg) {
    port.postMessage({question: msg});
  });
});

// For a single request:
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    port.postMessage('onMessageExternal');
    if (request.getTargetData)
      sendResponse({targetData: targetData});
    else if (request.activateLasers) {
      var success = activateLasers();
      sendResponse({activateLasers: success});
    }
  });

// For long-lived connections:
chrome.runtime.onConnectExternal.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    port.postMessage('connected');
  });
});