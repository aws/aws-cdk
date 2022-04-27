import { CustomResourceHandler } from './base';
import { ResultsCollectionRequest, ResultsCollectionResult } from './types';

export class ResultsCollectionHandler extends CustomResourceHandler<ResultsCollectionRequest, ResultsCollectionResult> {
  protected async processEvent(request: ResultsCollectionRequest): Promise<ResultsCollectionResult | undefined> {
    const reduced: string = request.assertionResults.reduce((agg, result, idx) => {
      const msg = result.status === 'pass' ? 'pass' : `fail - ${result.message}`;
      return `${agg}\nTest${idx}: ${msg}`;
    }, '').trim();
    return { message: reduced };
  }
}
