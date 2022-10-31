// 将 url 与 urlPattern 匹配，匹配成功返回 true，否则 false
function matchRules(urlPattern, url) {
    // urlPattern: 'https://en.wikipedia.org/wiki/[]'
    // url:        'https://en.wikipedia.org/wiki/Pale_crag_martin'
    const regExp = RegExp(urlPattern.replaceAll('[]', '\\w+'));
    return regExp.test(url);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status && changeInfo.status === 'complete') {
        console.log('================ Background: tab created ==================');
        const url = tab.url;
        console.log(`url: ${url}`);
        chrome.storage.local.get(['tableData', 'rawHTML', 'curTab']).then(value => {
            // Do something with value.`key`
            let triggeredTableIdxList = []; // 被触发的 table
            console.log(value);
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
            console.log(triggeredTableIdxList);
            chrome.runtime.sendMessage({
                'triggeredTableIdxList': triggeredTableIdxList,
                'tableData': value.tableData,
                'rawHTML': value.rawHTML,
                'curTab': value.curTab,
            }); // 发回前端，执行提取
        })
    }
})

chrome.runtime.onMessage.addListener(msg => {
    console.log('========= Background: receiving msg from runtime ============');
    chrome.storage.local.set(msg).then(() => {
        if(chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
        }
    });
});
