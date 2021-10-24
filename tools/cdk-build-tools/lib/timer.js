"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timers = exports.Timer = void 0;
/**
 * A single timer
 */
class Timer {
    constructor(label) {
        this.label = label;
        this.startTime = Date.now();
    }
    start() {
        this.startTime = Date.now();
    }
    end() {
        this.timeMs = (Date.now() - this.startTime) / 1000;
    }
    isSet() {
        return this.timeMs !== undefined;
    }
    humanTime() {
        if (!this.timeMs) {
            return '???';
        }
        const parts = [];
        let time = this.timeMs;
        if (time > 60) {
            const mins = Math.floor(time / 60);
            parts.push(mins + 'm');
            time -= mins * 60;
        }
        parts.push(time.toFixed(1) + 's');
        return parts.join('');
    }
}
exports.Timer = Timer;
/**
 * A collection of Timers
 */
class Timers {
    constructor() {
        this.timers = [];
    }
    record(label, operation) {
        const timer = this.start(label);
        try {
            const x = operation();
            timer.end();
            return x;
        }
        catch (e) {
            timer.end();
            throw e;
        }
    }
    async recordAsync(label, operation) {
        const timer = this.start(label);
        try {
            const x = await operation();
            timer.end();
            return x;
        }
        catch (e) {
            timer.end();
            throw e;
        }
    }
    start(label) {
        const timer = new Timer(label);
        this.timers.push(timer);
        return timer;
    }
    display() {
        const timers = this.timers.filter(t => t.isSet());
        timers.sort((a, b) => b.timeMs - a.timeMs);
        return timers.map(t => `${t.label} (${t.humanTime()})`).join(' | ');
    }
}
exports.Timers = Timers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0aW1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7R0FFRztBQUNILE1BQWEsS0FBSztJQUloQixZQUE0QixLQUFhO1FBQWIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRU0sS0FBSztRQUNWLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFTSxHQUFHO1FBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3JELENBQUM7SUFFTSxLQUFLO1FBQ1YsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQztJQUNuQyxDQUFDO0lBRU0sU0FBUztRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUM7U0FBRTtRQUVuQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFFakIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QixJQUFJLElBQUksR0FBRyxFQUFFLEVBQUU7WUFDYixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNuQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUN2QixJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztTQUNuQjtRQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUVsQyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBbkNELHNCQW1DQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxNQUFNO0lBQW5CO1FBQ21CLFdBQU0sR0FBWSxFQUFFLENBQUM7SUFxQ3hDLENBQUM7SUFuQ1EsTUFBTSxDQUFJLEtBQWEsRUFBRSxTQUFrQjtRQUNoRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLElBQUk7WUFDRixNQUFNLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQztZQUN0QixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDWixPQUFPLENBQUMsQ0FBQztTQUNWO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDWixNQUFNLENBQUMsQ0FBQztTQUNUO0lBQ0gsQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXLENBQUksS0FBYSxFQUFFLFNBQTJCO1FBQ3BFLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsSUFBSTtZQUNGLE1BQU0sQ0FBQyxHQUFHLE1BQU0sU0FBUyxFQUFFLENBQUM7WUFDNUIsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1osT0FBTyxDQUFDLENBQUM7U0FDVjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1osTUFBTSxDQUFDLENBQUM7U0FDVDtJQUNILENBQUM7SUFFTSxLQUFLLENBQUMsS0FBYTtRQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTSxPQUFPO1FBQ1osTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBUSxFQUFFLENBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU8sR0FBRyxDQUFDLENBQUMsTUFBTyxDQUFDLENBQUM7UUFDM0QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RFLENBQUM7Q0FDRjtBQXRDRCx3QkFzQ0MifQ==