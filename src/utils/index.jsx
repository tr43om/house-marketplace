const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function formatMoney(cost) {
  if (!cost) return undefined;
  return formatter.format(cost);
}
