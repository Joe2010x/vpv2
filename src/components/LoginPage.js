import React, { useEffect } from 'react'
import { useState } from 'react/cjs/react.development'
import axios from 'axios'

const LoginPage =(props)=>{
    //const base_Url = "http://192.168.10.197:3001"
    const base_Url = "https://vpbackend-utu.herokuapp.com"
    const [email,setEmail] = useState ("email")
    const [userList,setUserList]=useState(null)

    const changeEmail = (event)=>{
        setEmail(event.target.value)
    }
    //let userList = null
    //useEffect(()=>{},[])
       
    
    //const checkEmail =()=>{}
    const checkEmail = () =>{
        let token = null
         axios.get(base_Url +"/getToken/"+email)
            .then(res=>{
               // userList = JSON.stringify(res.data) 
               console.log(res)
               if (res.status === 200) {
                    token = res.data
                    console.log(token)
                    props.getToken(token)
                    props.isLogedIn(true)

               } else {
                alert("User does not exist!")
                }

                
            })
        // let person = null;
        // console.log("email is "+email)
        // //if (!userList) {
        //     console.log(userList.persons[1].email)

        //     if (userList!==null) {
        //         person = userList.persons.find(item=>item.email === email)
        //     } 
        //     if (person!==null) {
                
        //     } else {
        //         alert("User does not exist!")
        //     }


        //}
        
    }



    //props.getUserEmail(email)

    return (
        <div className='login_page'>
            <h2>Please enter your email address</h2>
            <br/>
            <input id="lpemail" onChange = {changeEmail} type='text' value = {email} ></input>
            <br/>
            <button className="btn" onClick = {checkEmail} >SUBMIT</button>
            {/* <br/>
            <p>{"the email value is "+email}</p> */}
        </div>
    )
}

export default LoginPage