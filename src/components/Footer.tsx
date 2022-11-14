/*global chrome*/
import React, { useState, useEffect } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import { load_table_from_html } from "../api/home";
import { useDispatch, useSelector } from "react-redux";
import {getCurTabState, getRawHTMLState, updateCurTab, updateRawHTML} from "../store/store";
import Divider from "@mui/material/Divider";
import {Alert, Snackbar} from "@mui/material";

export default function Footer () {

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
  // getting tab and rawHTML info of the current active tab
  useEffect(() => {
    let event = new CustomEvent('REQUEST_TAB_AND_HTML_INFO');
    window.dispatchEvent(event);

    window.addEventListener('RECEIVE_TAB_AND_HTML_INFO', (event: any) => {
      // do something cool with event.data
      console.log('========= Page: receiving msg from content ============');
      console.log('detail:\n', event.detail);
      dispatch(updateRawHTML(event.detail.rawHTML));
      dispatch(updateCurTab(event.detail.curTab));
    })
  }, [])

  // getting html info of the current active tab

  return (
    <div>
      <Divider />
      <footer style={{
        textAlign: 'center',
        bottom: 0,
        width: '100%',
      }}>
        <LoadingButton
          variant="outlined"
          onClick={handleClick}
          loadingPosition="start"
          loading={loading}
          fullWidth
          startIcon={<AddIcon />}
          style={{textAlign: "center", margin: '8px 0 0 0'}}
        >
          获取本网页表格
        </LoadingButton>
      </footer>

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
