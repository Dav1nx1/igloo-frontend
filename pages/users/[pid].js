import * as React from 'react';
import { useRouter } from 'next/router'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const Post = () => {
  
  const router = useRouter()
  const { pid } = router.query
  const [user, setUser] = React.useState([])

  const fetchUsers = async () => {
    const userDataArray = []
    const response = await fetch( 'http://localhost:3000/users/'+pid);
    const userData = await response.json();
    userDataArray.push(userData)
    setUser(userDataArray)
  }

  React.useEffect( () => {
    fetchUsers(pid)
  }, [pid])

  const backButton = (e) => {
    e.preventDefault()
    router.push('/')
  }
  
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
      {user.map( user => 
        <>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {`Nombre: ${user.name}`}
            </Typography>
            <Typography variant="h5" component="div">
              {`Email: ${user.email}`}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {`Username: ${user.username}`}
            </Typography>
            <Typography variant="body">
              {`Address: ${user.address.street} - ${user.address.suite} - ${user.address.city}`}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="large" onClick={ (e) => backButton(e) }>Back</Button>
          </CardActions>
        </>
      )}
      </Card>
    </Box>
  );
}

export default Post