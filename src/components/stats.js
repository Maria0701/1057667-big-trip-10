import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import {TRAVEL_TRANSPORT, TRAVEL_ACTIVITY, CURRENCY} from '../const.js';

const COLOR = `#ffffff`;


const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const calcUniqueActivity = (points, activity) => {
  return points.filter((it) => it.travelPoints === activity).length;
};

const calcTimeUniqueActivity = (points, activity) => {
  return points
  .filter((point) => point.travelPoints === activity)
  .reduce((total, point) =>
    total + moment(point.endDate).diff(moment(point.startDate), `hours`, true), 0);
};

const calcPriceUniqueActivity = (points, activity) => {
  return points
  .filter((point) => point.travelPoints === activity)
  .reduce((total, point) =>
    total + point.price, 0);
};
const getUpperCase = (lowerCaseArray) => lowerCaseArray.map((lowerCaseItem) =>lowerCaseItem.toUpperCase());

const CHART_INFO = {
  MONEY: {
    name: `MONEY`,
    remark: CURRENCY,
    remarkPlace: `start`,
    formula: calcPriceUniqueActivity
  },
  TIME: {
    name: `TIME SPENT`,
    remark: `H`,
    remarkPlace: `end`,
    formula: calcTimeUniqueActivity
  },
  TRANSPORT: {
    name: `TRANSPORT`,
    remark: `x`,
    remarkPlace: `end`,
    formula: calcUniqueActivity,
  }
};

const renderChart = (colorCtx, points, array, details) => {
  const activities = points
  .reduce((total, amount) => {
    if (array.includes(amount.travelPoints)) {
      total.push(amount.travelPoints);
    }
    return total;
  }, [])
  .filter(getUniqItems);

  return new Chart(colorCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: getUpperCase(activities),
      datasets: [{
        data: activities.map((activity) => details.formula(points, activity)),
        backgroundColor: COLOR
      }],
    },
    options: {
      title: {
        display: true,
        position: `left`,
        text: details.name,
        fontSize: 25,
        fontColor: `#000000`
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            min: 0,
            display: false
          }
        }],
        yAxes: [{
          gridLines: {
            display: false,
          }
        }]
      },
      plugins: {
        datalabels: {
          display: true,
          anchor: `end`,
          align: `left`,
          fontSize: `20px`,
          fontWeight: `bold`,
          formatter: (value) => {
            return details.remarkPlace === `start` ? `${details.remark + ` ` + Math.round(value)}` : `${Math.round(value) + ` ` + details.remark}`;
          }
        }
      }
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const allData = data.datasets[tooltipItem.datasetIndex].data;
          const tooltipData = allData[tooltipItem.index];
          return `${tooltipData}`;
        }
      },
      displayColors: false,
      backgroundColor: `red`,
      bodyFontColor: `#000000`,
      borderColor: COLOR,
      borderWidth: 1,
      cornerRadius: 0,
      xPadding: 10,
      yPadding: 10
    },
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(points) {
    super();
    this._points = points;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;
    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();
    this.rerender(this._points);
  }

  recoveryListeners() {}

  rerender(points) {
    this._points = points;
    super.rerender();
    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();
    this._moneyChart = renderChart(moneyCtx, this._points.getPoints(), [...TRAVEL_TRANSPORT, ...TRAVEL_ACTIVITY], CHART_INFO.MONEY);
    this._transportChart = renderChart(transportCtx, this._points.getPoints(), TRAVEL_TRANSPORT, CHART_INFO.TRANSPORT);
    this._timeChart = renderChart(timeCtx, this._points.getPoints(), [...TRAVEL_TRANSPORT, ...TRAVEL_ACTIVITY], CHART_INFO.TIME);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}
