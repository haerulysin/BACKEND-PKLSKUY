const Validator = require("validator");
const isEmpty = require('is-empty');

module.exports = function validateLoginInput(data){
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (Validator.isEmpty(data.email)){
        errors.email = "Email atau Username tidak boleh kosong";
    }


    if(Validator.isEmpty(data.password)){
        errors.password = "Password tidak boleh kosong";
    }

    return{
        errors,
        isValid: isEmpty(errors)
    };
};