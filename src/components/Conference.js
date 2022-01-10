import React,{useState,useEffect} from 'react'
import axios from 'axios'
const OT = require ('@opentok/client')

const Conference =({newToken})=>{
    
    //const base_Url = "http://192.168.10.197:3001"
    const base_Url = "https://vpbackend-utu.herokuapp.com"
    const [api_key,setApiKey] = useState(null)
    const [sessionId,setSessionId] =useState(null)
    const [sessionIsOn,setSessionIsOn] = useState(false)
    const [startOn,setStartOn] = useState(true)
    useEffect (()=>{
         axios.get(base_Url+"/currentsId/")
            .then((res)=>{
                if (res.status === 200) {
                    setSessionId(res.data)
                    console.log("received the session_ID")
                } else if (res.status === 400) {
                    alert(res.data)
                    console.log("session_ID error")
                } else {
                    alert("unexpected session ID result !")
                }
            })
    },[])

    useEffect(()=>{
        axios.get(base_Url+"/vonageKey/")
            .then((res)=>{
                if (res.status === 200) {
                    setApiKey(res.data)
                    console.log("received the Api_key")
                } else if (res.status === 400) {
                    alert(res.data)
                    console.log("api_key error")
                } else {
                    alert("unexpected Api key result !")
                }
    })},[])

    const handleError = (err)=>{
        if (err) 
            {alert(err.message)}
    }

    let session, publisher, subscriber;

    const initializeSession = () =>{
        session = OT.initSession(api_key,sessionId);
        setStartOn (false)
        setSessionIsOn(true)
    }
    
        
        //     // //create a publisher
        //     // publisher = OT.initPublisher (
        //     //     "publisher",
        //     //     {
        //     //         insertMode:"append",
        //     //         width:"100%",
        //     //         height:"100%"
        //     //     },
        //     //     handleError
        //     // );

        // }
        const handlePublish =()=>{
            //create a publisher
            publisher = OT.initPublisher (
                "publisher",
                {
                    insertMode:"append",
                    width:"200px",
                    height:"200px"
                },
                handleError
            );
        }
    

    return (
        <div>
             Conference page
            <br/>
            {(api_key!==null && sessionId!==null && startOn)
            ? <button id = "StartConf" onClick = {initializeSession}>Initiate Conference</button>
            :null}
            
            {(sessionIsOn===true)
            ? <div>
                button connect 
                publisher
                <button onClick={handlePublish} >publishe</button>
            </div>

            :null}
            <div id="pubFrame">
            <div id="publisher"></div>
            </div>
            <br/>
            {newToken}
            <br/>
            {api_key}
            <br/>
            {sessionId}
            <br/>

        </div>
    )
}

export default Conference