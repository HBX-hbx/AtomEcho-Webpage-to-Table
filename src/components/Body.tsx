import React from 'react';
import './Header.css'
import {useDispatch, useSelector} from "react-redux";
import ArticleIcon from '@mui/icons-material/Article';
import TableViewIcon from '@mui/icons-material/TableView';
import LanguageIcon from '@mui/icons-material/Language';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Snackbar,
  List,
  Box,
  styled,
  ListItem,
  SpeedDial,
  Typography,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  SpeedDialIcon,
  SpeedDialAction
} from "@mui/material";
import { useEffect, useState } from "react";
import {getCurTabState, getRawHTMLState, getTableDataState, updateTableData, updateTokenState} from "../store/store";
import {get_all_table_data, set_listened_urls, submit_content_record} from "../api/home";
import SetURLPrefixDialog from "./SetURLPrefixDialog";
import {setToken, TokenKey} from "../utils/auth";
import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  '&.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(0),
    right: theme.spacing(1),
  },
  '& .MuiFab-primary': {
    '& .MuiSpeedDialIcon-icon': { fontSize: 20 },
    width: 35,
    height: 35
  }
}));

const actions = [
  { icon: <EditIcon />, name: '编辑' },
];

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
  const tableData = JSON.parse(useSelector(getTableDataState));
  // message feedback
  const [openMsg, setOpenMsg] = useState(false);
  const [severity, setSeverity] = useState<any>('success');
  const [msg, setMsg] = useState<string>('请求成功！');
  // setURLDialog
  const [openURLPrefixDialog, setOpenURLPrefixDialog] = useState<boolean>(false);

  const [curTableIndex, setCurTableIndex] = useState<number>(-1);

  const handleMsgClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenMsg(false);
  };
  const handleTableClick = (index: number, tableData: any, rawHTML: string, curTab: any) => {
    setCurTableIndex(index);
    tableData[index].loading = true;
    dispatch(updateTableData(JSON.stringify(tableData)));

    submit_content_record({
      table_uid: tableData[index].table_uid,
      name: curTab.title,
      data: rawHTML
    }).then((res: any) => {

      tableData[index].loading = false;
      dispatch(updateTableData(JSON.stringify(tableData)));

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
  const handleSetURLPrefixClick = (event: any, index: number) => {
    setOpenURLPrefixDialog(true);
    setCurTableIndex(index);
    // 防止触发父组件点击事件
    event.stopPropagation();
  }
  const handleSetURLDone = (listened: boolean, listenedURLs: any) => {
    // 可改进提升性能
    tableData[curTableIndex].listened_urls = listenedURLs;
    dispatch(updateTableData(JSON.stringify(tableData)));

    set_listened_urls({
      table_uid: tableData[curTableIndex].table_uid,
      listened: listened,
      data: listenedURLs
    }).then(res => {
      console.log(res);
      // 重新加载有无必要？还是直接更新 store？
      loadTableData();
      // 反馈信息
      setMsg('设置成功');
      setSeverity('success');
      setOpenMsg(true);
    })
  }
  const loadTableData = () => {
    get_all_table_data({
      page_size: 1000,
      page_num: 0
    }).then(res => {
      console.log('=========== getting all table data ===============')
      let tmpTableData = res.data.data.table_uids.map((item: any) => {
        item['loading'] = false;
        return item;
      }).filter((item: any) => item.table_type === 'SourceType_Doc')
      console.log('tableData:\n', tmpTableData);
      dispatch(updateTableData(JSON.stringify(tmpTableData)));
      chrome.runtime.sendMessage({'tableData': tmpTableData})
    })
  }
  // 登录
  useEffect(() => {
    chrome.runtime.onMessage.addListener(msg => {
      console.log('========= Popup: receiving msg from runtime ============');
      dispatch(updateTableData(JSON.stringify(msg.tableData)));
      msg.triggeredTableIdxList.forEach((item: number) => {
        handleTableClick(item, msg.tableData, msg.rawHTML, msg.curTab);
      })
    })
    chrome.cookies.get({
      "url": 'https://meta.atomecho.cn/',
      "name": TokenKey
    }).then((cookie: any) => {
      if (cookie) {
        dispatch(updateTokenState(cookie.value))
        setToken(cookie.value)
        setSeverity('success')
        setMsg('登录成功！')
        setOpenMsg(true); // 反馈：请求成功
        // 加载表格数据
        loadTableData();
      } else {
        setSeverity('error')
        setMsg('Ah oh！登录失败啦！请登录')
        setOpenMsg(true);
        // enter AtomEcho meta page
        chrome.tabs.create({ url: "https://meta.atomecho.cn/" })
      }
    })
  }, [])

  // < --------------------------------- test ----------------------------------- >
  // function makeId (length: number) {
  //   let result           = '';
  //   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   let charactersLength = characters.length;
  //   for ( let i = 0; i < length; i++ ) {
  //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //   }
  //   return result;
  // }
  // useEffect(() => {
  //   let tmpTableData = []
  //   for (let i = 0; i < 1; i++){
  //     tmpTableData.push({
  //       "id": "1e5142bb-b042-4b24-89ff-139630926e50",
  //       "description": null,
  //       "modifier": null,
  //       "dept_belong_id": null,
  //       "update_datetime": "2022-10-29T02:20:31.005718Z",
  //       "create_datetime": "2022-10-29T02:20:31.005768Z",
  //       "table_name": "世界长河世界长河世界长河世界长河世界长河世界长河世界长河世界长河世界长河",
  //       "table_uid": makeId(19),
  //       "user_uuid": "ced4332f-c801-4fa8-b737-4a599d01adf7",
  //       "hash_table_attrs": "uid:ced4332f-c801-4fa8-b737-4a599d01adf7 time:1667010031 table_name:世界长河列表 - 维基百科，自由的百科全书_0",
  //       "table_type": "SourceType_WebTable",
  //       "use_cache": 0,
  //       "if_identity_table": false,
  //       "if_identity_image": false,
  //       "table_from_source": "SourceType_WebTable",
  //       "table_verify": 1,
  //       "table_object_name": "不同色块所代表的大洲",
  //       "upload_choices": 0,
  //       "is_deleted": false,
  //       "dictionary": "NULL",
  //       "project": "default",
  //       "is_show": 1,
  //       "webtable_url": "https://zh.wikipedia.org/wiki/%E4%B8%96%E7%95%8C%E9%95%BF%E6%B2%B3%E5%88%97%E8%A1%A8",
  //       "progress": -100,
  //       "listened_urls": [
  //         'https://en.wikipedia.org/wiki/[]',
  //         'https://bj.ke.com/xiaoqu/[]',
  //         'https://zh.wikipedia.org/wiki/%E9%95%BF%E6%B1%9F'
  //       ],
  //       "listened": true,
  //       "loading": false,
  //     })
  //   }
  //   dispatch(updateTableData(JSON.stringify(tmpTableData)));
  // }, [])
  // < --------------------------------- test ----------------------------------- >

  const tableItems = tableData.map((table: any, index: number) =>
    <ListItem disablePadding key={tableData[index].table_uid} id={tableData[index].table_uid}>
      <LoadingButton
        onClick={() => handleTableClick(index, tableData, rawHTML, curTab)}
        loadingPosition="start"
        loading={tableData[index].loading}
        fullWidth
        startIcon={
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
        style={{textAlign: "center"}}
      >
        <ListItemText primary={
          <React.Fragment>
            <Typography
              sx={{ display: 'inline-block', width: '100%'}}
              component="span"
              variant="body2"
              align="justify"
              noWrap
              color="text.primary"
            >
              {tableData[index].table_name}
            </Typography>
          </React.Fragment>
        } style={{paddingRight: '40px'}}/>
      </LoadingButton>
      <StyledSpeedDial
        ariaLabel="SpeedDial playground example"
        icon={<SpeedDialIcon />}
        direction='left'
        onClick={(event) => event.stopPropagation()}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={(event) => handleSetURLPrefixClick(event, index)}
          />
        ))}
      </StyledSpeedDial>
    </ListItem>
  )

  return (
    <div className="mainBody">
      <List style={{maxHeight: '293px', overflowY: "auto"}}>
        {tableItems}
      </List>
      <Snackbar
        open={openMsg}
        autoHideDuration={3000}
        onClose={handleMsgClose}
      >
        <Alert onClose={handleMsgClose} severity={severity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
      <SetURLPrefixDialog
        open={openURLPrefixDialog}
        onClose={() => setOpenURLPrefixDialog(false)}
        tableData={tableData}
        curTableIndex={curTableIndex}
        onOK={handleSetURLDone}
      />
    </div>
  )
}
