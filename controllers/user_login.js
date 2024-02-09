const pool = require('../db');
const Utils = require('../helperfun/utils');
const validateUserInput = require('../helperfun/validateUserInput');
const APIRes = require('../helperfun/result');
const { validationResult } = require("express-validator");

exports.user_login = async (req, res, next) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    console.log(userInput)
    const requiredFields = ["name", "email", "phonenumber", "password"];
    const inputs = validateUserInput.validateUserInput(userInput, requiredFields);
    if (inputs !== true) {
        return APIRes.getNotExistsResult(`Required ${inputs}`, res);
    }


    let name = userInput.name;
    let email = userInput.email;
    let phonenumber = userInput.phonenumber;
    let password = userInput.password;

    if (validateEmail(email)) {
        console.log("Email is valid");

    } else {
        console.log("Email is invalid");
        return APIRes.getFinalResponse(false, `Email is invalid`, [], res);
    }

    const existing_record = await pool.query(
        'SELECT * FROM user_login_hdr WHERE email = $1',
        [email]
    );
    if (existing_record.rows.length === 0) {
        console.log("kavitha")
        const result = await pool.query(
            'INSERT INTO user_login_hdr(name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, phonenumber, password]
        );
        console.log(result.rows)
        if (result) {
            return APIRes.getFinalResponse(true, `Profile created successfully.`, [], res);

        }
    }
    else {
        return APIRes.getFinalResponse(false, `Email alredy exist`, [], res);
    }


}


const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};