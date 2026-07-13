import { useState } from "react";
import api from "../services/api";


import {
Box,
Card,
CardContent,
Typography,
TextField,
Button,
Grid,
MenuItem,
Snackbar,
Alert,
} from "@mui/material";


import {
LocalHospital,
} from "@mui/icons-material";




function CreateHCP(){



const initialForm={

full_name:"",
specialty:"",
hospital:"",
city:"",
tier:"B",
email:"",
phone:""

};




const [form,setForm]=useState(initialForm);

const [loading,setLoading]=useState(false);

const [open,setOpen]=useState(false);

const [message,setMessage]=useState("");

const [severity,setSeverity]=useState("success");






const handleChange=(e)=>{


setForm({

...form,

[e.target.name]:e.target.value

});


};






const submitHCP=async()=>{


try{


setLoading(true);



await api.post(
"/hcps",
form
);



setMessage(
"HCP created successfully ✅"
);


setSeverity("success");


setOpen(true);



setForm(initialForm);



}


catch(error){


console.log(error);


setMessage(
"Error creating HCP ❌"
);


setSeverity("error");


setOpen(true);


}



finally{


setLoading(false);


}



};






return(



<Box

sx={{

width:"100%",

maxWidth:"1200px",

margin:"auto"

}}

>





<Typography

variant="h4"

fontWeight="700"

mb={4}

>

Create Healthcare Professional

</Typography>







<Card

sx={{

borderRadius:3,

boxShadow:"0 4px 15px rgba(0,0,0,0.08)"

}}

>


<CardContent

sx={{

padding:"35px"

}}

>





<Box

sx={{

display:"flex",

alignItems:"center",

gap:2,

mb:4

}}

>



<LocalHospital

color="primary"

fontSize="large"

/>



<Typography

variant="h6"

fontWeight="700"

>

Doctor Information

</Typography>



</Box>








<Grid

container

spacing={3}

>





<Grid item xs={12} md={6}>


<TextField

fullWidth

label="Full Name"

name="full_name"

value={form.full_name}

onChange={handleChange}

/>


</Grid>







<Grid item xs={12} md={6}>


<TextField

fullWidth

label="Specialty"

name="specialty"

value={form.specialty}

onChange={handleChange}

/>


</Grid>







<Grid item xs={12} md={6}>


<TextField

fullWidth

label="Hospital"

name="hospital"

value={form.hospital}

onChange={handleChange}

/>


</Grid>







<Grid item xs={12} md={6}>


<TextField

fullWidth

label="City"

name="city"

value={form.city}

onChange={handleChange}

/>


</Grid>








<Grid item xs={12} md={6}>


<TextField

select

fullWidth

label="Tier"

name="tier"

value={form.tier}

onChange={handleChange}

>


<MenuItem value="A">
A
</MenuItem>


<MenuItem value="B">
B
</MenuItem>


<MenuItem value="C">
C
</MenuItem>


</TextField>


</Grid>








<Grid item xs={12} md={6}>


<TextField

fullWidth

label="Email"

name="email"

value={form.email}

onChange={handleChange}

/>


</Grid>







<Grid item xs={12}>


<TextField

fullWidth

label="Phone"

name="phone"

value={form.phone}

onChange={handleChange}

/>


</Grid>








<Grid 
item 
xs={12} 
md={6}
sx={{
display:"flex",
alignItems:"center"
}}
>

<Button

variant="contained"

size="large"

onClick={submitHCP}

disabled={loading}

sx={{

mt:0,

px:7,

py:1.5,

borderRadius:2,

fontWeight:"600",

height:"56px"

}}

>

{

loading

?

"Creating..."

:

"Create HCP"

}

</Button>

</Grid>




</Grid>







</CardContent>


</Card>







<Snackbar

open={open}

autoHideDuration={3000}

onClose={()=>setOpen(false)}

>


<Alert

severity={severity}

>

{message}

</Alert>


</Snackbar>







</Box>



);



}



export default CreateHCP;