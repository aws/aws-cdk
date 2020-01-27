# Run Exported Functions Directly From The Command Line

What's the quickest way to trial a function you're exporting? 

Doing this in your shell?

    $node
    >require('./your_file').addOneTo(3)
    4

No. That's annoying. And you have to repeat it all every time you change `your_file.js`. 

Rather insert the following **__at the end__** of `your_file.js` to expose its exports to the command line:

    require('make-runnable');

That's it. Now you can do:

    $node your_file.js addOneTo 3
    4


## Syntax

Call your function with several args:

    node [your_file] [function_name] firstArg secondArg 
    
Or call it with a single object:

    node [your_file] [function_name] --key1 value1 --key2 value2 
    
    
## Full Example

Let's say you have the following file:

**your_file.js**

    module.exports = {
        addTogether: function(x,y){
            return x + y
        }, doSomethingWithObject: function(object){
            object.newKey = "easy AF";
            return object;
        }, simpleValue: 'also works'
    };
    require('make-runnable');

You can now do the following:

**$sh**

    node your_file.js addTogether 1 2
    > 3
    node your_file.js doSomethingWithObject --x 1 --y hello
    > {x: 1, y: 'hello', newKey: 'easy AF'}
    node your_file.js simpleValue
    > also works

## How does it work?

1. `require.main === module` is used to check if the module is being run directly, or imported.
2. If it's being run directly, then [yargs](https://www.npmjs.com/package/yargs) is used to parse `process.argv` so that the target function may be called with the desired arguments.

## What if you want to:

### Run a function directly exported by a module, not nested inside an exported object

Just leave off the function name, like so:

**say_hello.js**

    module.exports = function(){console.log('hello');};

**$sh**

    node say_hello.js
    > hello

### View the output of a function that doesn't print anything

The output is automatically printed.

### View the resolved value of a `Promise` returned by a function

That happens automatically.

### Remove the `--------make-runnable-output--------` frame from printed output

You can pass in a custom option to `make-runnable` to remove that, like this:
```
require('make-runnable/custom')({
    printOutputFrame: false
})
```

### Pass in multiple objects to the function being called

While you can pass a *single* object, or multiple *primitives*, multiple objects are not currently supported. PRs welcome!