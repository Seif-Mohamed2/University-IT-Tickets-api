const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

const verifyJWT = require("../middleware/verifyJWT");

//router.use(verifyJWT)

router.route("/")
    .get(studentController.getAllStudents)
    .post(studentController.createNewStudent)
    .patch(studentController.updateStudent)
    .delete(studentController.delelteStudent)

module.exports = router;