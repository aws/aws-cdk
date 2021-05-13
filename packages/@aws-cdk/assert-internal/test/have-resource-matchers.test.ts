import { InspectionFailure, stringIsNoLongerThan } from '../lib';

//(props: any, inspection: InspectionFailure) => boolean;
// export interface InspectionFailure {
//   resource: any;
//   failureReason: string;
// }

describe('stringIsNoLongerThan', function () {
  test('string is shorter than limit', () => {
    const matcher = stringIsNoLongerThan(10);

    const inspection: InspectionFailure = {
      resource: {},
      failureReason: '',
    };
    const result = matcher('abcdefghi', inspection);

    expect(result).toBe(true);
    expect(inspection.failureReason).toEqual('');
  });

  test('string is as long as the limit', () => {
    const matcher = stringIsNoLongerThan(10);

    const inspection: InspectionFailure = {
      resource: {},
      failureReason: '',
    };
    const result = matcher('abcdefghij', inspection);

    expect(result).toBe(true);
    expect(inspection.failureReason).toEqual('');
  });

  test('string is longer than the limit', () => {
    const matcher = stringIsNoLongerThan(10);

    const inspection: InspectionFailure = {
      resource: {},
      failureReason: '',
    };
    const result = matcher('abcdefghijk', inspection);

    expect(result).toBe(false);
    expect(inspection.failureReason).toEqual('String is 11 characters long. Expected at most 10 characters');
  });
});