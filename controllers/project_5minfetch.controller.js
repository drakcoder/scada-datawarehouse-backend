const mongoose = require("mongoose");
const {projectData_5minTimeModel,projectData_5minTimeSchema}=require('../models/projectData_5minTime.model')
const _ = require("lodash");

const POADataFetch = async (req, res, next) => {
    try {
        let query = {
            "metadata.project_id": req.body.project_id,
            "metadata.timestamp": {
                $gte: new Date(_.get(req, "body.from_date")),
                $lte: new Date(_.get(req, "body.to_date"))
            }
        }
        let reqFields = { "_id": 0 ,metadata:{timestamp:1,parameters:{}}};

        for (i of _.get(req, "body.columns")) {
            reqFields.metadata.parameters[i] = 1
        }
        const docs = await projectData_5minTimeModel.find(query, reqFields);
        res.send(docs);
    }
    catch (e) {
        res.send({ "ERR": e });
    }
}

module.exports = {
    POADataFetch
}