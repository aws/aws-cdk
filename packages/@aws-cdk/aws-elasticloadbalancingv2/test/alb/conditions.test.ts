import '@aws-cdk/assert/jest';
import * as elbv2 from '../../lib';

describe('tests', () => {

  test('pathPatterns length less than or equal to 5 will be ok', () => {
    //GIVEN
    const array1 = ['/u1', '/u2', '/u3', '/u4', '/u5'];
    const array2 = ['/u1', '/u2', '/u3', '/u4'];

    // WHEN
    const listenerCondition = elbv2.ListenerCondition.pathPatterns(array1);
    const listenerCondition2 = elbv2.ListenerCondition.pathPatterns(array2);

    // THEN
    expect(listenerCondition).toEqual({
      field: 'path-pattern',
      pathPatternConfig: {
        values: ['/u1', '/u2', '/u3', '/u4', '/u5'],
      },
    });
    expect(listenerCondition2).toEqual({
      field: 'path-pattern',
      pathPatternConfig: {
        values: ['/u1', '/u2', '/u3', '/u4'],
      },
    });

  });

  test('pathPatterns length greater than 5 will throw exception', () => {
    //GIVEN
    const array = ['/u1', '/u2', '/u3', '/u4', '/u5', '/u6'];

    // THEN
    expect(() => {
      elbv2.ListenerCondition.pathPatterns(array);
    }).toThrow(/A rule can only have '5' condition values/);
  });

});
