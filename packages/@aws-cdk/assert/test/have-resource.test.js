"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_artifact_1 = require("./cloud-artifact");
const index_1 = require("../lib/index");
test('support resource with no properties', () => {
    const synthStack = cloud_artifact_1.mkStack({
        Resources: {
            SomeResource: {
                Type: 'Some::Resource',
            },
        },
    });
    expect(() => index_1.expect(synthStack).to(index_1.haveResource('Some::Resource'))).not.toThrowError();
});
test('haveResource tells you about mismatched fields', () => {
    const synthStack = cloud_artifact_1.mkStack({
        Resources: {
            SomeResource: {
                Type: 'Some::Resource',
                Properties: {
                    PropA: 'somevalue',
                },
            },
        },
    });
    expect(() => {
        index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
            PropA: 'othervalue',
        }));
    }).toThrowError(/PropA/);
});
test('haveResource value matching is strict by default', () => {
    const synthStack = cloud_artifact_1.mkStack({
        Resources: {
            SomeResource: {
                Type: 'Some::Resource',
                Properties: {
                    PropA: {
                        foo: 'somevalue',
                        bar: 'This is unexpected, so the value of PropA doesn\'t strictly match - it shouldn\'t pass',
                    },
                    PropB: 'This property is unexpected, but it\'s allowed',
                },
            },
        },
    });
    expect(() => {
        index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
            PropA: {
                foo: 'somevalue',
            },
        }));
    }).toThrowError(/PropA/);
});
test('haveResource allows to opt in value extension', () => {
    const synthStack = cloud_artifact_1.mkStack({
        Resources: {
            SomeResource: {
                Type: 'Some::Resource',
                Properties: {
                    PropA: {
                        foo: 'somevalue',
                        bar: 'Additional value is permitted, as we opted in',
                    },
                    PropB: 'Additional properties is always okay!',
                },
            },
        },
    });
    expect(() => index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
        PropA: {
            foo: 'somevalue',
        },
    }, undefined, true))).not.toThrowError();
});
describe('property absence', () => {
    test('pass on absence', () => {
        const synthStack = cloud_artifact_1.mkResource({
            Prop: 'somevalue',
        });
        index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
            PropA: index_1.ABSENT,
        }));
    });
    test('fail on presence', () => {
        const synthStack = cloud_artifact_1.mkResource({
            PropA: 3,
        });
        expect(() => {
            index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
                PropA: index_1.ABSENT,
            }));
        }).toThrowError(/PropA/);
    });
    test('pass on deep absence', () => {
        const synthStack = cloud_artifact_1.mkResource({
            Deep: {
                Prop: 'somevalue',
            },
        });
        index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
            Deep: {
                Prop: 'somevalue',
                PropA: index_1.ABSENT,
            },
        }));
    });
    test('fail on deep presence', () => {
        const synthStack = cloud_artifact_1.mkResource({
            Deep: {
                Prop: 'somevalue',
            },
        });
        expect(() => {
            index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
                Deep: {
                    Prop: index_1.ABSENT,
                },
            }));
        }).toThrowError(/Prop/);
    });
    test('can use matcher to test for list element', () => {
        const synthStack = cloud_artifact_1.mkResource({
            List: [
                { Prop: 'distraction' },
                { Prop: 'goal' },
            ],
        });
        expect(() => {
            index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
                List: index_1.arrayWith({ Prop: 'goal' }),
            }));
        }).not.toThrowError();
        expect(() => {
            index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
                List: index_1.arrayWith({ Prop: 'missme' }),
            }));
        }).toThrowError(/Array did not contain expected element/);
    });
    test('can use matcher to test stringLike on single-line strings', () => {
        const synthStack = cloud_artifact_1.mkResource({
            Content: 'something required something',
        });
        expect(() => {
            index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
                Content: index_1.stringLike('*required*'),
            }));
        }).not.toThrowError();
    });
    test('can use matcher to test stringLike on multi-line strings', () => {
        const synthStack = cloud_artifact_1.mkResource({
            Content: 'something\nrequired\nsomething',
        });
        expect(() => {
            index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
                Content: index_1.stringLike('*required*'),
            }));
        }).not.toThrowError();
    });
    test('arrayContaining must match all elements in any order', () => {
        const synthStack = cloud_artifact_1.mkResource({
            List: ['a', 'b'],
        });
        expect(() => {
            index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
                List: index_1.arrayWith('b', 'a'),
            }));
        }).not.toThrowError();
        expect(() => {
            index_1.expect(synthStack).to(index_1.haveResource('Some::Resource', {
                List: index_1.arrayWith('a', 'c'),
            }));
        }).toThrowError(/Array did not contain expected element/);
    });
    test('exactValue escapes from deep fuzzy matching', () => {
        const synthStack = cloud_artifact_1.mkResource({
            Deep: {
                PropA: 'A',
                PropB: 'B',
            },
        });
        expect(() => {
            index_1.expect(synthStack).to(index_1.haveResourceLike('Some::Resource', {
                Deep: {
                    PropA: 'A',
                },
            }));
        }).not.toThrowError();
        expect(() => {
            index_1.expect(synthStack).to(index_1.haveResourceLike('Some::Resource', {
                Deep: index_1.exactValue({
                    PropA: 'A',
                }),
            }));
        }).toThrowError(/Unexpected keys present in object/);
    });
    /**
     * Backwards compatibility test
     *
     * If we had designed this with a matcher library from the start, we probably wouldn't
     * have had this behavior, but here we are.
     *
     * Historically, when we do `haveResourceLike` (which maps to `objectContainingDeep`) with
     * a pattern containing lists of objects, the objects inside the list are also matched
     * as 'containing' keys (instead of having to completely 'match' the pattern objects).
     *
     * People will have written assertions depending on this behavior, so we have to maintain
     * it.
     */
    test('objectContainingDeep has deep effect through lists', () => {
        const synthStack = cloud_artifact_1.mkResource({
            List: [
                {
                    PropA: 'A',
                    PropB: 'B',
                },
                {
                    PropA: 'A',
                    PropB: 'B',
                },
            ],
        });
        expect(() => {
            index_1.expect(synthStack).to(index_1.haveResourceLike('Some::Resource', {
                List: [
                    { PropA: 'A' },
                    { PropB: 'B' },
                ],
            }));
        }).not.toThrowError();
    });
    test('test capturing', () => {
        const synthStack = cloud_artifact_1.mkResource({
            Prop: 'somevalue',
        });
        const propValue = index_1.Capture.aString();
        index_1.expect(synthStack).to(index_1.haveResourceLike('Some::Resource', {
            Prop: propValue.capture(index_1.anything()),
        }));
        expect(propValue.capturedValue).toEqual('somevalue');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGF2ZS1yZXNvdXJjZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGF2ZS1yZXNvdXJjZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQXVEO0FBQ3ZELHdDQVVzQjtBQUV0QixJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO0lBQy9DLE1BQU0sVUFBVSxHQUFHLHdCQUFPLENBQUM7UUFDekIsU0FBUyxFQUFFO1lBQ1QsWUFBWSxFQUFFO2dCQUNaLElBQUksRUFBRSxnQkFBZ0I7YUFDdkI7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLG9CQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzVGLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtJQUMxRCxNQUFNLFVBQVUsR0FBRyx3QkFBTyxDQUFDO1FBQ3pCLFNBQVMsRUFBRTtZQUNULFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixVQUFVLEVBQUU7b0JBQ1YsS0FBSyxFQUFFLFdBQVc7aUJBQ25CO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDVixjQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLG9CQUFZLENBQUMsZ0JBQWdCLEVBQUU7WUFDdEQsS0FBSyxFQUFFLFlBQVk7U0FDcEIsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0IsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO0lBQzVELE1BQU0sVUFBVSxHQUFHLHdCQUFPLENB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c0NvbnRlbnQiOlsiaW1wb3J0IHsgbWtSZXNvdXJjZSwgbWtTdGFjayB9IGZyb20gJy4vY2xvdWQtYXJ0aWZhY3QnO1xuaW1wb3J0IHtcbiAgQUJTRU5ULFxuICBhcnJheVdpdGgsXG4gIGV4YWN0VmFsdWUsXG4gIGV4cGVjdCBhcyBjZGtFeHBlY3QsXG4gIGhhdmVSZXNvdXJjZSxcbiAgaGF2ZVJlc291cmNlTGlrZSxcbiAgQ2FwdHVyZSxcbiAgYW55dGhpbmcsXG4gIHN0cmluZ0xpa2UsXG59IGZyb20gJy4uL2xpYi9pbmRleCc7XG5cbnRlc3QoJ3N1cHBvcnQgcmVzb3VyY2Ugd2l0aCBubyBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICBjb25zdCBzeW50aFN0YWNrID0gbWtTdGFjayh7XG4gICAgUmVzb3VyY2VzOiB7XG4gICAgICBTb21lUmVzb3VyY2U6IHtcbiAgICAgICAgVHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG4gIGV4cGVjdCgoKSA9PiBjZGtFeHBlY3Qoc3ludGhTdGFjaykudG8oaGF2ZVJlc291cmNlKCdTb21lOjpSZXNvdXJjZScpKSkubm90LnRvVGhyb3dFcnJvcigpO1xufSk7XG5cbnRlc3QoJ2hhdmVSZXNvdXJjZSB0ZWxscyB5b3UgYWJvdXQgbWlzbWF0Y2hlZCBmaWVsZHMnLCAoKSA9PiB7XG4gIGNvbnN0IHN5bnRoU3RhY2sgPSBta1N0YWNrKHtcbiAgICBSZXNvdXJjZXM6IHtcbiAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICBUeXBlOiAnU29tZTo6UmVzb3VyY2UnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgUHJvcEE6ICdzb21ldmFsdWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcblxuICBleHBlY3QoKCkgPT4ge1xuICAgIGNka0V4cGVjdChzeW50aFN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ1NvbWU6OlJlc291cmNlJywge1xuICAgICAgUHJvcEE6ICdvdGhlcnZhbHVlJyxcbiAgICB9KSk7XG4gIH0pLnRvVGhyb3dFcnJvcigvUHJvcEEvKTtcbn0pO1xuXG50ZXN0KCdoYXZlUmVzb3VyY2UgdmFsdWUgbWF0Y2hpbmcgaXMgc3RyaWN0IGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gIGNvbnN0IHN5bnRoU3RhY2sgPSBta1N0YWNrKHtcbiAgICBSZXNvdXJjZXM6IHtcbiAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICBUeXBlOiAnU29tZTo6UmVzb3VyY2UnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgUHJvcEE6IHtcbiAgICAgICAgICAgIGZvbzogJ3NvbWV2YWx1ZScsXG4gICAgICAgICAgICBiYXI6ICdUaGlzIGlzIHVuZXhwZWN0ZWQsIHNvIHRoZSB2YWx1ZSBvZiBQcm9wQSBkb2VzblxcJ3Qgc3RyaWN0bHkgbWF0Y2ggLSBpdCBzaG91bGRuXFwndCBwYXNzJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFByb3BCOiAnVGhpcyBwcm9wZXJ0eSBpcyB1bmV4cGVjdGVkLCBidXQgaXRcXCdzIGFsbG93ZWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcblxuICBleHBlY3QoKCkgPT4ge1xuICAgIGNka0V4cGVjdChzeW50aFN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ1NvbWU6OlJlc291cmNlJywge1xuICAgICAgUHJvcEE6IHtcbiAgICAgICAgZm9vOiAnc29tZXZhbHVlJyxcbiAgICAgIH0sXG4gICAgfSkpO1xuICB9KS50b1Rocm93RXJyb3IoL1Byb3BBLyk7XG59KTtcblxudGVzdCgnaGF2ZVJlc291cmNlIGFsbG93cyB0byBvcHQgaW4gdmFsdWUgZXh0ZW5zaW9uJywgKCkgPT4ge1xuICBjb25zdCBzeW50aFN0YWNrID0gbWtTdGFjayh7XG4gICAgUmVzb3VyY2VzOiB7XG4gICAgICBTb21lUmVzb3VyY2U6IHtcbiAgICAgICAgVHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIFByb3BBOiB7XG4gICAgICAgICAgICBmb286ICdzb21ldmFsdWUnLFxuICAgICAgICAgICAgYmFyOiAnQWRkaXRpb25hbCB2YWx1ZSBpcyBwZXJtaXR0ZWQsIGFzIHdlIG9wdGVkIGluJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFByb3BCOiAnQWRkaXRpb25hbCBwcm9wZXJ0aWVzIGlzIGFsd2F5cyBva2F5IScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIGV4cGVjdCgoKSA9PlxuICAgIGNka0V4cGVjdChzeW50aFN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ1NvbWU6OlJlc291cmNlJywge1xuICAgICAgUHJvcEE6IHtcbiAgICAgICAgZm9vOiAnc29tZXZhbHVlJyxcbiAgICAgIH0sXG4gICAgfSwgdW5kZWZpbmVkLCB0cnVlKSksXG4gICkubm90LnRvVGhyb3dFcnJvcigpO1xufSk7XG5cbmRlc2NyaWJlKCdwcm9wZXJ0eSBhYnNlbmNlJywgKCkgPT4ge1xuICB0ZXN0KCdwYXNzIG9uIGFic2VuY2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3ludGhTdGFjayA9IG1rUmVzb3VyY2Uoe1xuICAgICAgUHJvcDogJ3NvbWV2YWx1ZScsXG4gICAgfSk7XG5cbiAgICBjZGtFeHBlY3Qoc3ludGhTdGFjaykudG8oaGF2ZVJlc291cmNlKCdTb21lOjpSZXNvdXJjZScsIHtcbiAgICAgIFByb3BBOiBBQlNFTlQsXG4gICAgfSkpO1xuICB9KTtcblxuICB0ZXN0KCdmYWlsIG9uIHByZXNlbmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN5bnRoU3RhY2sgPSBta1Jlc291cmNlKHtcbiAgICAgIFByb3BBOiAzLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNka0V4cGVjdChzeW50aFN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ1NvbWU6OlJlc291cmNlJywge1xuICAgICAgICBQcm9wQTogQUJTRU5ULFxuICAgICAgfSkpO1xuICAgIH0pLnRvVGhyb3dFcnJvcigvUHJvcEEvKTtcbiAgfSk7XG5cbiAgdGVzdCgncGFzcyBvbiBkZWVwIGFic2VuY2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3ludGhTdGFjayA9IG1rUmVzb3VyY2Uoe1xuICAgICAgRGVlcDoge1xuICAgICAgICBQcm9wOiAnc29tZXZhbHVlJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjZGtFeHBlY3Qoc3ludGhTdGFjaykudG8oaGF2ZVJlc291cmNlKCdTb21lOjpSZXNvdXJjZScsIHtcbiAgICAgIERlZXA6IHtcbiAgICAgICAgUHJvcDogJ3NvbWV2YWx1ZScsXG4gICAgICAgIFByb3BBOiBBQlNFTlQsXG4gICAgICB9LFxuICAgIH0pKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbCBvbiBkZWVwIHByZXNlbmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN5bnRoU3RhY2sgPSBta1Jlc291cmNlKHtcbiAgICAgIERlZXA6IHtcbiAgICAgICAgUHJvcDogJ3NvbWV2YWx1ZScsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNka0V4cGVjdChzeW50aFN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ1NvbWU6OlJlc291cmNlJywge1xuICAgICAgICBEZWVwOiB7XG4gICAgICAgICAgUHJvcDogQUJTRU5ULFxuICAgICAgICB9LFxuICAgICAgfSkpO1xuICAgIH0pLnRvVGhyb3dFcnJvcigvUHJvcC8pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gdXNlIG1hdGNoZXIgdG8gdGVzdCBmb3IgbGlzdCBlbGVtZW50JywgKCkgPT4ge1xuICAgIGNvbnN0IHN5bnRoU3RhY2sgPSBta1Jlc291cmNlKHtcbiAgICAgIExpc3Q6IFtcbiAgICAgICAgeyBQcm9wOiAnZGlzdHJhY3Rpb24nIH0sXG4gICAgICAgIHsgUHJvcDogJ2dvYWwnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNka0V4cGVjdChzeW50aFN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ1NvbWU6OlJlc291cmNlJywge1xuICAgICAgICBMaXN0OiBhcnJheVdpdGgoeyBQcm9wOiAnZ29hbCcgfSksXG4gICAgICB9KSk7XG4gICAgfSkubm90LnRvVGhyb3dFcnJvcigpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNka0V4cGVjdChzeW50aFN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ1NvbWU6OlJlc291cmNlJywge1xuICAgICAgICBMaXN0OiBhcnJheVdpdGgoeyBQcm9wOiAnbWlzc21lJyB9KSxcbiAgICAgIH0pKTtcbiAgICB9KS50b1Rocm93RXJyb3IoL0FycmF5IGRpZCBub3QgY29udGFpbiBleHBlY3RlZCBlbGVtZW50Lyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiB1c2UgbWF0Y2hlciB0byB0ZXN0IHN0cmluZ0xpa2Ugb24gc2luZ2xlLWxpbmUgc3RyaW5ncycsICgpID0+IHtcbiAgICBjb25zdCBzeW50aFN0YWNrID0gbWtSZXNvdXJjZSh7XG4gICAgICBDb250ZW50OiAnc29tZXRoaW5nIHJlcXVpcmVkIHNvbWV0aGluZycsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY2RrRXhwZWN0KHN5bnRoU3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnU29tZTo6UmVzb3VyY2UnLCB7XG4gICAgICAgIENvbnRlbnQ6IHN0cmluZ0xpa2UoJypyZXF1aXJlZConKSxcbiAgICAgIH0pKTtcbiAgICB9KS5ub3QudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiB1c2UgbWF0Y2hlciB0byB0ZXN0IHN0cmluZ0xpa2Ugb24gbXVsdGktbGluZSBzdHJpbmdzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN5bnRoU3RhY2sgPSBta1Jlc291cmNlKHtcbiAgICAgIENvbnRlbnQ6ICdzb21ldGhpbmdcXG5yZXF1aXJlZFxcbnNvbWV0aGluZycsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY2RrRXhwZWN0KHN5bnRoU3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnU29tZTo6UmVzb3VyY2UnLCB7XG4gICAgICAgIENvbnRlbnQ6IHN0cmluZ0xpa2UoJypyZXF1aXJlZConKSxcbiAgICAgIH0pKTtcbiAgICB9KS5ub3QudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FycmF5Q29udGFpbmluZyBtdXN0IG1hdGNoIGFsbCBlbGVtZW50cyBpbiBhbnkgb3JkZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3ludGhTdGFjayA9IG1rUmVzb3VyY2Uoe1xuICAgICAgTGlzdDogWydhJywgJ2InXSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjZGtFeHBlY3Qoc3ludGhTdGFjaykudG8oaGF2ZVJlc291cmNlKCdTb21lOjpSZXNvdXJjZScsIHtcbiAgICAgICAgTGlzdDogYXJyYXlXaXRoKCdiJywgJ2EnKSxcbiAgICAgIH0pKTtcbiAgICB9KS5ub3QudG9UaHJvd0Vycm9yKCk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY2RrRXhwZWN0KHN5bnRoU3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnU29tZTo6UmVzb3VyY2UnLCB7XG4gICAgICAgIExpc3Q6IGFycmF5V2l0aCgnYScsICdjJyksXG4gICAgICB9KSk7XG4gICAgfSkudG9UaHJvd0Vycm9yKC9BcnJheSBkaWQgbm90IGNvbnRhaW4gZXhwZWN0ZWQgZWxlbWVudC8pO1xuICB9KTtcblxuICB0ZXN0KCdleGFjdFZhbHVlIGVzY2FwZXMgZnJvbSBkZWVwIGZ1enp5IG1hdGNoaW5nJywgKCkgPT4ge1xuICAgIGNvbnN0IHN5bnRoU3RhY2sgPSBta1Jlc291cmNlKHtcbiAgICAgIERlZXA6IHtcbiAgICAgICAgUHJvcEE6ICdBJyxcbiAgICAgICAgUHJvcEI6ICdCJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY2RrRXhwZWN0KHN5bnRoU3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ1NvbWU6OlJlc291cmNlJywge1xuICAgICAgICBEZWVwOiB7XG4gICAgICAgICAgUHJvcEE6ICdBJyxcbiAgICAgICAgfSxcbiAgICAgIH0pKTtcbiAgICB9KS5ub3QudG9UaHJvd0Vycm9yKCk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY2RrRXhwZWN0KHN5bnRoU3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ1NvbWU6OlJlc291cmNlJywge1xuICAgICAgICBEZWVwOiBleGFjdFZhbHVlKHtcbiAgICAgICAgICBQcm9wQTogJ0EnLFxuICAgICAgICB9KSxcbiAgICAgIH0pKTtcbiAgICB9KS50b1Rocm93RXJyb3IoL1VuZXhwZWN0ZWQga2V5cyBwcmVzZW50IGluIG9iamVjdC8pO1xuICB9KTtcblxuICAvKipcbiAgICogQmFja3dhcmRzIGNvbXBhdGliaWxpdHkgdGVzdFxuICAgKlxuICAgKiBJZiB3ZSBoYWQgZGVzaWduZWQgdGhpcyB3aXRoIGEgbWF0Y2hlciBsaWJyYXJ5IGZyb20gdGhlIHN0YXJ0LCB3ZSBwcm9iYWJseSB3b3VsZG4ndFxuICAgKiBoYXZlIGhhZCB0aGlzIGJlaGF2aW9yLCBidXQgaGVyZSB3ZSBhcmUuXG4gICAqXG4gICAqIEhpc3RvcmljYWxseSwgd2hlbiB3ZSBkbyBgaGF2ZVJlc291cmNlTGlrZWAgKHdoaWNoIG1hcHMgdG8gYG9iamVjdENvbnRhaW5pbmdEZWVwYCkgd2l0aFxuICAgKiBhIHBhdHRlcm4gY29udGFpbmluZyBsaXN0cyBvZiBvYmplY3RzLCB0aGUgb2JqZWN0cyBpbnNpZGUgdGhlIGxpc3QgYXJlIGFsc28gbWF0Y2hlZFxuICAgKiBhcyAnY29udGFpbmluZycga2V5cyAoaW5zdGVhZCBvZiBoYXZpbmcgdG8gY29tcGxldGVseSAnbWF0Y2gnIHRoZSBwYXR0ZXJuIG9iamVjdHMpLlxuICAgKlxuICAgKiBQZW9wbGUgd2lsbCBoYXZlIHdyaXR0ZW4gYXNzZXJ0aW9ucyBkZXBlbmRpbmcgb24gdGhpcyBiZWhhdmlvciwgc28gd2UgaGF2ZSB0byBtYWludGFpblxuICAgKiBpdC5cbiAgICovXG4gIHRlc3QoJ29iamVjdENvbnRhaW5pbmdEZWVwIGhhcyBkZWVwIGVmZmVjdCB0aHJvdWdoIGxpc3RzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN5bnRoU3RhY2sgPSBta1Jlc291cmNlKHtcbiAgICAgIExpc3Q6IFtcbiAgICAgICAge1xuICAgICAgICAgIFByb3BBOiAnQScsXG4gICAgICAgICAgUHJvcEI6ICdCJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFByb3BBOiAnQScsXG4gICAgICAgICAgUHJvcEI6ICdCJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY2RrRXhwZWN0KHN5bnRoU3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ1NvbWU6OlJlc291cmNlJywge1xuICAgICAgICBMaXN0OiBbXG4gICAgICAgICAgeyBQcm9wQTogJ0EnIH0sXG4gICAgICAgICAgeyBQcm9wQjogJ0InIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSk7XG4gICAgfSkubm90LnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICB0ZXN0KCd0ZXN0IGNhcHR1cmluZycsICgpID0+IHtcbiAgICBjb25zdCBzeW50aFN0YWNrID0gbWtSZXNvdXJjZSh7XG4gICAgICBQcm9wOiAnc29tZXZhbHVlJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BWYWx1ZSA9IENhcHR1cmUuYVN0cmluZygpO1xuICAgIGNka0V4cGVjdChzeW50aFN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdTb21lOjpSZXNvdXJjZScsIHtcbiAgICAgIFByb3A6IHByb3BWYWx1ZS5jYXB0dXJlKGFueXRoaW5nKCkpLFxuICAgIH0pKTtcblxuICAgIGV4cGVjdChwcm9wVmFsdWUuY2FwdHVyZWRWYWx1ZSkudG9FcXVhbCgnc29tZXZhbHVlJyk7XG4gIH0pO1xufSk7XG4iXX0=