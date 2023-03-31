"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda-nodejs");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new lambda.NodejsFunction(this, 'ts-handler', {
            entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            bundling: {
                minify: true,
                sourceMap: true,
                sourceMapMode: lambda.SourceMapMode.BOTH,
            },
        });
        new lambda.NodejsFunction(this, 'js-handler', {
            entry: path.join(__dirname, 'integ-handlers/js-handler.js'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
        });
        new lambda.NodejsFunction(this, 'ts-handler-vpc', {
            entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            vpc: new aws_ec2_1.Vpc(this, 'Vpc'),
        });
        new lambda.NodejsFunction(this, 'ts-handler-custom-handler-no-dots', {
            entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            bundling: {
                minify: true,
                sourceMap: true,
                sourceMapMode: lambda.SourceMapMode.BOTH,
            },
            handler: 'handler',
        });
        new lambda.NodejsFunction(this, 'ts-handler-custom-handler-dots', {
            entry: path.join(__dirname, 'integ-handlers/ts-web-handler.ts'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            bundling: {
                minify: true,
                sourceMap: true,
                sourceMapMode: lambda.SourceMapMode.BOTH,
                commandHooks: {
                    beforeBundling: () => [],
                    beforeInstall: () => [],
                    afterBundling: (_inputDir, outputDir) => [
                        `${os.platform() === 'win32' ? 'copy' : 'cp'} ${path.join(__dirname, 'integ-handlers', 'ts-web-run.sh')} ${outputDir}`,
                    ],
                },
            },
            handler: 'ts-web.run.sh',
            layers: [
                aws_lambda_1.LayerVersion.fromLayerVersionArn(this, 'lambda-adapter-layer', `arn:aws:lambda:${aws_cdk_lib_1.Aws.REGION}:753240598075:layer:LambdaAdapterLayerX86:13`),
            ],
        });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-lambda-nodejs');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZnVuY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5mdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsaURBQTBDO0FBQzFDLHVEQUErRDtBQUMvRCw2Q0FBMEQ7QUFFMUQsd0RBQXdEO0FBRXhELE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDNUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLDhCQUE4QixDQUFDO1lBQzNELE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFNBQVMsRUFBRSxJQUFJO2dCQUNmLGFBQWEsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUk7YUFDekM7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM1QyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsOEJBQThCLENBQUM7WUFDM0QsT0FBTyxFQUFFLG9CQUFPLENBQUMsV0FBVztTQUM3QixDQUFDLENBQUM7UUFFSCxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ2hELEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSw4QkFBOEIsQ0FBQztZQUMzRCxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLEdBQUcsRUFBRSxJQUFJLGFBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1NBQzFCLENBQUMsQ0FBQztRQUVILElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsbUNBQW1DLEVBQUU7WUFDbkUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLDhCQUE4QixDQUFDO1lBQzNELE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFNBQVMsRUFBRSxJQUFJO2dCQUNmLGFBQWEsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUk7YUFDekM7WUFDRCxPQUFPLEVBQUUsU0FBUztTQUNuQixDQUFDLENBQUM7UUFFSCxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdDQUFnQyxFQUFFO1lBQ2hFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQ0FBa0MsQ0FBQztZQUMvRCxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLFFBQVEsRUFBRTtnQkFDUixNQUFNLEVBQUUsSUFBSTtnQkFDWixTQUFTLEVBQUUsSUFBSTtnQkFDZixhQUFhLEVBQUUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJO2dCQUN4QyxZQUFZLEVBQUU7b0JBQ1osY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7b0JBQ3hCLGFBQWEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO29CQUN2QixhQUFhLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQzt3QkFDdkMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUN2RCxTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLGVBQWUsQ0FDaEIsSUFBSSxTQUFTLEVBQUU7cUJBQ2pCO2lCQUNGO2FBQ0Y7WUFDRCxPQUFPLEVBQUUsZUFBZTtZQUN4QixNQUFNLEVBQUU7Z0JBQ04seUJBQVksQ0FBQyxtQkFBbUIsQ0FDOUIsSUFBSSxFQUNKLHNCQUFzQixFQUN0QixrQkFBa0IsaUJBQUcsQ0FBQyxNQUFNLDhDQUE4QyxDQUMzRTthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLHlCQUF5QixDQUFDLENBQUM7QUFDOUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgb3MgZnJvbSAnb3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFZwYyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgTGF5ZXJWZXJzaW9uLCBSdW50aW1lIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBBd3MsIEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLW5vZGVqcyc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBuZXcgbGFtYmRhLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICd0cy1oYW5kbGVyJywge1xuICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICdpbnRlZy1oYW5kbGVycy90cy1oYW5kbGVyLnRzJyksXG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICBzb3VyY2VNYXA6IHRydWUsXG4gICAgICAgIHNvdXJjZU1hcE1vZGU6IGxhbWJkYS5Tb3VyY2VNYXBNb2RlLkJPVEgsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IGxhbWJkYS5Ob2RlanNGdW5jdGlvbih0aGlzLCAnanMtaGFuZGxlcicsIHtcbiAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnaW50ZWctaGFuZGxlcnMvanMtaGFuZGxlci5qcycpLFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIG5ldyBsYW1iZGEuTm9kZWpzRnVuY3Rpb24odGhpcywgJ3RzLWhhbmRsZXItdnBjJywge1xuICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICdpbnRlZy1oYW5kbGVycy90cy1oYW5kbGVyLnRzJyksXG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgdnBjOiBuZXcgVnBjKHRoaXMsICdWcGMnKSxcbiAgICB9KTtcblxuICAgIG5ldyBsYW1iZGEuTm9kZWpzRnVuY3Rpb24odGhpcywgJ3RzLWhhbmRsZXItY3VzdG9tLWhhbmRsZXItbm8tZG90cycsIHtcbiAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnaW50ZWctaGFuZGxlcnMvdHMtaGFuZGxlci50cycpLFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgc291cmNlTWFwOiB0cnVlLFxuICAgICAgICBzb3VyY2VNYXBNb2RlOiBsYW1iZGEuU291cmNlTWFwTW9kZS5CT1RILFxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJyxcbiAgICB9KTtcblxuICAgIG5ldyBsYW1iZGEuTm9kZWpzRnVuY3Rpb24odGhpcywgJ3RzLWhhbmRsZXItY3VzdG9tLWhhbmRsZXItZG90cycsIHtcbiAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnaW50ZWctaGFuZGxlcnMvdHMtd2ViLWhhbmRsZXIudHMnKSxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBtaW5pZnk6IHRydWUsXG4gICAgICAgIHNvdXJjZU1hcDogdHJ1ZSxcbiAgICAgICAgc291cmNlTWFwTW9kZTogbGFtYmRhLlNvdXJjZU1hcE1vZGUuQk9USCxcbiAgICAgICAgY29tbWFuZEhvb2tzOiB7XG4gICAgICAgICAgYmVmb3JlQnVuZGxpbmc6ICgpID0+IFtdLFxuICAgICAgICAgIGJlZm9yZUluc3RhbGw6ICgpID0+IFtdLFxuICAgICAgICAgIGFmdGVyQnVuZGxpbmc6IChfaW5wdXREaXIsIG91dHB1dERpcikgPT4gW1xuICAgICAgICAgICAgYCR7b3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJyA/ICdjb3B5JyA6ICdjcCd9ICR7cGF0aC5qb2luKFxuICAgICAgICAgICAgICBfX2Rpcm5hbWUsXG4gICAgICAgICAgICAgICdpbnRlZy1oYW5kbGVycycsXG4gICAgICAgICAgICAgICd0cy13ZWItcnVuLnNoJyxcbiAgICAgICAgICAgICl9ICR7b3V0cHV0RGlyfWAsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBoYW5kbGVyOiAndHMtd2ViLnJ1bi5zaCcsXG4gICAgICBsYXllcnM6IFtcbiAgICAgICAgTGF5ZXJWZXJzaW9uLmZyb21MYXllclZlcnNpb25Bcm4oXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICAnbGFtYmRhLWFkYXB0ZXItbGF5ZXInLFxuICAgICAgICAgIGBhcm46YXdzOmxhbWJkYToke0F3cy5SRUdJT059Ojc1MzI0MDU5ODA3NTpsYXllcjpMYW1iZGFBZGFwdGVyTGF5ZXJYODY6MTNgLFxuICAgICAgICApLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2Nkay1pbnRlZy1sYW1iZGEtbm9kZWpzJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==