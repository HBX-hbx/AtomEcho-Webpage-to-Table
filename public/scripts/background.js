window.perfWatch = {};
window.transmit_data = {};

// get the current tab info
let curTab = {}
chrome.tabs.query({active: true, currentWindow: true}).then(res => {
    curTab = res[0];
});

// setting background global object according to the message from content.js

chrome.tabs.sendMessage(curTab.id, window.transmit_data)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    window.perfWatch[sender.tab.id] = message.essential || null;
});
