import { useState } from "react";
import { useNavigate } from "react-router-dom";


import {
AppBar,
Toolbar,
Typography,
Box,
InputBase,
Avatar,
IconButton,
Badge,
Menu,
MenuItem,
Divider,
} from "@mui/material";


import {
Search,
Notifications,
AccountCircle,
} from "@mui/icons-material";




function Navbar() {


const navigate = useNavigate();


const [anchorEl,setAnchorEl] = useState(null);



const openMenu = (event)=>{

setAnchorEl(event.currentTarget);

};



const closeMenu = ()=>{

setAnchorEl(null);

};





const handleLogout = ()=>{


// remove login session

localStorage.removeItem("userLoggedIn");


// close menu

setAnchorEl(null);


// go to login page

navigate("/");


};






return (

<AppBar

position="static"

elevation={1}

sx={{

background:"#FFFFFF",

color:"#0F172A"

}}

>


<Toolbar

sx={{

display:"flex",

justifyContent:"space-between"

}}

>




<Typography

variant="h5"

fontWeight="bold"

>

AI First CRM

</Typography>








<Box

sx={{

display:"flex",

alignItems:"center",

gap:2

}}

>




<Box

sx={{

display:"flex",

alignItems:"center",

background:"#F1F5F9",

padding:"8px 15px",

borderRadius:"12px",

width:320

}}

>



<Search

sx={{

color:"#64748B"

}}

/>



<InputBase

placeholder="Search CRM..."

sx={{

marginLeft:1,

flex:1

}}

/>



</Box>








<IconButton>


<Badge

badgeContent={3}

color="error"

>


<Notifications/>


</Badge>


</IconButton>








<IconButton

onClick={openMenu}

>


<Avatar

sx={{

bgcolor:"#2563EB"

}}

>

F

</Avatar>


</IconButton>









<Menu

anchorEl={anchorEl}

open={Boolean(anchorEl)}

onClose={closeMenu}

>



<MenuItem>


<AccountCircle sx={{mr:1}}/>


Faiz Ahmad


</MenuItem>





<Divider/>






<MenuItem

onClick={closeMenu}

>

Profile

</MenuItem>





<MenuItem

onClick={closeMenu}

>

Settings

</MenuItem>








<MenuItem

onClick={handleLogout}

>

Logout

</MenuItem>





</Menu>





</Box>






</Toolbar>


</AppBar>


);


}


export default Navbar;