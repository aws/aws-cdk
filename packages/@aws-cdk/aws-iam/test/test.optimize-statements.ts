import fs = require('fs-extra');
import YAML = require('js-yaml');
import nodeunit = require('nodeunit');
import path = require('path');

import { optimizeStatements } from '../lib/optimize-statements';

const EXAMPLES_DIR = path.resolve(__dirname, 'test.optimize-statements');
const tests = { optimizeStatements: ({} as any) };

for (const file of fs.readdirSync(EXAMPLES_DIR)) {
  const example = YAML.safeLoad(fs.readFileSync(path.join(EXAMPLES_DIR, file), { encoding: 'utf-8' }));
  tests.optimizeStatements[example.name] = async (test: nodeunit.Test) => {
    try {
      const sizeBefore = JSON.stringify(example.input).length;
      const optimized = optimizeStatements(example.input);
      const sizeAfter = JSON.stringify(optimized).length;
      test.deepEqual(optimized, example.expectedOutput);
      test.ok(sizeAfter <= sizeBefore, `Statements size should reduce, but it went from ${sizeBefore} to ${sizeAfter}`);
    } catch (e) {
      test.doesNotThrow(() => { throw e; });
    } finally {
      test.done();
    }
  };
}

export = nodeunit.testCase(tests);
