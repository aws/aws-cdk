import { integTest, withTemporaryDirectory, withPackages } from "../../lib";

integTest(
  "cdk migrate typescript",
  withTemporaryDirectory(withPackages(async () => {}))
);
