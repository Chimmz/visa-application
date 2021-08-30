import { titleCase } from './utils.js';

const topNav = document.querySelector('nav .nav-top');
const bottomNav = document.querySelector('nav .nav-bottom');
const navlinks = [...bottomNav.querySelectorAll('.nav-item a')];
const loggedInUserElement = bottomNav.querySelector('.nav-logged-in-user');
const [btnLogout, btnLogin] = topNav.querySelectorAll(
   '.nav-auth .nav-authlink[name*="log"]'
);
const token = localStorage.getItem('VISA_PROCESSING_USER_TOKEN') || '';
const currentUser =
   JSON.parse(localStorage.getItem('VISA_PROCESSING_USER')) || '';

(function () {
   navlinks[0].href = '/';
   navlinks[1].href = `/visa-apply?userToken=${token}`;
   navlinks[2].href = '/interview';
})();

switch (currentUser?.isLoggedIn) {
   case true:
      btnLogin.classList.add('u-hidden');
      [
         loggedInUserElement.querySelector('.nav-user-fullname').textContent,
         loggedInUserElement.querySelector('.nav-user-passportno').textContent
      ] = [titleCase(currentUser.fullname), currentUser.passportNo];
      break;
   default:
      btnLogout.classList.add('u-hidden');
      loggedInUserElement.classList.add('u-hidden');
      console.log('loggedInUserElement hidden');
}

btnLogout.onclick = function (ev) {
   window.localStorage.removeItem('VISA_PROCESSING_USER_TOKEN');
   window.localStorage.removeItem('VISA_PROCESSING_USER');
   location.href = location.origin;
};

console.log(token, currentUser);
