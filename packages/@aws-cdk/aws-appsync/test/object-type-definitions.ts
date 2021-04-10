import { ObjectType } from '../lib';
import * as ScalarType from './scalar-type-defintions';

export const planet = new ObjectType('Planet', {
  definition: {
    name: ScalarType.string,
    diameter: ScalarType.int,
    rotationPeriod: ScalarType.int,
    orbitalPeriod: ScalarType.int,
    gravity: ScalarType.string,
    population: ScalarType.list_string,
    climates: ScalarType.list_string,
    terrains: ScalarType.list_string,
    surfaceWater: ScalarType.float,
    created: ScalarType.string,
    edited: ScalarType.string,
    id: ScalarType.required_id,
  },
});