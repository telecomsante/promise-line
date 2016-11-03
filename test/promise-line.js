import test from 'ava'
import { expect } from 'chai'
import promiseLine from '..'

test('executes a promise', function (done) {
  var line = promiseLine()
  var executed = false
  line.push(() => new Promise(function (resolve, reject) {
    setTimeout(function () {
      executed = true
      resolve()
    }, 30)
  })).then(function () {
    done(executed ? undefined : 'failed')
  }).catch(done)
})

test('gets a promise resolved result', function (done) {
  var line = promiseLine()
  line.push(() => new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(42)
    }, 30)
  })).then(function (result) {
    expect(result).to.equal(42)
    done()
  }).catch(done)
})

test('gets a promise rejected error', function (done) {
  var line = promiseLine()
  line.push(() => new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(42)
    }, 30)
  })).then(done).catch(function (error) {
    expect(error).to.equal(42)
    done()
  })
})

test('executes many promises in sequence', function (done) {
  var line = promiseLine()
  var max = 30
  var count = 0
  new Array(max).fill(0).map((_, i) => max - i).map(v => () => new Promise(function (resolve, reject) {
    setTimeout(function () {
      ++count
      resolve()
    }, v)
  })).map((p, i) => line.push(p).then(function () {
    expect(count).to.equal(i + 1)
  }).catch(done))

  line.push(() => new Promise(function (resolve, reject) {
    expect(count).to.equal(max)
    resolve()
  })).then(done).catch(done)
})

test('executes many promise chains in sequence', function (done) {
  var line = promiseLine()
  var max = 30
  var count = 0
  new Array(max).fill(function () {
    var localCount
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        localCount = count
        resolve()
      }, 10)
    }).then(function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          ++localCount
          resolve()
        }, 10)
      })
    }).then(function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          count = localCount
          resolve()
        }, 10)
      })
    })
  }).map((p, i) => line.push(p).then(function () {
    expect(count).to.equal(i + 1)
  }).catch(done))

  line.push(() => new Promise(function (resolve, reject) {
    expect(count).to.equal(max)
    resolve()
  })).then(done).catch(done)
})
