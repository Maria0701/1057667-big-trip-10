export const getPriceTotalTemplate = (priceArray) => {
  const totalPrice = priceArray.reduce(function (sum, current) {
    return sum + current;
  }, 0);
  return (
    `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>`);
};
