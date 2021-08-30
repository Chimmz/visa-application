class AppError extends Error {
   constructor(msg, errCode) {
      super(msg);
      this.errCode = errCode;
      this.status = `${errCode}`[0] == 4 ? 'fail' : 'error';
      this.isUserError = true;
   }
}
module.exports = AppError;
