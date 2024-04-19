import { TypeCoercionStateMachine, typeCoercionStateMachine } from './parameter-types';

type ApiParameters = { [param: string]: any };

type StateOrConversion = TypeCoercionStateMachine[number][string];

/**
 * Given a minimal AWS SDKv3 call definition (service, action, parameters),
 * coerces nested parameter values into a Uint8Array if that's what the SDKv3 expects.
 */
export function coerceApiParameters(v3service: string, action: string, parameters: ApiParameters = {}): ApiParameters {
  const typeMachine = typeCoercionStateMachine();
  return new Coercer(typeMachine).coerceApiParameters(v3service, action, parameters);
}

/**
 * Make this a class in order to have multiple entry points for testing that can all share convenience functions
 */
export class Coercer {
  constructor(private readonly typeMachine: TypeCoercionStateMachine) { }

  public coerceApiParameters(v3service: string, action: string, parameters: ApiParameters = {}): ApiParameters {
    // Get the initial state corresponding to the current service+action, then recurse through the parameters
    const actionState = this.progress(action.toLowerCase(), this.progress(v3service.toLowerCase(), 0));
    return this.recurse(parameters, actionState) as any;
  }

  public testCoerce(value: unknown): any {
    return this.recurse(value, 0);
  }

  private recurse(value: unknown, state: StateOrConversion | undefined): any {
    switch (state) {
      case undefined: return value;
      case 'b': return coerceValueToUint8Array(value);
      case 'n': return coerceValueToNumber(value);
      case 'd': return coerceValueToDate(value);
    }

    if (Array.isArray(value)) {
      const elState = this.progress('*', state);
      return elState !== undefined
        ? value.map((e) => this.recurse(e, elState))
        : value;
    }

    if (value && typeof value === 'object') {
      // Mutate the object in-place for efficiency
      const mapState = this.progress('*', state);
      for (const key of Object.keys(value)) {
        const fieldState = this.progress(key, state) ?? mapState;
        if (fieldState !== undefined) {
          (value as any)[key] = this.recurse((value as any)[key], fieldState);
        }
      }
      return value;
    }

    return value;
  }

  /**
   * From a given state, return the state we would end up in if we followed this field
   */
  private progress(field: string, s: StateOrConversion | undefined): StateOrConversion | undefined {
    if (s === undefined || typeof s !== 'number') {
      return undefined;
    }
    return this.typeMachine[s][field];
  }
}

function coerceValueToUint8Array(x: unknown): Uint8Array | any {
  if (x instanceof Uint8Array) {
    return x;
  }

  if (typeof x === 'string' || typeof x === 'number') {
    return new TextEncoder().encode(x.toString());
  }

  return x;
}

function coerceValueToNumber(x: unknown): number | any {
  if (typeof x === 'number') {
    return x;
  }

  if (typeof x === 'string') {
    const n = Number(x);
    return isNaN(n) ? x : n;
  }

  return x;
}

function coerceValueToDate(x: unknown): Date | any {
  if (typeof x === 'string' || typeof x === 'number') {
    const date = new Date(x);
    // if x is not a valid date
    if (isNaN(date.getTime())) {
      return x;
    }
    return date;
  }

  return x;
}
