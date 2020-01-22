import * as cxapi from '@aws-cdk/cx-api';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { ABSENT, expect as cdkExpect, haveResource } from '../lib/index';

test('support resource with no properties', () => {
  const synthStack = mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource'
      }
    }
  });
  expect(() => cdkExpect(synthStack).to(haveResource('Some::Resource'))).not.toThrowError();
});

test('haveResource tells you about mismatched fields', () => {
  const synthStack = mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
        Properties: {
          PropA: 'somevalue'
        }
      }
    }
  });

  expect(() => {
    cdkExpect(synthStack).to(haveResource('Some::Resource', {
      PropA: 'othervalue'
    }));
  }).toThrowError(/PropA/);
});

test('haveResource value matching is strict by default', () => {
  const synthStack = mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
        Properties: {
          PropA: {
            foo: 'somevalue',
            bar: 'This is unexpected, so the value of PropA doesn\'t strictly match - it shouldn\'t pass'
          },
          PropB: 'This property is unexpected, but it\'s allowed'
        }
      }
    }
  });

  expect(() => {
    cdkExpect(synthStack).to(haveResource('Some::Resource', {
      PropA: {
        foo: 'somevalue'
      }
    }));
  }).toThrowError(/PropA/);
});

test('haveResource allows to opt in value extension', () => {
  const synthStack = mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
        Properties: {
          PropA: {
            foo: 'somevalue',
            bar: 'Additional value is permitted, as we opted in'
          },
          PropB: 'Additional properties is always okay!'
        }
      }
    }
  });

  expect(() =>
    cdkExpect(synthStack).to(haveResource('Some::Resource', {
      PropA: {
        foo: 'somevalue'
      }
    }, undefined, true))
  ).not.toThrowError();
});

describe('property absence', () => {
  test('pass on absence', () => {
    const synthStack = mkSomeResource({
      Prop: 'somevalue'
    });

    cdkExpect(synthStack).to(haveResource('Some::Resource', {
      PropA: ABSENT
    }));
  });

  test('fail on presence', () => {
    const synthStack = mkSomeResource({
      PropA: 3
    });

    expect(() => {
      cdkExpect(synthStack).to(haveResource('Some::Resource', {
        PropA: ABSENT
      }));
    }).toThrowError(/PropA/);
  });

  test('pass on deep absence', () => {
    const synthStack = mkSomeResource({
      Deep: {
        Prop: 'somevalue',
      }
    });

    cdkExpect(synthStack).to(haveResource('Some::Resource', {
      Deep: {
        Prop: 'somevalue',
        PropA: ABSENT
      }
    }));
  });

  test('fail on deep presence', () => {
    const synthStack = mkSomeResource({
      Deep: {
        Prop: 'somevalue',
      }
    });

    expect(() => {
      cdkExpect(synthStack).to(haveResource('Some::Resource', {
        Deep: {
          Prop: ABSENT
        }
      }));
    }).toThrowError(/Prop/);
  });

});

function mkStack(template: any): cxapi.CloudFormationStackArtifact {
  const assembly = new cxapi.CloudAssemblyBuilder();
  assembly.addArtifact('test', {
    type: cxapi.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: cxapi.EnvironmentUtils.format('123456789', 'us-west-2'),
    properties: {
      templateFile: 'template.json'
    }
  });

  writeFileSync(join(assembly.outdir, 'template.json'), JSON.stringify(template));
  return assembly.buildAssembly().getStackByName('test');
}

function mkSomeResource(props: any): cxapi.CloudFormationStackArtifact {
  return mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
        Properties: props
      }
    }
  });
}