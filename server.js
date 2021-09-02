const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('./utils/AppError');
const VisaApplicant = require('./models/VisaApplicant');
// console.log(__dirname, __filename);

let dbError;
(function connectDB() {
   mongoose
      .connect(
         'mongodb+srv://admin-divine:8u7y6t5r4e3w2q@cluster0.izxpt.mongodb.net/Whatsap-mern-backend?retryWrites=true&w=majority',
         {
            useNewUrlParser: true,
            useUnifiedTopology: true
         }
      )
      .then(conn => console.log('Database connected'))
      .catch(err => {
         dbError = err;
         console.log("Database couldn't connect");
      });
})();
app.use((req, res, next) => {
   next(
      dbError &&
         new AppError(
            'We are having problems connecting to our database. Check your internet connection and try again',
            500
         )
   );
});
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const JWT_SECRET_KEY = 'myvisaprocessingwebtoken';

const signToken = function (id) {
   const token = jwt.sign({ id }, JWT_SECRET_KEY, {
      expiresIn: '7d'
   });
   return token;
};

const authenticate = async function (req, res, next) {
   const token = req.query.userToken;
   // console.log(token);
   if (!token) return res.status(401).redirect('/login');

   try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);

      if (!user) return res.status(401).redirect('/login');
      req.user = user;
      next();
   } catch (err) {
      return res.redirect('/login');
   }
};

const restrictToAdmin = function (req, res, next) {
   if (req.user.role != 'embassy-admin')
      return res.status(401).send('Unauthorized to view this page. 401');
   return next();
};

app.get('/', (req, res) => {
   res.render('home', { pageName: 'home' });
});

app.get('/applicants/:passportNo', async (req, res) => {
   const { passportNo } = req.params;
   return res
      .status(200)
      .json({ applicant: await VisaApplicant.findOne({ passportNo }) });
});

app.get('/login', (req, res) => {
   res.render('auth', { pageName: 'auth', authStyle: 'login' });
});
app.get('/signup', (req, res) => {
   res.render('auth', { pageName: 'auth', authStyle: 'signup' });
});

app.get('/visa-apply', authenticate, (req, res) => {
   // console.log(req.user);
   res.render('visa-apply', {
      pageName: 'visa-apply',
      loggedInUser: req.user
   });
});

const adminAuthMiddlewares = [authenticate, restrictToAdmin];

app.get('/admin-page', ...adminAuthMiddlewares, async (req, res) => {
   const allApplicants = await VisaApplicant.find({});
   console.log(allApplicants);
   res.render('admin', {
      pageName: 'admin',
      allApplicants,
      token: req.query.userToken
   });
});

app.patch(
   '/visa-application/:passportNo/:actionTaken',
   ...adminAuthMiddlewares,
   async (req, res, next) => {
      try {
         const { passportNo, actionTaken } = req.params;
         const applicant = await VisaApplicant.findOne({ passportNo });
         if (!applicant)
            return next(new AppError('This applicant does not exis', 404));

         switch (actionTaken) {
            case 'grant':
               applicant.visaGranted = true;
               applicant.visaRejected = false;
               await applicant.save();
               break;

            case 'reject':
               applicant.visaGranted = false;
               applicant.visaRejected = true;
               await applicant.save();
               break;
         }
         res.status(200).json({ updatedApplicant: applicant });
      } catch (err) {
         return next(new AppError(err.message, 400));
      }
   }
);

app.post('/signup', async (req, res, next) => {
   try {
      for (key in req.body) {
         if (!req.body[key])
            return next(
               new AppError(`The "${key}" field cannot be empty`, 400)
            );
      }

      if (await User.findUserByPassportNo(req.body.passportNo)) {
         return next(
            new AppError(
               'Sorry, a user with that passport number already exists.',
               403
            )
         );
      }

      const newUser = new User(req.body);
      newUser.password = await newUser.encryptPassword(newUser.password);
      await newUser.save();

      res.status(201).json({
         status: 'success',
         user: newUser,
         token: signToken(newUser._id)
      });
   } catch (err) {
      console.log(err);
      // return next(
      //    new AppError(
      //       "Sorry, something happened. We couldn't create the new account",
      //       500
      //    )
      // );
   }
});

app.post('/login', async (req, res, next) => {
   delete req.body.fullname;
   console.log('Login Route hit');
   const { passportNo, password } = req.body;
   try {
      const user = await User.findUserByPassportNo(passportNo);
      if (!user || !(await bcrypt.compare(password, user.password)))
         return next(
            new AppError('Wrong passport number or password entered.', 404)
         );
      // Successful log in
      return res
         .status(201)
         .json({ status: 'success', user, token: signToken(user._id) });
   } catch (err) {
      console.log(err);
   }
});

app.post('/visa-apply', authenticate, async (req, res, next) => {
   // console.log(req.user, req.query.authToken);
   if (req.body.passportNo !== req.user.passportNo)
      return next(new AppError('Wrong passport number entered', 400));

   if (req.body.fullname.toLowerCase() !== req.user.fullname)
      return next(new AppError('Wrong full name entered', 400));

   try {
      const newApplicant = new VisaApplicant(req.body);
      console.log(req.user);
      await newApplicant.save();
      // console.log('newApplicant: ', newApplicant);
      return res.status(201).json({
         status: 'success',
         applicant: newApplicant,
         message: `Your visa application details have been successfully submitted. Watch out to be called for an interview.`
      });
   } catch (err) {
      console.log(err);
      if (err.code == 11000)
         return next(
            new AppError(
               'You have already applied for visa before. Please wait for you to be called for an interview',
               400
            )
         );
      return next(new AppError(err.message, 400));
   }
});

app.all('*', (req, res, next) => {
   res.send('<h1>Invalid path. 404</h1>');
   next();
});

const globalErrorHandler = (err, req, res, next) => {
   return res.status(err.errCode || 500).json({
      status: err.status || 'error',
      message: err.message
   });
};
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is up on ${PORT}`));
