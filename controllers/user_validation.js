const pool = require('../db');
const Utils = require('../helperfun/utils');
const validateUserInput = require('../helperfun/validateUserInput');
const APIRes = require('../helperfun/result');
const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// exports.user_validation = async (req, res, next) => {

//     let errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         throw errors.array();
//     }
//     const userInput = Utils.getReqValues(req);
//     console.log(userInput)
//     const requiredFields = ["email", "password"];
//     const inputs = validateUserInput.validateUserInput(userInput, requiredFields);
//     if (inputs !== true) {
//         return APIRes.getNotExistsResult(`Required ${inputs}`, res);
//     }


//     let email = userInput.email;
//     let password = userInput.password;

//     const result = await pool.query(
//         `select * from user_login_hdr
//         where email='${email}' and password='${password}'`
//     );

//     console.log(result.rows)
//     if (result) {
//         return APIRes.getFinalResponse(true, `Record created successfully`, [], res);

//     }
// }


exports.authenticateUser = async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    console.log(userInput)
    const requiredFields = ["empcode", "password"];
    const inputs = validateUserInput.validateUserInput(userInput, requiredFields);
    if (inputs !== true) {
        return APIRes.getNotExistsResult(`Required ${inputs}`, res);
    }
    const email = userInput.email;
    const password = userInput.password;

    try {
        const result = await pool.query(
            'SELECT * FROM user_login WHERE empcode = $1',
            [email]
        );

        console.log(result.rows)
        if (result.rows.length === 0) {
            // User not found
            return APIRes.getFinalResponse(false, 'Invalid username or password', [], res);
        }

        const databasepassword = result.rows[0].password;
        const databaseemail = result.rows[0].email;
        const name = result.rows[0].name;
        console.log(result.rows)
        // Compare the entered password with the password from the database
        if (password === databasepassword && databaseemail == email) {
            // Passwords match, authentication successful
            return APIRes.getFinalResponse(true, 'Authentication successful', [{databaseemail,name}], res);
        } else {
            // Passwords don't match
            return APIRes.getFinalResponse(false, 'Invalid email or password', [], res);
        }
    } catch (error) {
        // Handle database query errors
        console.error(error);
        return APIRes.getFinalResponse(false, 'Internal server error', [], res);
    }
};




