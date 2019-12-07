import {MONTHS} from '../const.js';
export const createTripInfo = (cityArray, datesArray) => {
  const getDatePeriod = () => {
    const newArray = datesArray.slice().sort((a, b) => a - b);
    const firstDate = MONTHS[newArray[0].getMonth()] + ` ` + newArray[0].getDate();
    const lastDate = (
      newArray[0].getMonth() === newArray[newArray.length - 1].getMonth() ? newArray[newArray.length - 1].getDate() : MONTHS[newArray[length - 1].getMonth()] + ` ` + newArray[length - 1].getDate()
    );
    return `${firstDate} - ${lastDate}`;
  };

  return (
    `  <div class="trip-info__main">
        <h1 class="trip-info__title">${cityArray[0]}&mdash; ... &mdash; ${cityArray[cityArray.length - 1]}</h1>
        <p class="trip-info__dates">${getDatePeriod()}</p>
      </div>`
  );
};
