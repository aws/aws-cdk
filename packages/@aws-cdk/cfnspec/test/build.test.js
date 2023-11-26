"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const massage_spec_1 = require("../build-tools/massage-spec");
test('dropTypelessAttributes works correctly', () => {
    const spec = {
        Fingerprint: 'some-fingerprint',
        PropertyTypes: {
            'CDK::Test::Property': {
                Properties: {
                    Type: {
                        PrimitiveType: 'String',
                    }, // ts is being weird and doesn't correctly match the type
                },
            },
        },
        ResourceTypes: {
            'CDK::Test::Resource': {
                Attributes: {
                    Attribute1: {
                        PrimitiveType: 'String',
                    },
                    Attribute2: {},
                },
                Documentation: 'https://documentation-url/cdk/test/resource',
                Properties: {
                    ResourceArn: {
                        PrimitiveType: 'String',
                    }, // ts is being weird and doesn't correctly match the type
                },
            },
        },
    };
    (0, massage_spec_1.massageSpec)(spec);
    expect(spec).toEqual({
        Fingerprint: 'some-fingerprint',
        PropertyTypes: {
            'CDK::Test::Property': {
                Properties: {
                    Type: {
                        PrimitiveType: 'String',
                    }, // ts is being weird and doesn't correctly match the type
                },
            },
        },
        ResourceTypes: {
            'CDK::Test::Resource': {
                Attributes: {
                    Attribute1: ({
                        PrimitiveType: 'String',
                    }),
                },
                Documentation: 'https://documentation-url/cdk/test/resource',
                Properties: {
                    ResourceArn: {
                        PrimitiveType: 'String',
                    },
                },
            },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1aWxkLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4REFBMEQ7QUFHMUQsSUFBSSxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtJQUNsRCxNQUFNLElBQUksR0FBeUI7UUFDakMsV0FBVyxFQUFFLGtCQUFrQjtRQUMvQixhQUFhLEVBQUU7WUFDYixxQkFBcUIsRUFBRTtnQkFDckIsVUFBVSxFQUFFO29CQUNWLElBQUksRUFBRzt3QkFDTCxhQUFhLEVBQUUsUUFBUTtxQkFDRSxFQUFFLHlEQUF5RDtpQkFDdkY7YUFDRjtTQUNGO1FBQ0QsYUFBYSxFQUFFO1lBQ2IscUJBQXFCLEVBQUU7Z0JBQ3JCLFVBQVUsRUFBRTtvQkFDVixVQUFVLEVBQUc7d0JBQ1gsYUFBYSxFQUFFLFFBQVE7cUJBQ007b0JBQy9CLFVBQVUsRUFBRyxFQUFnQztpQkFDOUM7Z0JBQ0QsYUFBYSxFQUFFLDZDQUE2QztnQkFDNUQsVUFBVSxFQUFFO29CQUNWLFdBQVcsRUFBRzt3QkFDWixhQUFhLEVBQUUsUUFBUTtxQkFDSyxFQUFFLHlEQUF5RDtpQkFDMUY7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLElBQUEsMEJBQVcsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUVsQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ25CLFdBQVcsRUFBRSxrQkFBa0I7UUFDL0IsYUFBYSxFQUFFO1lBQ2IscUJBQXFCLEVBQUU7Z0JBQ3JCLFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUc7d0JBQ0wsYUFBYSxFQUFFLFFBQVE7cUJBQ0UsRUFBRSx5REFBeUQ7aUJBQ3ZGO2FBQ0Y7U0FDRjtRQUNELGFBQWEsRUFBRTtZQUNiLHFCQUFxQixFQUFFO2dCQUNyQixVQUFVLEVBQUU7b0JBQ1YsVUFBVSxFQUFFLENBQUM7d0JBQ1gsYUFBYSxFQUFFLFFBQVE7cUJBQ3hCLENBQUM7aUJBQ0g7Z0JBQ0QsYUFBYSxFQUFFLDZDQUE2QztnQkFDNUQsVUFBVSxFQUFFO29CQUNWLFdBQVcsRUFBRTt3QkFDWCxhQUFhLEVBQUUsUUFBUTtxQkFDeEI7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtYXNzYWdlU3BlYyB9IGZyb20gJy4uL2J1aWxkLXRvb2xzL21hc3NhZ2Utc3BlYyc7XG5pbXBvcnQgeyBzY2hlbWEgfSBmcm9tICcuLi9saWInO1xuXG50ZXN0KCdkcm9wVHlwZWxlc3NBdHRyaWJ1dGVzIHdvcmtzIGNvcnJlY3RseScsICgpID0+IHtcbiAgY29uc3Qgc3BlYzogc2NoZW1hLlNwZWNpZmljYXRpb24gPSB7XG4gICAgRmluZ2VycHJpbnQ6ICdzb21lLWZpbmdlcnByaW50JyxcbiAgICBQcm9wZXJ0eVR5cGVzOiB7XG4gICAgICAnQ0RLOjpUZXN0OjpQcm9wZXJ0eSc6IHtcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIFR5cGU6ICh7XG4gICAgICAgICAgICBQcmltaXRpdmVUeXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICB9IGFzIHNjaGVtYS5TY2FsYXJQcm9wZXJ0eSksIC8vIHRzIGlzIGJlaW5nIHdlaXJkIGFuZCBkb2Vzbid0IGNvcnJlY3RseSBtYXRjaCB0aGUgdHlwZVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIFJlc291cmNlVHlwZXM6IHtcbiAgICAgICdDREs6OlRlc3Q6OlJlc291cmNlJzoge1xuICAgICAgICBBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgQXR0cmlidXRlMTogKHtcbiAgICAgICAgICAgIFByaW1pdGl2ZVR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIH0gYXMgc2NoZW1hLlByaW1pdGl2ZUF0dHJpYnV0ZSksIC8vIHRzIGlzIGJlaW5nIHdlaXJkIGFuZCBkb2Vzbid0IGNvcnJlY3RseSBtYXRjaCB0aGUgdHlwZVxuICAgICAgICAgIEF0dHJpYnV0ZTI6ICh7fSBhcyBzY2hlbWEuUHJpbWl0aXZlQXR0cmlidXRlKSxcbiAgICAgICAgfSxcbiAgICAgICAgRG9jdW1lbnRhdGlvbjogJ2h0dHBzOi8vZG9jdW1lbnRhdGlvbi11cmwvY2RrL3Rlc3QvcmVzb3VyY2UnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgUmVzb3VyY2VBcm46ICh7XG4gICAgICAgICAgICBQcmltaXRpdmVUeXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICB9IGFzIHNjaGVtYS5QcmltaXRpdmVQcm9wZXJ0eSksIC8vIHRzIGlzIGJlaW5nIHdlaXJkIGFuZCBkb2Vzbid0IGNvcnJlY3RseSBtYXRjaCB0aGUgdHlwZVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuXG4gIG1hc3NhZ2VTcGVjKHNwZWMpO1xuXG4gIGV4cGVjdChzcGVjKS50b0VxdWFsKHtcbiAgICBGaW5nZXJwcmludDogJ3NvbWUtZmluZ2VycHJpbnQnLFxuICAgIFByb3BlcnR5VHlwZXM6IHtcbiAgICAgICdDREs6OlRlc3Q6OlByb3BlcnR5Jzoge1xuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgVHlwZTogKHtcbiAgICAgICAgICAgIFByaW1pdGl2ZVR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIH0gYXMgc2NoZW1hLlNjYWxhclByb3BlcnR5KSwgLy8gdHMgaXMgYmVpbmcgd2VpcmQgYW5kIGRvZXNuJ3QgY29ycmVjdGx5IG1hdGNoIHRoZSB0eXBlXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgUmVzb3VyY2VUeXBlczoge1xuICAgICAgJ0NESzo6VGVzdDo6UmVzb3VyY2UnOiB7XG4gICAgICAgIEF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBBdHRyaWJ1dGUxOiAoe1xuICAgICAgICAgICAgUHJpbWl0aXZlVHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICAgIERvY3VtZW50YXRpb246ICdodHRwczovL2RvY3VtZW50YXRpb24tdXJsL2Nkay90ZXN0L3Jlc291cmNlJyxcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIFJlc291cmNlQXJuOiB7XG4gICAgICAgICAgICBQcmltaXRpdmVUeXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuIl19