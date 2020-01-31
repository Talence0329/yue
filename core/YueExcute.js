module.exports = function (action) {
  let result, error
  browser.waitUntil(async () => {
    try {
      await action()
    } catch (err) {
      error = err
      return true
    }
    result = true
    return true
  })
  if (error) {
    throw (error)
  }
  return result
}
