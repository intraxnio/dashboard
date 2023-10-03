import React from 'react'
import { Grid, Box, Paper, Typography, Container } from '@mui/material'
import BoxComponents from './BoxComponents'

function PaperComponent() {
  return (
    <Grid container spacing={1} direction='row' alignItems='center' justifyContent='center' sx={{marginTop:'64px'}}>
    <Grid item xs={6} sm={6} md={6}>
        <Paper
        
        sx={{
            backgroundColor:'primary.main',
            color:'white',
            height:'500px',
            // width:'600px',
            padding:'10px',
            borderRadius:'10px',
            marginRight:'5px'
        }}
        >
            <Typography>
                Top Followers by Country
            </Typography>


        </Paper>
    </Grid>
    <Grid item xs={6} sm={6} md={6}>
    <Paper
        
        sx={{
            backgroundColor:'#eeeee',
            color:'white',
            height:'500px',
            // width:'600px',
            padding:'10px',
            borderRadius:'10px',
            marginRight:'5px'
        }}
        >
            <Typography sx={{color:'primary.main'}}>
                Followers by Gender
            </Typography>


        </Paper>
    </Grid>
   
    
</Grid>
  )
}

export default PaperComponent