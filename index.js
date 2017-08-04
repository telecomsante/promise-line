'use strict'

module.exports = function (nbMax = 1) {
  const line = []
  let nbExec = 0

  const process = function () {
    if (nbExec === nbMax) return

    const task = line.shift()
    if (!task) return

    nbExec++
    task.factory().then(task.resolve).catch(task.reject)
      .then(() => {
        nbExec--
        process()
      })
  }

  return {
    push (promiseFactory) {
      const task = { factory: promiseFactory }
      line.push(task)
      return new Promise(function (resolve, reject) {
        task.resolve = resolve
        task.reject = reject
        process()
      })
    }
  }
}
