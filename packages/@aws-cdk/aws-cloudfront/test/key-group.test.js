"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const publicKey1 = `-----BEGIN PUBLIC KEY-----
FIRST_KEYgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAudf8/iNkQgdvjEdm6xYS
JAyxd/kGTbJfQNg9YhInb7TSm0dGu0yx8yZ3fnpmxuRPqJIlaVr+fT4YRl71gEYa
dlhHmnVegyPNjP9dNqZ7zwNqMEPOPnS/NOHbJj1KYKpn1f8pPNycQ5MQCntKGnSj
6fc+nbcC0joDvGz80xuy1W4hLV9oC9c3GT26xfZb2jy9MVtA3cppNuTwqrFi3t6e
0iGpraxZlT5wewjZLpQkngqYr6s3aucPAZVsGTEYPo4nD5mswmtZOm+tgcOrivtD
/3sD/qZLQ6c5siqyS8aTraD6y+VXugujfarTU65IeZ6QAUbLMsWuZOIi5Jn8zAwx
NQIDAQAB
-----END PUBLIC KEY-----`;
const publicKey2 = `-----BEGIN PUBLIC KEY-----
SECOND_KEYkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAudf8/iNkQgdvjEdm6xYS
JAyxd/kGTbJfQNg9YhInb7TSm0dGu0yx8yZ3fnpmxuRPqJIlaVr+fT4YRl71gEYa
dlhHmnVegyPNjP9dNqZ7zwNqMEPOPnS/NOHbJj1KYKpn1f8pPNycQ5MQCntKGnSj
6fc+nbcC0joDvGz80xuy1W4hLV9oC9c3GT26xfZb2jy9MVtA3cppNuTwqrFi3t6e
0iGpraxZlT5wewjZLpQkngqYr6s3aucPAZVsGTEYPo4nD5mswmtZOm+tgcOrivtD
/3sD/qZLQ6c5siqyS8aTraD6y+VXugujfarTU65IeZ6QAUbLMsWuZOIi5Jn8zAwx
NQIDAQAB
-----END PUBLIC KEY-----`;
describe('KeyGroup', () => {
    let app;
    let stack;
    beforeEach(() => {
        app = new core_1.App();
        stack = new core_1.Stack(app, 'Stack', {
            env: { account: '123456789012', region: 'testregion' },
        });
    });
    test('import existing key group by id', () => {
        const keyGroupId = '344f6fe5-7ce5-4df0-a470-3f14177c549c';
        const keyGroup = lib_1.KeyGroup.fromKeyGroupId(stack, 'MyKeyGroup', keyGroupId);
        expect(keyGroup.keyGroupId).toEqual(keyGroupId);
    });
    test('minimal example', () => {
        new lib_1.KeyGroup(stack, 'MyKeyGroup', {
            items: [
                new lib_1.PublicKey(stack, 'MyPublicKey', {
                    encodedKey: publicKey1,
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyPublicKey78071F3D: {
                    Type: 'AWS::CloudFront::PublicKey',
                    Properties: {
                        PublicKeyConfig: {
                            CallerReference: 'c872d91ae0d2943aad25d4b31f1304d0a62c658ace',
                            EncodedKey: publicKey1,
                            Name: 'StackMyPublicKey36EDA6AB',
                        },
                    },
                },
                MyKeyGroupAF22FD35: {
                    Type: 'AWS::CloudFront::KeyGroup',
                    Properties: {
                        KeyGroupConfig: {
                            Items: [
                                {
                                    Ref: 'MyPublicKey78071F3D',
                                },
                            ],
                            Name: 'StackMyKeyGroupC9D82374',
                        },
                    },
                },
            },
        });
    });
    test('maximum example', () => {
        new lib_1.KeyGroup(stack, 'MyKeyGroup', {
            keyGroupName: 'AcmeKeyGroup',
            comment: 'Key group created on 1/1/1984',
            items: [
                new lib_1.PublicKey(stack, 'MyPublicKey', {
                    publicKeyName: 'pub-key',
                    encodedKey: publicKey1,
                    comment: 'Key expiring on 1/1/1984',
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyPublicKey78071F3D: {
                    Type: 'AWS::CloudFront::PublicKey',
                    Properties: {
                        PublicKeyConfig: {
                            CallerReference: 'c872d91ae0d2943aad25d4b31f1304d0a62c658ace',
                            EncodedKey: publicKey1,
                            Name: 'pub-key',
                            Comment: 'Key expiring on 1/1/1984',
                        },
                    },
                },
                MyKeyGroupAF22FD35: {
                    Type: 'AWS::CloudFront::KeyGroup',
                    Properties: {
                        KeyGroupConfig: {
                            Items: [
                                {
                                    Ref: 'MyPublicKey78071F3D',
                                },
                            ],
                            Name: 'AcmeKeyGroup',
                            Comment: 'Key group created on 1/1/1984',
                        },
                    },
                },
            },
        });
    });
    test('multiple keys example', () => {
        new lib_1.KeyGroup(stack, 'MyKeyGroup', {
            keyGroupName: 'AcmeKeyGroup',
            comment: 'Key group created on 1/1/1984',
            items: [
                new lib_1.PublicKey(stack, 'BingoKey', {
                    publicKeyName: 'Bingo-Key',
                    encodedKey: publicKey1,
                    comment: 'Key expiring on 1/1/1984',
                }),
                new lib_1.PublicKey(stack, 'RollyKey', {
                    publicKeyName: 'Rolly-Key',
                    encodedKey: publicKey2,
                    comment: 'Key expiring on 1/1/1984',
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                BingoKeyCBEC786C: {
                    Type: 'AWS::CloudFront::PublicKey',
                    Properties: {
                        PublicKeyConfig: {
                            CallerReference: 'c847cb3dc23f619c0a1e400a44afaf1060d27a1d1a',
                            EncodedKey: publicKey1,
                            Name: 'Bingo-Key',
                            Comment: 'Key expiring on 1/1/1984',
                        },
                    },
                },
                RollyKey83F8BC5B: {
                    Type: 'AWS::CloudFront::PublicKey',
                    Properties: {
                        PublicKeyConfig: {
                            CallerReference: 'c83a16945c386bf6cd88a3aaa1aa603eeb4b6c6c57',
                            EncodedKey: publicKey2,
                            Name: 'Rolly-Key',
                            Comment: 'Key expiring on 1/1/1984',
                        },
                    },
                },
                MyKeyGroupAF22FD35: {
                    Type: 'AWS::CloudFront::KeyGroup',
                    Properties: {
                        KeyGroupConfig: {
                            Items: [
                                {
                                    Ref: 'BingoKeyCBEC786C',
                                },
                                {
                                    Ref: 'RollyKey83F8BC5B',
                                },
                            ],
                            Name: 'AcmeKeyGroup',
                            Comment: 'Key group created on 1/1/1984',
                        },
                    },
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LWdyb3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJrZXktZ3JvdXAudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBMkM7QUFDM0MsZ0NBQTZDO0FBRTdDLE1BQU0sVUFBVSxHQUFHOzs7Ozs7Ozt5QkFRTSxDQUFDO0FBRTFCLE1BQU0sVUFBVSxHQUFHOzs7Ozs7Ozt5QkFRTSxDQUFDO0FBRTFCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLElBQUksR0FBUSxDQUFDO0lBQ2IsSUFBSSxLQUFZLENBQUM7SUFFakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO1FBQ2hCLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO1lBQzlCLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRTtTQUN2RCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7UUFDM0MsTUFBTSxVQUFVLEdBQUcsc0NBQXNDLENBQUM7UUFDMUQsTUFBTSxRQUFRLEdBQUcsY0FBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtRQUMzQixJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQ2hDLEtBQUssRUFBRTtnQkFDTCxJQUFJLGVBQVMsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO29CQUNsQyxVQUFVLEVBQUUs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ZSxFQUFFLDRDQUE0Qzs0QkFDN0QsVUFBVSxFQUFFLFVBQVU7NEJBQ3RCLElBQUksRUFBRSxXQUFXOzRCQUNqQixPQUFPLEVBQUUsMEJBQTBCO3lCQUNwQztxQkFDRjtpQkFDRjtnQkFDRCxnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLDRCQUE0QjtvQkFDbEMsVUFBVSxFQUFFO3dCQUNWLGVBQWUsRUFBRTs0QkFDZixlQUFlLEVBQUUsNENBQTRDOzRCQUM3RCxVQUFVLEVBQUUsVUFBVTs0QkFDdEIsSUFBSSxFQUFFLFdBQVc7NEJBQ2pCLE9BQU8sRUFBRSwwQkFBMEI7eUJBQ3BDO3FCQUNGO2lCQUNGO2dCQUNELGtCQUFrQixFQUFFO29CQUNsQixJQUFJLEVBQUUsMkJBQTJCO29CQUNqQyxVQUFVLEVBQUU7d0JBQ1YsY0FBYyxFQUFFOzRCQUNkLEtBQUssRUFBRTtnQ0FDTDtvQ0FDRSxHQUFHLEVBQUUsa0JBQWtCO2lDQUN4QjtnQ0FDRDtvQ0FDRSxHQUFHLEVBQUUsa0JBQWtCO2lDQUN4Qjs2QkFDRjs0QkFDRCxJQUFJLEVBQUUsY0FBYzs0QkFDcEIsT0FBTyxFQUFFLCtCQUErQjt5QkFDekM7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgS2V5R3JvdXAsIFB1YmxpY0tleSB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IHB1YmxpY0tleTEgPSBgLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbkZJUlNUX0tFWWdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdWRmOC9pTmtRZ2R2akVkbTZ4WVNcbkpBeXhkL2tHVGJKZlFOZzlZaEluYjdUU20wZEd1MHl4OHlaM2ZucG14dVJQcUpJbGFWcitmVDRZUmw3MWdFWWFcbmRsaEhtblZlZ3lQTmpQOWROcVo3endOcU1FUE9QblMvTk9IYkpqMUtZS3BuMWY4cFBOeWNRNU1RQ250S0duU2pcbjZmYytuYmNDMGpvRHZHejgweHV5MVc0aExWOW9DOWMzR1QyNnhmWmIyank5TVZ0QTNjcHBOdVR3cXJGaTN0NmVcbjBpR3ByYXhabFQ1d2V3alpMcFFrbmdxWXI2czNhdWNQQVpWc0dURVlQbzRuRDVtc3dtdFpPbSt0Z2NPcml2dERcbi8zc0QvcVpMUTZjNXNpcXlTOGFUcmFENnkrVlh1Z3VqZmFyVFU2NUllWjZRQVViTE1zV3VaT0lpNUpuOHpBd3hcbk5RSURBUUFCXG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS1gO1xuXG5jb25zdCBwdWJsaWNLZXkyID0gYC0tLS0tQkVHSU4gUFVCTElDIEtFWS0tLS0tXG5TRUNPTkRfS0VZa3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQXVkZjgvaU5rUWdkdmpFZG02eFlTXG5KQXl4ZC9rR1RiSmZRTmc5WWhJbmI3VFNtMGRHdTB5eDh5WjNmbnBteHVSUHFKSWxhVnIrZlQ0WVJsNzFnRVlhXG5kbGhIbW5WZWd5UE5qUDlkTnFaN3p3TnFNRVBPUG5TL05PSGJKajFLWUtwbjFmOHBQTnljUTVNUUNudEtHblNqXG42ZmMrbmJjQzBqb0R2R3o4MHh1eTFXNGhMVjlvQzljM0dUMjZ4ZlpiMmp5OU1WdEEzY3BwTnVUd3FyRmkzdDZlXG4waUdwcmF4WmxUNXdld2paTHBRa25ncVlyNnMzYXVjUEFaVnNHVEVZUG80bkQ1bXN3bXRaT20rdGdjT3JpdnREXG4vM3NEL3FaTFE2YzVzaXF5UzhhVHJhRDZ5K1ZYdWd1amZhclRVNjVJZVo2UUFVYkxNc1d1Wk9JaTVKbjh6QXd4XG5OUUlEQVFBQlxuLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tYDtcblxuZGVzY3JpYmUoJ0tleUdyb3VwJywgKCkgPT4ge1xuICBsZXQgYXBwOiBBcHA7XG4gIGxldCBzdGFjazogU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwID0gbmV3IEFwcCgpO1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywge1xuICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd0ZXN0cmVnaW9uJyB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnQgZXhpc3Rpbmcga2V5IGdyb3VwIGJ5IGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IGtleUdyb3VwSWQgPSAnMzQ0ZjZmZTUtN2NlNS00ZGYwLWE0NzAtM2YxNDE3N2M1NDljJztcbiAgICBjb25zdCBrZXlHcm91cCA9IEtleUdyb3VwLmZyb21LZXlHcm91cElkKHN0YWNrLCAnTXlLZXlHcm91cCcsIGtleUdyb3VwSWQpO1xuICAgIGV4cGVjdChrZXlHcm91cC5rZXlHcm91cElkKS50b0VxdWFsKGtleUdyb3VwSWQpO1xuICB9KTtcblxuICB0ZXN0KCdtaW5pbWFsIGV4YW1wbGUnLCAoKSA9PiB7XG4gICAgbmV3IEtleUdyb3VwKHN0YWNrLCAnTXlLZXlHcm91cCcsIHtcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIG5ldyBQdWJsaWNLZXkoc3RhY2ssICdNeVB1YmxpY0tleScsIHtcbiAgICAgICAgICBlbmNvZGVkS2V5OiBwdWJsaWNLZXkxLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlQdWJsaWNLZXk3ODA3MUYzRDoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkNsb3VkRnJvbnQ6OlB1YmxpY0tleScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUHVibGljS2V5Q29uZmlnOiB7XG4gICAgICAgICAgICAgIENhbGxlclJlZmVyZW5jZTogJ2M4NzJkOTFhZTBkMjk0M2FhZDI1ZDRiMzFmMTMwNGQwYTYyYzY1OGFjZScsXG4gICAgICAgICAgICAgIEVuY29kZWRLZXk6IHB1YmxpY0tleTEsXG4gICAgICAgICAgICAgIE5hbWU6ICdTdGFja015UHVibGljS2V5MzZFREE2QUInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBNeUtleUdyb3VwQUYyMkZEMzU6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpDbG91ZEZyb250OjpLZXlHcm91cCcsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgS2V5R3JvdXBDb25maWc6IHtcbiAgICAgICAgICAgICAgSXRlbXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdNeVB1YmxpY0tleTc4MDcxRjNEJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBOYW1lOiAnU3RhY2tNeUtleUdyb3VwQzlEODIzNzQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbWF4aW11bSBleGFtcGxlJywgKCkgPT4ge1xuICAgIG5ldyBLZXlHcm91cChzdGFjaywgJ015S2V5R3JvdXAnLCB7XG4gICAgICBrZXlHcm91cE5hbWU6ICdBY21lS2V5R3JvdXAnLFxuICAgICAgY29tbWVudDogJ0tleSBncm91cCBjcmVhdGVkIG9uIDEvMS8xOTg0JyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIG5ldyBQdWJsaWNLZXkoc3RhY2ssICdNeVB1YmxpY0tleScsIHtcbiAgICAgICAgICBwdWJsaWNLZXlOYW1lOiAncHViLWtleScsXG4gICAgICAgICAgZW5jb2RlZEtleTogcHVibGljS2V5MSxcbiAgICAgICAgICBjb21tZW50OiAnS2V5IGV4cGlyaW5nIG9uIDEvMS8xOTg0JyxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15UHVibGljS2V5NzgwNzFGM0Q6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpDbG91ZEZyb250OjpQdWJsaWNLZXknLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFB1YmxpY0tleUNvbmZpZzoge1xuICAgICAgICAgICAgICBDYWxsZXJSZWZlcmVuY2U6ICdjODcyZDkxYWUwZDI5NDNhYWQyNWQ0YjMxZjEzMDRkMGE2MmM2NThhY2UnLFxuICAgICAgICAgICAgICBFbmNvZGVkS2V5OiBwdWJsaWNLZXkxLFxuICAgICAgICAgICAgICBOYW1lOiAncHViLWtleScsXG4gICAgICAgICAgICAgIENvbW1lbnQ6ICdLZXkgZXhwaXJpbmcgb24gMS8xLzE5ODQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBNeUtleUdyb3VwQUYyMkZEMzU6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpDbG91ZEZyb250OjpLZXlHcm91cCcsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgS2V5R3JvdXBDb25maWc6IHtcbiAgICAgICAgICAgICAgSXRlbXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdNeVB1YmxpY0tleTc4MDcxRjNEJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBOYW1lOiAnQWNtZUtleUdyb3VwJyxcbiAgICAgICAgICAgICAgQ29tbWVudDogJ0tleSBncm91cCBjcmVhdGVkIG9uIDEvMS8xOTg0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ211bHRpcGxlIGtleXMgZXhhbXBsZScsICgpID0+IHtcbiAgICBuZXcgS2V5R3JvdXAoc3RhY2ssICdNeUtleUdyb3VwJywge1xuICAgICAga2V5R3JvdXBOYW1lOiAnQWNtZUtleUdyb3VwJyxcbiAgICAgIGNvbW1lbnQ6ICdLZXkgZ3JvdXAgY3JlYXRlZCBvbiAxLzEvMTk4NCcsXG4gICAgICBpdGVtczogW1xuICAgICAgICBuZXcgUHVibGljS2V5KHN0YWNrLCAnQmluZ29LZXknLCB7XG4gICAgICAgICAgcHVibGljS2V5TmFtZTogJ0JpbmdvLUtleScsXG4gICAgICAgICAgZW5jb2RlZEtleTogcHVibGljS2V5MSxcbiAgICAgICAgICBjb21tZW50OiAnS2V5IGV4cGlyaW5nIG9uIDEvMS8xOTg0JyxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBQdWJsaWNLZXkoc3RhY2ssICdSb2xseUtleScsIHtcbiAgICAgICAgICBwdWJsaWNLZXlOYW1lOiAnUm9sbHktS2V5JyxcbiAgICAgICAgICBlbmNvZGVkS2V5OiBwdWJsaWNLZXkyLFxuICAgICAgICAgIGNvbW1lbnQ6ICdLZXkgZXhwaXJpbmcgb24gMS8xLzE5ODQnLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgQmluZ29LZXlDQkVDNzg2Qzoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkNsb3VkRnJvbnQ6OlB1YmxpY0tleScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUHVibGljS2V5Q29uZmlnOiB7XG4gICAgICAgICAgICAgIENhbGxlclJlZmVyZW5jZTogJ2M4NDdjYjNkYzIzZjYxOWMwYTFlNDAwYTQ0YWZhZjEwNjBkMjdhMWQxYScsXG4gICAgICAgICAgICAgIEVuY29kZWRLZXk6IHB1YmxpY0tleTEsXG4gICAgICAgICAgICAgIE5hbWU6ICdCaW5nby1LZXknLFxuICAgICAgICAgICAgICBDb21tZW50OiAnS2V5IGV4cGlyaW5nIG9uIDEvMS8xOTg0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgUm9sbHlLZXk4M0Y4QkM1Qjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkNsb3VkRnJvbnQ6OlB1YmxpY0tleScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUHVibGljS2V5Q29uZmlnOiB7XG4gICAgICAgICAgICAgIENhbGxlclJlZmVyZW5jZTogJ2M4M2ExNjk0NWMzODZiZjZjZDg4YTNhYWExYWE2MDNlZWI0YjZjNmM1NycsXG4gICAgICAgICAgICAgIEVuY29kZWRLZXk6IHB1YmxpY0tleTIsXG4gICAgICAgICAgICAgIE5hbWU6ICdSb2xseS1LZXknLFxuICAgICAgICAgICAgICBDb21tZW50OiAnS2V5IGV4cGlyaW5nIG9uIDEvMS8xOTg0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgTXlLZXlHcm91cEFGMjJGRDM1OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6Q2xvdWRGcm9udDo6S2V5R3JvdXAnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIEtleUdyb3VwQ29uZmlnOiB7XG4gICAgICAgICAgICAgIEl0ZW1zOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQmluZ29LZXlDQkVDNzg2QycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdSb2xseUtleTgzRjhCQzVCJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBOYW1lOiAnQWNtZUtleUdyb3VwJyxcbiAgICAgICAgICAgICAgQ29tbWVudDogJ0tleSBncm91cCBjcmVhdGVkIG9uIDEvMS8xOTg0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=