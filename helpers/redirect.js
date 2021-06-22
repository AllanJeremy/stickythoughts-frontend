/** Get a link with query params from the current url preserved
 * @param {String} redirectLink The link to append params to
 * @param {Object} $route The VueJS route object. Should contain a `query` object
 * @return {String} The redirect link with url params from the current page appended
 */
const getLinkWithQueryParams = (redirectLink, $route) => {
  const { query } = $route

  // Return the link as is if no query params were found
  if (!Object.keys(query).length) {
    return redirectLink
  }

  const queryKeys = Object.keys(query)

  queryKeys.forEach((param, i) => {
    const paramValue = query[param]

    // Only add `?` if there are no existing query params in the redirect url provided
    if (i === 0 && !redirectLink.includes('?')) {
      redirectLink += '?'
    } else {
      // First and last params don't have a `&`  prepended to them
      redirectLink += '&'
    }

    redirectLink += `${param}=${paramValue}`
  })

  return redirectLink
}

//* EXPORTS
export { getLinkWithQueryParams }
