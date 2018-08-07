"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/cdk");
/**
 * A Lambda that will only ever be added to a stack once.
 *
 * The lambda is identified using the value of 'uuid'. Run 'uuidgen'
 * for every SingletonLambda you create.
 */
class SingletonLambda extends lambda.LambdaRef {
    constructor(parent, name, props) {
        super(parent, name);
        this.lambdaFunction = this.ensureLambda(props.uuid, props);
        this.functionArn = this.lambdaFunction.functionArn;
        this.functionName = this.lambdaFunction.functionName;
        this.role = this.lambdaFunction.role;
        this.canCreatePermissions = true; // Doesn't matter, addPermission is overriden anyway
    }
    addPermission(name, permission) {
        return this.lambdaFunction.addPermission(name, permission);
    }
    ensureLambda(uuid, props) {
        const constructName = 'SingletonLambda' + slugify(uuid);
        const stack = cdk.Stack.find(this);
        const existing = stack.tryFindChild(constructName);
        if (existing) {
            // Just assume this is true
            return existing;
        }
        return new lambda.Lambda(stack, constructName, props);
    }
}
exports.SingletonLambda = SingletonLambda;
function slugify(x) {
    return x.replace(/[^a-zA-Z0-9]/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xldG9ubGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2luZ2xldG9ubGFtYmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsOENBQStDO0FBQy9DLG9DQUFxQztBQWVyQzs7Ozs7R0FLRztBQUNILHFCQUE2QixTQUFRLE1BQU0sQ0FBQyxTQUFTO0lBT2pELFlBQVksTUFBcUIsRUFBRSxJQUFZLEVBQUUsS0FBMkI7UUFDeEUsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVwQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDO1FBQ25ELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUM7UUFDckQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztRQUVyQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLENBQUMsb0RBQW9EO0lBQzFGLENBQUM7SUFFTSxhQUFhLENBQUMsSUFBWSxFQUFFLFVBQW1DO1FBQ2xFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFTyxZQUFZLENBQUMsSUFBWSxFQUFFLEtBQXlCO1FBQ3hELE1BQU0sYUFBYSxHQUFHLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25ELElBQUksUUFBUSxFQUFFO1lBQ1YsMkJBQTJCO1lBQzNCLE9BQU8sUUFBNEIsQ0FBQztTQUN2QztRQUVELE9BQU8sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUQsQ0FBQztDQUNKO0FBbENELDBDQWtDQztBQUVELGlCQUFpQixDQUFTO0lBQ3RCLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDMUMsQ0FBQyJ9