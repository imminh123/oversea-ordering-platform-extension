chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (request.jwt) {
      chrome.storage.local.set({ aaltoToken: request.jwt }, () => {
        console.log(`Value is set`);
      });
      sendResponse({
        success: true,
        message: "Token has been received onMessageExternal",
      });
    }
  }
);
