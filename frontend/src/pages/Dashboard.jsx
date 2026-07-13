import { useEffect, useState } from "react";
import api from "../services/api";

import {
Box,
Grid,
Card,
CardContent,
Typography,
Avatar,
Chip,
} from "@mui/material";


import {
People,
Assignment,
SmartToy,
Event,
} from "@mui/icons-material";


import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
} from "recharts";


import {
DataGrid,
} from "@mui/x-data-grid";

function StatCard({title,value,icon}){


  return(

    <Card
    
    sx={{
    
    height:"140px",
    
    borderRadius:3,
    
    boxShadow:"0 4px 15px rgba(0,0,0,0.08)"
    
    }}
    
    >
    
    <CardContent
    
    sx={{
    
    height:"100%",
    
    display:"flex",
    
    alignItems:"center"
    
    }}
    
    >
    
    
    <Box
    
    sx={{
    
    display:"flex",
    
    justifyContent:"space-between",
    
    alignItems:"center",
    
    width:"100%"
    
    }}
    
    >
    
    
    <Box>
    
    
    <Typography
    
    color="text.secondary"
    
    fontSize={16}
    
    fontWeight="500"
    
    >
    
    {title}
    
    </Typography>
    
    
    
    
    <Typography
    
    fontSize={34}
    
    fontWeight="700"
    
    mt={1}
    
    >
    
    {value}
    
    </Typography>
    
    
    
    </Box>
    
    
    
    
    
    <Avatar
    
    sx={{
    
    bgcolor:"#2563EB",
    
    width:48,
    
    height:48
    
    }}
    
    >
    
    
    {icon}
    
    
    </Avatar>
    
    
    
    
    
    </Box>
    
    
    </CardContent>
    
    
    </Card>
    
    );
  
  }



function Dashboard(){


const [hcps,setHcps]=useState([]);

const [interactions,setInteractions]=useState([]);




useEffect(()=>{

loadData();

},[]);





const loadData=async()=>{

try{

const hcpRes=await api.get("/hcps");

const interactionRes=await api.get("/interactions");


setHcps(hcpRes.data);

setInteractions(interactionRes.data);


}

catch(error){

console.log(error);

}


};






const followUps =
interactions.filter(
item=>item.follow_up_date
).length;






const chartData=[

{
name:"HCPs",
value:hcps.length
},

{
name:"Interactions",
value:interactions.length
}

];






const rows=interactions.map(item=>{


const doctor =
hcps.find(
h=>h.id===item.hcp_id
);



return{

id:item.id,

doctor:
doctor
?
doctor.full_name
:
"Unknown",

hcp:item.hcp_id,

type:item.interaction_type,


duration:
item.duration_minutes
?
item.duration_minutes+" mins"
:
"N/A",


status:item.status,


date:
new Date(item.interaction_date)
.toLocaleDateString()

};


});






const columns=[


{
field:"id",
headerName:"ID",
width:70
},


{
field:"doctor",
headerName:"Doctor",
width:180
},


{
field:"hcp",
headerName:"HCP ID",
width:90
},


{
field:"type",
headerName:"Interaction",
width:130
},


{
field:"duration",
headerName:"Duration",
width:120
},


{
field:"status",
headerName:"Status",
width:130,

renderCell:(params)=>(

<Chip

label={params.value}

color="success"

size="small"

/>

)

},


{
field:"date",
headerName:"Date",
width:130
}


];







return(


<Box

sx={{

width:"100%",

maxWidth:"1400px",

margin:"auto"

}}

>




<Typography

variant="h4"

fontWeight="700"

mb={4}

>

AI First CRM Dashboard

</Typography>







<Grid
container
spacing={4}
sx={{
marginBottom:"30px"
}}
>




<Grid
item
xs={12}
sm={6}
md={3}
sx={{
padding:"8px"
}}
>

<StatCard

title="Total HCPs"

value={hcps.length}

icon={<People/>}

/>

</Grid>





<Grid item xs={12} sm={6} md={3}>

<StatCard

title="Interactions"

value={interactions.length}

icon={<Assignment/>}

/>

</Grid>






<Grid item xs={12} sm={6} md={3}>

<StatCard

title="Follow Ups"

value={followUps}

icon={<Event/>}

/>

</Grid>






<Grid item xs={12} sm={6} md={3}>

<StatCard

title="AI Assistant"

value="Online"

icon={<SmartToy/>}

/>

</Grid>




</Grid>










<Grid
container
spacing={4}
sx={{
marginTop:"20px"
}}
>


<Grid

item

xs={12}

md={6}

>

<Card
sx={{
height:360,
borderRadius:3,
padding:"10px",
boxShadow:"0 4px 15px rgba(0,0,0,0.08)"
}}
>

<CardContent>



<Typography

variant="h6"

fontWeight="600"

mb={2}

>

CRM Overview

</Typography>





<ResponsiveContainer

width="100%"

height={280}

>


<BarChart data={chartData}>


<XAxis dataKey="name"/>


<YAxis/>


<Tooltip/>


<Bar dataKey="value"/>


</BarChart>


</ResponsiveContainer>





</CardContent>


</Card>


</Grid>









<Grid

item

xs={12}

md={6}

>


<Card
sx={{
height:360,
borderRadius:3,
padding:"10px",
boxShadow:"0 4px 15px rgba(0,0,0,0.08)"
}}
>


<CardContent>


<Typography

variant="h6"

fontWeight="600"

>

AI Insights 🤖

</Typography>



<Box mt={3}>


<Typography>

• Total doctors managed:
<b> {hcps.length}</b>

</Typography>



<Typography mt={2}>

• Total meetings completed:
<b> {interactions.length}</b>

</Typography>




<Typography mt={2}>

• Recommended action:
Follow up with pending HCPs

</Typography>


</Box>


</CardContent>


</Card>



</Grid>




</Grid>










<Card

sx={{

mt:4,

height:480,

borderRadius:3

}}

>


<CardContent>


<Typography

variant="h6"

fontWeight="600"

mb={2}

>

Recent Interactions

</Typography>




<Box

sx={{

height:390

}}

>


<DataGrid

rows={rows}

columns={columns}

pageSizeOptions={[5,10]}

disableRowSelectionOnClick

/>

</Box>



</CardContent>


</Card>







</Box>


);


}


export default Dashboard;