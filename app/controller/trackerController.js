module.exports = function (databaseBS, Sequelize) {
    var trackerModel = require('../module/tracker').TrackerDetial(databaseBS, Sequelize, "trackers");
    var connectionControllerModel = require('../module/connection').ConnectionDetial(databaseBS, Sequelize, "children_connections");
    var trackerServiceObject = require('../service/trackerService')(trackerModel);

    var trackerController = {};
    // Tracker object to call service using functon call "InsertTracker"
    trackerController.Tracker = function (req, res, next) {
        console.log("hi tracker user");
        trackerServiceObject.InsertTracker(req, trackerModel, connectionControllerModel, Sequelize, function (result) {
            console.log("my ressssssssssssssssts" + result);
            res.send(result);
        });
    };

    trackerController.ListDates = function (req, res, next) {
        console.log("hi tracker user");
        trackerServiceObject.ListTrackerDates(req, trackerModel, Sequelize, res);
    }
    trackerController.trackerDatesToVerify = function (req, res, next) {
        console.log("hi tracker controller to verify tracker dates ");
        trackerServiceObject.trackerDatesToVerify(req, trackerModel, Sequelize, res);
    }
    trackerController.mentorgraphDates = function (req, res, next) {
        console.log("hi tracker user");
        trackerServiceObject.mentorgraphDates(req, trackerModel, Sequelize, res);
    }
    trackerController.adminmentorgraphDates = function (req, res, next) {
        console.log("hi tracker user");
        trackerServiceObject.adminmentorgraphDates(req, trackerModel, Sequelize, res);
    }

    trackerController.ListTrackerDatesmentorid = function (req, res, next) {
        console.log("hi tracker user");
        trackerServiceObject.ListTrackerDatesmentorid(req, trackerModel, connectionControllerModel, Sequelize, res);
    }

    trackerController.ReviewGraph = function (req, res, next) {
        console.log("hi review of tracker user");
        trackerServiceObject.reviewGraph(req, trackerModel,connectionControllerModel, Sequelize, res);
    };

    // cumulativegraph starts
    trackerController.cumulativegraph = function (req, res, next) {
        console.log("hi review of tracker user");
        trackerServiceObject.cumulativegraph(req, trackerModel, Sequelize, res);
    };

    trackerController.cumulativegraphwithdate = function (req, res, next) {
        console.log("hi review of tracker user");
        trackerServiceObject.cumulativegraphwithdate(req, trackerModel, Sequelize, res);
    };
    // cumulativegraph ends
    return trackerController;
}