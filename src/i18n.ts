// Naive implementation of localization until the project gets to that point...
export const translate = (key, interpolations = {}) => {
  const dictionary = {
    from: "From",
    to: "To",
    searchLocation: "Search for Location",
    searchLocationResults: "Results",
    searchRoute: "Search for Route",
    error: `Oh no, there's an error with status ${interpolations.status} yo!`
  }

  return dictionary[key]
}
