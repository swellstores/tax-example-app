export async function getAppConfigSettings(
  req: SwellRequest
): Promise<SwellSettings> {
  return req.swell.settings(`${req.appId}/config`);
}

export function roundToDecimals(value: number, decimals: number = 2): number {
  const factor = 10 ** decimals;

  return Math.round(value * factor) / factor;
}
