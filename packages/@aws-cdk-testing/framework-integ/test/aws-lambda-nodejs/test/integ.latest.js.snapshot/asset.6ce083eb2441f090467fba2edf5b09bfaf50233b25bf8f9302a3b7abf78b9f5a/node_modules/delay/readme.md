# delay

> Delay a promise a specified amount of time

*If you target [Node.js 15](https://medium.com/@nodejs/node-js-v15-0-0-is-here-deb00750f278) or later, you can do `await require('timers/promises').setTimeout(1000)` instead.*

## Install

```
$ npm install delay
```

## Usage

```js
const delay = require('delay');

(async () => {
	bar();

	await delay(100);

	// Executed 100 milliseconds later
	baz();
})();
```

## API

### delay(milliseconds, options?)

Create a promise which resolves after the specified `milliseconds`.

### delay.reject(milliseconds, options?)

Create a promise which rejects after the specified `milliseconds`.

### delay.range(minimum, maximum, options?)

Create a promise which resolves after a random amount of milliseconds between `minimum` and `maximum` has passed.

Useful for tests and web scraping since they can have unpredictable performance. For example, if you have a test that asserts a method should not take longer than a certain amount of time, and then run it on a CI, it could take longer. So with `.range()`, you could give it a threshold instead.

#### milliseconds
#### mininum
#### maximum

Type: `number`

Milliseconds to delay the promise.

#### options

Type: `object`

##### value

Type: `unknown`

Optional value to resolve or reject in the returned promise.

##### signal

Type: [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

The returned promise will be rejected with an AbortError if the signal is aborted. AbortSignal is available in all modern browsers and there is a [ponyfill for Node.js](https://github.com/mysticatea/abort-controller).

### delayPromise.clear()

Clears the delay and settles the promise.

### delay.createWithTimers({clearTimeout, setTimeout})

Creates a new `delay` instance using the provided functions for clearing and setting timeouts. Useful if you're about to stub timers globally, but you still want to use `delay` to manage your tests.

## Advanced usage

Passing a value:

```js
const delay = require('delay');

(async() => {
	const result = await delay(100, {value: '🦄'});

	// Executed after 100 milliseconds
	console.log(result);
	//=> '🦄'
})();
```

Using `delay.reject()`, which optionally accepts a value and rejects it `ms` later:

```js
const delay = require('delay');

(async () => {
	try {
		await delay.reject(100, {value: new Error('🦄')});

		console.log('This is never executed');
	} catch (error) {
		// 100 milliseconds later
		console.log(error);
		//=> [Error: 🦄]
	}
})();
```

You can settle the delay early by calling `.clear()`:

```js
const delay = require('delay');

(async () => {
	const delayedPromise = delay(1000, {value: 'Done'});

	setTimeout(() => {
		delayedPromise.clear();
	}, 500);

	// 500 milliseconds later
	console.log(await delayedPromise);
	//=> 'Done'
})();
```

You can abort the delay with an AbortSignal:

```js
const delay = require('delay');

(async () => {
	const abortController = new AbortController();

	setTimeout(() => {
		abortController.abort();
	}, 500);

	try {
		await delay(1000, {signal: abortController.signal});
	} catch (error) {
		// 500 milliseconds later
		console.log(error.name)
		//=> 'AbortError'
	}
})();
```

Create a new instance that is unaffected by libraries such as [lolex](https://github.com/sinonjs/lolex/):

```js
const delay = require('delay');

const customDelay = delay.createWithTimers({clearTimeout, setTimeout});

(async() => {
	const result = await customDelay(100, {value: '🦄'});

	// Executed after 100 milliseconds
	console.log(result);
	//=> '🦄'
})();
```

## Related

- [delay-cli](https://github.com/sindresorhus/delay-cli) - CLI for this module
- [p-cancelable](https://github.com/sindresorhus/p-cancelable) - Create a promise that can be canceled
- [p-min-delay](https://github.com/sindresorhus/p-min-delay) - Delay a promise a minimum amount of time
- [p-immediate](https://github.com/sindresorhus/p-immediate) - Returns a promise resolved in the next event loop - think `setImmediate()`
- [p-timeout](https://github.com/sindresorhus/p-timeout) - Timeout a promise after a specified amount of time
- [More…](https://github.com/sindresorhus/promise-fun)
