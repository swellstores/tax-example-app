# Swell Tax Service Example

An example Swell app that calculates order taxes through a **tax extension**. Use it as a reference for integrating any tax calculation service or custom tax logic with Swell.

## What it demonstrates

- Declaring a **tax extension** in `swell.json` so the app can provide tax calculation for a store
- Handling the `order.taxes` event with an app function that returns order and item-level taxes
- **App settings** for tax configuration (a flat rate in the example; real integrations would hold service credentials)

## How it works

When Swell calculates taxes for a cart or order — for example, when a customer enters their address at checkout — it triggers the `order.taxes` event hook. The app's function responds with item-level taxes and order tax totals:

```ts
export default async function (req: SwellRequest) {
  const { items } = req.data;
  const settings = await getAppConfigSettings(req);
  const taxRate = roundToDecimals(settings.rate / 100);

  const taxedItems = (items || []).map((item) => ({
    id: item.id,
    taxes: [{ id: "example-tax", amount: roundToDecimals(item.price_total * taxRate) }],
  }));

  return {
    items: taxedItems,
    taxes: [{ id: "example-tax", amount: totalTax, rate: taxRate }],
  };
}
```

The example applies a flat percentage configured in app settings. A real integration would send the order details on `req.data` (items, prices, shipping address) to a tax service and map its response into the same shape.

## Project structure

```
swell.json               App config with the tax extension declaration
settings/config.json     Tax settings (rate %)
functions/
  calculate.ts           order.taxes handler returning item and order taxes
  lib/index.ts           Settings helper and decimal rounding
```

## Setup

Requires the [Swell CLI](https://developers.swell.is/apps/cli) and a Swell account.

```bash
npm install -g @swell/cli
swell login

git clone git@github.com:swellstores/tax-example-app.git
cd tax-example-app
npm install

swell app push
```

Then, in your test environment dashboard, open **Apps > Tax Example > Settings** and set the tax rate percentage.

To see it in action, add an item to a cart in your test storefront and proceed through checkout — taxes are calculated at the configured rate.

## Notes

- The response contains order-level `taxes` (with `id`, `amount`, and `rate`) and optional item-level `items[].taxes` entries keyed by item id.
- Amounts are rounded to two decimals — keep rounding consistent between item taxes and totals to avoid off-by-a-cent discrepancies.
- This app is an example for learning and building from — review it carefully and verify calculations with your tax provider before using any of it in production.

## Documentation

- [Swell Apps overview](https://developers.swell.is/apps/overview)
- [Extensions](https://developers.swell.is/apps/extensions)
- [Functions](https://developers.swell.is/apps/functions)
- [Settings](https://developers.swell.is/apps/settings)
