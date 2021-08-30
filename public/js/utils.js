// This function converts any text into title case. Eg. It converts hi there into Hi There
export const titleCase = function (str) {
   return str
      .toLowerCase()
      .split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ');
};
