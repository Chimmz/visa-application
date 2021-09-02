const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
   passportNo: {
      type: String,
      required: true,
      unique: true,
      minlength: 9,
      maxlength: 9
   },
   fullname: { type: String, required: true, lowercase: true },
   password: { type: String, required: true },
   role: {
      type: String,
      enum: ['applicant', 'embassy-admin'],
      default: 'applicant',
      required: true
   }
});

userSchema.methods.encryptPassword = async function (pwdText) {
   return await bcrypt.hash(pwdText, 11);
};
userSchema.statics.findUserByPassportNo = async function (passportNo) {
   return await this.findOne({ passportNo });
};
module.exports = User = mongoose.model('User', userSchema);
