"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const constructs_1 = require("constructs");
const index_1 = require("../../lib/index");
class AbstractCfnResource extends index_1.CfnResource {
    constructor(scope, id) {
        super(scope, id, {
            type: 'CDK::UnitTest::MyCfnResource',
        });
    }
    inspect(inspector) {
        inspector.addAttribute('aws:cdk:cloudformation:type', 'CDK::UnitTest::MyCfnResource');
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
    }
}
describe('tree metadata', () => {
    test('tree metadata is generated as expected', () => {
        const app = new index_1.App();
        const stack = new index_1.Stack(app, 'mystack');
        new constructs_1.Construct(stack, 'myconstruct');
        const assembly = app.synth();
        const treeArtifact = assembly.tree();
        expect(treeArtifact).toBeDefined();
        expect(readJson(assembly.directory, treeArtifact.file)).toEqual({
            version: 'tree-0.1',
            tree: expect.objectContaining({
                id: 'App',
                path: '',
                children: {
                    Tree: expect.objectContaining({
                        id: 'Tree',
                        path: 'Tree',
                    }),
                    mystack: expect.objectContaining({
                        id: 'mystack',
                        path: 'mystack',
                        children: {
                            BootstrapVersion: {
                                constructInfo: {
                                    fqn: '@aws-cdk/core.CfnParameter',
                                    version: expect.any(String),
                                },
                                id: 'BootstrapVersion',
                                path: 'mystack/BootstrapVersion',
                            },
                            CheckBootstrapVersion: {
                                constructInfo: {
                                    fqn: '@aws-cdk/core.CfnRule',
                                    version: expect.any(String),
                                },
                                id: 'CheckBootstrapVersion',
                                path: 'mystack/CheckBootstrapVersion',
                            },
                            myconstruct: expect.objectContaining({
                                id: 'myconstruct',
                                path: 'mystack/myconstruct',
                            }),
                        },
                    }),
                },
            }),
        });
    });
    test('tree metadata for a Cfn resource', () => {
        class MyCfnResource extends AbstractCfnResource {
            get cfnProperties() {
                return {
                    mystringpropkey: 'mystringpropval',
                    mylistpropkey: ['listitem1'],
                    mystructpropkey: {
                        myboolpropkey: true,
                        mynumpropkey: 50,
                    },
                };
            }
        }
        const app = new index_1.App();
        const stack = new index_1.Stack(app, 'mystack');
        new MyCfnResource(stack, 'mycfnresource');
        const assembly = app.synth();
        const treeArtifact = assembly.tree();
        expect(treeArtifact).toBeDefined();
        expect(readJson(assembly.directory, treeArtifact.file)).toEqual({
            version: 'tree-0.1',
            tree: expect.objectContaining({
                id: 'App',
                path: '',
                children: {
                    Tree: expect.objectContaining({
                        id: 'Tree',
                        path: 'Tree',
                    }),
                    mystack: expect.objectContaining({
                        id: 'mystack',
                        path: 'mystack',
                        children: expect.objectContaining({
                            mycfnresource: expect.objectContaining({
                                id: 'mycfnresource',
                                path: 'mystack/mycfnresource',
                                attributes: {
                                    'aws:cdk:cloudformation:type': 'CDK::UnitTest::MyCfnResource',
                                    'aws:cdk:cloudformation:props': {
                                        mystringpropkey: 'mystringpropval',
                                        mylistpropkey: ['listitem1'],
                                        mystructpropkey: {
                                            myboolpropkey: true,
                                            mynumpropkey: 50,
                                        },
                                    },
                                },
                            }),
                        }),
                    }),
                },
            }),
        });
    });
    test('tree metadata has construct class & version in there', () => {
        // The runtime metadata this test relies on is only available if the most
        // recent compile has happened using 'jsii', as the jsii compiler injects
        // this metadata.
        //
        // If the most recent compile was using 'tsc', the metadata will not have
        // been injected, and the test will fail.
        //
        // People may choose to run `tsc` directly (instead of `yarn build` for
        // example) to escape the additional TSC compilation time that is necessary
        // to run 'eslint', or the additional time that 'jsii' needs to analyze the
        // type system), this test is allowed to fail if we're not running on CI.
        //
        // If the compile of this library has been done using `tsc`, the runtime
        // information will always find `constructs.Construct` as the construct
        // identifier, since `constructs` will have had a release build done using `jsii`.
        //
        // If this test is running on CodeBuild, we will require that the more specific
        // class names are found. If this test is NOT running on CodeBuild, we will
        // allow the specific class name (for a 'jsii' build) or the generic
        // 'constructs.Construct' class name (for a 'tsc' build).
        const app = new index_1.App();
        const stack = new index_1.Stack(app, 'mystack');
        new index_1.CfnResource(stack, 'myconstruct', { type: 'Aws::Some::Resource' });
        const assembly = app.synth();
        const treeArtifact = assembly.tree();
        expect(treeArtifact).toBeDefined();
        const codeBuild = !!process.env.CODEBUILD_BUILD_ID;
        expect(readJson(assembly.directory, treeArtifact.file)).toEqual({
            version: 'tree-0.1',
            tree: expect.objectContaining({
                children: expect.objectContaining({
                    mystack: expect.objectContaining({
                        constructInfo: {
                            fqn: expect.stringMatching(codeBuild ? /\bStack$/ : /\bStack$|^constructs.Construct$/),
                            version: expect.any(String),
                        },
                        children: expect.objectContaining({
                            myconstruct: expect.objectContaining({
                                constructInfo: {
                                    fqn: expect.stringMatching(codeBuild ? /\bCfnResource$/ : /\bCfnResource$|^constructs.Construct$/),
                                    version: expect.any(String),
                                },
                            }),
                        }),
                    }),
                }),
            }),
        });
    });
    test('token resolution & cfn parameter', () => {
        const app = new index_1.App();
        const stack = new index_1.Stack(app, 'mystack');
        const cfnparam = new index_1.CfnParameter(stack, 'mycfnparam');
        class MyCfnResource extends AbstractCfnResource {
            get cfnProperties() {
                return {
                    lazykey: index_1.Lazy.string({ produce: () => 'LazyResolved!' }),
                    cfnparamkey: cfnparam,
                };
            }
        }
        new MyCfnResource(stack, 'mycfnresource');
        const assembly = app.synth();
        const treeArtifact = assembly.tree();
        expect(treeArtifact).toBeDefined();
        expect(readJson(assembly.directory, treeArtifact.file)).toEqual({
            version: 'tree-0.1',
            tree: expect.objectContaining({
                id: 'App',
                path: '',
                children: {
                    Tree: expect.objectContaining({
                        id: 'Tree',
                        path: 'Tree',
                    }),
                    mystack: expect.objectContaining({
                        id: 'mystack',
                        path: 'mystack',
                        children: expect.objectContaining({
                            mycfnparam: expect.objectContaining({
                                id: 'mycfnparam',
                                path: 'mystack/mycfnparam',
                            }),
                            mycfnresource: expect.objectContaining({
                                id: 'mycfnresource',
                                path: 'mystack/mycfnresource',
                                attributes: {
                                    'aws:cdk:cloudformation:type': 'CDK::UnitTest::MyCfnResource',
                                    'aws:cdk:cloudformation:props': {
                                        lazykey: 'LazyResolved!',
                                        cfnparamkey: { Ref: 'mycfnparam' },
                                    },
                                },
                            }),
                        }),
                    }),
                },
            }),
        });
    });
    test('cross-stack tokens', () => {
        class MyFirstResource extends AbstractCfnResource {
            constructor(scope, id) {
                super(scope, id);
                this.lazykey = index_1.Lazy.string({ produce: () => 'LazyResolved!' });
            }
            get cfnProperties() {
                return {
                    lazykey: this.lazykey,
                };
            }
        }
        class MySecondResource extends AbstractCfnResource {
            constructor(scope, id, myprop) {
                super(scope, id);
                this.myprop = myprop;
            }
            get cfnProperties() {
                return {
                    myprop: this.myprop,
                };
            }
        }
        const app = new index_1.App();
        const firststack = new index_1.Stack(app, 'myfirststack');
        const firstres = new MyFirstResource(firststack, 'myfirstresource');
        const secondstack = new index_1.Stack(app, 'mysecondstack');
        new MySecondResource(secondstack, 'mysecondresource', firstres.lazykey);
        const assembly = app.synth();
        const treeArtifact = assembly.tree();
        expect(treeArtifact).toBeDefined();
        expect(readJson(assembly.directory, treeArtifact.file)).toEqual({
            version: 'tree-0.1',
            tree: expect.objectContaining({
                id: 'App',
                path: '',
                children: {
                    Tree: expect.objectContaining({
                        id: 'Tree',
                        path: 'Tree',
                    }),
                    myfirststack: expect.objectContaining({
                        id: 'myfirststack',
                        path: 'myfirststack',
                        children: expect.objectContaining({
                            myfirstresource: expect.objectContaining({
                                id: 'myfirstresource',
                                path: 'myfirststack/myfirstresource',
                                attributes: {
                                    'aws:cdk:cloudformation:type': 'CDK::UnitTest::MyCfnResource',
                                    'aws:cdk:cloudformation:props': {
                                        lazykey: 'LazyResolved!',
                                    },
                                },
                            }),
                        }),
                    }),
                    mysecondstack: expect.objectContaining({
                        id: 'mysecondstack',
                        path: 'mysecondstack',
                        children: expect.objectContaining({
                            mysecondresource: expect.objectContaining({
                                id: 'mysecondresource',
                                path: 'mysecondstack/mysecondresource',
                                attributes: {
                                    'aws:cdk:cloudformation:type': 'CDK::UnitTest::MyCfnResource',
                                    'aws:cdk:cloudformation:props': {
                                        myprop: 'LazyResolved!',
                                    },
                                },
                            }),
                        }),
                    }),
                },
            }),
        });
    });
    test('tree metadata can be disabled', () => {
        // GIVEN
        const app = new index_1.App({
            treeMetadata: false,
        });
        // WHEN
        const stack = new index_1.Stack(app, 'mystack');
        new constructs_1.Construct(stack, 'myconstruct');
        const assembly = app.synth();
        const treeArtifact = assembly.tree();
        // THEN
        expect(treeArtifact).not.toBeDefined();
    });
    test('failing nodes', () => {
        class MyCfnResource extends index_1.CfnResource {
            inspect(_) {
                throw new Error('Forcing an inspect error');
            }
        }
        const app = new index_1.App();
        const stack = new index_1.Stack(app, 'mystack');
        new MyCfnResource(stack, 'mycfnresource', {
            type: 'CDK::UnitTest::MyCfnResource',
        });
        const assembly = app.synth();
        const treeArtifact = assembly.tree();
        expect(treeArtifact).toBeDefined();
        const treenode = app.node.findChild('Tree');
        const warn = treenode.node.metadata.find((md) => {
            return md.type === cxschema.ArtifactMetadataEntryType.WARN
                && /Forcing an inspect error/.test(md.data)
                && /mycfnresource/.test(md.data);
        });
        expect(warn).toBeDefined();
        // assert that the rest of the construct tree is rendered
        expect(readJson(assembly.directory, treeArtifact.file)).toEqual({
            version: 'tree-0.1',
            tree: expect.objectContaining({
                id: 'App',
                path: '',
                children: {
                    Tree: expect.objectContaining({
                        id: 'Tree',
                        path: 'Tree',
                    }),
                    mystack: expect.objectContaining({
                        id: 'mystack',
                        path: 'mystack',
                    }),
                },
            }),
        });
    });
});
function readJson(outdir, file) {
    return JSON.parse(fs.readFileSync(path.join(outdir, file), 'utf-8'));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1tZXRhZGF0YS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidHJlZS1tZXRhZGF0YS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QiwyREFBMkQ7QUFDM0QsMkNBQXVDO0FBQ3ZDLDJDQUE2RjtBQUU3RixNQUFlLG1CQUFvQixTQUFRLG1CQUFXO0lBQ3BELFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsSUFBSSxFQUFFLDhCQUE4QjtTQUNyQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sT0FBTyxDQUFDLFNBQXdCO1FBQ3JDLFNBQVMsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsOEJBQThCLENBQUMsQ0FBQztRQUN0RixTQUFTLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM3RSxDQUFDO0NBR0Y7QUFFRCxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixJQUFJLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO1FBQ2xELE1BQU0sR0FBRyxHQUFHLElBQUksV0FBRyxFQUFFLENBQUM7UUFFdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxhQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLElBQUksc0JBQVMsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFcEMsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFbkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLFlBQWEsQ0FBQyxJQUFJ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QUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUUzQix5REFBeUQ7UUFDekQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLFlBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUMvRCxPQUFPLEVBQUUsVUFBVTtZQUNuQixJQUFJLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDO2dCQUM1QixFQUFFLEVBQUUsS0FBSztnQkFDVCxJQUFJLEVBQUUsRUFBRTtnQkFDUixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQzt3QkFDNUIsRUFBRSxFQUFFLE1BQU07d0JBQ1YsSUFBSSxFQUFFLE1BQU07cUJBQ2IsQ0FBQztvQkFDRixPQUFPLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDO3dCQUMvQixFQUFFLEVBQUUsU0FBUzt3QkFDYixJQUFJLEVBQUUsU0FBUztxQkFDaEIsQ0FBQztpQkFDSDthQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7SUFHTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxRQUFRLENBQUMsTUFBYyxFQUFFLElBQVk7SUFDNUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUN2RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFwcCwgQ2ZuUGFyYW1ldGVyLCBDZm5SZXNvdXJjZSwgTGF6eSwgU3RhY2ssIFRyZWVJbnNwZWN0b3IgfSBmcm9tICcuLi8uLi9saWIvaW5kZXgnO1xuXG5hYnN0cmFjdCBjbGFzcyBBYnN0cmFjdENmblJlc291cmNlIGV4dGVuZHMgQ2ZuUmVzb3VyY2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICB0eXBlOiAnQ0RLOjpVbml0VGVzdDo6TXlDZm5SZXNvdXJjZScsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IFRyZWVJbnNwZWN0b3IpIHtcbiAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKCdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGUnLCAnQ0RLOjpVbml0VGVzdDo6TXlDZm5SZXNvdXJjZScpO1xuICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoJ2F3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHMnLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IG92ZXJyaWRlIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH07XG59XG5cbmRlc2NyaWJlKCd0cmVlIG1ldGFkYXRhJywgKCkgPT4ge1xuICB0ZXN0KCd0cmVlIG1ldGFkYXRhIGlzIGdlbmVyYXRlZCBhcyBleHBlY3RlZCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteXN0YWNrJyk7XG4gICAgbmV3IENvbnN0cnVjdChzdGFjaywgJ215Y29uc3RydWN0Jyk7XG5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHRyZWVBcnRpZmFjdCA9IGFzc2VtYmx5LnRyZWUoKTtcbiAgICBleHBlY3QodHJlZUFydGlmYWN0KS50b0JlRGVmaW5lZCgpO1xuXG4gICAgZXhwZWN0KHJlYWRKc29uKGFzc2VtYmx5LmRpcmVjdG9yeSwgdHJlZUFydGlmYWN0IS5maWxlKSkudG9FcXVhbCh7XG4gICAgICB2ZXJzaW9uOiAndHJlZS0wLjEnLFxuICAgICAgdHJlZTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICBpZDogJ0FwcCcsXG4gICAgICAgIHBhdGg6ICcnLFxuICAgICAgICBjaGlsZHJlbjoge1xuICAgICAgICAgIFRyZWU6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGlkOiAnVHJlZScsXG4gICAgICAgICAgICBwYXRoOiAnVHJlZScsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbXlzdGFjazogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgaWQ6ICdteXN0YWNrJyxcbiAgICAgICAgICAgIHBhdGg6ICdteXN0YWNrJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiB7XG4gICAgICAgICAgICAgIEJvb3RzdHJhcFZlcnNpb246IHtcbiAgICAgICAgICAgICAgICBjb25zdHJ1Y3RJbmZvOiB7XG4gICAgICAgICAgICAgICAgICBmcW46ICdAYXdzLWNkay9jb3JlLkNmblBhcmFtZXRlcicsXG4gICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBleHBlY3QuYW55KFN0cmluZyksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpZDogJ0Jvb3RzdHJhcFZlcnNpb24nLFxuICAgICAgICAgICAgICAgIHBhdGg6ICdteXN0YWNrL0Jvb3RzdHJhcFZlcnNpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBDaGVja0Jvb3RzdHJhcFZlcnNpb246IHtcbiAgICAgICAgICAgICAgICBjb25zdHJ1Y3RJbmZvOiB7XG4gICAgICAgICAgICAgICAgICBmcW46ICdAYXdzLWNkay9jb3JlLkNmblJ1bGUnLFxuICAgICAgICAgICAgICAgICAgdmVyc2lvbjogZXhwZWN0LmFueShTdHJpbmcpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaWQ6ICdDaGVja0Jvb3RzdHJhcFZlcnNpb24nLFxuICAgICAgICAgICAgICAgIHBhdGg6ICdteXN0YWNrL0NoZWNrQm9vdHN0cmFwVmVyc2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG15Y29uc3RydWN0OiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgICAgaWQ6ICdteWNvbnN0cnVjdCcsXG4gICAgICAgICAgICAgICAgcGF0aDogJ215c3RhY2svbXljb25zdHJ1Y3QnLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndHJlZSBtZXRhZGF0YSBmb3IgYSBDZm4gcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgY2xhc3MgTXlDZm5SZXNvdXJjZSBleHRlbmRzIEFic3RyYWN0Q2ZuUmVzb3VyY2Uge1xuICAgICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG15c3RyaW5ncHJvcGtleTogJ215c3RyaW5ncHJvcHZhbCcsXG4gICAgICAgICAgbXlsaXN0cHJvcGtleTogWydsaXN0aXRlbTEnXSxcbiAgICAgICAgICBteXN0cnVjdHByb3BrZXk6IHtcbiAgICAgICAgICAgIG15Ym9vbHByb3BrZXk6IHRydWUsXG4gICAgICAgICAgICBteW51bXByb3BrZXk6IDUwLFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ215c3RhY2snKTtcbiAgICBuZXcgTXlDZm5SZXNvdXJjZShzdGFjaywgJ215Y2ZucmVzb3VyY2UnKTtcblxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdHJlZUFydGlmYWN0ID0gYXNzZW1ibHkudHJlZSgpO1xuICAgIGV4cGVjdCh0cmVlQXJ0aWZhY3QpLnRvQmVEZWZpbmVkKCk7XG5cbiAgICBleHBlY3QocmVhZEpzb24oYXNzZW1ibHkuZGlyZWN0b3J5LCB0cmVlQXJ0aWZhY3QhLmZpbGUpKS50b0VxdWFsKHtcbiAgICAgIHZlcnNpb246ICd0cmVlLTAuMScsXG4gICAgICB0cmVlOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgIGlkOiAnQXBwJyxcbiAgICAgICAgcGF0aDogJycsXG4gICAgICAgIGNoaWxkcmVuOiB7XG4gICAgICAgICAgVHJlZTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgaWQ6ICdUcmVlJyxcbiAgICAgICAgICAgIHBhdGg6ICdUcmVlJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBteXN0YWNrOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBpZDogJ215c3RhY2snLFxuICAgICAgICAgICAgcGF0aDogJ215c3RhY2snLFxuICAgICAgICAgICAgY2hpbGRyZW46IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgbXljZm5yZXNvdXJjZTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICAgIGlkOiAnbXljZm5yZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgcGF0aDogJ215c3RhY2svbXljZm5yZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICAgJ2F3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZSc6ICdDREs6OlVuaXRUZXN0OjpNeUNmblJlc291cmNlJyxcbiAgICAgICAgICAgICAgICAgICdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzJzoge1xuICAgICAgICAgICAgICAgICAgICBteXN0cmluZ3Byb3BrZXk6ICdteXN0cmluZ3Byb3B2YWwnLFxuICAgICAgICAgICAgICAgICAgICBteWxpc3Rwcm9wa2V5OiBbJ2xpc3RpdGVtMSddLFxuICAgICAgICAgICAgICAgICAgICBteXN0cnVjdHByb3BrZXk6IHtcbiAgICAgICAgICAgICAgICAgICAgICBteWJvb2xwcm9wa2V5OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgIG15bnVtcHJvcGtleTogNTAsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCd0cmVlIG1ldGFkYXRhIGhhcyBjb25zdHJ1Y3QgY2xhc3MgJiB2ZXJzaW9uIGluIHRoZXJlJywgKCkgPT4ge1xuICAgIC8vIFRoZSBydW50aW1lIG1ldGFkYXRhIHRoaXMgdGVzdCByZWxpZXMgb24gaXMgb25seSBhdmFpbGFibGUgaWYgdGhlIG1vc3RcbiAgICAvLyByZWNlbnQgY29tcGlsZSBoYXMgaGFwcGVuZWQgdXNpbmcgJ2pzaWknLCBhcyB0aGUganNpaSBjb21waWxlciBpbmplY3RzXG4gICAgLy8gdGhpcyBtZXRhZGF0YS5cbiAgICAvL1xuICAgIC8vIElmIHRoZSBtb3N0IHJlY2VudCBjb21waWxlIHdhcyB1c2luZyAndHNjJywgdGhlIG1ldGFkYXRhIHdpbGwgbm90IGhhdmVcbiAgICAvLyBiZWVuIGluamVjdGVkLCBhbmQgdGhlIHRlc3Qgd2lsbCBmYWlsLlxuICAgIC8vXG4gICAgLy8gUGVvcGxlIG1heSBjaG9vc2UgdG8gcnVuIGB0c2NgIGRpcmVjdGx5IChpbnN0ZWFkIG9mIGB5YXJuIGJ1aWxkYCBmb3JcbiAgICAvLyBleGFtcGxlKSB0byBlc2NhcGUgdGhlIGFkZGl0aW9uYWwgVFNDIGNvbXBpbGF0aW9uIHRpbWUgdGhhdCBpcyBuZWNlc3NhcnlcbiAgICAvLyB0byBydW4gJ2VzbGludCcsIG9yIHRoZSBhZGRpdGlvbmFsIHRpbWUgdGhhdCAnanNpaScgbmVlZHMgdG8gYW5hbHl6ZSB0aGVcbiAgICAvLyB0eXBlIHN5c3RlbSksIHRoaXMgdGVzdCBpcyBhbGxvd2VkIHRvIGZhaWwgaWYgd2UncmUgbm90IHJ1bm5pbmcgb24gQ0kuXG4gICAgLy9cbiAgICAvLyBJZiB0aGUgY29tcGlsZSBvZiB0aGlzIGxpYnJhcnkgaGFzIGJlZW4gZG9uZSB1c2luZyBgdHNjYCwgdGhlIHJ1bnRpbWVcbiAgICAvLyBpbmZvcm1hdGlvbiB3aWxsIGFsd2F5cyBmaW5kIGBjb25zdHJ1Y3RzLkNvbnN0cnVjdGAgYXMgdGhlIGNvbnN0cnVjdFxuICAgIC8vIGlkZW50aWZpZXIsIHNpbmNlIGBjb25zdHJ1Y3RzYCB3aWxsIGhhdmUgaGFkIGEgcmVsZWFzZSBidWlsZCBkb25lIHVzaW5nIGBqc2lpYC5cbiAgICAvL1xuICAgIC8vIElmIHRoaXMgdGVzdCBpcyBydW5uaW5nIG9uIENvZGVCdWlsZCwgd2Ugd2lsbCByZXF1aXJlIHRoYXQgdGhlIG1vcmUgc3BlY2lmaWNcbiAgICAvLyBjbGFzcyBuYW1lcyBhcmUgZm91bmQuIElmIHRoaXMgdGVzdCBpcyBOT1QgcnVubmluZyBvbiBDb2RlQnVpbGQsIHdlIHdpbGxcbiAgICAvLyBhbGxvdyB0aGUgc3BlY2lmaWMgY2xhc3MgbmFtZSAoZm9yIGEgJ2pzaWknIGJ1aWxkKSBvciB0aGUgZ2VuZXJpY1xuICAgIC8vICdjb25zdHJ1Y3RzLkNvbnN0cnVjdCcgY2xhc3MgbmFtZSAoZm9yIGEgJ3RzYycgYnVpbGQpLlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ215c3RhY2snKTtcbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdteWNvbnN0cnVjdCcsIHsgdHlwZTogJ0F3czo6U29tZTo6UmVzb3VyY2UnIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0cmVlQXJ0aWZhY3QgPSBhc3NlbWJseS50cmVlKCk7XG4gICAgZXhwZWN0KHRyZWVBcnRpZmFjdCkudG9CZURlZmluZWQoKTtcblxuICAgIGNvbnN0IGNvZGVCdWlsZCA9ICEhcHJvY2Vzcy5lbnYuQ09ERUJVSUxEX0JVSUxEX0lEO1xuXG4gICAgZXhwZWN0KHJlYWRKc29uKGFzc2VtYmx5LmRpcmVjdG9yeSwgdHJlZUFydGlmYWN0IS5maWxlKSkudG9FcXVhbCh7XG4gICAgICB2ZXJzaW9uOiAndHJlZS0wLjEnLFxuICAgICAgdHJlZTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICBjaGlsZHJlbjogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIG15c3RhY2s6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGNvbnN0cnVjdEluZm86IHtcbiAgICAgICAgICAgICAgZnFuOiBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoY29kZUJ1aWxkID8gL1xcYlN0YWNrJC8gOiAvXFxiU3RhY2skfF5jb25zdHJ1Y3RzLkNvbnN0cnVjdCQvKSxcbiAgICAgICAgICAgICAgdmVyc2lvbjogZXhwZWN0LmFueShTdHJpbmcpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgIG15Y29uc3RydWN0OiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgICAgY29uc3RydWN0SW5mbzoge1xuICAgICAgICAgICAgICAgICAgZnFuOiBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoY29kZUJ1aWxkID8gL1xcYkNmblJlc291cmNlJC8gOiAvXFxiQ2ZuUmVzb3VyY2UkfF5jb25zdHJ1Y3RzLkNvbnN0cnVjdCQvKSxcbiAgICAgICAgICAgICAgICAgIHZlcnNpb246IGV4cGVjdC5hbnkoU3RyaW5nKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgndG9rZW4gcmVzb2x1dGlvbiAmIGNmbiBwYXJhbWV0ZXInLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ215c3RhY2snKTtcbiAgICBjb25zdCBjZm5wYXJhbSA9IG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdteWNmbnBhcmFtJyk7XG5cbiAgICBjbGFzcyBNeUNmblJlc291cmNlIGV4dGVuZHMgQWJzdHJhY3RDZm5SZXNvdXJjZSB7XG4gICAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGF6eWtleTogTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnTGF6eVJlc29sdmVkIScgfSksXG4gICAgICAgICAgY2ZucGFyYW1rZXk6IGNmbnBhcmFtLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5ldyBNeUNmblJlc291cmNlKHN0YWNrLCAnbXljZm5yZXNvdXJjZScpO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0cmVlQXJ0aWZhY3QgPSBhc3NlbWJseS50cmVlKCk7XG4gICAgZXhwZWN0KHRyZWVBcnRpZmFjdCkudG9CZURlZmluZWQoKTtcblxuICAgIGV4cGVjdChyZWFkSnNvbihhc3NlbWJseS5kaXJlY3RvcnksIHRyZWVBcnRpZmFjdCEuZmlsZSkpLnRvRXF1YWwoe1xuICAgICAgdmVyc2lvbjogJ3RyZWUtMC4xJyxcbiAgICAgIHRyZWU6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgaWQ6ICdBcHAnLFxuICAgICAgICBwYXRoOiAnJyxcbiAgICAgICAgY2hpbGRyZW46IHtcbiAgICAgICAgICBUcmVlOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBpZDogJ1RyZWUnLFxuICAgICAgICAgICAgcGF0aDogJ1RyZWUnLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG15c3RhY2s6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGlkOiAnbXlzdGFjaycsXG4gICAgICAgICAgICBwYXRoOiAnbXlzdGFjaycsXG4gICAgICAgICAgICBjaGlsZHJlbjogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICBteWNmbnBhcmFtOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgICAgaWQ6ICdteWNmbnBhcmFtJyxcbiAgICAgICAgICAgICAgICBwYXRoOiAnbXlzdGFjay9teWNmbnBhcmFtJyxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIG15Y2ZucmVzb3VyY2U6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgICBpZDogJ215Y2ZucmVzb3VyY2UnLFxuICAgICAgICAgICAgICAgIHBhdGg6ICdteXN0YWNrL215Y2ZucmVzb3VyY2UnLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGUnOiAnQ0RLOjpVbml0VGVzdDo6TXlDZm5SZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAnYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wcyc6IHtcbiAgICAgICAgICAgICAgICAgICAgbGF6eWtleTogJ0xhenlSZXNvbHZlZCEnLFxuICAgICAgICAgICAgICAgICAgICBjZm5wYXJhbWtleTogeyBSZWY6ICdteWNmbnBhcmFtJyB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3Mtc3RhY2sgdG9rZW5zJywgKCkgPT4ge1xuICAgIGNsYXNzIE15Rmlyc3RSZXNvdXJjZSBleHRlbmRzIEFic3RyYWN0Q2ZuUmVzb3VyY2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGxhenlrZXk6IHN0cmluZztcblxuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgICAgICB0aGlzLmxhenlrZXkgPSBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdMYXp5UmVzb2x2ZWQhJyB9KTtcbiAgICAgIH1cblxuICAgICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxhenlrZXk6IHRoaXMubGF6eWtleSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBNeVNlY29uZFJlc291cmNlIGV4dGVuZHMgQWJzdHJhY3RDZm5SZXNvdXJjZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbXlwcm9wOiBzdHJpbmc7XG5cbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG15cHJvcDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgICAgIHRoaXMubXlwcm9wID0gbXlwcm9wO1xuICAgICAgfVxuXG4gICAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbXlwcm9wOiB0aGlzLm15cHJvcCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3QgZmlyc3RzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteWZpcnN0c3RhY2snKTtcbiAgICBjb25zdCBmaXJzdHJlcyA9IG5ldyBNeUZpcnN0UmVzb3VyY2UoZmlyc3RzdGFjaywgJ215Zmlyc3RyZXNvdXJjZScpO1xuICAgIGNvbnN0IHNlY29uZHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ215c2Vjb25kc3RhY2snKTtcbiAgICBuZXcgTXlTZWNvbmRSZXNvdXJjZShzZWNvbmRzdGFjaywgJ215c2Vjb25kcmVzb3VyY2UnLCBmaXJzdHJlcy5sYXp5a2V5KTtcblxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdHJlZUFydGlmYWN0ID0gYXNzZW1ibHkudHJlZSgpO1xuICAgIGV4cGVjdCh0cmVlQXJ0aWZhY3QpLnRvQmVEZWZpbmVkKCk7XG5cbiAgICBleHBlY3QocmVhZEpzb24oYXNzZW1ibHkuZGlyZWN0b3J5LCB0cmVlQXJ0aWZhY3QhLmZpbGUpKS50b0VxdWFsKHtcbiAgICAgIHZlcnNpb246ICd0cmVlLTAuMScsXG4gICAgICB0cmVlOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgIGlkOiAnQXBwJyxcbiAgICAgICAgcGF0aDogJycsXG4gICAgICAgIGNoaWxkcmVuOiB7XG4gICAgICAgICAgVHJlZTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgaWQ6ICdUcmVlJyxcbiAgICAgICAgICAgIHBhdGg6ICdUcmVlJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBteWZpcnN0c3RhY2s6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGlkOiAnbXlmaXJzdHN0YWNrJyxcbiAgICAgICAgICAgIHBhdGg6ICdteWZpcnN0c3RhY2snLFxuICAgICAgICAgICAgY2hpbGRyZW46IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgbXlmaXJzdHJlc291cmNlOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgICAgaWQ6ICdteWZpcnN0cmVzb3VyY2UnLFxuICAgICAgICAgICAgICAgIHBhdGg6ICdteWZpcnN0c3RhY2svbXlmaXJzdHJlc291cmNlJyxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAnYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlJzogJ0NESzo6VW5pdFRlc3Q6Ok15Q2ZuUmVzb3VyY2UnLFxuICAgICAgICAgICAgICAgICAgJ2F3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHMnOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhenlrZXk6ICdMYXp5UmVzb2x2ZWQhJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBteXNlY29uZHN0YWNrOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBpZDogJ215c2Vjb25kc3RhY2snLFxuICAgICAgICAgICAgcGF0aDogJ215c2Vjb25kc3RhY2snLFxuICAgICAgICAgICAgY2hpbGRyZW46IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgbXlzZWNvbmRyZXNvdXJjZTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICAgIGlkOiAnbXlzZWNvbmRyZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgcGF0aDogJ215c2Vjb25kc3RhY2svbXlzZWNvbmRyZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICAgJ2F3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZSc6ICdDREs6OlVuaXRUZXN0OjpNeUNmblJlc291cmNlJyxcbiAgICAgICAgICAgICAgICAgICdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzJzoge1xuICAgICAgICAgICAgICAgICAgICBteXByb3A6ICdMYXp5UmVzb2x2ZWQhJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0cmVlIG1ldGFkYXRhIGNhbiBiZSBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgdHJlZU1ldGFkYXRhOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteXN0YWNrJyk7XG4gICAgbmV3IENvbnN0cnVjdChzdGFjaywgJ215Y29uc3RydWN0Jyk7XG5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHRyZWVBcnRpZmFjdCA9IGFzc2VtYmx5LnRyZWUoKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodHJlZUFydGlmYWN0KS5ub3QudG9CZURlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbGluZyBub2RlcycsICgpID0+IHtcbiAgICBjbGFzcyBNeUNmblJlc291cmNlIGV4dGVuZHMgQ2ZuUmVzb3VyY2Uge1xuICAgICAgcHVibGljIGluc3BlY3QoXzogVHJlZUluc3BlY3Rvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvcmNpbmcgYW4gaW5zcGVjdCBlcnJvcicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteXN0YWNrJyk7XG4gICAgbmV3IE15Q2ZuUmVzb3VyY2Uoc3RhY2ssICdteWNmbnJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0NESzo6VW5pdFRlc3Q6Ok15Q2ZuUmVzb3VyY2UnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0cmVlQXJ0aWZhY3QgPSBhc3NlbWJseS50cmVlKCk7XG4gICAgZXhwZWN0KHRyZWVBcnRpZmFjdCkudG9CZURlZmluZWQoKTtcblxuICAgIGNvbnN0IHRyZWVub2RlID0gYXBwLm5vZGUuZmluZENoaWxkKCdUcmVlJyk7XG5cbiAgICBjb25zdCB3YXJuID0gdHJlZW5vZGUubm9kZS5tZXRhZGF0YS5maW5kKChtZCkgPT4ge1xuICAgICAgcmV0dXJuIG1kLnR5cGUgPT09IGN4c2NoZW1hLkFydGlmYWN0TWV0YWRhdGFFbnRyeVR5cGUuV0FSTlxuICAgICAgICAmJiAvRm9yY2luZyBhbiBpbnNwZWN0IGVycm9yLy50ZXN0KG1kLmRhdGEgYXMgc3RyaW5nKVxuICAgICAgICAmJiAvbXljZm5yZXNvdXJjZS8udGVzdChtZC5kYXRhIGFzIHN0cmluZyk7XG4gICAgfSk7XG4gICAgZXhwZWN0KHdhcm4pLnRvQmVEZWZpbmVkKCk7XG5cbiAgICAvLyBhc3NlcnQgdGhhdCB0aGUgcmVzdCBvZiB0aGUgY29uc3RydWN0IHRyZWUgaXMgcmVuZGVyZWRcbiAgICBleHBlY3QocmVhZEpzb24oYXNzZW1ibHkuZGlyZWN0b3J5LCB0cmVlQXJ0aWZhY3QhLmZpbGUpKS50b0VxdWFsKHtcbiAgICAgIHZlcnNpb246ICd0cmVlLTAuMScsXG4gICAgICB0cmVlOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgIGlkOiAnQXBwJyxcbiAgICAgICAgcGF0aDogJycsXG4gICAgICAgIGNoaWxkcmVuOiB7XG4gICAgICAgICAgVHJlZTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgaWQ6ICdUcmVlJyxcbiAgICAgICAgICAgIHBhdGg6ICdUcmVlJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBteXN0YWNrOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBpZDogJ215c3RhY2snLFxuICAgICAgICAgICAgcGF0aDogJ215c3RhY2snLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG5cblxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiByZWFkSnNvbihvdXRkaXI6IHN0cmluZywgZmlsZTogc3RyaW5nKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4ob3V0ZGlyLCBmaWxlKSwgJ3V0Zi04JykpO1xufVxuIl19