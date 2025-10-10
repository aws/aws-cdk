import { IAspect } from './aspect';
import { IReusableStackSynthesizer } from './stack-synthesizers';

/**
 * Props for the TestIntersections class
 *
 * @experimental
 */
export interface TestIntersectionProps {
  /**
   * This input doesn't make any sense -- don't implement it!
   */
  readonly field: IAspect & IReusableStackSynthesizer;
}

/**
 * A class that purely exists to demonstrate that type intersections pass through the entire release pipeline
 *
 * This class will disappear again in the future; do not use it.
 *
 * @experimental
 */
export class TestIntersections {
  constructor(props: TestIntersectionProps) {
    void props;
  }

  public takeIntersection(field: IAspect & IReusableStackSynthesizer) {
    void field;
  }
}
