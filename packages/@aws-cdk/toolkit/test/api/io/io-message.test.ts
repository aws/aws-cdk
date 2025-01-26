import { isMessageRelevantForLevel } from '../../../lib/api/io/io-message';

describe('IoMessageLevel', () => {
  test.each`
		msgLevel   | logLevel   | isRelevant
		${'error'} | ${'trace'} | ${true}
		${'info'}  | ${'trace'} | ${true}
		${'info'}  | ${'warn'}  | ${false}
		${'trace'} | ${'error'} | ${false}
	`('with msgLevel=$msgLevel and logLevel=$msgLevel, logging should be $shouldLog', async ({ msgLevel, logLevel, isRelevant }) => {
    expect(isMessageRelevantForLevel({ level: msgLevel }, logLevel)).toBe(isRelevant);
  });
});
