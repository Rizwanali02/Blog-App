import mongoose from "mongoose";
import validator from "validator"; //this package for Email Validation
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true,
        minLength: [3, "Name must contain at least 3 character"],
        maxLength: [32, "Name cannot exceed 32 character"],
    },

    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },

    phone: {
        type: Number,
        required: true,
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    education: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["Reader", "Author"]
    },

    password: {
        type: String,
        required: true,
        minLength: [8, "Password must contain at least 6 character"],
        maxLength: [32, "Password cannot exceed 32 character"],
        select: false
    },
    createdOn: {
        type: Date,
        default: Date.now,
    }

});


//hashing user password for save database----------------------------------------------------------------
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


//compare login user :- enter password correct hai ya nhi --------------------
userSchema.methods.comparePassword =function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};


//Generateing JWT Token for user --------------------------------
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  };

export const User = mongoose.model('User', userSchema);