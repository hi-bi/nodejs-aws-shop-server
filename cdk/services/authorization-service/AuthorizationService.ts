import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import 'dotenv/config';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';


class AuthorizationService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const authorizationServiceLambda = new lambda.Function(scope, id, {
            runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
            code: lambda.Code.fromAsset('dist/authorization-service/lambdas'), // Points to the lambda directory
            handler: 'basicAuthorizerLambda.handler', // Points to the 'importProductsFileLambda' file in the lambda directory
            environment: {
                'hi-bi': process.env.hibi!,
            },
            logRetention: RetentionDays.THREE_DAYS,
            
        });

    }
}

export { AuthorizationService }