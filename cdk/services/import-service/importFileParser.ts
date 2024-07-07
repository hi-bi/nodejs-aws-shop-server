import { Construct } from 'constructs';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { QUEUE, LOGGING, S3 } from '../../constants/constants';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Queue } from 'aws-cdk-lib/aws-sqs';


class ImportFileParser {
    importFileParserLambda: IFunction
    
    constructor(scope: Construct, id: string,
        importBucketName: string, 
        ) {

        const catalogItemsQueue = Queue.fromQueueArn(scope, QUEUE.CATALOG_ITEMS_QUEUE_ID, QUEUE.CATALOG_ITEMS_QUEUE_ARN);

        // Define the Lambda function resource
        const importFileParserLambda = new lambda.Function(scope, id, {
            runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
            code: lambda.Code.fromAsset('dist/import-service/lambdas'), // Points to the lambda directory
            handler: 'importFileParserLambda.handler', // Points to the 'importProductsFileLambda' file in the lambda directory
            environment: {
                IMPORT_BUCKET_NAME: importBucketName,
                IMPORT_UPLOADED_PREFIX: S3.IMPORT_UPLOADED_PREFIX,
                IMPORT_SQS_URL: catalogItemsQueue.queueUrl,
                LOG_LEVEL: LOGGING.IMPORT_FILE_PARSER,
            },
            logRetention: RetentionDays.ONE_WEEK,
        });

        catalogItemsQueue.grantSendMessages(importFileParserLambda);

        this.importFileParserLambda = importFileParserLambda;

    }
}

export { ImportFileParser }