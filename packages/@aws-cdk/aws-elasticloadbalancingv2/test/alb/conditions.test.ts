import '@aws-cdk/assert/jest';
import * as elbv2 from '../../lib';

describe('tests', () => {
  test('pathPatterns length should be less than or equal to 5', () => {

    //GIVEN
    const array1 = ['/u1', '/u2', '/u3', '/u4', '/u5'];
    const array2 = ['/u1', '/u2', '/u3', '/u4', '/u5', '/u6'];
    const listenerCondition = elbv2.ListenerCondition.pathPatterns(array1);

    // THEN
    expect(listenerCondition.renderRawCondition().pathPatternConfig.values).toEqual(array1);

    expect(() => {
      elbv2.ListenerCondition.pathPatterns(array2);
    }).toThrow(/A rule can only have '5' condition values/);

  });

});
