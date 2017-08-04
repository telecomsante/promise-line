# Queuing some promises

Promise-line aim to queuing task and executing n of then in parallel

If n = 1 (default) promise-line execute task sequentially

A task is a function which return a promise

This can be useful to limit the access of a resource to one task at the time and avoid race condition or to limit the access to n task and avoid overload

## Usage

Get the package:

```bash
npm install --save promise-line
```

### Sequential

Get a sequential Promise line:

```javascript
const promiseLine = require('promise-line')
const line = promiseLine()
```

Then push some promise factories:

```javascript
line.push(() => new Promise((resolve, reject) => { /* promise 1 resolution */ }))
line.push(() => new Promise((resolve, reject) => { /* promise 2 resolution */ }))
line.push(() => new Promise((resolve, reject) => { /* promise 3 resolution */ }))
```

The line can be used in different unrelated parts of your code in order to avoid mangling critical sections.

### Parallel

Get a Promise line limited to 10 parallel task:

```javascript
const promiseLine = require('promise-line')
const line = promiseLine(10)
```

Add some task:

```javascript
[...new Array(30)].map((_,i) => ()  => new Promise((resolve, reject) => { /* promise i resolution */ }))
  .forEach(task => line.push(task))
```

No more than 10 task will be executed in parallel
