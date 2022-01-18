import React,{useState,useEffect} from 'react'
import axios from 'axios'
const OT = require ('@opentok/client')

let session, publisher_cam,publisher_scr, subscriber;
const handleError = (err)=>{
    if (err) 
        {alert(err.message)}
}

const Conference =({newToken})=>{
    
    //const base_Url = "http://192.168.10.197:3001"
    const base_Url = "https://vpbackend-utu.herokuapp.com"
    const [api_key,setApiKey] = useState(null)
    const [sessionId,setSessionId] =useState(null)
    const [sessionIsOn,setSessionIsOn] = useState(false)
    const [startOn,setStartOn] = useState(true)
    const [screenBtnOn,setScreenBtnOn] = useState(true)
    const [publishBtnOn,setpublishBtnOn] = useState(true)
    const [chatInputValue,setChatInputValue] = useState("")
    const [chatText,setChatText] = useState('')

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

    


    const initializeSession = () =>{
        session = OT.initSession(api_key,sessionId);

        session.connect(newToken,function(error){
            if (error) {
                handleError(error)
            } else {
                console.log("session is connected")
                
                setStartOn (false)
                setSessionIsOn(true)
            }
        
        })

        session.on('streamCreated',function(event){
            subscriber = session.subscribe(event.stream,"sub_box",
            {
                insertMode:"append",
                width:"200px",
                height:"200px", 
            },
            handleError
            )
            console.log("new stream id is "+event.stream.streamId)
            //subscriber.element.style.padding="20px"
            subscriber.element.onclick = function(){
                console.log("result of click is "+event.stream.streamId)
                session.subscribe(event.stream,"zoom_stream",
            {
                insertMode:"replace",
                width:"80%",
                height:"80%", 
            },
            handleError
            )
            
            }

            // document.getElementById(event.stream.streamId).style.padding="20px";
            // document.getElementById(event.stream.streamId).onclick = function(){
            //     console.log("result of click is "+event.stream.streamId)
            // }
        }
            
            
        )

        session.on("signal:msg", function (event){
            
                alert("signal received "+ event.data)
                //setChatText(chatText.copy()+"\n"+event.data)
                updateChat(event.data)
            
        })

    }

    function updateChat(content) {
        const msgHistory = document.getElementById("messageArea");
        const msg = document.createElement("p");
        msg.textContent = content;
        msgHistory.appendChild(msg);
        msgHistory.scroll({
          top: msgHistory.scrollHeight,
          behavior: "smooth"
        });
      }

    const terminateSession = () =>{
        //session = OT.initSession(api_key,sessionId);
        setStartOn (true)
        //setSessionIsOn(true)
    }

        const publishCamera =()=>{
            let pubOptions = {
                publishAudio:true,
                publishVideo:true
            }
            //create a publisher
            publisher_cam = OT.initPublisher (
                "publish_camera",pubOptions,
                {
                    insertMode:"append",
                    width:"200px",
                    height:"200px"
                },
                handleError
            );
            setpublishBtnOn(false)
                    session.publish(publisher_cam,function(error){
                        if (error){
                            console.log(error)
                        } else {
                            console.log("Publishing Camera to stream.")
                        }
                    })
                
                    
             
        }

        

        const cameraOff = () =>{

            session.unpublish(publisher_cam)
            setpublishBtnOn(true)
        }

        const screenOff = () =>{

            session.unpublish(publisher_scr)
            setScreenBtnOn(true)
        }

        const publishScreen =()=>{
           
            setScreenBtnOn(false);
            let pubOptions = {
                publishAudio:true,
                publishVideo:true,
                videoSource:'screen'
            }
            publisher_scr = OT.initPublisher (
                "publish_screen",pubOptions,
                {
                    insertMode:"append",
                    width:"200px",
                    height:"200px"
                },
                handleError
            );
            setpublishBtnOn(false)
            
                    session.publish(publisher_scr,function(error){
                        if (error){
                            console.log(error)
                        } else {
                            console.log("Publishing screen to stream.")
                        }
                    })
                
            
                    
             
            
        }
        const getEleId=(e) =>{
            console.log("the element id is ")
            console.log("target is "+e.target.id);
            console.log("current target is "+e.currentTarget.id)
        }

        const handleChatInput =(event)=>{
            setChatInputValue (event.target.value)
        }

        const sendText = ()=>{
            //alert("text input is "+ chatInputValue)
            session.signal ({   data:chatInputValue,
                                type:"msg"
                },
                function (error) {
                    if (error) {
                        handleError(error)
                    } else 
                        {
                            console.log('signal sent.')
                            setChatText("btn action "+chatText.slice()+"\n"+chatInputValue.slice()+"\n")
                            console.log(chatText)
                        } 
                    } 
                )
                
        }

    

    return (
        <div id="conference">
             <h1>Conference page</h1>
            <br/>
            {(api_key!==null && sessionId!==null)
            ? <div id = "start_end">
                
                {(startOn)
                    ? <button id = "StartConf"  onClick = {initializeSession}>Initiate Conference</button>
                    :<button id="end_session" onClick={terminateSession}>Terminate</button>
                }                
            
            </div>:null}
            
            {(sessionIsOn===true)
            ?
            <div id= "conf_body" >
                    <div id="publish_field">
                        {(publishBtnOn)
                        ?<button id="btn_publish" className="btn_pub" onClick={publishCamera} > Camera On </button>
                        :<button id="btn_publish_off" className='btn_pub' onClick ={cameraOff}>Camera Off</button>}
                        

                        <div id = "publish_camera"  />
                        {(screenBtnOn)
                        ?<button id="btn_screen"  className="btn_pub" onClick={publishScreen} > Share Screen </button>
                        :<button id="btn_screen_off" className='btn_pub' onClick ={screenOff}>Screen Off</button>}
                        
                        
                        <div id = "publish_screen" />
                            
                    </div>

                    <div id = "zoom_out">
                        <div id= "zoom_stream"> 
                        Center area
                        </div>
                    </div>

                    <div id="chat_div" >
                        
                        <div id="chat_view" >
                            <div id="messageArea" className="messages"/>
                        </div>
                    </div>

            </div>
            :null}

            {(sessionIsOn===true)
            ?
            <div id="lower_field" >
                <div id = 'sub_box'  >
                    {/* <div id="subscriber" /> */}
                </div>

                <div id="chat_box">
                    <input type ='text' id = "chat_input" onChange={handleChatInput}/>
                    <button id = 'send' onClick={sendText}>send</button>
                </div>
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