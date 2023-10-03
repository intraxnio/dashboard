import React from 'react'
import { Box, Typography, Stack } from '@mui/material'
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';


function BoxComponents() {
  return (
    <>
    <Box 
    
    sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        height: '230px',
        width: '230px',
        padding: '16px',
        borderRadius:'10px',
        
        '&:hover': {
            backgroundColor: 'primary.light'
        }
    }}
    >

        <Typography sx={{ fontSize: '16px'}}>Followers</Typography>
        <Typography sx={{
            fontSize:'60px',
            textAlign:'center',
            padding:'20px',
            color:'orange'
            }}>2.1M</Typography>

          <Stack direction='row' spacing={1}>
            <NorthOutlinedIcon/>
            <Typography  sx={{}}>
               8.3% vs previous 30 days
            </Typography>
          </Stack>

           
       
    </Box>
    </>
  )
}

export default BoxComponents