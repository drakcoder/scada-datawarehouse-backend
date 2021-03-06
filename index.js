const axios=require("axios");
const express=require("express");
const mongoose=require("mongoose");
const loginApiRoute=require("./routes/strategixLogin.route")
const dataPushApiRoute=require("./routes/stringDataPush.route");
const fetchDataApiRoute=require("./routes/stringDataFetch.route");
const POADataApiRoute=require("./routes/POAData.route");
const TotalDataFetchApitRoute=require("./routes/totalDataFetch.route")
const pvDataRoute=require('./routes/pvData.route')

require("dotenv").config()

mongoose.connect(process.env.DB_URL,(err,client)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('connection succesfull');
    db=mongoose.connection;
    app.locals.DatabaseObject=db;
})
const app=express();
app.use(express.json());


app.use('/login',loginApiRoute);
app.use('/pushData',dataPushApiRoute);
app.use('/fetchData',fetchDataApiRoute);
app.use('/streams',POADataApiRoute);
app.use('/project',TotalDataFetchApitRoute);
app.use('/streams1',pvDataRoute);

app.listen(8000,()=>{
    console.log("app listening to port 8000");
})