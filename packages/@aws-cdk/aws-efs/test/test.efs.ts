import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { FileSystem, ImportedFileSystem, PerformanceMode, ThroughputMode } from '../lib/filesystem';

export = {
  'default properties'(test: Test) {
    const stack = new cdk.Stack();
    new FileSystem(stack, 'MyFileSystem');
    expect(stack).to(haveResource('AWS::EFS::FileSystem', {
      Encrypted: true,
      PerformanceMode: 'generalPurpose',
      ProvisionedThroughputInMibps: 100,
      ThroughputMode: 'bursting',
      encrypted: true
    }));

    test.done();
  },
  'when specifying throughput'(test: Test) {
    const stack = new cdk.Stack();
    new FileSystem(stack, 'MyFileSystem', {
      throughputMiB: 10,
    });
    expect(stack).to(haveResource('AWS::EFS::FileSystem', {
      Encrypted: true,
      PerformanceMode: 'generalPurpose',
      ProvisionedThroughputInMibps: 10,
      ThroughputMode: 'bursting',
      encrypted: true
    }));

    test.done();
  },
  'when specifying throughput mode'(test: Test) {
    const stack = new cdk.Stack();
    new FileSystem(stack, 'MyFileSystem', {
      throughputMode: ThroughputMode.Provisioned,
    });
    expect(stack).to(haveResource('AWS::EFS::FileSystem', {
      Encrypted: true,
      PerformanceMode: 'generalPurpose',
      ProvisionedThroughputInMibps: 100,
      ThroughputMode: 'provisioned',
      encrypted: true
    }));

    test.done();
  },
  'when specifying performance mode'(test: Test) {
    const stack = new cdk.Stack();
    new FileSystem(stack, 'MyFileSystem', {
      performanceMode: PerformanceMode.MaxIO,
    });
    expect(stack).to(haveResource('AWS::EFS::FileSystem', {
      Encrypted: true,
      PerformanceMode: 'maxIO',
      ProvisionedThroughputInMibps: 100,
      ThroughputMode: 'bursting',
      encrypted: true
    }));

    test.done();
  },
  'when specifying encryption mode'(test: Test) {
    const stack = new cdk.Stack();
    new FileSystem(stack, 'MyFileSystem', {
      encrypted: false,
    });
    expect(stack).to(haveResource('AWS::EFS::FileSystem', {
      Encrypted: true,
      PerformanceMode: 'generalPurpose',
      ProvisionedThroughputInMibps: 100,
      ThroughputMode: 'bursting',
      encrypted: false
    }));

    test.done();
  },
  'when specifying every property'(test: Test) {
    const stack = new cdk.Stack();
    new FileSystem(stack, 'MyFileSystem', {
      throughputMiB: 10,
      throughputMode: ThroughputMode.Provisioned,
      performanceMode: PerformanceMode.MaxIO,
    });
    expect(stack).to(haveResource('AWS::EFS::FileSystem', {
      Encrypted: true,
      PerformanceMode: 'maxIO',
      ProvisionedThroughputInMibps: 10,
      ThroughputMode: 'provisioned',
      encrypted: true
    }));

    test.done();
  },
  'invalid throughput is rejected'(test: Test) {
    const stack = new cdk.Stack();
    test.throws(
      () => new FileSystem(stack, 'MyFileSystem', {throughputMiB: -2}),
      Error,
      'Provisioned throughput can\'t be set to a value less than 1.0 MiB/s');

    test.done();
  },
  'valid throughput on boundary is accepted'(test: Test) {
    const stack = new cdk.Stack();
    new FileSystem(stack, 'MyFileSystem', {
      throughputMiB: 1,
    });
    expect(stack).to(haveResource('AWS::EFS::FileSystem', {
      Encrypted: true,
      PerformanceMode: 'generalPurpose',
      ProvisionedThroughputInMibps: 1,
      ThroughputMode: 'bursting',
      encrypted: true
    }));

    test.done();
  },
  'retrieve FileSystemId'(test: Test) {
    const stack = new cdk.Stack();
    const fileSystem = new FileSystem(stack, 'MyFileSystem', {
      throughputMiB: 1,
    });

    // const newFS = new ImportedFileSystem(newApp.stack, 'MyFileSystem', {fileSystemId: fileSystem.fileSystemId});
    ImportedFileSystem.import(stack, 'MyReferencedFileSystem', {fileSystemId: fileSystem.fileSystemId});
    test.done();
  }
};