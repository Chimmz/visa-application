const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
   passportNo: { type: String, required: true, unique: true },
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
// userSchema.pre('save', async function (next) {
//    if (this.isModified('password'))
//       this.password = await bcrypt.hash(this.password, 11);
//    return next();
// });

module.exports = User = mongoose.model('User', userSchema);
