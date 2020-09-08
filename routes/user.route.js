
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const keys = require('../config/globalkeys');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
//Validations
const validateRegisterInput = require('../validation/register.validation');
const validateLoginInput = require('../validation/login.validation');

//Models
const User = require('../models/user.model');



// @route GET /users
// @desc Get All User List
// @access Public
router.route('/').get((req,res)=>{

    User.find((err,data)=>{
        if(err){res.status(400).json({status:0,message:err})}
        data.auth = {};
        res.status(200).json(data);
    });

});

// @route GET /users/:id
// @desc Get User by ID
// @access Public
router.route('/:id').get((req,res)=>{
    User.findById(req.params.id,(err,data)=>{
        if(err){res.status(400).json({status:0,message:err})}
        data.auth = {username: data.auth.username};
        res.status(200).json(data);
    })
});


// @route POST /users/register
// @desc Login user
// @access Public
router.route('/login').post((req,res) => {
    const {errors,isValid} = validateLoginInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email}).then(user => {
        if(!user){
            return res.status(404).json({ message: "AUsername atau password salah!"});
        }

        bcrypt.compare(password,user.auth.password).then(isMatch=>{
            if(isMatch){
                const payload = {
                    id : user.id,
                    fullName : user.fullName
                };

                jwt.sign(
                    payload,
                    keys.JWTSecreyKey,
                    {
                        expiresIn: 86400 //1 hari
                    },
                    (err,token)=>{
                        res.json({
                            success: true,
                            token: "Bearer"+token
                        });
                    }
                );
            }else{
                return res.status(400).json({success:false,message: "Username atau password salah!"})
            }
        });
    });

});

router.route('/register').post((req,res) => {
    const {errors,isValid} = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {

        if (user) {
            return res.status(400).json({ message: "Email sudah terdafatar" });
        } else {
            const newUser = new User({
                fullName: req.body.fullName,
                email: req.body.email,
                auth : {
                    password: req.body.password
                },
                address:{},
                reputation:{},
                biodata:{},

            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.auth.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.auth.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });


            });
        }

    });
});

router.route('/updateUser/:id').patch((req,res) => {
    User.findByIdAndUpdate(req.params.id,{
        
        $set: req.body
    },(err,data) => {

        if(err){res.status(400).json(err)}
        res.status(200).json({status: 'OK',message:'Update Data Sukses'});

    });
});




router.route('/deleteUser/:id').delete((req,res)=>{
    User.findByIdAndRemove(req.params.id,(err,data) => {
        if(err){res.status(400).json(err);throw err;}
        res.status(200).json({status:"OK", message:"Data "+data.fullName+" Berhasil dihapus"})
    });
});

router.route('/changePassword/:id').patch((req,res) => {
    const {currentPassword,newPassword} = req.body;
    const salt = bcrypt.genSaltSync(10);
    User.findById(req.params.id, (err,data)=>{
        if(err){res.status(400).json(err)}

        bcrypt.compare(currentPassword,data.auth.password).then(isMatch=>{
            if(isMatch){
                const newPasswordHashed = bcrypt.hashSync(newPassword);
                User.findByIdAndUpdate(req.params.id,
                    { $set: { 'auth.password': newPasswordHashed}},(err,data)=>{
                        if(err){res.status(400).json({status:0,message:err})}
                        res.status(200).json({status:1,message:'Password berhasil diperbaharui'})
                    }
                );
            }else{
                return res.status(400).json({status:0,message:'Password lama salah!'});
            }
        });

    });
    
});

module.exports = router;