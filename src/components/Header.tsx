/*global chrome*/
import React, { useState, useEffect } from 'react';
import './Header.css';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import { load_table_from_html } from "../api/home";
import { useDispatch, useSelector } from "react-redux";
import {getCurTabState, getRawHTMLState, updateCurTab, updateRawHTML} from "../store/store";
import Divider from "@mui/material/Divider";
import {Alert, Snackbar} from "@mui/material";

export default function Header () {

  const curTab = useSelector(getCurTabState)
  const rawHTML = useSelector(getRawHTMLState)
  const dispatch = useDispatch();
  // loading
  const [loading, setLoading] = useState<boolean>(false);
  // message feedback
  const [openMsg, setOpenMsg] = useState<boolean>(false);
  const [severity, setSeverity] = useState<any>('success');
  const [msg, setMsg] = useState<string>('请求成功！');
  const handleMsgClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenMsg(false);
  };

  const handleClick = () => {
    // get the html of the current page
    console.log(curTab);
    setLoading(true)
    load_table_from_html({
      data: rawHTML,
      table_name: curTab.title,
      url: curTab.url
    }).then((res: any) => {
      setLoading(false)
      switch (res.code) {
        case 2000:
          setMsg(res.msg);
          setSeverity('success');
          break;
        case 4000:
          setMsg(res.msg);
          setSeverity('error');
          break;
        default:
          break;
      }
      setOpenMsg(true);
    })
  }
  // getting tab info of the current active tab
  useEffect(() => {
    chrome.tabs.query({active: true}).then(res => {
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
          chrome.runtime.sendMessage({
            'rawHTML': rawHTML,
            'curTab': curTab,
          })
        }
      })
    }
  }, [curTab])

  return (
    <div>
      <header className="ext-header">
        <LoadingButton
          variant="outlined"
          onClick={handleClick}
          loadingPosition="start"
          loading={loading}
          fullWidth
          startIcon={<AddIcon />}
          style={{textAlign: "center"}}
        >
          获取本网页表格
        </LoadingButton>
      </header>
      <Divider />
      <Snackbar
        open={openMsg}
        autoHideDuration={3000}
        onClose={handleMsgClose}
      >
        <Alert onClose={handleMsgClose} severity={severity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </div>

  )
}
