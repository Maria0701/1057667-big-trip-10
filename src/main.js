import SiteMenuComponent from './components/menu.js';
import Points from './models/points.js';
import {generateTravelItems} from './mocks/travel-points';
import {RenderPosition, render} from './utils/render.js';
import TripController from './controllers/board.js';
import FilterController from './controllers/filter.js';

const EVENT_COUNTS = 5;

const events = generateTravelItems(EVENT_COUNTS);
const points = new Points();
points.setPoints(events);

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header`);

const mainTripControls = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const filterController = new FilterController(mainTripControls, points);
filterController.render();

render(mainTripControls, new SiteMenuComponent(), RenderPosition.AFTERBEGIN);

const tripBoard = siteMainElement.querySelector(`.trip-events`);

const boardController = new TripController(tripBoard, events, points);
boardController.render();
const addButton = siteMainElement.querySelector(`.trip-main__event-add-btn`);
addButton.addEventListener(`click`, () => {
  boardController.createPoint();
});
