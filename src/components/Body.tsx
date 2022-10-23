import React from 'react';
import './Header.css'
import {useDispatch, useSelector} from "react-redux";
import ArticleIcon from '@mui/icons-material/Article';
import TableViewIcon from '@mui/icons-material/TableView';
import LanguageIcon from '@mui/icons-material/Language';
import { FixedSizeList } from 'react-window';
import {
  Alert,
  Snackbar,
  List,
  Box,
  ListItem,
  Typography,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";

import { useEffect, useState } from "react";
import {getCurTabState, getRawHTMLState, updateTokenState} from "../store/store";
import { setToken, TokenKey } from '../utils/auth';
import {get_all_table_data, submit_content_record} from "../api/home";

export default function Body () {

  const dispatch = useDispatch();
  const curTab = useSelector(getCurTabState)
  const rawHTML = useSelector(getRawHTMLState)
  // tableData example: [
  //    {
  //       table_uid: '',
  //       table_name: '',
  //       table_type: 'SourceType_WebTable'
  //       ...
  //    }
  //    ...
  // ]
  const [tableData, setTableData] = useState<any>([]);
  // message feedback
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<any>('success');
  const [msg, setMsg] = useState<string>('请求成功！')

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleTableClick = (index: number) => {
    console.log('tab:\n', curTab)
    console.log('rawHTML:\n', rawHTML)
    submit_content_record({
      table_uid: tableData[index],
      name: curTab.title,
      data: rawHTML
    }).then((res: any) => {
      console.log('res:\n', res);
    })
  }
  // 登录
  useEffect(() => {
    chrome.cookies.get({
      "url": 'https://meta.atomecho.cn/',
      "name": TokenKey
    }).then((cookie: any) => {
      if (cookie) {
        console.log(cookie)
        dispatch(updateTokenState(cookie.value))
        setToken(cookie.value)
        setSeverity('success')
        setMsg('登录成功！')
        setOpen(true); // 反馈：请求成功
        // 加载表格数据
        get_all_table_data({
          page_size: 1000,
          page_num: 0
        }).then(res => {
          console.log('=========== getting all table data ===============')
          console.log('res:\n', res)
          setTableData(res.data.data.table_uids.filter((item: any) => item.table_type === 'SourceType_Doc'))
        })
      } else {
        setSeverity('error')
        setMsg('Ah oh！登录失败啦！请登录')
        setOpen(true);
        // enter AtomEcho meta page
        chrome.tabs.create({ url: "https://meta.atomecho.cn/" })
      }
    })
  }, [])

  const tableItems = tableData.map((table: any, index: number) =>
      <ListItem disablePadding key={tableData[index].table_uid} id={tableData[index].table_uid} onClick={() => handleTableClick(index)}>
        <ListItemButton>
          <ListItemIcon>
            {
              (() => {
                switch (tableData[index].table_type) {
                  case 'SourceType_WebTable':
                    return <TableViewIcon />
                  case 'SourceType_Doc':
                    return <ArticleIcon />
                  case 'SourceType_Net':
                    return <LanguageIcon />
                }
              })()
            }
          </ListItemIcon>
          <ListItemText primary={
            <React.Fragment>
              <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  noWrap
                  color="text.primary"
              >
                {tableData[index].table_name}
              </Typography>
            </React.Fragment>
          }/>
        </ListItemButton>
      </ListItem>
  )

  return (
    <div className="mainBody">
      <List sx={{ maxHeight: "300px" }} dense>
        {tableItems}
      </List>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert variant="outlined" onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </div>
  )
}
