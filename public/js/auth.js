const authStyle = document.querySelector('input[type="hidden"]').value;
const authForm = document.querySelector('.auth-form');
const errorText = document.querySelector('.u-msg-error');
const btnSubmit = document.querySelector('[type="submit"]');
console.log(btnSubmit);

console.log(errorText);

authForm.onsubmit = function (ev) {
   ev.preventDefault();
   const fullname = authStyle === 'signup' && this.fullname.value;
   const passportNo = this.passportNo.value;
   const password = this.password.value;

   submit({ fullname, passportNo, password });
};

const showResponseMsg = function (response) {
   if (!errorText) return;
   errorText.textContent =
      response.message || 'Sorry, something wrong has happened';
   errorText.classList.remove('u-hidden');
};
const removeErrorMsg = function () {
   if (!errorText) return;
   errorText.textContent = '';
   errorText.classList.add('u-hidden');
};

const handleResponse = function (response) {
   switch (response.status) {
      case 'success':
         const { token, user } = response;
         const { fullname, passportNo, role } = user;

         removeErrorMsg();
         window.localStorage.setItem('VISA_PROCESSING_USER_TOKEN', token);
         window.localStorage.setItem(
            'VISA_PROCESSING_USER',
            JSON.stringify({
               fullname,
               passportNo,
               role,
               isLoggedIn: true
            })
         );
         window.location.href = window.location.origin;
         break;
      case 'fail':
         window.localStorage.setItem('VISA_PROCESSING_USER_TOKEN', null);
         window.localStorage.setItem('VISA_PROCESSING_USER', null);
      case 'error':
         showResponseMsg(response);
         break;
   }
};

async function submit(formData) {
   const body = JSON.stringify(formData);

   try {
      const res = await fetch(`/${authStyle}`, {
         method: 'POST',
         body,
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
         }
      });

      const response = await res.json();
      console.log('Response: ', response);

      handleResponse(response);
   } catch (err) {
      console.log('An error: ', err);
   }
}
