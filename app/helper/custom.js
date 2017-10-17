module.exports = function (databaseBS, Sequelize) {
    
        var validationObj = {};
        validationObj.validation = function (req, model, profile, Sequelize, callBack) {
            console.log("validation");
            console.log(req.body);
            model.findAll({
                where: { user_id: req.body.user_id }
            }).then(function (result) {
                profile.findAll({
                    where: { email_id: req.body.user_id }
                }).then(function (result1) {
                    console.log(result1);
                    if (result == "") {
                        console.log("ab");
                        var strin = {};
                        strin.msg = "0";
                        strin.req = req.body;
    
                        callBack(strin);
    
                    }
    
                    else {
                        console.log("present");
                        var strin = {};
                        strin.msg = "1";
                        strin.req = req.body;
    
                        callBack(strin);
                    }
    
    
                })
            });
        };
    
    
        validationObj.memvalidation = function (req, model, childrenProfileModel, Sequelize, callBack) {
            model.findAll
                ({
                    where: {
                        email_id: req.body.email_id
    
                    }
                }).then(function (result) {
                    model.findAll({
                        where: { mobile_no: req.body.mobile_no }
    
                    }).then(function (result1) {
                        childrenProfileModel.findAll({
                            where: { user_id: req.body.email_id }
    
                        }).then(function (result2) {
                            if (result != "" || result1 != "" || result2 != "") {
                                console.log("ab");
                                var strin = {};
                                if (result != "" || result2 != "") {
                                    strin.emailidpresent = 1;
                                }
                                if (result1 != "") {
                                    strin.mobilenopresent = 1;
                                }
    
                                strin.msg = 1;
                                strin.req = req.body;
    
                                callBack(strin);
    
                            }
    
                            else {
                                console.log("presentmember details ");
                                var strin = {};
                                strin.msg = "0";
                                strin.req = req.body;
    
                                callBack(strin);
                            }
    
                        })
                    })
    
    
                 });
        };
    
        validationObj.workflowstatus = function (process,action, statusflowModel, Sequelize, callBack) {
            console.log("inside my workflowstatus helper");
    
            statusflowModel.findAll({
                where: {
                    process: process,
                    action: action
                }
            }).then(function (result) {
    
                var status = result[0].status;
                console.log("status" + status);
    
                // console.log("my ------------workflow result"+result[0].status);
                callBack(result);
            });
        }
        validationObj.updateWorkFlowStatus = function (childId, profileId, workflowstatus, childrenProfileModel, profileModel, Sequelize, callBack) {
            console.log("inside updateWorkFlowStatus helper");
            console.log("child id"+childId);
            console.log("profile id"+profileId);
            console.log("workflow"+workflowstatus);
            if('REQ_INT_VOL'==workflowstatus||'ADM_APP_VOL'==workflowstatus||'ADM_DEC_VOL'==workflowstatus)
                {
                    childrenProfileModel.update({
                        workflowstatus_volunteer: workflowstatus
                    }, {
                            where: {
                                id: childId
                            }
                        }).then(function (result) {
                            profileModel.update({
                                workflowstatus: workflowstatus
                            }, {
                                    where: {
                                        id: profileId
                                    }
                                }).then(function (result) {
                                    
                                   callBack(result);
                                })
                        })
                }
                else {
                    console.log("inside my else");
                    childrenProfileModel.update({
                        workflowstatus_mentor: workflowstatus
                    }, {
                            where: {
                                id: childId
                            }
                        }).then(function (result) {
                            profileModel.update({
                                workflowstatus: workflowstatus
                            }, {
                                    where: {
                                        id: profileId
                                    }
                                }).then(function (result) {
                                    
                                   callBack(result);
                                })
                        })
                }
           
            }
        return validationObj;
    }
    
    