import * as autoscaling from '../lib';

test('test utc cron, hour only', () => {
  expect(autoscaling.Schedule.cron({ hour: '18', minute: '0' }).expressionString).toEqual('0 18 * * *');
});

test('test utc cron, hour and minute', () => {
  expect(autoscaling.Schedule.cron({ hour: '18', minute: '24' }).expressionString).toEqual('24 18 * * *');
});
