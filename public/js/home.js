const linkVisaApply = document.querySelector('header .btn.btn-purple');
const allPossibleNotifications = [
   ...document.querySelector('aside.page-home-notification > ul.alerts')
      .children
];

const loggedInUser =
   JSON.parse(localStorage.getItem('VISA_PROCESSING_USER')) || null;
const loggedInUserToken =
   localStorage.getItem('VISA_PROCESSING_USER_TOKEN') || null;
console.log(loggedInUser, loggedInUserToken);
linkVisaApply.href = `/visa-apply?userToken=${loggedInUserToken}`;

const { passportNo } = loggedInUser;
console.log(allPossibleNotifications);

let existingApplicant;

fetch(`/applicants/${passportNo}`, {
   method: 'GET',
   Accept: 'application/json',
   'Content-Type': 'application/json'
})
   .then(res => res.json())
   .then(response => {
      handleResponse(response);
   })
   .catch(err => console.log(err));

function handleResponse(response) {
   const [alert] = allPossibleNotifications;
   existingApplicant = response.applicant;
   console.log(existingApplicant);

   if (!existingApplicant) {
      alert.innerHTML = `No notifications.`;
      return;
   }

   const { visaGranted, visaRejected, dateApplied } = existingApplicant;
   const dateStr = new Intl.DateTimeFormat(navigator.language, {
      day: 'numeric',
      month: 'long'
   }).format(new Date(dateApplied));

   if (visaGranted) {
      alert.innerHTML = `Congratulations, your visa application on ${dateStr} has been <span class="u-text-green">granted.</span>`;
      return;
   }
   if (visaRejected) {
      alert.innerHTML = `Sorry, your visa application on ${dateStr} has been <span class="u-text-red">denied</span>`;
      return;
   }
   if (!visaGranted && !visaRejected) {
      alert.innerHTML = `Your visa application on ${dateStr} is yet to be granted`;
      return;
   }
}
