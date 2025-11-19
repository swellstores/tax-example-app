export const config: SwellConfig = {
  extension: "example",
  description: "Provide tax rates from Example Tax Service",
  model: {
    events: ["order.taxes"],
    conditions: {},
  },
};

export default async function (req: SwellRequest) {
  const { data } = req;

  const taxRate = 0.1; // 10% tax rate
  const items = data.items || [];
  
  const taxedItems = items.map((item: any) => ({
    id: item.id,
    taxes: [
      {
        id: "example-tax",
        amount: item.price * taxRate,
      },
    ],
  }));

  const totalTax = taxedItems.reduce((sum: number, item: any) => {
    return sum + item.taxes[0].price;
  }, 0);

  return {
    items: taxedItems,
    taxes: [
      {
        id: "example-tax",
        amount: totalTax,
        rate: taxRate,
      },
    ],
  };
}
