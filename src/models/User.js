import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { bcryptSaltRounds } from '../config/serverConfig.js';

const userSchema = new Schema({
    registerAs: {
        type: String,
        enum: {
            values: ['parent', 'teacher', 'student'],
            message: 'The value "{VALUE}" is not acceptable as user status. Options are: "parent", "teacher" or "student".'
        },
        required: [true, 'Status is required. Options are: "parent", "teacher" or "student".']
    },
    firstName: {
        type: String,
        validate: {
            validator: function (val) {
                const regex = new RegExp('^[A-Za-z ]+$');
                val = val.trim();
                return regex.test(val);
            },
            message: props => `The value "${props.value}" is not a valid first name.`
        },
        required: [true, 'First name is required.']
    },
    lastName: {
        type: String,
        validate: {
            validator: function (val) {
                const regex = new RegExp('^[A-Za-z ]+$');
                val = val.trim();
                return regex.test(val);
            },
            message: props => `The value "${props.value}" is not a valid last name.`
        },
        required: [true, 'Last name is required.']
    },
    dateOfBirth: {
        type: String,
        validate: {
            validator: function (val) {
                const regex = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
                return regex.test(val);
            },
            message: props => `The value "${props.value}" is not a valid date of birth.`
        },
        required: [true, 'Date of birth is required.']
    },
    email: {
        type: String,
        validate: {
            validator: function (val) {
                const regex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$');
                return regex.test(val);
            },
            message: props => `The value "${props.value}" is not a valid email.`
        },
        required: [true, 'Email is required.']
    },
    mobileNumber: {
        type: String,
        validate: {
            validator: function (val) {
                const regex = new RegExp('^[+]?[0-9 ]+$');
                val = val.trim();
                return regex.test(val);
            },
            message: props => `The value "${props.value}" is not a valid mobile number.`
        },
        required: [true, 'Mobile number is required.']
    },
    homeNumber: {
        type: String,
        validate: {
            validator: function (val) {
                const regex = new RegExp('^[+]?[0-9 ]+$');
                val = val.trim();
                if (val === '') {
                    return true;
                    // true because home phone number is optional; validate only if entered
                }
                return regex.test(val);
            },
            message: props => `The value "${props.value}" is not a valid home number.`
        }
    },
    street: {
        type: String,
        validate: {
            validator: function (val) {
                const regex = new RegExp('^[A-Za-z -]+$');
                val = val.trim();
                return regex.test(val);
            },
            message: props => `The value "${props.value}" is not a valid street.`
        },
        required: [true, 'Street is required.']
    },
    houseNumber: {
        type: String,
        validate: {
            validator: function (val) {
                const regex = new RegExp('^(?<![A-Za-z -])[0-9 -]+[A-Za-z]?$');
                val = val.trim();
                return regex.test(val);
            },
            message: props => `The value "${props.value}" is not a valid house number.`
        },
        required: [true, 'House number is required.']
    },
    city: {
        type: String,
        validate: {
            validator: function (val) {
                const regex = new RegExp('^[A-Za-z -]+$');
                val = val.trim();
                return regex.test(val);
            },
            message: props => `The value "${props.value}" is not a valid city.`
        },
        required: [true, 'City is required.']
    },
    password: {
        type: String,
        validate: {
            validator: function (val) {
                const regex = new RegExp('^[0-9A-Za-z$%_!+@?=&,;.:-]{8,}$');
                return regex.test(val);
            },
            message: props => `The value "${props.value}" is not a valid password.`
        },
        required: [true, 'Password is missing.']
    },
    profilePicture: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    }
});

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, bcryptSaltRounds);
});

const User = model('User', userSchema);

export default User;



