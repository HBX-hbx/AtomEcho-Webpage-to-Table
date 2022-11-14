console.log('<----- Content script started running ----->');

if (document.getElementById('atom_extension')) {
    document.getElementById('atom_extension').remove();
} else {
    let div = document.createElement('div');
    div.id = 'atom_extension';
    document.body.appendChild(div);

    let link = document.createElement("link");
    link.href = chrome.runtime.getURL("static/css/main.614c992b.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);

    fetch(chrome.runtime.getURL('index.html'))
        .then((response) => response.text())
        .then((data) => {
            console.log(`content fetch html:\n ${data}`)
            const extension_element = document.getElementById('atom_extension');
            extension_element.innerHTML = data;
            extension_element.style.position = 'fixed';
            // extension_element.style.background = 'red';
            extension_element.style.right = '0';
            extension_element.style.top = '30%';
            // extension_element.style.height = '400px';
            // extension_element.style.width = '300px';
            extension_element.style.zIndex = '999';
            let script = document.createElement("script");
            script.src = chrome.runtime.getURL("static/js/main.31d4dc31.js");
            script.defer = "defer";
            extension_element.appendChild(script);
        });
}



// receiving data from page and
// sending data to background page using the runtime api
window.addEventListener("REQUEST_TAB_AND_HTML_INFO", function (event) {
    console.log('========= content: receiving event from injected script ============');

    // use null-safe operator since chrome.runtime
    // is lazy inited and might return undefined
    if (chrome.runtime?.id) {
        chrome.runtime.sendMessage({
            type: "REQUEST_TAB_AND_HTML_INFO"
        }).then(resp => {
            console.log('resp: \n', resp);
            let event = new CustomEvent('RECEIVE_TAB_AND_HTML_INFO', {
                detail: resp,
            });
            window.dispatchEvent(event);
        });
    }
});

window.addEventListener("LOGIN", function (event) {
    console.log('========= content: receiving event from injected script ============');

    // use null-safe operator since chrome.runtime
    // is lazy inited and might return undefined
    if (chrome.runtime?.id) {
        chrome.runtime.sendMessage({
            type: "LOGIN"
        }).then(resp => {
            console.log('resp: \n', resp);
            let event = new CustomEvent('RECEIVE_COOKIE', {
                detail: resp,
            });
            window.dispatchEvent(event);
        });
    }
});

window.addEventListener("SET_TABLE_DATA", function (event) {
    console.log('========= content: receiving event from injected script ============');

    // use null-safe operator since chrome.runtime
    // is lazy inited and might return undefined
    if (chrome.runtime?.id) {
        chrome.runtime.sendMessage({
            type: "STORE_DATA",
            data: event.detail,
        }).then();
    }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log('========= content: receiving msg from runtime ============');
    console.log('receiving:\n', msg);
    let event = new CustomEvent('TAB_UPDATE', {
        detail: msg,
    });
    window.dispatchEvent(event);
});
