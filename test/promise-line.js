import test from 'ava'
import promiseLine from '..'

test('executes a promise', t => {
  var line = promiseLine()
  var executed = false
  t.plan(1)
  return line.push(() => new Promise((resolve, reject) => {
    setTimeout(function () {
      executed = true
      resolve()
    }, 30)
  })).then(function () {
    t.true(executed)
  })
})

test('gets a promise resolved result', t => {
  var line = promiseLine()
  t.plan(1)
  return line.push(() => new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(42)
    }, 30)
  })).then(function (result) {
    t.is(result, 42)
  })
})

test('gets a promise rejected error', t => {
  var line = promiseLine()
  t.plan(1)
  return line.push(() => new Promise((resolve, reject) => {
    setTimeout(function () {
      reject(42)
    }, 30)
  })).then(() => t.fail('must reject')).catch(error => {
    t.is(error, 42)
  })
})

test('executes many promises in sequence', t => {
  var line = promiseLine()
  var max = 30
  var count = 0
  t.plan(max + 1)
  new Array(max).fill(0).map((_, i) => max - i).map(v => () => new Promise(function (resolve, reject) {
    setTimeout(function () {
      ++count
      resolve()
    }, v)
  })).map((p, i) => line.push(p).then(() => {
    t.is(count, i + 1)
  }).catch(() => t.fail('must resolve')))

  return line.push(() => new Promise((resolve, reject) => {
    t.is(count, max)
    resolve()
  }))
})

test('executes many promise chains in sequence', t => {
  var line = promiseLine()
  var max = 30
  var count = 0
  t.plan(max + 1)
  new Array(max).fill(() => {
    var localCount
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        localCount = count
        resolve()
      }, 10)
    }).then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          ++localCount
          resolve()
        }, 10)
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          count = localCount
          resolve()
        }, 10)
      })
    })
  }).map((p, i) => line.push(p).then(() => {
    t.is(count, i + 1)
  }).catch(t => t.fail('must resove')))

  return line.push(() => new Promise((resolve, reject) => {
    t.is(count, max)
    resolve()
  }))
})

test('executes many promises in parallel', t => {
  let count = 0
  let maxCount = 0
  var line = promiseLine(10)
  t.plan(2)
  const promises = [...new Array(30)].map(() => () => new Promise(resolve => {
    count++
    maxCount = count > maxCount ? count : maxCount
    setTimeout(function () {
      count--
      resolve()
    }, 100)
  })).map(p => line.push(p))

  return Promise.all(promises)
    .then(() => {
      t.is(count, 0)
      t.is(maxCount, 10)
    })
})
