import {getTimeIso} from '../utils.js';
import {MONTHS} from '../const.js';

export const createDayCardTemplate = (dates) => {
  return dates
  .map((date, id) =>{
    const eventDate = new Date(date);
    const tripDate = `${MONTHS[eventDate.getMonth()]} ${eventDate.getDate()}`;
    return (
      `<li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${id + 1}</span>
            <time class="day__date" datetime="${getTimeIso(eventDate)}"> ${tripDate}
            </time>
          </div>
        <ul class="trip-events__list" id="${getTimeIso(eventDate)}">
        </ul>
      </li>`
    );
  }).join(`\n`);
};
