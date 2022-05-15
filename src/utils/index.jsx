const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function formatMoney(cost) {
  return formatter.format(cost);
}
