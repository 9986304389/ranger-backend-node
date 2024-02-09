const express = require('express');
const user_login = require('../controllers/user_login');
const user_validation = require('../controllers/user_validation')
const save_form_data = require('../controllers/study_form_data');
const view_save_form_data = require('../controllers/view_study_form_data');
const reset_password=require("../controllers/resetPassword");
const router = express.Router();

router.post('/create_emp', user_login.emp_create);
router.post('/login', user_validation.authenticateUser);
router.post('/save_form_data', save_form_data.study_form_data);
router.post('/view_form_data', view_save_form_data.view_study_form_data);
router.post('/resetpassword', reset_password.reset_password);
module.exports = router;