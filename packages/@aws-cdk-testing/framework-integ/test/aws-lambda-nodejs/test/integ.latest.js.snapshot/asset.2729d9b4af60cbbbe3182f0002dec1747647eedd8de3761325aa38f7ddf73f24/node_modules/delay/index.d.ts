declare namespace delay {
	interface ClearablePromise<T> extends Promise<T> {
		/**
		Clears the delay and settles the promise.
		*/
		clear(): void;
	}

	/**
	Minimal subset of `AbortSignal` that delay will use if passed.
	This avoids a dependency on dom.d.ts.
	The dom.d.ts `AbortSignal` is compatible with this one.
	*/
	interface AbortSignal {
		readonly aborted: boolean;
		addEventListener(
			type: 'abort',
			listener: () => void,
			options?: {once?: boolean}
		): void;
		removeEventListener(type: 'abort', listener: () => void): void;
	}

	interface Options {
		/**
		An optional AbortSignal to abort the delay.
		If aborted, the Promise will be rejected with an AbortError.
		*/
		signal?: AbortSignal;
	}
}

type Delay = {
	/**
	Create a promise which resolves after the specified `milliseconds`.

	@param milliseconds - Milliseconds to delay the promise.
	@returns A promise which resolves after the specified `milliseconds`.
	*/
	(milliseconds: number, options?: delay.Options): delay.ClearablePromise<void>;

	/**
	Create a promise which resolves after the specified `milliseconds`.

	@param milliseconds - Milliseconds to delay the promise.
	@returns A promise which resolves after the specified `milliseconds`.
	*/
	<T>(
		milliseconds: number,
		options?: delay.Options & {
			/**
			Value to resolve in the returned promise.
			*/
			value: T;
		}
	): delay.ClearablePromise<T>;

	/**
	Create a promise which resolves after a random amount of milliseconds between `minimum` and `maximum` has passed.

	Useful for tests and web scraping since they can have unpredictable performance. For example, if you have a test that asserts a method should not take longer than a certain amount of time, and then run it on a CI, it could take longer. So with `.range()`, you could give it a threshold instead.

	@param minimum - Minimum amount of milliseconds to delay the promise.
	@param maximum - Maximum amount of milliseconds to delay the promise.
	@returns A promise which resolves after a random amount of milliseconds between `maximum` and `maximum` has passed.
	*/
	range<T>(
		minimum: number,
		maximum: number,
		options?: delay.Options & {
			/**
			Value to resolve in the returned promise.
			*/
			value: T;
		}
	): delay.ClearablePromise<T>;

	// TODO: Allow providing value type after https://github.com/Microsoft/TypeScript/issues/5413 is resolved.
	/**
	Create a promise which rejects after the specified `milliseconds`.

	@param milliseconds - Milliseconds to delay the promise.
	@returns A promise which rejects after the specified `milliseconds`.
	*/
	reject(
		milliseconds: number,
		options?: delay.Options & {
			/**
			Value to reject in the returned promise.
			*/
			value?: unknown;
		}
	): delay.ClearablePromise<never>;
};

declare const delay: Delay & {
	// The types are intentionally loose to make it work with both Node.js and browser versions of these methods.
	createWithTimers(timers: {
		clearTimeout: (timeoutId: any) => void;
		setTimeout: (callback: (...args: any[]) => void, milliseconds: number, ...args: any[]) => unknown;
	}): Delay;

	// TODO: Remove this for the next major release.
	default: typeof delay;
};

export = delay;
