const mongoose=require("mongoose");
const express=require("express");

DataFetch=async (req,res)=>{
    //bringing the database object from local storage
    db=req.app.locals.DatabaseObject;
    db=db.collection("test");
    // console.log(req.body)
    let query;
    if(req.body.project_id==undefined){
        res.send({
            "status":false,
            "error":"project id is required"
        })
        return;
    }
    //checking if equipment_id is given or not and creating query accordingly
    if(req.body.equipment_id==undefined){
        query={
            "project_id":req.body.project_id,
            "timestamp":{$lte: new Date(req.body.end_date),$gte: new Date(req.body.start_date)}
        }
    }else{
        query={
            "project_id":req.body.project_id,
            "equipment_id":req.body.equipment_id,
            "timestamp":{$lte: new Date(req.body.end_date),$gte: new Date(req.body.start_date)}
        }
    }
    //checkking if date is given in request body
    if(req.body.start_date==undefined||req.body.start_date==undefined){
        //setting up date to previous 7 days
        let currDate=new Date();
        let prevDate=new Date(currDate);
        prevDate.setHours(prevDate.getHours()-6);
        query.timestamp.$gte=prevDate;
        query.timestamp.$lte=currDate;
    }
    console.log(query);
    // console.log(query);
    //querying the database
    let docs=await db.find(query,{projection:{_id:0,__v:0}}).toArray((err, docs)=>{
        if(err){
            console.log(err);
            res.send({"ERR":err});
        }
        // console.log(docs[0])
        console.log(docs.length);
        // console.log(docs[0]);
        res.send(docs)
    });
}
module.exports=DataFetch;

