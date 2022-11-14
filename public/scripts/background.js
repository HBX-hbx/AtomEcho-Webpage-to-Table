// 将 url 与 urlPattern 匹配，匹配成功返回 true，否则 false
function matchRules(urlPattern, url) {
    // urlPattern: 'https://en.wikipedia.org/wiki/[]'
    // url:        'https://en.wikipedia.org/wiki/Pale_crag_martin'
    const regExp = RegExp(urlPattern.replaceAll('[]', '\\w+'));
    return regExp.test(url);
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status && changeInfo.status === 'complete') {
        chrome.storage.local.get(['tableData', 'cookie', 'started']).then(value => {
            if (value.cookie && !tab.url.startsWith('https://meta.atomecho.cn')) {
                // console.log('================ Background: tab created ==================');
                console.log(`in url ${tab.url}, current state: ${value.started ? 'ON' : 'OFF'}`);
                chrome.action.setBadgeText({
                    text: value.started ? 'ON' : 'OFF',
                });

                const url = tab.url;
                // console.log(`url: ${url}`);
                // Do something with value.`key`
                let triggeredTableIdxList = []; // 被触发的 table
                // console.log(value);
                if (value.tableData) {
                    value.tableData.forEach((table, index) => {
                        if (table.listened) {
                            for (let i = 0; i < table.listened_urls.length; ++i) {
                                if (matchRules(table.listened_urls[i], url)) {
                                    triggeredTableIdxList.push(index);
                                    break; // 防止匹配同一张表的多个 pattern 而重复加入
                                }
                            }
                        }
                    })
                }
                // console.log(triggeredTableIdxList);
                // getting rawHTML
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => document.documentElement.innerHTML
                }, (resp) => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                    } else {
                        /**
                         * resp[0]: {
                         *      documentId: "57CFBD6E697601FC9CC3A4053E3395CF",
                         *      frameId: 0,
                         *      result: "something"
                         * }
                         */
                        const rawHTML = resp[0].result;
                        // console.log(`getting rawHTML:\n${rawHTML}`);
                        chrome.tabs.sendMessage(tab.id, {
                            'triggeredTableIdxList': triggeredTableIdxList,
                            'tableData': value.tableData,
                            'rawHTML': rawHTML,
                            'curTab': tab,
                        }); // 发回前端，执行提取
                    }
                })
            }
        })
    }
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // console.log('========= Background: receiving msg from runtime ============');
    // console.log('receiving:\n', msg);
    switch (msg.type) {
        case "REQUEST_TAB_AND_HTML_INFO":
            // getting curTab
            chrome.tabs.query({active: true}).then(res => {
                const curTab = res[0];
                // console.log('getting curTab:\n', curTab);
                chrome.storage.local.set({
                    'curTab': curTab,
                }).then(() => {
                    if(chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError.message);
                    }
                });
                // getting rawHTML
                chrome.scripting.executeScript({
                    target: { tabId: curTab.id },
                    func: () => document.documentElement.innerHTML
                }, (resp) => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                    } else {
                        /**
                         * resp[0]: {
                         *      documentId: "57CFBD6E697601FC9CC3A4053E3395CF",
                         *      frameId: 0,
                         *      result: "something"
                         * }
                         */
                        const rawHTML = resp[0].result;
                        // console.log(`getting rawHTML:\n${rawHTML}`);
                        chrome.storage.local.set({
                            'rawHTML': rawHTML,
                        }).then(() => {
                            if(chrome.runtime.lastError) {
                                console.log(chrome.runtime.lastError.message);
                            }
                        });
                        // console.log('sending:\n', {
                        //     'curTab': curTab,
                        //     'rawHTML': rawHTML,
                        // });
                        sendResponse({
                            'curTab': curTab,
                            'rawHTML': rawHTML,
                        });
                    }
                })
            })
            return true;
        case "LOGIN":
            chrome.cookies.get({
                "url": 'https://meta.atomecho.cn/',
                "name": 'Admin-Token'
            }).then(cookie => {
                if (cookie) {
                    // console.log(cookie.value);
                    chrome.storage.local.set({'cookie': cookie.value}).then(() => {
                        if(chrome.runtime.lastError) {
                            console.log(chrome.runtime.lastError.message);
                        }
                    });
                    sendResponse({
                        'cookie': cookie,
                    });
                } else {
                    chrome.tabs.create({ url: "https://meta.atomecho.cn/" });
                }
            })
            return true;
        case "STORE_DATA":
            chrome.storage.local.set({'tableData': msg.data}).then(() => {
                if(chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                }
            });
            break;
        default:
            break;
    }

});

chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith('https://meta.atomecho.cn')) {
        return;
    }
    const value = await chrome.storage.local.get(['started']);

    let nextState = value.started ? 'OFF' : 'ON';
    console.log(`in url ${tab.url}, current state: ${value.started ? 'ON' : 'OFF'}, next state: ${nextState}`);
    if (nextState === "ON") {
        // inject the extension
        try {
            console.log('<-------------------- registering content script -------------------->')
            await chrome.scripting.registerContentScripts([{
                id: 'content-script',
                js: ['scripts/content.js'],
                matches: ["https://*/*", "http://*/*"],
                excludeMatches: ['https://meta.atomecho.cn/*']
            }]);
        } catch (err) {
            console.log(`failed to register content scripts: ${err}`);
        }
    } else if (nextState === "OFF") {
        // Remove the extension
        try {
            console.log('<-------------------- unregistering content script -------------------->')
            await chrome.scripting.unregisterContentScripts({
                ids: ['content-script'],
            });
        } catch (err) {
            console.log(`failed to unregister content scripts: ${err}`);
        }
    }
    await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: [
            'scripts/content.js',
        ]
    });
    // Set the action badge to the next state
    console.log(`setting next state: ${nextState}`);
    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    });
    chrome.storage.local.set({'started': nextState === 'ON'}).then(() => {
        if(chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
        }
    });

});
