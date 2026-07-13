import { Link, useLocation } from "react-router-dom";

import {
  Dashboard,
  PersonAdd,
  Assignment,
  History,
  SmartToy,
  LocalHospital,
} from "@mui/icons-material";


import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";



function Sidebar(){


const location = useLocation();



const menus=[

{
name:"Dashboard",
path:"/dashboard",
icon:<Dashboard/>
},

{
name:"Create HCP",
path:"/create-hcp",
icon:<PersonAdd/>
},

{
name:"Log Interaction",
path:"/log-interaction",
icon:<Assignment/>
},

{
name:"Interaction History",
path:"/history",
icon:<History/>
},

{
name:"AI Chat",
path:"/ai-chat",
icon:<SmartToy/>
}

];





return(


<Box

sx={{

width:270,

background:

"linear-gradient(180deg,#0F172A,#020617)",

color:"white",

minHeight:"100vh",

display:"flex",

flexDirection:"column"

}}

>





<Box

sx={{

p:3,

textAlign:"center"

}}

>


<Box

sx={{

display:"flex",

justifyContent:"center",

mb:1

}}

>

<LocalHospital

sx={{

fontSize:45,

color:"#38BDF8"

}}

/>


</Box>





<Typography

variant="h5"

fontWeight="bold"

sx={{

color:"#38BDF8"

}}

>

AI First CRM

</Typography>



<Typography

variant="body2"

sx={{

color:"#94A3B8",

mt:1

}}

>

HCP Management System

</Typography>



</Box>







<Divider

sx={{

bgcolor:"#334155"

}}

/>







<List

sx={{

mt:2

}}

>


{

menus.map((menu)=>(


<ListItemButton


key={menu.path}


component={Link}


to={menu.path}



selected={

location.pathname===menu.path

}



sx={{


mx:2,

mb:1,

borderRadius:3,


transition:"0.3s",



"& .MuiListItemIcon-root":{

color:"#CBD5E1"

},



"&.Mui-selected":{

background:"#2563EB",

color:"white",


"& .MuiListItemIcon-root":{

color:"white"

}


},



"&.Mui-selected:hover":{

background:"#1D4ED8"

},




"&:hover":{

background:"#1E293B",

transform:"translateX(5px)"

}



}}


>



<ListItemIcon

sx={{

minWidth:45

}}

>

{menu.icon}


</ListItemIcon>



<ListItemText

primary={menu.name}

primaryTypographyProps={{

fontWeight:500

}}

/>



</ListItemButton>


))


}



</List>








<Box

sx={{

flexGrow:1

}}

/>







<Divider

sx={{

bgcolor:"#334155"

}}

/>






<Box

sx={{

p:2,

textAlign:"center"

}}

>


<Typography

variant="body2"

sx={{

color:"#E2E8F0"

}}

>

Version 1.0

</Typography>



<Typography

variant="caption"

sx={{

color:"#94A3B8"

}}

>

AI Powered CRM

</Typography>


</Box>





</Box>


);


}


export default Sidebar;