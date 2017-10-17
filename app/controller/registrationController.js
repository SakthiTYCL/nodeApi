module.exports = function (databaseBS, Sequelize) {
        var login = require('../module/login').UserDetial(databaseBS, Sequelize, "logins");
        var profileinfo = require('../module/profileinfo').UserDetial(databaseBS, Sequelize, "profileinfos");
        var profile = require('../module/profile').UserDetial(databaseBS, Sequelize, "profiles");
        var childrenProfileModel = require('../module/childrenprofile').ChildrenProfileDetial(databaseBS, Sequelize, "childrenprofiles");
        var registrationServiceObject = require('../service/registrationService')(profile, profileinfo, databaseBS, Sequelize);
        var registrationController = {};
        registrationController.Registration = function (req, res, next) {
                console.log("Helo users");
                registrationServiceObject.InsertProfile(
                        req,
                        profile,
                        profileinfo,
                        childrenProfileModel,
                        login,
                        Sequelize,
                        function (results) {
                                console.log("my controller result"+JSON.stringify(results));
                                if(results.emailidpresent == 1)
                                        {
                                                console.log("your email id already present please choose some other email id");
                                        }
                                res.send(results);
                        });
                console.log("controller reggggggggggistration" + req.body.name);
        };
        // ValidateUser object to call service using functon call "validateUserDetial"
        registrationController.ValidateUser = function (req, res, next) {
                console.log("Entering into validate user");
                registrationServiceObject.validateUserCredential(
                        req,
                        login,
                        Sequelize,
                        res);
        };
        registrationController.denyloginstatus = function (req, res, next) {
                console.log("change status value");
                registrationServiceObject.denyloginstatus(
                        req,
                        profile,
                        login,
                        Sequelize,
                        res);
        };

        registrationController.changeStatusController = function (req, res, next) {
                console.log("change status value");
                registrationServiceObject.changeStatusService(
                        req,
                        profile,
                        login,
                        Sequelize,
                        res);
        };
        registrationController.listofvolunteer = function (req, res, next) {
                console.log("list of volunteer");
                registrationServiceObject.viewvolunteer(req, profile, Sequelize, res);
        };
        registrationController.viewVolunteerToApprove = function (req, res, next) {
                console.log(" view data to approve controller");
                registrationServiceObject.viewDataToApprove(
                        req,
                        login,
                        profile,
                        profileinfo,
                        Sequelize,
                        res);
        };
        registrationController.addfiles = function (req, res, next) {
                console.log("hello");
                registrationServiceObject.addfiles(
                        req,
                        profileinfo,
                        Sequelize,
                        res);
        };
        registrationController.userVerification = function (req, res, next) {
                registrationServiceObject.userVerification(
                        req,
                        profile,
                        profileinfo,
                        login,
                        Sequelize,
                        res);
        };

        registrationController.forgotPassword = function (req, res, next) {
                registrationServiceObject.forgotPassword(
                        req,
                        profile,
                        login,
                        Sequelize,
                        res);
        };
        // update Password start
        registrationController.changePassword = function (req, res, next) {
                registrationServiceObject.changePassword(
                        req,
                        profile,
                        login,
                        Sequelize,
                        res);
        }
        registrationController.contactUs = function (req, res, next) {
                console.log("hgigttttttttt");
                registrationServiceObject.contactUs(
                        req,
                        profile,
                        Sequelize,
                        res);
        }
        registrationController.photoUpload = function (req, res, next) {
                // console.log("hello");
                registrationServiceObject.photoUpload(
                        req,
                        childrenProfileModel,
                        Sequelize,
                        res);
        };
        // update Password end
        return registrationController;
}