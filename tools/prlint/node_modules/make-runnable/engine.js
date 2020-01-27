var argv = require('yargs').argv;
var Bluebird = require('bluebird');
var path = require('path');

// since old versions of node can't do Object.assign :(
var mergeObjects = require('./utils/mergeObjects');

var requiringModule = module.parent.parent;

module.exports = function(inputOptions) {

  var defaultOptions = {
    printOutputFrame: true
  };

  var options = mergeObjects(defaultOptions, inputOptions || {});

  function printOutput(returnValue) {
    Bluebird.resolve(returnValue)
    .then(function (output) {
      if (options.printOutputFrame) {
        console.log('--------make-runnable-output--------');
      }
      console.log(output);
      if (options.printOutputFrame) {
        console.log('------------------------------------');
      }
    }).catch(printError);
  }

  function printError(error) {
      if (options.printOutputFrame) {
        console.log('--------make-runnable-error--------');
      }
      console.log(error);
      if (options.printOutputFrame) {
        console.log('------------------------------------');
      }
  }

  // if the requiring file is being run directly from the command line
  if (require.main === requiringModule) {
    var targetPropertyFound = false;

    function runFuncWithArgs(func, unnamedArgs) {
      var namedArgs = Object.assign({},argv);
      delete namedArgs._;
      delete namedArgs.$0;

      if (Object.keys(namedArgs).length > 0 && unnamedArgs.length > 0) {
        console.error('You cannot specify both named and unnamed arguments to the function');
        process.exit(1);
      } else if (Object.keys(namedArgs).length > 0) {
        //we have named arguments. Let's pass these as an object to the function
        printOutput(func(namedArgs));
      } else if (unnamedArgs.length > 0) {
        //we have 1 or more unnamed arguments. let's pass those as individual args to function
        printOutput(func.apply(null, unnamedArgs));
      } else {
        //no extra arguments given to pass to function. let's just run it
        printOutput(func());
      }
    }

    // if the module exports a function, then evidently no target property could be specified
    // all the rest of the target properties must then be the unnamed arguments to the function
    if (requiringModule.exports instanceof Function) {
      targetPropertyFound = true;
      runFuncWithArgs(requiringModule.exports, argv._.slice(0));
    } else if (argv._.length > 0) {
      // there must be at least one argument which specifies the target property to run/show
      var targetProperty = argv._[0];
      if (targetProperty in requiringModule.exports) {
        targetPropertyFound = true;

        // if the target is a function, we need to run it with any provided args
        if (requiringModule.exports[targetProperty] instanceof Function) {

          runFuncWithArgs(requiringModule.exports[targetProperty].bind(requiringModule.exports), argv._.slice(1));
        } else {// if the target isn't a function, we simply print it
          printOutput(requiringModule.exports[targetProperty]);
        }
      }
    }

    // the specified first arg didn't match up to any of the exported properties
    if (!targetPropertyFound) {
      var validProperties = Object.keys(requiringModule.exports);
      if (validProperties.length === 0) {
        printError("The module you're trying to make runnable doesn't export anything.");
      } else { // let's give an example of how this should be used
        var validFunctionProperties = validProperties.filter(function(prop) {
          return requiringModule.exports[prop] instanceof Function
        });


        // ideally the examples should use a function so it makes sense
        var egProperty = validFunctionProperties.length > 0 ? validFunctionProperties[0] : validProperties[0];

        // the example changes based on whether the property name contains a space
        var egPropertyHasSpace = egProperty.indexOf(' ') > 0; //if example property
        var egPropertyAsArg = egPropertyHasSpace ? '"' + egProperty + '"' : egProperty;

        var example = 'node ' + argv.$0 + ' ' + egPropertyAsArg + ' xyz';
        example += ' → ';
        example += 'module.exports' + (egPropertyHasSpace ? '[' + egPropertyAsArg + ']': '.' + egProperty) + '("xyz")'

        var errorString = 'One of the following must be specified as an argument, to run/print the corresponding function/property:';
        errorString += '\n\n' + Object.keys(requiringModule.exports);
        errorString += '\n\nExample:';
        errorString += '\n\t' + example;

        printError(errorString);
      }
    }
  } else {
    // needed with nested make-runnables
    delete require.cache[path.join(__dirname, 'engine.js')]
    delete require.cache[path.join(__dirname, 'index.js')]
    delete require.cache[path.join(__dirname, 'custom.js')]
  }
}
