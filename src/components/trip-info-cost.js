export const getPriceTotalTemplate = (priceArray) => {
  const totalPrice = priceArray.reduce((sum, current) =>
    sum + current);
  return (
    `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>`);
};
