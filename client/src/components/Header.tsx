import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"





// header for site
const Header = () =>{
  const [jwt, setJwt] = useState<string | null>(null)

  // function to check if user is authenticated; helps with the conditional rendering of objects
  useEffect(() => {
    if(localStorage.getItem("token")){
      setJwt(localStorage.getItem("token"))
    }
  })

  // function to log the user out 
  const logout = () => {
    localStorage.removeItem("token")
    setJwt(null)
    window.location.href = "/"
  }

// app bar from https://mui.com/material-ui/react-app-bar/
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ position: "relative" }} >


          <Typography
            fontFamily="'Courier New', Courier, monospace"
            variant="h6"
            component="div"
            sx={{
              position: "static",
              left: "5%",
              textAlign: "left",
            }}
          >
          </Typography>


          <Box sx={{ marginLeft: "auto" }}>
            <Button sx={{ 
              fontFamily: "'Courier New', Courier, monospace", 
              fontSize:17,
              textTransform: "none" }}
              color="inherit" 
              component={Link} to="/">
              home
            </Button>

            {!jwt ? (<>
              <Button sx={{ fontFamily: "'Courier New', Courier, monospace", 
              fontSize:17,
              textTransform: "none"}} 
              color="inherit" 
              component={Link} to="/register">
              register
            </Button>
            <Button sx={{ fontFamily: "'Courier New', Courier, monospace", 
              fontSize:17,
              textTransform: "none"}}
              color="inherit" 
              component={Link} to="/login">
              login
            </Button>
            
            
            </>):(
              <Button sx={{ fontFamily: "'Courier New', Courier, monospace", 
              fontSize:17,
              textTransform: "none"}}
              color="inherit" 
              component={Link} to="/logout"
              onClick={logout}>
              logout 
              </Button>      



            ) }
              

          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header