const express=require('express');
const axios=require('axios');

loginFunction=async (req,res)=>{
    const reqBody={
        "email":req.body.email,
        "password":req.body.password
    }
    await axios.post("https://sensehawk-api.strategix4.com/api/users/token",reqBody)
    .then((msg)=>{
        console.log(msg.data.data);
        req.app.locals.x_access_token=msg.data.data.token
        res.send("check console for output");
    })
    .catch((err)=>{
        console.log(err);
    })
    // res.send("not sent")
}

module.exports=loginFunction;