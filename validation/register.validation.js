const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data){
    let errors = {};

    data.fullName = !isEmpty(data.fullName) ? data.fullName : "";
    data.email =  !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if(Validator.isEmpty(data.fullName)){
        errors.fullName = "Nama lengkap tidak boleh kosong";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "Email tidak boleh kosong";
    }else if(!Validator.isEmail(data.email)){
        errors.email = "Email tidak valid";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "password tidak boleh kosong";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Konfirmasi Password tidak boleh kosong";
    }


    if(!Validator.isLength(data.password,{min:8, max: 255})){
        errors.password = "Password minimal 8 karakter";
    }

    if(!Validator.equals(data.password,data.password2)){
        errors.password2 = "Password harus sama";
    }

    return{
        errors,
        isValid: isEmpty(errors)
    };
    
};