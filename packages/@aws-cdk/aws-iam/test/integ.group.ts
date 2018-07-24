// Creates a default group, with no users and no policy attached.

import { App, Stack } from "@aws-cdk/cdk";
import { Group } from "../lib";

const app = new App(process.argv);

const stack = new Stack(app, 'integ-iam-role-1');

new Group(stack, 'MyGroup');

process.stdout.write(app.run());
