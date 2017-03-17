'use strict'

module.exports = function (nbMax = 1) {
  const line = []
  let nbExec = 0

  const process = function () {
    if (nbExec === nbMax) return

    const job = line.shift()
    if (!job) return

    nbExec++
    job.factory().then(job.resolve).catch(job.reject)
      .then(() => {
        nbExec--
        process()
      })
  }

  return {
    push (promiseFactory) {
      const job = { factory: promiseFactory }
      line.push(job)
      return new Promise(function (resolve, reject) {
        job.resolve = resolve
        job.reject = reject
        process()
      })
    }
  }
}
