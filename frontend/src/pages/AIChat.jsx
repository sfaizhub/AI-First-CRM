import { useState, useRef, useEffect } from "react";
import api from "../services/api";

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  Chip,
  } from "@mui/material";

import {
  SmartToy,
  Person,
  Send,
} from "@mui/icons-material";


function AIChat() {


  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);


  const chatEndRef = useRef(null);



  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello 👋 I'm your AI CRM Assistant. Ask me about HCPs, interactions, follow-ups or recommendations.",
      tools: []
    }
  ]);




  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  }, [messages, loading]);





  const sendMessage = async () => {


    if (!message.trim()) return;


    const userText = message;


    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: userText
      }
    ]);



    setMessage("");



    try {


      setLoading(true);



      const res = await api.post(
        "/api/agent/chat",
        {
        message: userText
        }
        );



      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: res.data.reply,
          tools: res.data.tool_calls || []
        }
      ]);


    }

    catch(error) {


      console.log(error);


      setMessages(prev => [
        ...prev,
        {
          sender:"ai",
          text:"Unable to connect with AI backend."
        }
      ]);

    }


    finally {

      setLoading(false);

    }


  };





  return (

    <Box

      sx={{
        maxWidth:900,
        margin:"auto",
        height:"80vh",
        display:"flex",
        flexDirection:"column"
      }}

    >



      <Typography

        variant="h4"

        fontWeight="bold"

        mb={3}

      >

        🤖 AI CRM Assistant

      </Typography>






      <Paper

        sx={{

          flex:1,

          padding:3,

          background:"#F8FAFC",

          borderRadius:3,

          display:"flex",

          flexDirection:"column",

          overflow:"hidden"

        }}

      >




        {/* Scrollable Chat Area */}

        <Box

          sx={{

            flex:1,

            overflowY:"auto",

            pr:1

          }}

        >




          {messages.map((msg,index)=>(



            <Box

              key={index}

              sx={{

                display:"flex",

                justifyContent:

                  msg.sender==="user"

                  ?

                  "flex-end"

                  :

                  "flex-start",


                mb:2,

                gap:1

              }}

            >





              {
                msg.sender==="ai" &&

                <Avatar

                  sx={{
                    bgcolor:"#2563EB"
                  }}

                >

                  <SmartToy/>

                </Avatar>

              }





<Paper
  sx={{
    padding: 2,
    maxWidth: "70%",
    borderRadius: 3,
    background:
      msg.sender === "user" ? "#2563EB" : "white",
    color:
      msg.sender === "user" ? "white" : "black",
  }}
>
  <Typography>{msg.text}</Typography>

  {msg.sender === "ai" &&
    msg.tools &&
    msg.tools.length > 0 && (
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          mt: 2,
        }}
      >
        {msg.tools.map((tool, index) => (
          <Chip
            key={index}
            label={tool}
            color="primary"
            size="small"
          />
        ))}
      </Box>
    )}
</Paper>





              {
                msg.sender==="user" &&

                <Avatar

                  sx={{

                    bgcolor:"#16A34A"

                  }}

                >

                  <Person/>

                </Avatar>

              }





            </Box>



          ))}







          {
            loading &&


            <Box

              sx={{

                display:"flex",

                alignItems:"center",

                gap:2

              }}

            >

              <CircularProgress size={20}/>

              <Typography>

                AI is thinking...

              </Typography>


            </Box>


          }




          <div ref={chatEndRef}/>




        </Box>




      </Paper>







      {/* Message Input */}

      <Box

        sx={{

          display:"flex",

          gap:2,

          mt:2

        }}

      >




        <TextField

          fullWidth

          placeholder="Ask about HCP, interaction or recommendation..."

          value={message}


          onChange={(e)=>setMessage(e.target.value)}


          onKeyDown={(e)=>{

            if(e.key==="Enter")

              sendMessage();

          }}


        />





        <Button

          variant="contained"

          onClick={sendMessage}


          endIcon={<Send/>}


          sx={{

            px:4

          }}

        >

          Send


        </Button>





      </Box>





    </Box>


  );


}


export default AIChat;