const pool = require('../db');
const Utils = require('../helperfun/utils');
const validateUserInput = require('../helperfun/validateUserInput');
const APIRes = require('../helperfun/result');
const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { getClient } = require("../helperfun/postgresdatabase");

exports.authenticateUser = async (req, res, next) => {
    let client;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    const requiredFields = ["empcode", "password"];
    const inputs = validateUserInput.validateUserInput(userInput, requiredFields);
    if (inputs !== true) {
        return APIRes.getNotExistsResult(`Required ${inputs}`, res);
    }
    const empcode = userInput.empcode;
    const password = userInput.password;
    client = await getClient();
    try {
        const result = await client.query(
            `SELECT * FROM user_details_hdr WHERE empcode = '${empcode}' and password='${password}'`,

        );

        console.log(result.rows)
        if (result.rows.length === 0) {
            // User not found
            return APIRes.getFinalResponse(false, 'Invalid username or password', [], res);
        }

        const result_password = result.rows[0].password;
        const resutl_empcode = result.rows[0].empcode;
        const name = result.rows[0].name;
        const phoneNumber=result.rows[0].phonenumber;
        const email=result.rows[0].email;
        // Compare the entered password with the password from the database
        if (password === result_password && empcode == resutl_empcode) {
            // Passwords match, authentication successful
            return APIRes.getFinalResponse(true, 'Authentication successful', [{ name:name, phonenumber:phoneNumber, email:email,empcode:resutl_empcode}], res);
        } else {
            // Passwords don't match
            return APIRes.getFinalResponse(false, 'Invalid email or password', [], res);
        }
    } catch (error) {
        // Handle database query errors
        console.error(error);
        return APIRes.getFinalResponse(false, 'Internal server error', [], res);
    }
    finally {
        // Close the client connection
        if (client) {
            await client.end();
        }
    }
};




