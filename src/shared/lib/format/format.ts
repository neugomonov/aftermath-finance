export function formatSUI(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return "0";
  }
  return num.toFixed(9).replace(/\.?0+$/, "");
}

export function formatNumberWithCommas(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return "0";
  }
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 9,
  });
}

export function parseSUIAmount(amount: string): number {
  const cleaned = amount.replace(/,/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function truncateAddress(
  address: string,
  startLength = 6,
  endLength = 4
): string {
  if (!address || address.length <= startLength + endLength) {
    return address;
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}
