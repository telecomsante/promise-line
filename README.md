# Queuing some promises

It is sometimes necessary to synchronize parts of asynchronous processes in order to guarantee coherency (for instance database coherency when the database engine does not support transactions).
Promise lines can help in these particular cases.

## Usage

Get the package:

```bash
npm install --save promise-line
```

Get a Promise line:

```javascript
const promiseLine = require('promise-line')
const line = promiseLine()
```

Then push some promise factories:

```javascript
promiseLine.push(() => new Promise((resolve, reject) => { /* promise 1 resolution */ }))
promiseLine.push(() => new Promise((resolve, reject) => { /* promise 2 resolution */ }))
promiseLine.push(() => new Promise((resolve, reject) => { /* promise 3 resolution */ }))
```

The line can be used in different unrelated parts of your code in order to avoid mangling critical sections.
