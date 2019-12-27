import SiteMenuComponent from './components/menu.js';
import FilterComponent from './components/filter.js';
import Points from './models/points.js';
import {FILTER_NAMES} from './const.js';
import {generateTravelItems} from './mocks/travel-points';
import {RenderPosition, render} from './utils/render.js';
import TripController from './controllers/board.js';

const EVENT_COUNTS = 25;

const events = generateTravelItems(EVENT_COUNTS);
const points = new Points();
points.setPoints(events);

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header`);

const mainTripControls = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
render(mainTripControls, new FilterComponent(FILTER_NAMES), RenderPosition.BEFOREEND);
render(mainTripControls, new SiteMenuComponent(), RenderPosition.AFTERBEGIN);

const tripBoard = siteMainElement.querySelector(`.trip-events`);

const boardController = new TripController(tripBoard, events, points);
boardController.render();
