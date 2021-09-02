const btnGrantVisa = document.getElementById('btn-grant-visa');
const btnRejectVisa = document.getElementById('btn-reject-visa');
const visaGrantedNotify = document.querySelector(
   'table tbody tr td[data-notify="visa-granted"]'
);
const visaRejectedNotify = document.querySelector(
   'table tbody tr td[data-notify="visa-rejected"]'
);
// (() => {
//    [visaGrantedNotify, visaRejectedNotify].forEach(notify =>
//       notify.classList.add('u-hidden')
//    );
// })();

const handleResponse = response => {
   const { visaGranted, visaRejected } = response.updatedApplicant;
   if (visaGranted) {
      visaGrantedNotify.classList.remove('u-hidden');
      visaRejectedNotify.classList.add('u-hidden');
      btnGrantVisa.classList.add('u-hidden');
      btnRejectVisa.classList.remove('u-hidden');
   }
   if (visaRejected) {
      visaRejectedNotify.classList.remove('u-hidden');
      btnRejectVisa.classList.add('u-hidden');
      visaGrantedNotify.classList.add('u-hidden');
      btnGrantVisa.classList.remove('u-hidden');
   }
};
function repondToVisaApplication(adminReponse) {
   const { applicantPassportNo, adminToken } = this.dataset;
   const serverUrl = `/visa-application/${applicantPassportNo}/${adminReponse}?userToken=${adminToken}`;

   fetch(serverUrl, {
      method: 'PATCH',
      headers: {
         Accept: 'application/json'
      }
   })
      .then(res => res.json())
      .then(response => {
         console.log(response);
         handleResponse(response);
      })
      .catch(err => console.log(err));
}
btnGrantVisa.onclick = function (ev) {
   repondToVisaApplication.call(this, 'grant');
};
btnRejectVisa.onclick = function (ev) {
   repondToVisaApplication.call(this, 'reject');
};
