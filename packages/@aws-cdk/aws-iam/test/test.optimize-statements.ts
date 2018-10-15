import fc = require('fast-check');
import fs = require('fs-extra');
import YAML = require('js-yaml');
import _ = require('lodash');
import nodeunit = require('nodeunit');
import path = require('path');

import { optimizeStatements } from '../lib/optimize-statements';
import { PolicyStatement } from '../lib/policy-document';

function asyncTest(cb: (test: nodeunit.Test) => void | Promise<void>): (test: nodeunit.Test) => Promise<void> {
  return async (test: nodeunit.Test) => {
    let error: Error;
    try {
      return await cb(test);
    } catch (e) {
      error = e;
    } finally {
      test.doesNotThrow(() => { if (error) { throw error; } });
      test.done();
    }
  };
}

// Stuff that should be valid in a policy document, excluding *
const safeCharacters = fc.ascii().filter(c => /^[a-z0-9:/-]$/i.test(c));
const safeString = fc.stringOf(safeCharacters, 1, 16);

const tests: { [name: string]: { [name: string]: (test: nodeunit.Test) => void } } = {
  optimizeStatements: {
    'replaces a list of resources including a wild-card with just the wild-card': asyncTest(async () => {
      await fc.assert(
        fc.property(
          fc.array(safeString, 1, 3),
          (resources) => {
            const statement = new PolicyStatement().addResources(...resources, '*');
            const optimized = optimizeStatements([statement.resolve()])[0];
            return optimized && optimized.Resource === '*';
          }
        ),
        { verbose: true }
      );
    }),
    'removes resources that are globbed by a wild-card': asyncTest(async () => {
      await fc.assert(
        fc.property(
          safeString, fc.array(safeString, 1, 3),
          (prefix, resources) => {
            const statement = new PolicyStatement().addResources(...resources.map(r => `${prefix}:${r}`), `${prefix}:*`);
            const optimized = optimizeStatements([statement.resolve()])[0];
            return optimized && optimized.Resource === `${prefix}:*`;
          }
        ),
        { verbose: true }
      );
    }),
    'sorts resources': asyncTest(async () => {
      await fc.assert(
        fc.property(
          fc.array(safeString, 2, 3),
          (resources) => {
            const statement = new PolicyStatement().addResources(...resources);
            const optimized = optimizeStatements([statement.resolve()])[0];
            return optimized && _.isEqual(optimized.Resource, [...new Set(resources)].sort(_localeCompare));
          }
        ),
        { verbose: true }
      );
    }),

    'replaces a list of actions including a wild-card with just the wild-card': asyncTest(async () => {
      await fc.assert(
        fc.property(
          fc.array(safeString, 1, 3),
          (actions) => {
            const statement = new PolicyStatement().addActions(...actions, '*');
            const optimized = optimizeStatements([statement.resolve()])[0];
            return optimized && optimized.Action === '*';
          }
        ),
        { verbose: true }
      );
    }),
    'removes actions that are globbed by a wild-card': asyncTest(async () => {
      await fc.assert(
        fc.property(
          safeString, fc.array(safeString, 1, 3),
          (prefix, actions) => {
            const statement = new PolicyStatement().addActions(...actions.map(a => `${prefix}:${a}`), `${prefix}:*`);
            const optimized = optimizeStatements([statement.resolve()])[0];
            return optimized && optimized.Action === `${prefix}:*`;
          }
        ),
        { verbose: true }
      );
    }),
    'sorts actions': asyncTest(async () => {
      await fc.assert(
        fc.property(
          fc.array(safeString, 2, 3),
          (actions) => {
            const statement = new PolicyStatement().addActions(...actions);
            const optimized = optimizeStatements([statement.resolve()])[0];
            return optimized && _.isEqual(optimized.Action, [... new Set(actions)].sort(_localeCompare));
          }
        ),
        { verbose: true }
      );
    }),

    'merges statements that differ only in resources': asyncTest(async () => {
      await fc.assert(
        fc.property(
          fc.array(safeString, 1, 3), fc.array(safeString, 1, 3),
          fc.array(safeString, 2, 3), safeString, fc.string(), fc.string(), fc.string(),
          (resourcesA, resourcesB, actions, account, condOp, condKey, condVal) => {
            const statementA = new PolicyStatement().addActions(...actions)
                                                    .addResources(...resourcesA)
                                                    .addAwsPrincipal(account)
                                                    .addCondition(condOp, { [condKey]: condVal });
            const statementB = new PolicyStatement().addActions(...actions)
                                                    .addResources(...resourcesB)
                                                    .addAwsPrincipal(account)
                                                    .addCondition(condOp, { [condKey]: condVal });
            const optimized = optimizeStatements([statementA.resolve(), statementB.resolve()]);
            return optimized.length === 1
              && _.isEqual(optimized[0].Action, actions.sort(_localeCompare))
              && _.isEqual(optimized[0].Principal, { AWS: account })
              && _.isEqual(optimized[0].Condition, { [condOp]: { [condKey]: condVal } })
              && _.isEqual(optimized[0].Resource, [...new Set([...resourcesA, ...resourcesB])].sort(_localeCompare));
          }
        ),
        { verbose: true }
      );
    }),
  }
};

const EXAMPLES_DIR = path.resolve(__dirname, 'test.optimize-statements');
for (const file of fs.readdirSync(EXAMPLES_DIR)) {
  const example = YAML.safeLoad(fs.readFileSync(path.join(EXAMPLES_DIR, file), { encoding: 'utf-8' }));
  if (example.name in tests.optimizeStatements) {
    throw new Error(`Attempted to overwrite test function ${example.name} with example ${file}!`);
  }
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

function _localeCompare(l: string, r: string): number { return l.localeCompare(r); }
