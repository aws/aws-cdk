import { hoistDependencies } from "../lib/hoisting";
import { PackageLockPackage } from "../lib/types";

type Tree = Record<string, PackageLockPackage>;

test('nonconflicting tree gets flattened', () => {
  // GIVEN
  const tree: Tree = {
    stringutil: {
      version: '1.0.0',
      dependencies: {
        leftpad: { version: '2.0.0' }
      },
    },
    numutil: {
      version: '3.0.0',
      dependencies: {
        isodd: { version: '4.0.0' }
      },
    },
  };

  // WHEN
  hoistDependencies(tree);

  // THEN
  expect(tree).toEqual({
    stringutil: { version: '1.0.0' },
    leftpad: { version: '2.0.0' },
    numutil: { version: '3.0.0' },
    isodd: { version: '4.0.0' },
  });
});

test('matching versions get deduped', () => {
  // GIVEN
  const tree: Tree = {
    stringutil: {
      version: '1.0.0',
      dependencies: {
        leftpad: { version: '2.0.0' }
      },
    },
    numutil: {
      version: '3.0.0',
      dependencies: {
        leftpad: { version: '2.0.0' },
        isodd: { version: '4.0.0' }
      },
    },
  };

  // WHEN
  hoistDependencies(tree);

  // THEN
  expect(tree).toEqual({
    stringutil: { version: '1.0.0' },
    leftpad: { version: '2.0.0' },
    numutil: { version: '3.0.0' },
    isodd: { version: '4.0.0' },
  });
});

test('conflicting versions get left in place', () => {
  // GIVEN
  const tree: Tree = {
    stringutil: {
      version: '1.0.0',
      dependencies: {
        leftpad: { version: '2.0.0' }
      },
    },
    numutil: {
      version: '3.0.0',
      dependencies: {
        leftpad: { version: '5.0.0' },
        isodd: { version: '4.0.0' }
      },
    },
  };

  // WHEN
  hoistDependencies(tree);

  // THEN
  expect(tree).toEqual({
    stringutil: { version: '1.0.0' },
    leftpad: { version: '2.0.0' },
    numutil: {
      version: '3.0.0',
      dependencies: {
        leftpad: { version: '5.0.0' },
      },
    },
    isodd: { version: '4.0.0' },
  });
});

test('dependencies of deduped packages are not hoisted into useless positions', () => {
  // GIVEN

  const tree: Tree = {
    stringutil: {
      version: '1.0.0',
      dependencies: {
        leftpad: {
          version: '2.0.0',
          dependencies: {
            spacemaker: { version: '3.0.0' },
          }
        }
      },
    },
    leftpad: {
      version: '2.0.0',
      dependencies: {
        spacemaker: { version: '3.0.0' },
      }
    },
    spacemaker: { version: '4.0.0' }
  };

  // WHEN
  hoistDependencies(tree);

  // THEN
  expect(tree).toEqual({
    stringutil: { version: '1.0.0' },
    leftpad: {
      version: '2.0.0',
      dependencies: {
        spacemaker: { version: '3.0.0' }
      }
    },
    spacemaker: { version: '4.0.0' },
  });
});