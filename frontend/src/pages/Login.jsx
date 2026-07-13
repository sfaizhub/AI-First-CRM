import { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";


import {
  Visibility,
  VisibilityOff,
  LocalHospital,
} from "@mui/icons-material";


import { useNavigate } from "react-router-dom";



function Login() {


const navigate = useNavigate();


const [showPassword,setShowPassword] = useState(false);


const [email,setEmail] = useState("");

const [password,setPassword] = useState("");





const handleLogin = () => {


if(!email || !password){

alert("Please enter email and password");

return;

}


// Save login session

localStorage.setItem(
"userLoggedIn",
"true"
);


// Move to dashboard

navigate("/dashboard");


};






return (

<Box

sx={{

height:"100vh",

display:"flex",

justifyContent:"center",

alignItems:"center",

background:
"linear-gradient(135deg,#0F172A,#2563EB)"

}}

>



<Card

sx={{

width:420,

borderRadius:4,

boxShadow:5

}}

>


<CardContent

sx={{

p:4

}}

>



<Box

sx={{

textAlign:"center",

mb:3

}}

>


<LocalHospital

sx={{

fontSize:60,

color:"#2563EB"

}}

/>




<Typography

variant="h4"

fontWeight="bold"

>

AI First CRM

</Typography>




<Typography

color="text.secondary"

>

Healthcare Professional CRM

</Typography>



</Box>







<TextField

fullWidth

placeholder="Email"

margin="normal"

value={email}

onChange={(e)=>setEmail(e.target.value)}

sx={{

background:"white",

borderRadius:1

}}

/>








<TextField

fullWidth

placeholder="Password"

margin="normal"

type={
showPassword
?
"text"
:
"password"
}

value={password}

onChange={(e)=>setPassword(e.target.value)}

sx={{

background:"white",

borderRadius:1

}}



InputProps={{

endAdornment:(


<InputAdornment position="end">


<IconButton

onClick={()=>setShowPassword(!showPassword)}

>


{

showPassword

?

<VisibilityOff/>

:

<Visibility/>

}


</IconButton>


</InputAdornment>


)

}}


/>








<FormControlLabel

control={<Checkbox />}

label="Remember me"

/>







<Button

fullWidth

variant="contained"

size="large"

onClick={handleLogin}


sx={{

mt:2,

py:1.5,

borderRadius:2

}}

>

Login

</Button>








<Typography

textAlign="center"

mt={3}

fontSize={13}

color="text.secondary"

>

AI Powered CRM Platform

</Typography>





</CardContent>


</Card>


</Box>


);


}


export default Login;