export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function saferDotHref(dotNumber: string) {
  const digits = dotNumber.replace(/\D/g, "");
  return `https://safer.fmcsa.dot.gov/query.asp?query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${digits}`;
}
