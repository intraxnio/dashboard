import React, { useState, useEffect} from 'react'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Box, Button } from '@mui/material'
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from "react-redux";



function TableComponent() {

    const user = useSelector(state => state.creatorUser);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);


    function formatNumber(number) {
      if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + "M";
      } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + "K";
      } else {
        return number.toString();
      }
    }


  
    useEffect(() => {
      setTimeout(()=>{
        axios.post("http://localhost:8000/api/v1/creator/creator-dashboard-posts", {
          userId: user.creator_id,
        }).then(ress=>{
    
            setPosts(ress.data.postsArray);
            setLoading(false)
          
    
        }).catch(e=>{
    
        })
  
      }, 1000)
    }, []);

    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <>
        {loading ? (<CircularProgress />) : (

            <TableContainer component={Paper} sx={{marginTop:'64px', padding:'40px'}}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Recent Posts</TableCell>
                            <TableCell></TableCell>
                            <TableCell>PUBLISHED ON</TableCell>
                            <TableCell>REACH</TableCell>
                            <TableCell>LIKES</TableCell>
                            <TableCell>COMMENTS</TableCell>
                            <TableCell>VIEW POST</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            sortedPosts.slice(0, 10).map((row) => {

                              if(row.media_type === 'VIDEO'){

                                return(

                                <TableRow key={'1'}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                      
                                    <TableCell sx={{width:'130px', height:'40px'}}><img className="img-fluid" src={row.thumbnail_url} alt="Passion into Profession" /></TableCell>
                                    <TableCell sx={{maxWidth:'200px', wordWrap: 'break-word'}}>{row.caption}</TableCell>
                                    <TableCell>{new Date(row.date).toISOString().slice(0, 10)}</TableCell>
                                    <TableCell>{formatNumber(row.reach)}</TableCell>
                                    <TableCell>{formatNumber(row.likes)}</TableCell>
                                    <TableCell>{formatNumber(row.comments)}</TableCell>
                                    <TableCell><a href={row.permaLink} target="_blank" rel={row.caption} style={{ textDecoration: 'none' }}>View Post</a></TableCell>


                                </TableRow>)
                              }

                              else{
                                return(

                                <TableRow key={'1'}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                      
                                    <TableCell sx={{width:'130px', height:'40px'}}><img className="img-fluid" src={row.media_url} alt="Passion into Profession" /></TableCell>
                                    <TableCell sx={{maxWidth:'200px', wordWrap: 'break-word'}}>{(row.caption).slice(0, 100)+'...'}</TableCell>
                                    <TableCell>{new Date(row.date).toISOString().slice(0, 10)}</TableCell>
                                    <TableCell>{formatNumber(row.reach)}</TableCell>
                                    <TableCell>{formatNumber(row.likes)}</TableCell>
                                    <TableCell>{formatNumber(row.comments)}</TableCell>
                                    <TableCell><a href={row.permaLink} target="_blank" rel={row.caption} style={{ textDecoration: 'none' }}>View Post</a></TableCell>
                                    

                                </TableRow>
                                )
                              }
})
                        }
                    </TableBody>

                </Table>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
    <Button variant="contained" color="primary">View More</Button>
  </Box>
            </TableContainer>
            
            )}


        </>
    )
}

export default TableComponent