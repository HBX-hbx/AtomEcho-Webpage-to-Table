/*global chrome*/
import React, { useState, useEffect } from 'react';
import './Header.css'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { load_table_from_html } from "../api/home";

export default function Header () {

  const [curTab, setCurTab] = useState<any>();

  const handleClick = () => {
    // get the html of the current page
    console.log(curTab);
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
        console.log(rawHTML);
        load_table_from_html({
          data: rawHTML,
          table_name: curTab.title
        }).then((res: any) => {
          console.log('请求成功');
        })
      }
    })
    // enter AtomEcho meta page
    // chrome.tabs.update({ url: "https://meta.atomecho.cn/" })
    // window.close()

  }
  // getting tab info of the current active tab
  useEffect(() => {
    chrome.tabs.query({active: true}).then(res => {
      console.log(res[0])
      setCurTab(res[0])
    })
  }, [])

  return (
    <header className="ext-header">
      <Button
        variant="outlined"
        onClick={handleClick}
        fullWidth
        startIcon={<AddIcon />}
        style={{textAlign: "center"}}
      >
        获取本网页表格
      </Button>
    </header>
  )
}
