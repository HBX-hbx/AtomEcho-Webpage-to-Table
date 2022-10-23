/*global chrome*/
import React, { useState, useEffect } from 'react';
import './Header.css'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { load_table_from_html } from "../api/home";
import { useDispatch, useSelector } from "react-redux";
import {getCurTabState, getRawHTMLState, updateCurTab, updateRawHTML} from "../store/store";

export default function Header () {

  const curTab = useSelector(getCurTabState)
  const rawHTML = useSelector(getRawHTMLState)
  const dispatch = useDispatch();

  const handleClick = () => {
    // get the html of the current page
    console.log(curTab);
    load_table_from_html({
      data: rawHTML,
      table_name: curTab.title
    }).then((res: any) => {
      console.log('请求成功');
    })
  }
  // getting tab info of the current active tab
  useEffect(() => {
    chrome.tabs.query({active: true}).then(res => {
      console.log(res[0])
      dispatch(updateCurTab(res[0]))
    })
  }, [])
  // getting html info of the current active tab
  useEffect(() => {
    if (curTab) {
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
          dispatch(updateRawHTML(rawHTML));
          console.log(rawHTML);
        }
      })
    }
  }, [curTab])


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
