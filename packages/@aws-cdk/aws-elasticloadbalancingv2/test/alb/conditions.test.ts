import '@aws-cdk/assert/jest';
import * as elbv2 from '../../lib';

describe('tests', () => {
  test('pathPatterns length should be less than or equal to 5', () => {

    //GIVEN
    const array = ['/u1', '/u2', '/u3', '/u4', '/u5', '/u6'];

    // THEN
    expect(() => {
      elbv2.ListenerCondition.pathPatterns(array);
    }).toThrow(/A rule can only have '5' condition values/);

  });

});