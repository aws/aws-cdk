import { FilterPattern } from '../lib';

describe('FilterPattern', () => {
  describe('fromJson', () => {
    it('should stringify pattern', () => {
      // GIVEN
      const filter = {
        Metadata1: ['pattern1'],
        data: { Data1: ['pattern2'] },
      };

      // WHEN
      const result = FilterPattern.fromJson(filter);

      // THEN
      expect(result).toEqual(
        { pattern: '{"Metadata1":["pattern1"],"data":{"Data1":["pattern2"]}}' },
      );
    });
  });

});