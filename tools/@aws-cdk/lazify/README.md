# lazify

> **NOTE:** This tool should only be used on packages in this repository,
> and is not intended for external usage.

This tool rewrites TypeScript-compiled JavaScript files in the current directory
to make all subpackage imports lazy.  Subpackages will only be imported when
they are actually used/needed, instead of all packages being all read on
startup.

This can be used to reduce the load time of large JavaScript libraries, large
parts of which may go unused in any particular client application.

> [!IMPORTANT]
> This transformation is not safe in general. If modules contain code that must
> be executed upon startup for its side effects, then that code may not run or
> may not run in the right order.
>
> In general, code that depends on those kinds of side effects should be avoided
> regardless.

## How to use

```shell
# Run on all JavaScript in the current directory
lazify .
```

## Transformations

We apply the following transformations:

### Make require() lazy

We turn this:

```js
const my_module_1 = require('./my-module');

function hello() {
  return my_module_1.hello();
}
```

Into this:

```js
function my_module_1() {
  return require('./my-module');
}

function hello() {
  return my_module_1().hello();
}
```

This makes it so `my-module.js` is only loaded if and when the `hello()` function is actually
called. If that function is never called, we didn't need to needlessly load `my-module.js`.

### Make getters for 'export *'

The following TypeScript idiom:

```ts
export * from './my-module';
```

Is hard to make lazy, because it requires knowing the symbols that are available in `my-module`.

What this package does is load `my-module.js` at *transform time*, inspect its
list of *exported symbols*, and make a list of lazy getters for each of those symbols.

So, after statically determining the list of symbols to be `foo`, `bar` and
`baz`, the above gets turned into:

```js
Object.defineProperty(exports, "foo", { get: () => require("./my-module").foo });
Object.defineProperty(exports, "bar", { get: () => require("./my-module").bar });
Object.defineProperty(exports, "baz", { get: () => require("./my-module").baz });
```

> [!IMPORTANT]
> This transformation is also not safe for modules that add to their exported symbol
> set at runtime. None of the TypeScript-written code in our repository should be
> doing that.
