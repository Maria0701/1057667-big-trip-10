import {getTimeIso} from '../utils.js';
import {MONTHS} from '../const.js';

export const createDayCardTemplate = (dates) => {
  return dates
  .map((date) =>{
    const dayNumber = dates.indexOf(date) + 1;
    date = new Date(date);
    const tripDate = `${MONTHS[date.getMonth()]} ${date.getDate()}`;
    return (
      `<li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${dayNumber}</span>
            <time class="day__date" datetime="${getTimeIso(date)}"> ${tripDate}
            </time>
          </div>
        <ul class="trip-events__list">
        </ul>
      </li>`
    );
  }).join(`\n`);
};
