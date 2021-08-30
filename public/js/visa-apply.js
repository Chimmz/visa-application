const formVisaApply = document.querySelector('form[id="visa-apply"');
const modal = document.querySelector('.modal');
const modalTitle = modal.querySelector('.modal-title');
const [iconSuccess, iconFail] = modalTitle.querySelectorAll('.fas');
// console.log(iconSuccess, iconFail);
const modalMsg = modal.querySelector('.modal-msg');
const btnModalClose = document.querySelector('.modal > .modal-close');
const btnModalOk = modal.querySelector('.modal-btn-ok');
const overlay = document.querySelector('.overlay');
console.log(overlay);
// console.log(btnModalClose);

const closeModal = ev => {
   ev.target.closest('.modal').classList.add('modal--hidden');
   overlay.classList.add('overlay--hidden');
};
btnModalClose.addEventListener('click', closeModal);
btnModalOk.addEventListener('click', closeModal);

const handleResponse = function (response) {
   console.log(response);
   const { status, message } = response;
   switch (status) {
      case 'success':
         modalTitle.textContent = 'Success';
         modalTitle.classList.remove('modal-title--fail');
         modalTitle.classList.add('modal-title--success');
         iconSuccess.classList.remove('u-hidden');
         modalMsg.textContent = message;
         break;
      case 'fail':
      case 'error':
         modalTitle.textContent = 'Error';
         modalTitle.classList.add('modal-title--fail');
         modalTitle.classList.remove('modal-title--success');
         iconFail.classList.remove('u-hidden');
         modalMsg.textContent = message;
   }
   modal.classList.remove('modal--hidden');
   overlay.classList.remove('overlay--hidden');
};
const applyForVisa = async function (details) {
   console.log(details);
   const token =
      localStorage.getItem('VISA_PROCESSING_USER_TOKEN') || 'notoken';
   // if (!token) location.href = location.host + '/login';
   console.log(token);

   try {
      const res = await fetch(`/visa-apply?userToken=${token}`, {
         method: 'POST',
         body: JSON.stringify(details),
         headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
         }
      });
      const response = await res.json();
      handleResponse(response);
   } catch (err) {
      console.log('EEROR: ', err);
   }
};

formVisaApply.onsubmit = function (ev) {
   ev.preventDefault();
   const { target } = ev;
   const reqBody = {
      fullname: target.fullname.value,
      // surname: target.surname.value,
      // otherName: target.otherName.value,
      age: target.age.value,
      gender: target.gender.value,
      dob: new Date(target.dob.value),
      stateOrigin: target.stateOrigin.value,
      placeOrigin: target.placeOrigin.value,
      nationality: target.nationality.value,
      lga: target.lga.value,
      occupation: target.occupation.value,
      height: target.height.value,
      eyeColor: target.eyeColor.value,
      skinColor: target.skinColor.value,
      maritalStatus: target.maritalStatus.value,
      nextOfKin: target.nextOfKin.value,
      passportNo: target.passportNo.value,
      passportIssuedAt: new Date(target.passportIssuedAt.value),
      passportExpiresAt: new Date(target.passportExpiresAt.value),
      phone: target.phone.value,
      fathersName: target.fathersName.value,
      mothersName: target.mothersName.value
   };
   applyForVisa(reqBody);
};
