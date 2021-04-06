import { spawn as spawnAsync, SpawnOptions } from 'child_process';
import * as reflect from 'jsii-reflect';
import * as path from 'path';
import { SchemaContext, schemaForInterface } from '../lib/jsii2schema';

const fixturedir = path.join(__dirname, 'fixture');

/* eslint-disable no-console */

// building the decdk schema often does not complete in the default 5 second Jest timeout
jest.setTimeout(60_000);

let typesys: reflect.TypeSystem;

beforeAll(async () => {
  typesys = new reflect.TypeSystem();

  // jsii-compile the fixtures module
  await spawn(require.resolve('jsii/bin/jsii'), { cwd: fixturedir,  });

  // load the resulting file system
  await typesys.loadFile(path.join(fixturedir, '.jsii'));
  await typesys.load(path.dirname(require.resolve('@aws-cdk/core/.jsii')));
});

test('schemaForInterface: interface with primitives', async () => {
  // GIVEN
  const defs = { };
  const ctx = SchemaContext.root(defs);

  // WHEN
  const ref = schemaForInterface(typesys.findFqn('fixture.InterfaceWithPrimitives'), ctx);

  // THEN
  expect(ref).toStrictEqual({ $ref: '#/definitions/fixture.InterfaceWithPrimitives' });
  expect(ctx.definitions).toStrictEqual({
    'fixture.InterfaceWithPrimitives': {
      type: 'object',
      title: 'InterfaceWithPrimitives',
      additionalProperties: false,
      properties: {
        arrayOfStrings: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of strings.'
        },
        mapOfNumbers: {
          type: 'object',
          additionalProperties: { type: 'number' }
        },
        numberProperty: {
          type: 'number',
          description: 'A property of type number.'
        },
        stringProperty: {
          type: 'string',
          description: 'A property of type string.'
        },
        optionalBoolean: {
          type: 'boolean',
          description: 'Optional boolean.'
        }
      },
      required: [
        'arrayOfStrings',
        'mapOfNumbers',
        'numberProperty',
        'stringProperty'
      ],
      comment: 'fixture.InterfaceWithPrimitives'
    }
  });
});

/**
 * Version of spawn() that returns a promise
 *
 * Need spawn() so that we can set stdio to inherit so that any jsii errors
 * are propagated outwards.
 */
function spawn(command: string, options: SpawnOptions | undefined) {
  return new Promise<void>((resolve, reject) => {
    const cp = spawnAsync(command, [], { stdio: 'inherit', ...options });

    cp.on('error', reject);
    cp.on('exit', (code, signal) => {
      if (code === 0) { resolve(); }
      reject(new Error(`Subprocess exited with ${code || signal}`));
    });
  });
}
