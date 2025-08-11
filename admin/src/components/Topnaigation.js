import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Topnaigation() {

   let navObj=useNavigate();


   let storeObj=useSelector((store)=>{
    return store;
  })
  // console.log('inside the topnaviagtion',Object.keys(storeObj.employeesLoginData).length)
  //Object.keys(storeObj.employeesLoginData).length==0
  // console.log(storeObj.employeesLoginData)

  useEffect(()=>{
    if(storeObj.employeesLoginData.email){
      
  }
  else{
    navObj('/');
  }
  },[])
  return (
    <div>
      
    </div>
  )
}

export default Topnaigation