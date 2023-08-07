/* eslint-disable jest/expect-expect */
import { Template } from '../../assertions';
import { EbsDeviceVolumeType } from '../../aws-ec2';
import { App, Stack } from '../../core';
import { Domain, DomainProps, EngineVersion } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });

  jest.resetAllMocks();
});

describe('EBS Options Configurations', () => {

  test('iops', () => {
    const domainProps: DomainProps = {
      version: EngineVersion.OPENSEARCH_2_5,
      ebs: {
        volumeSize: 30,
        iops: 500,
        volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
      },
    };
    new Domain(stack, 'Domain', domainProps);

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      EBSOptions: {
        VolumeSize: 30,
        Iops: 500,
        VolumeType: 'io1',
      },
    });
  });

  test('throughput', () => {
    const domainProps: DomainProps = {
      version: EngineVersion.OPENSEARCH_2_5,
      ebs: {
        volumeSize: 30,
        throughput: 125,
        volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
      },
    };
    new Domain(stack, 'Domain', domainProps);

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      EBSOptions: {
        VolumeSize: 30,
        Throughput: 125,
        VolumeType: 'gp3',
      },
    });
  });

  test('throughput and iops', () => {
    const domainProps: DomainProps = {
      version: EngineVersion.OPENSEARCH_2_5,
      ebs: {
        volumeSize: 30,
        iops: 3000,
        throughput: 125,
        volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
      },
    };
    new Domain(stack, 'Domain', domainProps);

    Template.fromStack(stack).hasResourceProperties('AWS::OpenSearchService::Domain', {
      EBSOptions: {
        VolumeSize: 30,
        iops: 3000,
        Throughput: 125,
        VolumeType: 'gp3',
      },
    });
  });

  test('validation required props', () => {
    let idx: number = 0;

    expect(() => {
      const domainProps: DomainProps = {
        version: EngineVersion.OPENSEARCH_2_5,
        ebs: {
          volumeSize: 30,
          volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
        },
      };
      new Domain(stack, `Domain${idx++}`, domainProps);
    }).toThrow('`iops` must be specified if the `volumeType` is `PROVISIONED_IOPS_SSD`.');

    expect(() => {
      const domainProps: DomainProps = {
        version: EngineVersion.OPENSEARCH_2_5,
        ebs: {
          volumeSize: 30,
          volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
          iops: 125,
        },
      };
      new Domain(stack, `Domain${idx++}`, domainProps);
    }).toThrow(
      'General Purpose EBS volumes can not be used with Iops or Throughput configuration',
    );

    expect(() => {
      const domainProps: DomainProps = {
        version: EngineVersion.OPENSEARCH_2_5,
        ebs: {
          iops: 125,
        },
      };
      new Domain(stack, `Domain${idx++}`, domainProps);
    }).toThrow(
      'General Purpose EBS volumes can not be used with Iops or Throughput configuration',
    );

    expect(() => {
      const domainProps: DomainProps = {
        version: EngineVersion.OPENSEARCH_2_5,
        ebs: {
          volumeSize: 30,
          volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
          iops: 99,
        },
      };
      new Domain(stack, `Domain${idx++}`, domainProps);
    }).toThrow(
      '`io1` volumes iops must be between 100 and 64000.',
    );

    expect(() => {
      const domainProps: DomainProps = {
        version: EngineVersion.OPENSEARCH_2_5,
        ebs: {
          volumeSize: 30,
          volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
          iops: 64001,
        },
      };
      new Domain(stack, `Domain${idx++}`, domainProps);
    }).toThrow(
      '`io1` volumes iops must be between 100 and 64000.',
    );

    expect(() => {
      const domainProps: DomainProps = {
        version: EngineVersion.OPENSEARCH_2_5,
        ebs: {
          volumeSize: 30,
          volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
          iops: 16001,
        },
      };
      new Domain(stack, `Domain${idx++}`, domainProps);
    }).toThrow(
      '`gp3` volumes iops must be between 3000 and 16000.',
    );

    expect(() => {
      const domainProps: DomainProps = {
        version: EngineVersion.OPENSEARCH_2_5,
        ebs: {
          volumeSize: 30,
          volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
          iops: 2999,
        },
      };
      new Domain(stack, `Domain${idx++}`, domainProps);
    }).toThrow(
      '`gp3` volumes iops must be between 3000 and 16000.',
    );

    expect(() => {
      const domainProps: DomainProps = {
        version: EngineVersion.OPENSEARCH_2_5,
        ebs: {
          volumeSize: 30,
          volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
          throughput: 1024,
        },
      };
      new Domain(stack, `Domain${idx++}`, domainProps);
    }).toThrow(
      'throughput property takes a minimum of 125 and a maximum of 1000.',
    );

    expect(() => {
      const domainProps: DomainProps = {
        version: EngineVersion.OPENSEARCH_2_5,
        ebs: {
          volumeSize: 30,
          volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
          throughput: 100,
        },
      };
      new Domain(stack, `Domain${idx++}`, domainProps);
    }).toThrow(
      'throughput property takes a minimum of 125 and a maximum of 1000.',
    );
  });
});
