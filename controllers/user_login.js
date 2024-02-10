const { getClient } = require("../helperfun/postgresdatabase");
const Utils = require('../helperfun/utils');
const validateUserInput = require('../helperfun/validateUserInput');
const APIRes = require('../helperfun/result');
const { validationResult } = require("express-validator");

exports.emp_create = async (req, res, next) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw errors.array();
    }
    const userInput = Utils.getReqValues(req);

    const requiredFields = ["empcode", "name", "email", "phonenumber", "password", "username"];
    const inputs = validateUserInput.validateUserInput(userInput, requiredFields);
    if (inputs !== true) {
        return APIRes.getNotExistsResult(`Required ${inputs}`, res);
    }

    let empcode = userInput.empcode;
    let name = userInput.name;
    let email = userInput.email;
    let phonenumber = userInput.phonenumber;
    let password = userInput.password;
    let username = userInput.username;

    if (!validateEmail(email)) {
        console.log("Email is valid");
        return APIRes.getFinalResponse(false, `Email is invalid`, [], res);
    }



    const existing_record = `
        'SELECT * FROM user-login WHERE empcode = ${empcode}`


    const client = await getClient();
    const result = await client.query(existing_record);
    console.log(result.rows)
    if (existing_record.rows.length === 0) {
        console.log("kavitha")
        const result = await getClient().query(
            'INSERT INTO user-login(empcode,name, email, phone, password,username) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *',
            [empcode, name, email, phonenumber, password, username]
        );

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