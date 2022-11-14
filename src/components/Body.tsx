import * as React from 'react';
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
  IconButton,
  styled,
  ListItem,
  SpeedDial,
  Typography,
  Tooltip,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Backdrop,
  SpeedDialIcon,
  SpeedDialAction
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getCurTabState,
  getRawHTMLState,
  getTableDataState, updateCurTab,
  updateRawHTML,
  updateTableData,
  updateTokenState
} from "../store/store";
import {get_all_table_data, set_listened_urls, submit_content_record} from "../api/home";
import SetURLPrefixDialog from "./SetURLPrefixDialog";
import {setToken, TokenKey} from "../utils/auth";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
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
    height: 35,
  }
}));

const actions = [
  { icon: <EditIcon />, name: '编辑' },
  { icon: <ArrowOutwardIcon />, name: '跳转' },
];

interface RenderRowProps {
  table: any,
  index: number,
  handleTableClick: (index: number) => Promise<void>;
  handleSetURLPrefixClick: (event: any, index: number) => void;
}

export function RenderRow(props: RenderRowProps) {

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTableClick = () => {
    setLoading(true);
    props.handleTableClick(props.index).then(() => {
      setLoading(false);
    });
  }

  const handleTableActionClick = (event: any, index: number) => {
    switch (index) {
      case 0: // 编辑
        props.handleSetURLPrefixClick(event, props.index);
        break;
      case 1: // 跳转
        window.open('https://meta.atomecho.cn/tables/' + props.table.table_uid);
        break;
      default:
        break;
    }
  }

  return (
    <ListItem
      disablePadding
      style={{
        position: 'relative',
        borderRadius: '10px',
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <LoadingButton
        onClick={handleTableClick}
        loadingPosition="start"
        loading={loading}
        fullWidth
        startIcon={
          (() => {
            switch (props.table.table_type) {
              case 'SourceType_WebTable':
                return <TableViewIcon />
              case 'SourceType_Doc':
                return <ArticleIcon />
              case 'SourceType_Net':
                return <LanguageIcon />
            }
          })()
        }
        style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
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
              {props.table.table_name}
            </Typography>
          </React.Fragment>
        }/>
      </LoadingButton>
      {/*<StyledSpeedDial*/}
      {/*  ariaLabel="SpeedDial playground example"*/}
      {/*  icon={<SpeedDialIcon />}*/}
      {/*  direction='left'*/}
      {/*  open={open}*/}
      {/*  onClick={(event) => event.stopPropagation()}*/}
      {/*>*/}
      {/*  {actions.map((action, index: number) => (*/}
      {/*    <SpeedDialAction*/}
      {/*      key={action.name}*/}
      {/*      icon={action.icon}*/}
      {/*      tooltipTitle={action.name}*/}
      {/*      onClick={(event) => handleTableActionClick(event, index)}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</StyledSpeedDial>*/}
      <Box style={{display: 'flex', flexDirection: 'row'}}>
        <Tooltip title="编辑" placement="top">
          <IconButton color="primary" aria-label="edit" onClick={(event) => handleTableActionClick(event, 0)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="跳转" placement="top">
          <IconButton color="secondary" aria-label="jump" onClick={(event) => handleTableActionClick(event, 1)}>
            <ArrowOutwardIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </ListItem>
  )
}

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
  const handleTableClick = async (index: number, tableData: any, rawHTML: string, curTab: any) => {
    setCurTableIndex(index);
    const res: any = await submit_content_record({
      table_uid: tableData[index].table_uid,
      name: curTab.title,
      source: 'html',
      data: rawHTML
    })

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
        setMsg(res.msg);
        setSeverity('error');
        break;
    }
    setOpenMsg(true);
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
        // item['loading'] = false;
        return item;
      }).filter((item: any) => item.table_type === 'SourceType_Doc')
      console.log('tableData:\n', tmpTableData);
      dispatch(updateTableData(JSON.stringify(tmpTableData)));
      // set table data to background
      let event = new CustomEvent('SET_TABLE_DATA', {
        detail: tmpTableData,
      });
      window.dispatchEvent(event);
    })
  }
  // 登录
  useEffect(() => {
    let event = new CustomEvent('LOGIN');
    window.dispatchEvent(event);
    window.addEventListener('RECEIVE_COOKIE', (event: any) => {
      // do something cool with event.data
      console.log('========= Page: receiving msg from content ============');
      console.log('detail:\n', event.detail);
      if (event.detail.cookie) {
        dispatch(updateTokenState(event.detail.cookie.value))
        setToken(event.detail.cookie.value)
        setSeverity('success')
        setMsg('登录成功！')
        setOpenMsg(true); // 反馈：请求成功
        // 加载表格数据
        loadTableData();
      }
    })

    window.addEventListener('TAB_UPDATE', (event: any) => {
      // do something cool with event.data
      console.log('========= Page: receiving msg from content ============');
      console.log('detail:\n', event.detail);
      dispatch(updateTableData(JSON.stringify(event.detail.tableData)));
      event.detail.triggeredTableIdxList.forEach((item: number) => {
        console.log('triggered!\n', event.detail);
        handleTableClick(item, event.detail.tableData, event.detail.rawHTML, event.detail.curTab);
      })
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
  //   let tmpTableData = [];
  //   for (let i = 0; i < 100; i++){
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
  //     })
  //   }
  //   dispatch(updateTableData(JSON.stringify(tmpTableData)));
  // }, [])
  // < --------------------------------- test ----------------------------------- >

  const tableItems = tableData.map((table: any, index: number) =>
    <RenderRow
      key={table.table_uid}
      table={table}
      index={index}
      handleTableClick={(index: number) => handleTableClick(index, tableData, rawHTML, curTab)}
      handleSetURLPrefixClick={handleSetURLPrefixClick}
    />
  )

  return (
    <div style={{height: '305px', margin: '10px 0 10px 0'}}>
      <List style={{maxHeight: '290px', overflowY: "auto"}}>
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
