import * as appscaling from '../lib';

/**
 * Arbitrary (valid) array of intervals
 *
 * There are many invalid combinations of interval arrays, so we have
 * to be very specific about generating arrays that are valid. We do this
 * by taking a full, valid interval schedule and progressively stripping parts
 * away from it.
 *
 * Some of the changes may change its meaning, but we take care to never leave
 * a schedule with insufficient information so that the parser will error out.
 */
export function generateArbitraryIntervals(mrng: IRandomGenerator): ArbitraryIntervals {
  const ret = new Array<appscaling.ScalingInterval>();

  const absolute = mrng.nextBoolean();

  // Ascending or descending scaling
  const factor = (mrng.nextBoolean() ? 1 : -1) * (absolute ? 10 : 1);
  const bias = absolute ? 50 : 0;

  // Begin with a full schedule
  ret.push({ lower: 0, upper: 10, change: -2 * factor + bias });
  ret.push({ lower: 10, upper: 20, change: -1 * factor + bias });
  ret.push({ lower: 20, upper: 60, change: 0 + bias });
  ret.push({ lower: 60, upper: 80, change: 0 + bias });
  ret.push({ lower: 80, upper: 90, change: 1 * factor + bias });
  ret.push({ lower: 90, upper: Infinity, change: 2 * factor + bias });

  // Take away parts from this. First we see if we do something to the 0-change alarms.
  // The actions can be: remove it OR turn it into a regular change value.
  const noChanges = ret.filter(x => x.change === bias);

  if (!absolute) {
    if (mrng.nextBoolean()) {
      if (mrng.nextBoolean()) {
        ret.splice(ret.indexOf(noChanges[0]), 1);
      } else {
        noChanges[0] = { ...noChanges[0], change: -1 * factor + bias };
      }
    }
    if (mrng.nextBoolean()) {
      if (mrng.nextBoolean()) {
        ret.splice(ret.indexOf(noChanges[1]), 1);
      } else {
        noChanges[1] = { ...noChanges[1], change: 1 * factor + bias };
      }
    }
  } else {
    // In absolute mode both have to get the same treatment at the same time
    // otherwise we'll end up with a timeline with two gaps
    if (mrng.nextBoolean()) {
      ret.splice(ret.indexOf(noChanges[0]), 1);
      ret.splice(ret.indexOf(noChanges[1]), 1);
    } else {
      noChanges[0] = { ...noChanges[0], change: -1 * factor + bias };
      noChanges[1] = { ...noChanges[1], change: 1 * factor + bias };
    }
  }

  // We might also take away either the bottom or the upper half
  if (mrng.nextInt(0, 2) === 0) {
    const signToStrip = mrng.nextBoolean() ? -1 : 1;
    let ix = ret.findIndex(x => Math.sign(x.change - bias) === signToStrip);
    while (ix >= 0) {
      ret.splice(ix, 1);
      ix = ret.findIndex(x => Math.sign(x.change - bias) === signToStrip);
    }
  }

  // Then we're going to arbitrarily get rid of bounds in the most naive way possible
  const iterations = mrng.nextInt(0, 10);
  for (let iter = 0; iter < iterations; iter++) {
    const i = mrng.nextInt(0, ret.length - 1);
    if (mrng.nextBoolean()) {
      // scrap lower bound
      // okay if current interval has an upper bound AND the preceding interval has an upper bound
      if (ret[i].upper !== undefined && (i === 0 || ret[i - 1].upper !== undefined)) {
        ret[i] = { ...ret[i], lower: undefined };
      }
    } else {
      // scrap upper bound
      // okay if current interval has a lower bound AND the succeeding interval has a lower bound
      if (ret[i].lower !== undefined && (i === ret.length - 1 || ret[i + 1].lower !== undefined)) {
        ret[i] = { ...ret[i], upper: undefined };
      }
    }
  }

  return { absolute, intervals: ret };
}

export interface IRandomGenerator {
  nextBoolean(): boolean;
  nextInt(min: number, max: number): number;
}

export interface ArbitraryIntervals {
  readonly absolute: boolean;
  readonly intervals: appscaling.ScalingInterval[];
}
