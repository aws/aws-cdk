var assert = require('assert');
var exec = require('child_process').execSync;

describe('an exported non-function', function() {
    it('should be simply printed out', function() {
		var cmd = "node ./test/testModules/basic.js test_object";
		var cmdOutput = exec(cmd, {encoding: 'utf8'});
		assert.equal(cmdOutput, 
`--------make-runnable-output--------
{ test_key: 'test_value', another_test_key: 42 }
------------------------------------
`
		);
    });
});

describe('an exported function', function() {
    it("should have its output printed when called with no arguments", function() {
		var cmd = "node ./test/testModules/basic.js test_func";
		var cmdOutput = exec(cmd, {encoding: 'utf8'});
		assert.equal(cmdOutput, 
`--------make-runnable-output--------
Passed in:
{}
------------------------------------
`
		);
    });

    it("should have its output printed when called with 2 primitive arguments", function() {
		var cmd = "node ./test/testModules/basic.js test_func 5 yo";
		var cmdOutput = exec(cmd, {encoding: 'utf8'});
		assert.equal(cmdOutput, 
`--------make-runnable-output--------
Passed in:
{"0":5,"1":"yo"}
------------------------------------
`
		);
    });

    it("should have its output printed when called with an object", function() {
		var cmd = "node ./test/testModules/basic.js test_func --java shit --lisp legit";
		var cmdOutput = exec(cmd, {encoding: 'utf8'});
		assert.equal(cmdOutput, 
`--------make-runnable-output--------
Passed in:
{"0":{"java":"shit","lisp":"legit"}}
------------------------------------
`
		);
    });

    it("should have its output printed when it returns a promise", function() {
		var cmd = "node ./test/testModules/basic.js test_promising_func";
		var cmdOutput = exec(cmd, {encoding: 'utf8'});
		assert.equal(cmdOutput, 
`--------make-runnable-output--------
kept!!!
------------------------------------
`
		);
    });

    it("should be able to have its output printed without a frame", function() {
    			var cmd = "node ./test/testModules/noOutputFrame.js lookMa";
		var cmdOutput = exec(cmd, {encoding: 'utf8'});
		assert.equal(cmdOutput, 
`no frame!
`
		);
    });
});

