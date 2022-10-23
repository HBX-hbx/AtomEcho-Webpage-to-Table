console.log('<----- Injected script started running ----->');

// getting the page info in the current page
// function parseEssentialDetails() {
//     let main = {};
//
//     main.performance = JSON.parse(JSON.stringify(window.performance)) || null;
//
//     return main;
// }
//
// // sending data to content.js using postMessage api
// setInterval(() => {
//     let essential = parseEssentialDetails();
//     window.postMessage({ type: "FROM_PAGE", essential });
// }, 500);
