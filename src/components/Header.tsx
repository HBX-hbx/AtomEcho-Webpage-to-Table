import React from 'react';
import './Header.css'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

export default function Header () {
    return (
        <header className="ext-header">
            <Button variant="outlined" fullWidth startIcon={<AddIcon />} style={{textAlign: "center"}}>
                新建表
            </Button>
        </header>
    )
}
