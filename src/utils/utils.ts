export const commafy = (num: string | number) => {
  num = String(num)
  let str = num.split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}