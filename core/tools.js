function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function waitUntil (condition = () => {}, timeout = 30000, interval = 10, errorMsg = '') {
  return new Promise((resolve, reject) => {
    if (typeof timeout !== 'number' || timeout < 0) { reject(new Error('Wrong tpye of timeout')) }
    let timeoutTime = new Date().getTime() + timeout
    let timer = setInterval(async () => {
      let result = await condition()
      if (result) {
        clearInterval(timer)
        resolve(true)
      }
      if (new Date().getTime() > timeoutTime) {
        clearInterval(timer)
        reject(new Error(errorMsg !== '' ? errorMsg : 'timeout'))
      }
    }, interval)
  }).then((ret) => {
    return ret
  }).catch((error) => {
    throw new Error(error)
  })
}

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    if (await callback(array[index], index, array) === true) {
      return true
    }
  }
  return true
}

module.exports = {
  sleep,
  waitUntil,
  asyncForEach
}
