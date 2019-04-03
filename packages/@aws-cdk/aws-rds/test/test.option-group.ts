import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { DatabaseInstanceEngine, OptionGroup } from '../lib';

export = {
  'create an option group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new OptionGroup(stack, 'Params', {
      engineName: DatabaseInstanceEngine.OracleSE1,
      majorEngineVersion: '11.2',
      configurations: [
        {
          name: 'XMLDB'
        }
      ]
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::OptionGroup', {
      EngineName: 'oracle-se1',
      MajorEngineVersion: '11.2',
      OptionGroupDescription: 'Option group for oracle-se1 11.2',
      OptionConfigurations: [
        {
          OptionName: 'XMLDB'
        }
      ]
    }));

    test.done();
  },

  'import/export option group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const group = new OptionGroup(stack, 'Params', {
      engineName: DatabaseInstanceEngine.OracleSE1,
      majorEngineVersion: '11.2',
      configurations: [
        {
          name: 'XMLDB'
        }
      ]
    });

    // WHEN
    const exported = group.export();
    const imported = OptionGroup.import(stack, 'ImportParams', exported);

    // THEN
    test.deepEqual(stack.node.resolve(exported), { optionGroupName: { 'Fn::ImportValue': 'Stack:ParamsOptionGroupNameEC112901' } });
    test.deepEqual(stack.node.resolve(imported.optionGroupName), { 'Fn::ImportValue': 'Stack:ParamsOptionGroupNameEC112901' });
    test.done();
  }
};
