import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Divider from "@mui/material/Divider";

export default function Header () {
  return (
      <header>
        <div style={{
          padding: '0 0 10px 0',
          color: '#000',
          fontFamily: "Consolas",
          fontSize: '1.4rem',
          userSelect: 'none',
          fontWeight: 'bold',
        }}>
          AtomEcho
        </div>
        <Divider />
      </header>
  )
}
