var verification = require('../emailVerification/mailverification');
module.exports = function (testmodel, databaseBS, Sequelize) {
    var helperObject = require('../helper/custom')(databaseBS, Sequelize);
    var connectionService = {};
    var processType = '';
    var actionType = '';
    connectionService.deniedvolunteernextchild = function (req, testmodel, childrenProfileModel, Sequelize, callBack) {
        var children_id = req.body.children_id;
        var role = req.body.role;
        var profile_id = req.body.volunteer_id;
        var approve_status = req.body.approve_status;
        testmodel.create({
            children_id: children_id,
            role: role,
            profile_id: profile_id,
            flag: 0,
            approve_status: 0
        }).then(function (results) {
            childrenProfileModel.update({
                connection_status: 1
            }, {
                    where: {
                        id: results.children_id
                    }
                }).then(function (result) {
                    var res = {};
                    res.testmodel = results;
                    res.childrenProfileModel = result;
                    callBack(res);
                })

        }).catch(function (error) {
            callBack(error);
        });

    };

    connectionService.insertConneection = function (req, statusflowModel, profileModel, connectionModel, childrenProfileModel, Sequelize, callBack) {
        console.log("inside insert connection request service");
        var children_id = req.body.children_id;
        var role = req.body.role;
        var profile_id = req.body.profile_id;
        var time = req.body.time;
        var process = req.body.process;
        var action = req.body.action;
        var volunteer_id = req.body.volunteer_id;
        console.log("volunteer id from req" + volunteer_id);
        connectionModel.count({
            where: {
                profile_id: profile_id,
            }
        }).then(function (result) {
            console.log("my result value" + result);
            if (result > 0) {
                console.log("profile id already present");
                var res = "1"
                callBack(res);
            }
            else {
                helperObject.workflowstatus(process, action, statusflowModel, Sequelize, function (result) {
                    var status = result[0].status;
                    if (process == 'vc') {
                        console.log("inside volunteer");
                        connectionModel.create({
                            children_id: children_id,
                            role: role,
                            profile_id: profile_id,
                            flag: 0,
                            active_ind: 1,
                            workflowstatus: status
                        }).then(function (results) {
                            var workflowstatus = results.workflowstatus;
                            helperObject.updateWorkFlowStatus(children_id, profile_id, workflowstatus, childrenProfileModel, profileModel, Sequelize, function (result) {
                                if (result != null) {
                                    console.log("success");
                                    callBack("success");
                                }
                            })
                        })
                    }
                    if (process == 'vcm') {
                        console.log("volunteer id" + volunteer_id);
                        connectionModel.findOne({
                            where: {
                                profile_id: volunteer_id
                            }
                        }).then(function (result) {
                            console.log("result of children" + result.children_id);
                            var childrenid = result.children_id;
                            connectionModel.create({
                                children_id: childrenid,
                                role: role,
                                profile_id: profile_id,
                                flag: 0,
                                active_ind: 1,
                                workflowstatus: status
                            }).then(function (results) {
                                var workflowstatus = results.workflowstatus;
                                helperObject.updateWorkFlowStatus(childrenid, profile_id, workflowstatus, childrenProfileModel, profileModel, Sequelize, function (result) {
                                    if (result != null) {
                                        console.log("mentor success");
                                        callBack("mentor success");
                                    }
                                })
                            })
                        })

                    }
                })
            }
        })



    };
    connectionService.mentorApproval = function (req, connectionModel, childrenProfileModel, profile, Sequelize, callBack) {
        var profileId = req.body.profileId;
        connectionModel.findOne({
            where: {
                profile_id: profileId,
                workflowstatus:'REQ_INT_MEN'
            }
        }).then(function (results) {
            callBack(results);
        })

    }
    connectionService.insertMentorConnection = function (req, connectionModel, childrenProfileModel, profile, Sequelize, callBack) {

        var volunteer_id = req.body.volunteerid;
        var profile_id = req.body.profile_id;
        var time = req.body.time;
        connectionModel.count({
            where: {
                profile_id: profile_id,
            }
        }).then(function (result1) {
            if (result1 >= 1) {
                var res = "1"
                callBack(res);
            }
            else {
                connectionModel.findOne({
                    where: {
                        profile_id: volunteer_id
                    }
                }).then(function (results) {
                    connectionModel.create({
                        children_id: results.children_id,
                        role: 2,
                        profile_id: profile_id,
                        flag: 0,
                        active_ind: 1
                    }).then(function (result) {
                        callBack(result);
                    })
                })
            }
        }).catch(function (error) {
            callBack(error);
        });

    };
    connectionService.volunteerhomeselectchildicon = function (req, testmodel, Sequelize, callBack) {
        var profile_id = req.body.id;
        testmodel.count({
            where: {
                profile_id: profile_id,
            }
        }).then(function (results) {
            console.log(results);
            if (results >= 1) {

                callBack("0");
            }
            else {
                callBack("1");
            }
        })
    }

    connectionService.denydetails = function (req, connectionModel, Sequelize, res) {
        var id = req.body.id;
        console.log("sfdkjldsjf;lkdsjkl;f");
        connectionModel.findOne({
            order: [
                ['id', 'DESC']
            ],
            where: {
                profile_id: id
            }


        }).then(function (result) {
            res.send(result);
        });
    };
    connectionService.viewchild = function (req, connectionModel, childrenProfileModel, Sequelize, res) {
        var id = req.body.id;
        console.log("id"+id);
        connectionModel.belongsTo(childrenProfileModel, { foreignKey: 'children_id' });
        connectionModel.findOne({
            where: {
                profile_id: id,
                workflowstatus:['ADM_APP_VOL','ADM_APP_MEN']
            },

            include: [
                {
                    model: childrenProfileModel
                },
            ]
        }).then(function (result) {
            res.send(result);
        });
    };
    connectionService.viewvolunteermentorprofile = function (req, connectionModel, profile, profileinfo, Sequelize, res) {
        var id = req.body.id;
        var role=req.body.role;
        if(role=='volunteer')
            {
                profile.findOne({
                    where:{
                        role:role,
                        id:id,
                        workflowstatus:'ADM_APP_VOL'
                    }       
                }).then(function(result){
                    if(result!=null)
                        {
                            connectionModel.belongsTo(profile, { foreignKey: 'profile_id' });
                            profile.belongsTo(profileinfo, { foreignKey: 'id' });
                            connectionModel.findAll({
                                where: {
                                    profile_id: id,
                                }
                            }).then(function (result) {
                                var role;
                                if ((result[0] != null) || (result == null)) {
                                    if (result[0].role == 'volunteer') {
                                        role = 'mentor';
                                    }
                                    else {
                                        role = 'volunteer';
                                    }
                                    connectionModel.findAll({
                                        where: {
                                            children_id: result[0].children_id,
                                            role: role,
                                            workflowstatus:['ADM_APP_MEN','ADM_APP_VOL']
                                        },
                                        include: [
                                            {
                                                model: profile,
                    
                                                include: [
                                                    {
                                                        model: profileinfo
                                                    },
                    
                                                ]
                                            },
                    
                                        ]
                                    }).then(function (results) {
                                        res.send(results);
                                    })
                                }
                                else {
                                    res.send("Data Not Found");
                                }
                            });
                        }
                })
            }
            if(role=='mentor')
                {
                    profile.findOne({
                        where:{
                            role:role,
                            id:id,
                            workflowstatus:'ADM_APP_MEN'
                        }       
                    }).then(function(result){
                        if(result!=null){
                            connectionModel.belongsTo(profile, { foreignKey: 'profile_id' });
                            profile.belongsTo(profileinfo, { foreignKey: 'id' });
                            connectionModel.findAll({
                                where: {
                                    profile_id: id,
                                }
                            }).then(function (result) {
                                var role;
                                if ((result[0] != null) || (result == null)) {
                                    if (result[0].role == 'volunteer') {
                                        role = 'mentor';
                                    }
                                    else {
                                        role = 'volunteer';
                                    }
                                    connectionModel.findAll({
                                        where: {
                                            children_id: result[0].children_id,
                                            role: role,
                                            workflowstatus:['ADM_APP_MEN','ADM_APP_VOL']
                                        },
                                        include: [
                                            {
                                                model: profile,
                    
                                                include: [
                                                    {
                                                        model: profileinfo
                                                    },
                    
                                                ]
                                            },
                    
                                        ]
                                    }).then(function (results) {
                                        res.send(results);
                                    })
                                }
                                else {
                                    res.send("Data Not Found");
                                }
                            });
                        }
                    })
                }
       
    };

    connectionService.viewchildvolunteer = function (req, connectionModel, profile, profileinfo, Sequelize, res) {
        var id = req.body.id;
        connectionModel.belongsTo(profile, { foreignKey: 'profile_id' });
        profile.belongsTo(profileinfo, { foreignKey: 'id' });
        connectionModel.findAll({
            where: {
                children_id: id,
                workflowstatus: ['ADM_APP_VOL', 'ADM_APP_MEN'] //approve_status
            },

            include: [
                {
                    model: profile,

                    include: [
                        {
                            model: profileinfo
                        },

                    ]
                },

            ]
        }).then(function (result) {
            res.send(result);
        });
    };
    connectionService.childvolunteermentor = function (req, testmodel, Sequelize, res) {
        var children_id = req.body.id;
        testmodel.findAll({
            where: {
                children_id: children_id,
            }
        }).then(function (results) {
            console.log(results);
            res.send(results);
        })
    }
    connectionService.connectionapproval = function (req, childrenProfileModel, connectionModel, profile, profileinfo, Sequelize, callBack) {

        connectionModel.belongsTo(childrenProfileModel, { foreignKey: 'children_id' });
        connectionModel.belongsTo(profile, { foreignKey: 'profile_id' });
        profile.belongsTo(profileinfo, { foreignKey: 'id' });
        var connectionOperation = req.body.connectionOperation;
        if (connectionOperation == "volunteer") {
            connectionModel.findAll({
                where: {
                    workflowstatus: 'REQ_INT_VOL',
                    role: "volunteer",
                    flag: 0
                },

                include: [
                    {
                        model: childrenProfileModel
                    },
                    {
                        model: profile,
                        include: [
                            {
                                model: profileinfo
                            }
                        ]
                    }
                ]
            }).then(function (results) {
                console.log("helllllllllllo" + results);
                callBack(results);
            })
        }
        if (connectionOperation == "mentor") {
            connectionModel.findAll({
                where: {
                    workflowstatus: 'MEN_APP',
                    role: "mentor"
                },

                include: [
                    {
                        model: childrenProfileModel,
                        // where: {
                        //     mentor_approval: 1
                        // }
                    },
                    {
                        model: profile,
                        include: [
                            {
                                model: profileinfo
                            }
                        ]
                    }
                ]
            }).then(function (results) {
                callBack(results);
            })
        }

    }


    connectionService.changeapproval = function (req, statusflowModel, connectionModel, childrenProfileModel, profile, Sequelize, res) {
        console.log("change");
      //  var children_id = req.body.children_id;
        var profile_id = req.body.profile_id;
        console.log("hjjjjjjjjjjjjjjjjjjj" + profile_id);
        var process = req.body.process;
        var action = req.body.action;
        var time = req.body.time;
        connectionModel.findOne({
            where: {
                profile_id: profile_id
            }
        }).then(function(result){
            if(result!=null)
                {
                    var children_id=result.children_id;
                      
        helperObject.workflowstatus(process, action, statusflowModel, Sequelize, function (result) {
            var status = result[0].status;
            if ('ADM_APP_VOL' == status || 'ADM_APP_MEN' == status || 'MEN_APP' == status) {
                connectionModel.update({
                    workflowstatus: status
                },
                    {
                        where: {
                            profile_id: profile_id
                        }

                    }).then(function (results) {
                        console.log("status" + status);
                        var workflowstatus = status;
                        console.log("workflw" + workflowstatus);
                        helperObject.updateWorkFlowStatus(children_id, profile_id, workflowstatus, childrenProfileModel, profile, Sequelize, function (result) {
                            if (result != null) {
                                console.log("success");
                                res.send("success");
                            }
                        }).then(function (results) {
                            var mailOptions = {
                                to: profile_find[0].email_id,
                                subject: "Children Connection Approved",
                                text: "The child you are requested has been Approved by admin"
                            }
                            verification.smtpTransport.sendMail(mailOptions, function (error, response) {
                                if (error) {
                                    // console.log(error);
                                    res.end("error");
                                }
                                else {
                                }
                            });
                            res.send(results);
                        });
                    })
            }
            if ('ADM_DEC_VOL' == status || 'ADM_DEC_MEN' == status || 'MEN_DEC' == status) {
                connectionModel.destroy({
                    where: {
                        profile_id: profile_id
                    }

                }).then(function (results) {
                    console.log("status" + status);
                    var workflowstatus = status;
                    console.log("workflw" + workflowstatus);
                    helperObject.updateWorkFlowStatus(children_id, profile_id, workflowstatus, childrenProfileModel, profile, Sequelize, function (result) {
                        if (result != null) {
                            console.log("success");
                            res.send("success");
                        }
                    }).then(function (results) {
                        var mailOptions = {
                            to: profile_find[0].email_id,
                            subject: "Children Connection Declined",
                            text: "The child you are requested has been Declined by admin"
                        }
                        verification.smtpTransport.sendMail(mailOptions, function (error, response) {
                            if (error) {
                                // console.log(error);
                                res.end("error");
                            }
                            else {
                            }
                        });
                        res.send(results);
                    });
                })
            }

        })
                }
        })
      
    }






    connectionService.viewadmintracker = function (req, connectionModel, profile, profileinfo, childrenProfileModel, Sequelize, callBack) {

        childrenProfileModel.hasMany(connectionModel, { foreignKey: 'children_id' });
        connectionModel.belongsTo(profile, { foreignKey: 'profile_id' });
        profile.belongsTo(profileinfo, { foreignKey: 'id' });

        // connectionModel.belongsTo(childrenProfileModel, { foreignKey: 'children_id' });
        childrenProfileModel.findAll({
            include: [
                {
                    model: connectionModel,
                    where: {
                        approve_status: 1,
                        // active_ind: 1
                    },
                    include: [
                        {
                            model: profile,
                            include: [
                                {
                                    model: profileinfo
                                }
                            ]
                        }
                    ]
                }
            ]
        }).then(function (result) {
            callBack(result);
        })
    }

    connectionService.volunteerhomeviewmentor = function (req, connectionModel, Sequelize, callBack) {
        var id = req.body.id;
        connectionModel.findAll({
            where: {
                profile_id: id,
                workflowstatus: 'ADM_APP_VOL'
            }
        }).then(function (result) {

            if (result[0] == undefined) {
                callBack("3");
            }
            else {
                var id = result[0].children_id;
                console.log("aaaaaaaaaaaaaaaaaaa" + id);
                connectionModel.count({
                    where: {
                        children_id: id,
                        role: "mentor"
                    }
                }).then(function (results) {
                    console.log(results);
                    if (results >= 1) {
                        callBack("0");
                    }
                    else {
                        callBack("1");
                    }
                })
            }

        })

    }
    connectionService.screenstatusService = function (req, childrenProfileModel, profileModel, Sequelize, callBack) {
        console.log("service of screenstatus");
        var id = req.body.id;
        var role = req.body.role;
        if ('children' == role) {
            childrenProfileModel.findOne({
                where: {
                    id: id
                }
            }).then(function (result) {
                callBack(result);
            })
        }
        if ('volunteer' == role || 'mentor' == role) {
            profileModel.findOne({
                where: {
                    id: id

                }
            }).then(function (result) {
                callBack(result);
            })
        }

    }

    return connectionService;
}
