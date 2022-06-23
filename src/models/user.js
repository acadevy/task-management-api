const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email: {
        type:String,
        unique: true,
        required:true,
        trim:true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid');
            }
        }
    },
    password: {
        type:String,
        required:true,
        trim:true,
        minlength: 7,
        validator(value){
            if(value.lowercase().includes('password')){
                throw new Error('Password cannot contain password');
            }
        }
    }
})