const axios = require("axios");
const { projectData_5minTimeModel,projectData_5minTimeSchema} = require("../models/projectData_5minTime.model");
const _ = require('lodash');

const project_5minPush = async (req, res, next) => {
    try {
        const headers = {
            "x-access-token": req.app.locals.x_access_token
        }
        const reqBody = {
            "stream_name": "project_5min",
            "from_date": req.body.from_date,
            "to_date": req.body.to_date,
            "select_columns": ["*"],
            "filter_criteria": { "project_id": req.body.project_id }
        }
        const data = await axios.post("https://sensehawk-api.strategix4.com/api/streams/getstream", reqBody, { headers: headers })
        const Response = _.get(data, "data.data");
        console.log(Response.length)
        let dataToBePushed=[];
        for(i of Response){
            let obj={parameters:{}};
            for(p in i){
                if(p=="project_id"||p=="swiftPV_project_id"||p=="timestamp"){
                    obj[p]=i[p];
                }
                else{
                    obj.parameters[p]=i[p];
                }
            }
            obj={metadata:obj};
            dataToBePushed.push(obj);
        }
        try {
            await projectData_5minTimeModel.insertMany(dataToBePushed, { "strict": false })
            res.send({ "sent": true });
        }
        catch (err) {
            let bulkWriteQuery = []
            for (let dup of err.writeErrors) {
                dup = dup.err.op.metadata;
                let sq = {
                    "metadata.timestamp": dup.timestamp,
                    "metadata.project_id": dup.project_id,
                    "metadata.swiftPV_project_id": dup.swiftPV_project_id
                }
                setQuery = {metadata:{}}
                for (i of Object.keys(dup)) {
                    if (i != "timestamp" && i != "swiftPV_project_id" && i != "project_id" && i != "_id" && i != "__v") {
                        setQuery.metadata[i] = dup[i]
                    }
                }
                let update = {
                    $set: dup.parameters
                }
                let updateQuery = {
                    "updateOne": {
                        "filter": sq,
                        "update": update
                    }
                };
                bulkWriteQuery.push(updateQuery);
            }
            await projectData_5minTimeModel.bulkWrite(bulkWriteQuery)
            res.send({ "sent": true });
        }
    }
    catch (e) {
        console.log("[ERR]" + e);
        res.send({ "sent": false, "err": e });
    }
}

module.exports = {
    project_5minPush
}
