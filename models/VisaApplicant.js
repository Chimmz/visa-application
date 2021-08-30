const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const visaApplicantSchema = new mongoose.Schema({
   passportNo: {
      type: mongoose.Schema.Types.String,
      ref: 'User',
      unique: true,
      required: [true, 'Passport number field is required']
   },
   fullname: {
      type: String,
      lowercase: true,
      required: [true, 'Full name field is required']
   },
   // surname: { type: String, lowercase: true, required: true },
   // otherName: { type: String, lowercase: true, required: true },
   age: { type: Number, required: [true, 'Age field is required'] },
   gender: {
      type: String,
      enum: ['male', 'female'],
      lowercase: true,
      required: [true, 'Gender field is required']
   },
   dob: { type: Date, required: [true, 'Date of birth field is required'] },
   stateOrigin: {
      type: String,
      enum: [],
      lowercase: true,
      required: [true, 'State of origin field is required']
   },
   placeOrigin: { type: String, lowercase: true, required: true },
   nationality: {
      type: String,
      lowercase: true,
      required: [true, 'Nationality field is required']
   },
   lga: {
      type: String,
      lowercase: true,
      required: [true, 'Local govt. area field is required']
   },
   occupation: { type: String, lowercase: true, required: true },
   height: { type: Number, required: true },
   eyeColor: {
      type: String,
      enum: ['brown', 'black', 'blue'],
      lowercase: true,
      required: [true, 'Eye color field is required']
   },
   skinColor: {
      type: String,
      enum: ['white', 'black', 'red'],
      lowercase: true,
      required: [true, 'Skin color field is required']
   },
   maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'separated'],
      lowercase: true,
      required: [true, 'Marital status field is required']
   },
   // prettier-ignore
   nextOfKin: {
      type: String,
      lowercase: true,
      enum: ['father', 'mother', 'son', 'daughter', 'brother', 'sister', 'husband', 'wife', 'cousin', 'uncle', 'aunt', 'nephew', 'niece']
   },
   passportIssuedAt: {
      type: Date,
      required: [true, 'Passport issued date field is required']
   },
   passportExpiresAt: {
      type: Date,
      required: [true, 'Passport expiry date field is required']
   },
   phone: {
      type: String,
      required: [true, 'Phone number field is required'],
      validate: function (phone) {
         const phoneStarters = ['080', '070', '090', '081', '071'];
         const nigCode = ['+234'];
         if (
            [...phoneStarters, ...nigCode].every(
               prefix => !phone.startsWith(prefix)
            ) ||
            (phone.length !== 14 && phone.startsWith(nigCode[0])) ||
            // prettier-ignore
            phone.length !== 11 && phoneStarters.some(prefix => phone.startsWith(prefix))
         )
            throw new AppError('Invalid phone number entered', 400);
         return true;
      }
   },
   fathersName: { type: String, lowercase: true, required: true },
   mothersName: { type: String, lowercase: true, required: true }
});

const VisaApplicant = new mongoose.model('VisaApplicant', visaApplicantSchema);
module.exports = VisaApplicant;
