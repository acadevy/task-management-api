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
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number!');
            }
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    // avatar: {
    //     type: Buffer
    // }
},
    {
        timestamps: true
    }
);

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  
    this.tokens = this.tokens.concat({ token });
    await this.save();
  
    return token;
  };

  userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
  });

  userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
  
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.__v;
    // delete userObject.avatar;
  
    return userObject;
  };
  
  userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
  
    if (!user) {
      throw new Error('Unable to login!');
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      throw new Error('Unable to login!');
    }
  
    return user;
  };