console.log(chrome.action)
// When the user clicks on the extension action
chrome.action.onClicked.addListener((tab) => {
  console.log(' ================= creating a pop up =================')
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['scripts/create.js']
  });
});
