import React from 'react';
import './Footer.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Typography from '@mui/material/Typography';
import Divider from "@mui/material/Divider";

export default function Footer () {
  return (
      <footer className='ext-footer'>
        <Divider />
        <Typography variant="subtitle1" gutterBottom>
          © 2022 AtomEcho
        </Typography>
      </footer>
  )
}
