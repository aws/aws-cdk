import { Integration, IntegrationOptions, IntegrationType } from '../integration';

/**
 * This type of integration lets API Gateway return a response without sending
 * the request further to the backend. This is useful for API testing because it
 * can be used to test the integration set up without incurring charges for
 * using the backend and to enable collaborative development of an API. In
 * collaborative development, a team can isolate their development effort by
 * setting up simulations of API components owned by other teams by using the
 * MOCK integrations. It is also used to return CORS-related headers to ensure
 * that the API method permits CORS access. In fact, the API Gateway console
 * integrates the OPTIONS method to support CORS with a mock integration.
 * Gateway responses are other examples of mock integrations.
 */
export class MockIntegration extends Integration {
  constructor(options?: IntegrationOptions) {
    super({
      type: IntegrationType.Mock,
      options
    });
  }
}
