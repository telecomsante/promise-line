'use strict'

module.exports = function () {
  var handle = {}
  var line = []
  var started = false

  var process = function () {
    var job = line.shift()
    if (job) {
      job.factory().then(job.resolve).catch(job.reject).then(process)
    } else {
      started = false
    }
  }

  var start = function () {
    if (started) { return }
    started = true
    process()
  }

  handle.push = function (promiseFactory) {
    var job = { factory: promiseFactory }
    line.push(job)
    return new Promise(function (resolve, reject) {
      job.resolve = resolve
      job.reject = reject
      start()
    })
  }

  return handle
}
