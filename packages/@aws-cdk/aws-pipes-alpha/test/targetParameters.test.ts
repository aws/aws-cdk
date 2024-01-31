import { TargetParameter } from '../lib';

describe('TargetParameter', ()=>{
  describe('fromJsonPath', ()=>{
    it('should return a string in correct format', ()=>{
      expect(TargetParameter.fromJsonPath('$.test')).toEqual('<$.test>');
    });
    it('should throw an error if the jsonPath does not start with "$."', ()=>{
      expect(()=>TargetParameter.fromJsonPath('test')).toThrow('JsonPath must start with "$."');
    });
  },
  );
},
);
