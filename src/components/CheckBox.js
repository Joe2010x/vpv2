import React from 'react'
//import {uniqueId} from 'lodash'
import { useState } from 'react/cjs/react.development'

const CheckBox = (props) =>{
//label,initialChecked(boolean),onChange(function)
    //const id = uniqueId()
    const [isChecked,setIsChecked] = useState(props.initialChecked)
    console.log("initial check for "+props.label+" is "+props.initialChecked)

    const onChange =(event)=>{
        setIsChecked(event.currentTarget.checked)
        //console.log(onChange)
        //console.log(event.currentTarget.checked)
        props.onChange (isChecked)
        event.preventDefault()
    }


    return (
        <div className='checkbox'>
        {/* <label htmlFor={id}> */}
            <label >
                {props.label}
            </label>
            <input
                type="checkbox"
                checked={isChecked}
                // id={id}
                onChange={onChange}
                >
            </input>
        </div>
    )
}

export default CheckBox