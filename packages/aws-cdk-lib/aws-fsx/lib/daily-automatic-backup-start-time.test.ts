import { DailyAutomaticBackupStartTime } from './daily-automatic-backup-start-time';
import { UnscopedValidationError } from '../../core';

describe('DailyAutomaticBackupStartTime', () => {
  describe('constructor', () => {
    it('should use default values when none provided', () => {
      const time = new DailyAutomaticBackupStartTime();
      expect(time.toTimestamp()).toBe('22:00');
    });

    it('should accept valid time values', () => {
      const time = new DailyAutomaticBackupStartTime({ hour: 9, minute: 30 });
      expect(time.toTimestamp()).toBe('09:30');
    });

    it('should pad single-digit values', () => {
      const time = new DailyAutomaticBackupStartTime({ hour: 5, minute: 7 });
      expect(time.toTimestamp()).toBe('05:07');
    });

    it('should throw for invalid hour', () => {
      expect(() => new DailyAutomaticBackupStartTime({ hour: 24 })).toThrow(UnscopedValidationError);
      expect(() => new DailyAutomaticBackupStartTime({ hour: -1 })).toThrow(UnscopedValidationError);
    });

    it('should throw for invalid minute', () => {
      expect(() => new DailyAutomaticBackupStartTime({ minute: 60 })).toThrow(UnscopedValidationError);
      expect(() => new DailyAutomaticBackupStartTime({ minute: -1 })).toThrow(UnscopedValidationError);
    });
  });

  describe('fromString', () => {
    it('should parse valid time strings', () => {
      expect(DailyAutomaticBackupStartTime.fromString('00:00').toTimestamp()).toBe('00:00');
      expect(DailyAutomaticBackupStartTime.fromString('23:59').toTimestamp()).toBe('23:59');
      expect(DailyAutomaticBackupStartTime.fromString('09:05').toTimestamp()).toBe('09:05');
    });

    it('should throw for invalid formats', () => {
      expect(() => DailyAutomaticBackupStartTime.fromString('24:00')).toThrow(UnscopedValidationError);
      expect(() => DailyAutomaticBackupStartTime.fromString('12:60')).toThrow(UnscopedValidationError);
      expect(() => DailyAutomaticBackupStartTime.fromString('abc')).toThrow(UnscopedValidationError);
      expect(() => DailyAutomaticBackupStartTime.fromString('12:00:00')).toThrow(UnscopedValidationError);
    });
  });

  describe('toTimestamp', () => {
    it('should return properly formatted string', () => {
      expect(new DailyAutomaticBackupStartTime({ hour: 1, minute: 2 }).toTimestamp()).toBe('01:02');
      expect(new DailyAutomaticBackupStartTime({ hour: 10, minute: 20 }).toTimestamp()).toBe('10:20');
    });
  });
});
