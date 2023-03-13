import { HaveOutputProperties } from './lib/assertions/have-output';
import { ResourcePart } from './lib/assertions/have-resource';
import { MatchStyle } from './lib/assertions/match-template';
declare global {
    namespace jest {
        interface Matchers<R, T> {
            toMatchTemplate(template: any, matchStyle?: MatchStyle): R;
            toHaveResource(resourceType: string, properties?: any, comparison?: ResourcePart): R;
            toHaveResourceLike(resourceType: string, properties?: any, comparison?: ResourcePart): R;
            toHaveOutput(props: HaveOutputProperties): R;
            toCountResources(resourceType: string, count: number): R;
        }
    }
}
