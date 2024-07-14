import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import 'dotenv/config';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { CfnOutput } from 'aws-cdk-lib';


class AuthorizationService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const authorizationServiceLambda = new lambda.Function(scope, 'basicAuthorizer', {
            runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
            code: lambda.Code.fromAsset('dist/authorization-service/lambdas'), // Points to the lambda directory
            handler: 'basicAuthorizerLambda.handle', // Points to the 'importProductsFileLambda' file in the lambda directory
            environment: {
                hibi: process.env.hibi!,
            },
            logRetention: RetentionDays.THREE_DAYS,
            
        });

        new CfnOutput(scope, `authorizationServiceLambdaOtput`,
        {
            value: authorizationServiceLambda.functionArn,
        }
    );


    }
}

export { AuthorizationService }