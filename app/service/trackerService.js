module.exports = function (testmodel) {
    var trackerService = {};
    //insert data into tracker model   
    trackerService.InsertTracker = function (req, testmodel, connection, Sequelize, callBack) {
        console.log("welcome insert tracker");
        var date = req.body.date;
        var location = req.body.location;
        var agenda = req.body.agenda;
        var outcome = req.body.outcome;
        var keyAccomplishment = req.body.keyAccomplishment;
        var keyLearning = req.body.keyLearning;
        var newConnection = req.body.newcon;
        var menteeChallenges = req.body.menteeChallenges;
        var mentorChallenges = req.body.mentorChallenges;
        var volunteerChallenges = req.body.volunteerChallenges;
        var review = req.body.review;
        var profile_id = req.body.id;
        console.log("profile_id" + profile_id);
        console.log("hi");
        connection.findOne({
            where: {
                profile_id: profile_id
            }
        }).then(function (result) {
            console.log(result);
            var child_id = result.children_id;
            var role = result.role;
            console.log(role);
            testmodel.create({
                date: date,
                location: location,
                agenda: agenda,
                outcome: outcome,
                keyAccomplishment: keyAccomplishment,
                keyLearning: keyLearning,
                newConnection: newConnection,
                menteeChallenges: menteeChallenges,
                mentorChallenges: mentorChallenges,
                volunteerChallenges: volunteerChallenges,
                review: review,
                profile_id: profile_id,
                mentee_id: child_id,
                role: role
            }).then(function (results) {
                callBack(results);
            })

        }).catch(function (error) {
            callBack(error);
        });


    };
    trackerService.ListTrackerDates = function (req, testmodel, Sequelize, res) {
        console.log("welcome to listing of tracker users");
        var role=req.body.role;
        var child_id=req.body.child_id;
        var profile_id=req.body.profile_id
        if("volunteer"==role || 'mentor'==role)
        {
            testmodel.findOne({
                where:{
                    profile_id:profile_id
                }
            }).then(function(result){
                if(null!=result)
                {
                    //console.log()
                    testmodel.findAll({
                        where: {
                            mentee_id: result.mentee_id
                          
                        }
                    }).then(function (results) {
                        //console.log(results);
                        res.send(results);
            
                    });
                }
    
            })
    
        }
        if("children"==role || 'admin'==role)
        {
            testmodel.findAll({
                where: {
                    mentee_id: child_id
                  
                }
            }).then(function (results) {
                //console.log(results);
                res.send(results);
    
            });
        }
      
      
              

    };
    // trackerService.ListTrackerDates = function (req, testmodel, Sequelize, res) {
    //     console.log("welcome to listing of tracker users");

    //     var id = req.body.id;
    //     console.log(";dfjlsk" + id);
    //     testmodel.findAll({
    //         where: {
    //             $or: [{ mentee_id: id }, { profile_id: id }],
    //             $not: {
    //                 location: "Nil"
    //             }
    //         }
    //     }).then(function (results) {
    //         console.log(results);
    //         res.send(results);

    //     });

    // };

    trackerService.mentorgraphDates = function (req, testmodel, Sequelize, res) {
        console.log("welcome to listing of tracker users");

        var id = req.body.id;
        console.log(";dfjlsk" + id);
        testmodel.findAll({
            where: {
                profile_id: id,
                role: "mentor"
            }
        }).then(function (results) {
            console.log(results);
            res.send(results);

        });

    };
    trackerService.adminmentorgraphDates = function (req, testmodel, Sequelize, res) {
        var mentee_id = req.body.id;
        console.log(mentee_id)
        testmodel.findAll({
            where: {
                mentee_id: mentee_id,
                role: "mentor"
            }
        }).then(function (results) {
            res.send(results);
        })

    }
    trackerService.ListTrackerDatesmentorid = function (req, testmodel, connectionControllerModel, Sequelize, res) {
        var profile_id = req.body.id;
        console.log(profile_id);
        console.log("welcome to listing of tracker users sldfjsldfjsldf");
        connectionControllerModel.findOne({
            where: {
                profile_id: profile_id
            }
        }).then(function (results) {
            var mentee_id = results.children_id;
            var role = results.role;
            testmodel.findAll({
                where:
                {
                    mentee_id: mentee_id,
                    // $not: {
                    //     role: role
                    // }
                }
            }).then(function (results) {
                res.send(results);

            });
        })
    };
    trackerService.reviewGraph = function (req, trackerModel, connectionModel, Sequelize, res) {

        console.log("welcome to listing of review details of tracker  of users");
        var child_id = req.body.child_id;
        var role = req.body.role;
        var created_at=req.body.date;
        var profile_id=req.body.profile_id;

        if("volunteer"==role || 'mentor'==role)
        {
            trackerModel.findOne({
                where:{
                    profile_id:profile_id
                }
            }).then(function(result){
                if(null!=result)
                {
                    //console.log()
                    trackerModel.findOne({
                        where: {
                            mentee_id: result.mentee_id,
                            created_at: created_at
                          
                        }
                    }).then(function (results) {
                        //console.log(results);
                        res.send(results);
            
                    });
                }
    
            })
    
        }
        if("children"==role || 'admin'==role)
        {
                console.log("inside children"+child_id);
            trackerModel.findOne({
                where: {
                    mentee_id: child_id,
                    created_at: created_at
                  
                }
            }).then(function (results) {
                //console.log(results);
                res.send(results);
    
            }); 
        }
        // if( role == 'volunteer'|| role == 'mentor')
        // {
            //   trackerModel.findOne({ where: { created_at: req.body.date } })
            //     .then(function (results) {
            //         console.log(results);
            //         res.send(results);

            //     });
        // }
        // if ( role == 'admin'|| role == 'children') {

        //      trackerModel.findOne({ where: { created_at: req.body.date } })
        //         .then(function (results) {
        //             console.log(results);
        //             res.send(results);

        //         });
        // }
        // else {
        //    connectionModel.findOne({ where: {profile_id: req.body.profileId } })
        //         .then(function (results) {

        //             console.log(results);
        //       //     childId=results.children_id;
        //             console.log("child id : ",results.children_id);
        //            // res.send(results);
        //             trackerModel.findOne({ where: { created_at: req.body.date, mentee_id: results.children_id } })
        //         .then(function (result) {
        //             console.log(result);
        //             res.send(result);

        //         });

        //         });
         

        // }


    }
    // cumulativegraph start
    trackerService.cumulativegraph = function (req, trackerModel, Sequelize, res) {
        var profileId = req.body.profileId;
        console.log("my cumulative graph to fetch only date for dropdown");
        testmodel.findOne({
            where:{
                profile_id:profileId
            }
        }).then(function(result){
            trackerModel.findAll({
                where:
                {
                   mentee_id:result.mentee_id
    
                }
            }).then(function (results) {
    
                res.send(results);
            });
        })
           }
    trackerService.cumulativegraphwithdate = function (req, trackerModel, Sequelize, res) {
        console.log("welcome to listing of review details of tracker  of users");
        var common = req.body.common;
        console.log("common" + common);
        console.log("fromdadte" + req.body.fromdate);
        console.log("graph with date rfdkjhgjdhbg");
        var date1 = req.body.fromdate;
        console.log("date1" + date1);
        var date2 = req.body.todate;
        var profileId = req.body.profileId;
        console.log("date2" + date2);
        trackerModel.findAll({
            where:
            {
                profile_id: profileId,
                date: {
                    $between: [date1, date2]
                }
            }
        }).then(function (results) {

            res.send(results);

        });


    }
    // cumulativegraph ends
    return trackerService;
}