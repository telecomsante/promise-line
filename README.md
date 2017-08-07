# Queuing some promises

Promise-line queue tasks and starts executing them in order with a fixed amount of parallelism.
A task is a function with no argument returning a promise.

The default number of tasks that can run in parallel is fixed to 1 which means the tasks will all be executed sequentially by default.
Sequential promise lines might be used to limit access to a resource to one task at a time while parallel promise lines might be used to avoid having too much running tasks overloading a resource.

## Usage

Get the package:

```bash
npm install --save promise-line
```

### Sequential

It is sometimes necessary to synchronize parts of asynchronous processes in order to guarantee coherency (for instance database coherency when the database engine does not support transactions).
Promise lines can help in these particular cases.

Get a sequential Promise line:

```javascript
const promiseLine = require('promise-line')
const line = promiseLine()
```

Then push some tasks:

```javascript
line.push(() => new Promise((resolve, reject) => { /* promise 1 resolution */ }))
line.push(() => new Promise((resolve, reject) => { /* promise 2 resolution */ }))
line.push(() => new Promise((resolve, reject) => { /* promise 3 resolution */ }))
```

The line can be used in different unrelated parts of your code in order to avoid mangling critical sections.

### Parallel

This might be used for instance to avoid sending too much concurrent requests to a web server.

Get a promise line limited to 10 parallel tasks:

```javascript
const promiseLine = require('promise-line')
const line = promiseLine(10)
```

Add some task:

```javascript
[...new Array(30)].map((_,i) => ()  => new Promise((resolve, reject) => { /* promise i resolution */ }))
  .forEach(task => line.push(task))
```

No more than 10 tasks will be executed in parallel.
Tasks will be **started** in the same order they were pushed in the line.
