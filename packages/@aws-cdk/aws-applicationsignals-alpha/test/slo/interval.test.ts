import {Interval} from '../../lib/slo/interval'
import {CalendarIntervalProps, IntervalProps} from '../../lib';
import {DurationUnit} from "../../lib/slo/constants";

describe('Interval', () => {
    describe('calendar()', () => {
        it('should create a calendar interval with valid props', () => {
            const props: CalendarIntervalProps = {
                unit: DurationUnit.MONTH,
                duration: 1
            };

            const interval = Interval.calendar(props);
            expect(interval).toBeDefined();
            expect(interval.bind).toBeDefined();
        });

        it('should create a calendar interval with different time units', () => {
            const units = [
                DurationUnit.DAY,
                DurationUnit.MONTH
            ];

            units.forEach(unit => {
                const props: CalendarIntervalProps = {
                    unit: unit,
                    duration: 1
                };
                const interval = Interval.calendar(props);
                expect(interval).toBeDefined();
            });
        });

        it('should handle different duration values', () => {
            const durations = [1, 7, 14, 30];

            durations.forEach(duration => {
                const props: CalendarIntervalProps = {
                    unit: DurationUnit.DAY,
                    duration
                };
                const interval = Interval.calendar(props);
                expect(interval).toBeDefined();
            });
        });
    });

    describe('rolling()', () => {
        it('should create a rolling interval with valid props', () => {
            const props: IntervalProps = {
                duration: 24,
                unit: DurationUnit.HOUR
            };

            const interval = Interval.rolling(props);
            expect(interval).toBeDefined();
            expect(interval.bind).toBeDefined();
        });

        it('should handle different duration values', () => {
            const durations = [1, 7, 14, 31];

            durations.forEach(duration => {
                const props: CalendarIntervalProps = {
                    unit: DurationUnit.DAY,
                    duration
                };
                const interval = Interval.calendar(props);
                expect(interval).toBeDefined();
            });
        });
    });

    describe('bind()', () => {
        it('should return the correct structure for calendar intervals', () => {
            const props: CalendarIntervalProps = {
                unit: DurationUnit.MONTH,
                duration: 1
            };

            const interval = Interval.calendar(props);
            const bound = interval.bind();
            expect(bound).toBeDefined();

        });

        it('should return the correct structure for rolling intervals', () => {
            const props: IntervalProps = {
                duration: 24,
                unit: DurationUnit.HOUR
            };

            const interval = Interval.rolling(props);
            const bound = interval.bind();
            expect(bound).toBeDefined();
        });
    });

    describe('error cases', () => {
        it('should handle invalid calendar interval props', () => {
            expect(() => {
                Interval.calendar({
                    unit: DurationUnit.DAY,
                    duration: -1
                }).bind()
            }).toThrow();
        });

        it('should handle invalid rolling interval props', () => {
            expect(() => {
                Interval.rolling({
                    duration: -1,
                    unit: DurationUnit.HOUR
                } as any).bind()
            }).toThrow();
        });

        it('should handle missing required properties', () => {
            expect(() => {
                Interval.calendar({
                    unit: DurationUnit.DAY,
                    duration: 0
                } as CalendarIntervalProps).bind();
            }).toThrow('Duration must be greater than 0');

            expect(() => {
                Interval.rolling({
                    unit: DurationUnit.HOUR,
                    duration: 0
                } as IntervalProps).bind();
            }).toThrow('Duration must be greater than 0');
        });
    });
});
