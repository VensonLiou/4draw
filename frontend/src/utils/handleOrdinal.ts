const pluralRules = new Intl.PluralRules('en', { type: 'ordinal' })

const OrdinalSuffixes = {
  "zero": "",
  "many": "",
  "one": "st",
  "two": "nd",
  "few": "rd",
  "other": "th"
};


export const handleOrdinal = (n?: number) => {
  if (n === undefined) return ''
  const ordinal = pluralRules.select(n)
  return OrdinalSuffixes[ordinal]
}