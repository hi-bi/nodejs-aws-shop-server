import { Construct } from 'constructs';
import { ApiGatewayImportService } from './ApiGatewayImportService';
import { taskNum } from '../../constants/constants';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from "aws-cdk-lib/aws-s3-notifications";


class AuthorizationService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        // Define the Lambda function resource
        const importProductsFileLambda = new lambda.Function(scope, id, {
            runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
            code: lambda.Code.fromAsset('dist/import-service/lambdas'), // Points to the lambda directory
            handler: 'importProductsFileLambda.handler', // Points to the 'importProductsFileLambda' file in the lambda directory
            environment: {
                IMPORT_BUCKET_NAME: importBucketName,
                IMPORT_UPLOADED_PREFIX: S3.IMPORT_UPLOADED_PREFIX,
                LOG_LEVEL: 'INFO',
            },
            logRetention: RetentionDays.THREE_DAYS,
            
        });

        this.importProductsFileLambda = importProductsFileLambda;


    }
}

export { AuthorizationService }