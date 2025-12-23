import { getAppConfigSettings, roundToDecimals } from "./lib";

export const config: SwellConfig = {
  extension: "example",
  description: "Provide tax rates from Example Tax Service",
  model: {
    events: ["order.taxes"],
    conditions: {},
  },
};

export default async function (req: SwellRequest) {
  const { items } = req.data;
  const settings = await getAppConfigSettings(req);
  const taxRate = roundToDecimals(settings.rate / 100);

  const taxedItems = (items || []).map((item: any) => ({
    id: item.id,
    taxes: [
      {
        id: "example-tax",
        amount: roundToDecimals(item.price_total * taxRate),
      },
    ],
  }));

  const totalTax = taxedItems.reduce((sum: number, item: any) => {
    return sum + item.taxes[0].amount;
  }, 0);

  return {
    items: taxedItems,
    taxes: [
      {
        id: "example-tax",
        amount: roundToDecimals(totalTax),
        rate: taxRate,
      },
    ],
  };
}
