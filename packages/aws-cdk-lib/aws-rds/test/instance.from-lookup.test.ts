import * as cxschema from '../../cloud-assembly-schema';
import { ContextProvider, Stack } from '../../core';
import * as rds from '../lib';

/* eslint-disable */
describe('DatabaseInstanceBase from lookup', () => {
  test('return correct instance info', () => {
    // GIVEN
    const resultObjs = [
      {
        'DBInstanceArn': 'arn:aws:rds:us-east-1:123456789012:db:instance-1',
        'Endpoint.Address': 'instance-1.testserver.us-east-1.rds.amazonaws.com',
        'Endpoint.Port': '5432',
        'DbiResourceId': 'db-ABCDEFGHI',
        'DBSecurityGroups': [],
        'VPCSecurityGroups': [],
        'Identifier': 'instance-1',
      },
    ];
    const value = {
      value: resultObjs,
    };
    const mock = jest.spyOn(ContextProvider, 'getValue').mockReturnValue(value);

    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const instance = rds.DatabaseInstance.fromLookup(stack, 'MyInstance', {
      instanceIdentifier: 'instance-1',
    });

    // THEN
    expect(instance.instanceIdentifier).toEqual('instance-1');
    expect(instance.dbInstanceEndpointAddress).toEqual('instance-1.testserver.us-east-1.rds.amazonaws.com');
    expect(instance.dbInstanceEndpointPort).toEqual('5432');
    expect(instance.instanceResourceId).toEqual('db-ABCDEFGHI');
    expect(instance.connections.securityGroups.length).toEqual(0);

    expect(mock).toHaveBeenCalledWith(stack, {
      provider: cxschema.ContextProvider.CC_API_PROVIDER,
        props: {
          typeName: 'AWS::RDS::DBInstance',
          exactIdentifier: 'instance-1',
          propertiesToReturn: [
            'DBInstanceArn',
            'Endpoint.Address',
            'Endpoint.Port',
            'DbiResourceId',
            'DBSecurityGroups',
            'VPCSecurityGroups',
          ],
        } as cxschema.CcApiContextQuery,
        dummyValue: [
          {
            'Identifier': 'TEST',
            'DBInstanceArn': 'TESTARN',
            'Endpoint.Address': 'TESTADDRESS',
            'Endpoint.Port': '5432',
            'DbiResourceId': 'TESTID',
            'DBSecurityGroups': [],
            'VPCSecurityGroups': [],
          },
        ],
    });

    mock.mockRestore();
  });
});

describe("DatabaseInstanceBase from lookup with DBSG", () => {
  test("return correct instance info", () => {
    // GIVEN
    const resultObjs = [
      {
        DBInstanceArn: "arn:aws:rds:us-east-1:123456789012:db:instance-1",
        "Endpoint.Address": "instance-1.testserver.us-east-1.rds.amazonaws.com",
        "Endpoint.Port": "5432",
        DbiResourceId: "db-ABCDEFGHI",
        DBSecurityGroups: ["dbsg-1", "dbsg-2"],
        VPCSecurityGroups: [],
        Identifier: "instance-1",
      },
    ];
    const value = {
      value: resultObjs,
    };
    const mock = jest.spyOn(ContextProvider, "getValue").mockReturnValue(value);

    // WHEN
    const stack = new Stack(undefined, undefined, {
      env: { region: "us-east-1", account: "123456789012" },
    });
    const instance = rds.DatabaseInstance.fromLookup(stack, "MyInstance", {
      instanceIdentifier: "instance-1",
    });

    // THEN
    expect(instance.instanceIdentifier).toEqual("instance-1");
    expect(instance.dbInstanceEndpointAddress).toEqual(
      "instance-1.testserver.us-east-1.rds.amazonaws.com"
    );
    expect(instance.dbInstanceEndpointPort).toEqual("5432");
    expect(instance.instanceResourceId).toEqual("db-ABCDEFGHI");
    expect(instance.connections.securityGroups.length).toEqual(2);
    expect(instance.connections.securityGroups[0].securityGroupId).toEqual(
      "dbsg-1"
    );
    expect(instance.connections.securityGroups[1].securityGroupId).toEqual(
      "dbsg-2"
    );

    expect(mock).toHaveBeenCalledWith(stack, {
      provider: cxschema.ContextProvider.CC_API_PROVIDER,
      props: {
        typeName: "AWS::RDS::DBInstance",
        exactIdentifier: "instance-1",
        propertiesToReturn: [
          "DBInstanceArn",
          "Endpoint.Address",
          "Endpoint.Port",
          "DbiResourceId",
          "DBSecurityGroups",
          "VPCSecurityGroups",
        ],
      } as cxschema.CcApiContextQuery,
      dummyValue: [
        {
          Identifier: "TEST",
          DBInstanceArn: "TESTARN",
          "Endpoint.Address": "TESTADDRESS",
          "Endpoint.Port": "5432",
          DbiResourceId: "TESTID",
          DBSecurityGroups: [],
          VPCSecurityGroups: [],
        },
      ],
    });

    mock.mockRestore();
  });
});

describe('DatabaseInstanceBase from lookup with VPCSecurityGroups', () => {
  test('return correct instance info', () => {
    // GIVEN
    const resultObjs = [
      {
        'DBInstanceArn': 'arn:aws:rds:us-east-1:123456789012:db:instance-1',
        'Endpoint.Address': 'instance-1.testserver.us-east-1.rds.amazonaws.com',
        'Endpoint.Port': '5432',
        'DbiResourceId': 'db-ABCDEFGHI',
        'DBSecurityGroups': [],
        'VPCSecurityGroups': ['sg-1', 'sg-2'],
        'Identifier': 'instance-1',
      },
    ];
    const value = {
      value: resultObjs,
    };
    const mock = jest.spyOn(ContextProvider, 'getValue').mockReturnValue(value);

    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const instance = rds.DatabaseInstance.fromLookup(stack, 'MyInstance', {
      instanceIdentifier: 'instance-1',
    });

    // THEN
    expect(instance.instanceIdentifier).toEqual('instance-1');
    expect(instance.dbInstanceEndpointAddress).toEqual('instance-1.testserver.us-east-1.rds.amazonaws.com');
    expect(instance.dbInstanceEndpointPort).toEqual('5432');
    expect(instance.instanceResourceId).toEqual('db-ABCDEFGHI');
    expect(instance.connections.securityGroups.length).toEqual(2);
    expect(instance.connections.securityGroups[0].securityGroupId).toEqual('sg-1');
    expect(instance.connections.securityGroups[1].securityGroupId).toEqual('sg-2');

    expect(mock).toHaveBeenCalledWith(stack, {
      provider: cxschema.ContextProvider.CC_API_PROVIDER,
        props: {
          typeName: 'AWS::RDS::DBInstance',
          exactIdentifier: 'instance-1',
          propertiesToReturn: [
            'DBInstanceArn',
            'Endpoint.Address',
            'Endpoint.Port',
            'DbiResourceId',
            'DBSecurityGroups',
            'VPCSecurityGroups',
          ],
        } as cxschema.CcApiContextQuery,
        dummyValue: [
          {
            'Identifier': 'TEST',
            'DBInstanceArn': 'TESTARN',
            'Endpoint.Address': 'TESTADDRESS',
            'Endpoint.Port': '5432',
            'DbiResourceId': 'TESTID',
            'DBSecurityGroups': [],
            'VPCSecurityGroups': [],
          },
        ],
    });

    mock.mockRestore();
  });
});
/* eslint-enable */
