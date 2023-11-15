// Background script
chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log("🚀🚀🚀 ~ file: background.js:4 ~ chrome.runtime.onMessage.addListener ~ message:", message);
      
    });
  });
  

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    console.log("🚀🚀🚀 ~ file: background.js:2 ~ chrome.runtime.onMessageExternal.addListener ~ request:", request);
    if (request.jwt) {
        console.log('Token ::: ', request.jwt);
        sendResponse({ success: true, message: 'Token has been received' });
    }
});

chrome.runtime.onMessage.addListener((req) => {
    console.log("🚀🚀🚀 ~ file: background.js:10 ~ chrome.runtime.onMessage.addListener ~ req:", req);
    
});