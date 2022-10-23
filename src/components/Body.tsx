import React from 'react';
import './Header.css'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useDispatch } from "react-redux";
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

import { useEffect, useState } from "react";
import { updateTokenState } from "../store/store";
import { setToken, TokenKey } from '../utils/auth';

export default function Body () {

  const dispatch = useDispatch();

  const [tableData, setTableData] = useState<string>('');
  const [userName, setUserName] = useState<string>('atom');
  const [password, setPassword] = useState<string>('atom');

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
      <React.Fragment>
        <Button color="secondary" size="small" onClick={handleClose}>
          UNDO
        </Button>
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
  );

  useEffect(() => {
    // login({ username: userName.trim(), password: password }).then(response => {
    //   const { data } = response
    //   console.log('user_token:', data.token)
    //   dispatch(updateTokenState(data.token))
    //   // 将token保存在cookies
    //   setToken(data.token)
    // }).catch(error => {
    //   console.log(error)
    // })
    chrome.cookies.get({
      "url": 'https://meta.atomecho.cn/',
      "name": TokenKey
    }).then((cookie: any) => {
      if (cookie) {
        console.log(cookie)
        dispatch(updateTokenState(cookie.value))
        setToken(cookie.value)
      } else {

      }
    })
  }, [])

  return (
    <div className="mainBody">
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="Drafts" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="Drafts" />
          </ListItemButton>
        </ListItem>
      </List>
      <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Note archived"
          action={action}
      />
    </div>
  )
}
