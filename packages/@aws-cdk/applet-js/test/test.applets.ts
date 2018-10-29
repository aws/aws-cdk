import child_process = require('child_process');
import fs = require('fs');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');

export = {
  'basic test 1'(test: Test) {
    expectMatch(test, 'test/expected1.json', getStack('TestApplet', synthesizeApplet('test/test1.yaml')));
    test.done();
  },

  'basic test 2'(test: Test) {
    expectMatch(test, 'test/expected2.json', getStack('TestApplet', synthesizeApplet('test/test2.yaml')));
    test.done();
  },

  'can use shebang'(test: Test) {
    fs.chmodSync('test/test3.yaml', 0o755);
    expectMatch(test, 'test/expected3.json', getStack('Applet', synthesizeApplet('test/test3.yaml', true)));
    test.done();
  },

  'test non stack construct'(test: Test) {
    expectMatch(test, 'test/test-nonstack-expected.json', getStack('NoStackApplet', synthesizeApplet('test/test-nonstack.yaml')));
    test.done();
  },

  'test multiple stacks'(test: Test) {
    expectMatch(test, 'test/test-multistack-expected.json', getStack('Stack2', synthesizeApplet('test/test-multistack.yaml')));
    test.done();
  },

  'expect failure 4'(test: Test) {
    test.throws(() => {
      synthesizeApplet('test/negative-test4.yaml');
    }, /but it must be in the form/);
    test.done();
  },

  'expect failure 5'(test: Test) {
    test.throws(() => {
      synthesizeApplet('test/negative-test5.yaml');
    }, /Cannot find module/);
    test.done();
  },

  'expect failure 6'(test: Test) {
    test.throws(() => {
      synthesizeApplet('test/negative-test6.yaml');
    }, /Cannot find applet class/);
    test.done();
  },

  'expect failure 7'(test: Test) {
    test.throws(() => {
      synthesizeApplet('test/negative-test7.yaml');
    }, /but it must be in the form/);
    test.done();
  },
};

function expectMatch(test: Test, expectedFile: string, stack: any) {
  try {
    const expected = JSON.parse(fs.readFileSync(expectedFile, { encoding: 'utf-8' }));
    test.deepEqual(stack, expected);
  } catch (e) {
    if (e.code === 'ENOENT') {
      // tslint:disable-next-line:no-console
      console.log(JSON.stringify(stack, undefined, 2));
      throw new Error(`Make a file ${expectedFile} with the previous contents`);
    }
  }
}

function synthesizeApplet(yamlFile: string, direct = false) {
  // Can't depend on aws-cdk here, so we're reimplementing cx-api.
  // tslint:disable-next-line:no-console
  console.log('Writing to ', os.tmpdir());

  const command = direct ? yamlFile : 'cdk-applet-js';
  const args = direct ? [] : [yamlFile];

  child_process.execFileSync(command, args, {
    env: {
      ...process.env,
      CDK_OUTDIR: os.tmpdir(),
      PATH: 'bin:' + process.env.PATH
    }
  });

  return JSON.parse(fs.readFileSync(path.join(os.tmpdir(), 'cdk.out'), { encoding: 'utf-8' }));
}

function getStack(stackName: string, allStacks: any) {
  for (const stack of allStacks.stacks) {
    if (stack.name === stackName) {
      return stripStackMetadata(stack);
    }
  }

  // tslint:disable-next-line:no-console
  console.log(allStacks);
  throw new Error('Could not find stack: ' + stackName);
}

function stripStackMetadata(stack: any) {
  for (const key of Object.keys(stack.metadata)) {
    if (!stack.metadata[key]) { continue; }
    for (const entry of (stack.metadata[key] as any[])) {
      if (entry.trace) { entry.trace = ['**REDACTED**']; }
    }
  }
  delete stack.environment;
  return stack;
}

// cdk-applet-js test1.yaml '{ "type": "synth", "stacks": ["TestApplet"] }' | node strip-stacktrace.js > /tmp/actual1.json
// expect_success diff expected1.json /tmp/actual1.json

// #!/bin/bash
// set -euo pipefail
// cd $(dirname $0)
// export PATH=../bin:$PATH

// announce() {
//   echo "-------------------------------------------------"
//   echo "$@"
// }

// expect_success() {
//   announce $@
//   set +e
//   $@
//   local exit_code=$?
//   set -e

//   if [ "${exit_code}" -ne 0 ]; then
//     echo "Command expected to succeed: $@"
//     exit 1
//   fi
// }

// expect_failure() {
//   announce $@
//   set +e
//   $@
//   local exit_code=$?
//   set -e
//   if [ "${exit_code}" -eq 0 ]; then
//     echo "Command expected to fail: $@"
//     exit 1
//   fi
// }

// cdk-applet-js test1.yaml '{ "type": "synth", "stacks": ["TestApplet"] }' | node strip-stacktrace.js > /tmp/actual1.json
// expect_success diff expected1.json /tmp/actual1.json

// cdk-applet-js test2.yaml '{ "type": "synth", "stacks": ["TestApplet"] }' | node strip-stacktrace.js > /tmp/actual2.json
// expect_success diff expected2.json /tmp/actual2.json

// # applets can use the host as shebang
// chmod +x ./test3.yaml # since codebuild loses permissions
// ./test3.yaml '{ "type": "synth", "stacks": ["Applet"] }' | node strip-stacktrace.js > /tmp/actual3.json
// expect_success diff expected3.json /tmp/actual3.json

// expect_failure cdk-applet-js negative-test4.yaml
// expect_failure cdk-applet-js negative-test5.yaml
// expect_failure cdk-applet-js negative-test6.yaml
// expect_failure cdk-applet-js negative-test7.yaml

// echo "PASS"