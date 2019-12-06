const createFilterItem = (item, isChecked) => {
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${item}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item}" ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${item}">${item}</label>
    </div>`
  );
};

export const createFilterTemplate = (filters) => {
  const filterMarkup = filters.map((it, i) => createFilterItem(it, i === 0)).join(`\n`);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};
