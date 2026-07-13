import { useEffect, useState } from "react";
import api from "../services/api";


import {
Box,
Typography,
Card,
CardContent,
Chip,
CircularProgress,
} from "@mui/material";


import {
DataGrid,
} from "@mui/x-data-grid";





function InteractionHistory() {


const [interactions,setInteractions]=useState([]);

const [hcps,setHcps]=useState([]);

const [loading,setLoading]=useState(true);





useEffect(()=>{

loadData();

},[]);





const loadData=async()=>{


try{


const interactionRes =
await api.get("/interactions");


const hcpRes =
await api.get("/hcps");



setInteractions(interactionRes.data);

setHcps(hcpRes.data);



}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}


};








const getHCPName=(id)=>{


const hcp =
hcps.find(
(item)=>item.id===id
);


return hcp
?
hcp.full_name
:
"Unknown";


};







const rows =
interactions.map((item)=>(


{

id:item.id,


doctor:getHCPName(item.hcp_id),


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


}


));









const columns=[


{
field:"id",
headerName:"ID",
width:70
},



{
field:"doctor",
headerName:"Doctor",
width:200
},



{
field:"hcp",
headerName:"HCP ID",
width:90
},



{
field:"type",
headerName:"Interaction",
width:140
},



{
field:"duration",
headerName:"Duration",
width:120
},




{
field:"status",
headerName:"Status",
width:140,


renderCell:(params)=>(


<Chip

label={params.value}

color="success"

size="small"

sx={{

fontWeight:"600"

}}

/>


)


},




{
field:"date",
headerName:"Date",
width:130
}


];








if(loading){


return(


<Box

sx={{

display:"flex",

justifyContent:"center",

alignItems:"center",

height:"300px"

}}

>


<CircularProgress/>


</Box>


);


}








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

Interaction History

</Typography>








<Card

sx={{

borderRadius:3,

boxShadow:"0 4px 15px rgba(0,0,0,0.08)"

}}

>


<CardContent

sx={{

padding:"25px"

}}

>





<Box

sx={{

height:420

}}

>


<DataGrid


rows={rows}


columns={columns}


pageSizeOptions={[5,10]}


disableRowSelectionOnClick


sx={{

border:"none",


"& .MuiDataGrid-columnHeaders":{

background:"#F1F5F9",

fontWeight:"bold"

},


"& .MuiDataGrid-cell":{

fontSize:"14px"

}


}}


/>



</Box>





</CardContent>


</Card>







</Box>


);



}


export default InteractionHistory;