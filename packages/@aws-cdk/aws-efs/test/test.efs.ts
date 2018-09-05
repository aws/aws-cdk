import {App, Stack} from '@aws-cdk/cdk';
import {Test} from 'nodeunit';
import {FileSystem, ImportedFileSystem, PerformanceMode, ThroughputMode} from '../lib/filesystem';

export = {
    'default properties': {
        'defaults for all properties'(test: Test) {
            const app = new TestApp();
            new FileSystem(app.stack, 'MyFileSystem');

            const template = app.synthesizeTemplate();

            test.deepEqual(template, {
                Resources: {
                    MyFileSystem2010A7C5: {
                        Type: 'AWS::EFS::FileSystem',
                        Properties: {
                            Encrypted: true,
                            PerformanceMode: 'generalPurpose',
                            ProvisionedThroughputInMibps: 100,
                            ThroughputMode: 'bursting'
                        }
                    }
                }
            });
            test.done();
        }
    },
    'when specifying throughput'(test: Test) {
        const app = new TestApp();
        new FileSystem(app.stack, 'MyFileSystem', {
            throughputMiB: 10,
        });
        const template = app.synthesizeTemplate();

        test.deepEqual(template, {
            Resources: {
                MyFileSystem2010A7C5: {
                    Type: 'AWS::EFS::FileSystem',
                    Properties: {
                        Encrypted: true,
                        PerformanceMode: 'generalPurpose',
                        ProvisionedThroughputInMibps: 10,
                        ThroughputMode: 'bursting'
                    }
                }
            }
        });
        test.done();
    },
    'when specifying throughput mode'(test: Test) {
        const app = new TestApp();
        new FileSystem(app.stack, 'MyFileSystem', {
            throughputMode: ThroughputMode.Provisioned,
        });
        const template = app.synthesizeTemplate();

        test.deepEqual(template, {
            Resources: {
                MyFileSystem2010A7C5: {
                    Type: 'AWS::EFS::FileSystem',
                    Properties: {
                        Encrypted: true,
                        PerformanceMode: 'generalPurpose',
                        ProvisionedThroughputInMibps: 100,
                        ThroughputMode: 'provisioned'
                    }
                }
            }
        });
        test.done();
    },
    'when specifying performance mode'(test: Test) {
        const app = new TestApp();
        new FileSystem(app.stack, 'MyFileSystem', {
            performanceMode: PerformanceMode.MaxIO,
        });
        const template = app.synthesizeTemplate();

        test.deepEqual(template, {
            Resources: {
                MyFileSystem2010A7C5: {
                    Type: 'AWS::EFS::FileSystem',
                    Properties: {
                        Encrypted: true,
                        PerformanceMode: 'maxIO',
                        ProvisionedThroughputInMibps: 100,
                        ThroughputMode: 'bursting'
                    }
                }
            }
        });
        test.done();
    },
    'when specifying every property'(test: Test) {
        const app = new TestApp();
        new FileSystem(app.stack, 'MyFileSystem', {
            throughputMiB: 10,
            throughputMode: ThroughputMode.Provisioned,
            performanceMode: PerformanceMode.MaxIO,
        });
        const template = app.synthesizeTemplate();

        test.deepEqual(template, {
            Resources: {
                MyFileSystem2010A7C5: {
                    Type: 'AWS::EFS::FileSystem',
                    Properties: {
                        Encrypted: true,
                        PerformanceMode: 'maxIO',
                        ProvisionedThroughputInMibps: 10,
                        ThroughputMode: 'provisioned'
                    }
                }
            }
        });
        test.done();
    },
    'invalid throughput is rejected'(test: Test) {
        const app = new TestApp();

        test.throws(
            () => new FileSystem(app.stack, 'MyFileSystem', {throughputMiB: -2}),
            Error,
            'Provisioned throughput can\'t be set to a value less than 1.0 MiB/s');

        test.done();
    },
    'valid throughput on boundary is accepted'(test: Test) {
        const app = new TestApp();
        new FileSystem(app.stack, 'MyFileSystem', {
            throughputMiB: 1,
        });
        const template = app.synthesizeTemplate();

        test.deepEqual(template, {
            Resources: {
                MyFileSystem2010A7C5: {
                    Type: 'AWS::EFS::FileSystem',
                    Properties: {
                        Encrypted: true,
                        PerformanceMode: 'generalPurpose',
                        ProvisionedThroughputInMibps: 1,
                        ThroughputMode: 'bursting'
                    }
                }
            }
        });
        test.done();
    },
    'retrieve FileSystemId'(test: Test) {
        const app = new TestApp();
        const fileSystem = new FileSystem(app.stack, 'MyFileSystem', {
            throughputMiB: 1,
        });

        const newApp = new TestApp();
        // const newFS = new ImportedFileSystem(newApp.stack, 'MyFileSystem', {fileSystemId: fileSystem.fileSystemId});
        ImportedFileSystem.import(newApp.stack, 'MyReferencedFileSystem', {fileSystemId: fileSystem.fileSystemId});
        test.done();
    }
};

class TestApp {
    private readonly app = new App();
    // tslint:disable-next-line:member-ordering
    public readonly stack: Stack = new Stack(this.app, 'MyStack');

    public synthesizeTemplate() {
        return this.app.synthesizeStack(this.stack.name).template;
    }
}