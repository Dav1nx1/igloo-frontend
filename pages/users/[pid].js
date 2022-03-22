import React from 'react'
import { useRouter } from 'next/router'

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

  return (
    <>
      {user.map( user => 
        <div>{user.name} -- {user.email} -- {user.username} -- {user.address.city} -- {user.address.street}</div>
      )}
    </>
  )
}

export default Post