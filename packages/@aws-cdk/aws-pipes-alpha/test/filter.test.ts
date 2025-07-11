import { Filter } from '../lib';

describe('Filter', () => {
  describe('constructor', () => {
    it('should set filters', () => {
      // GIVEN
      const filter ={
        pattern: JSON.stringify( {
          Metadata1: ['pattern1'],
          data: { Data1: ['pattern2'] },
        }),
      };

      // WHEN
      const result = new Filter([filter]);

      // THEN
      expect(result).toEqual(
        {
          filters:
            [
              {
                pattern: '{"Metadata1":["pattern1"],"data":{"Data1":["pattern2"]}}',
              },
            ],
        },
      );
    });
  });
});
