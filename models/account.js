const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const accountSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
    },
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true,
    },
    githubId: String,
    image: String,
});

accountSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
accountSchema.plugin(mongodbErrorHandler);

const Account = model('Account', accountSchema);
module.exports = Account;