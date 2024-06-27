import { Construct } from 'constructs';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources'; 
import { Bucket ,EventType } from 'aws-cdk-lib/aws-s3'; 
import { S3 } from '../../../constants/cdk-constants';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';


class ImportFileParser {
    importFileParserLambda: IFunction
    

    constructor(scope: Construct, id: string,
        //importBucketName: string, 
        ) {

        const importBucket = Bucket.fromBucketName(
            scope,
            S3.IMPORT_BUCKET_ID,
            S3.IMPORT_BUCKET_NAME
        );
        //const importBucketArn = `arn:aws:s3:::${S3.IMPORT_BUCKET_NAME}`;
        //const importBucket = Bucket.fromBucketArn(scope, S3.IMPORT_BUCKET_ID, importBucketArn);

        // Define the Lambda function resource
        const importFileParserLambda = new lambda.Function(scope, id, {
            runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
            code: lambda.Code.fromAsset('dist/import-service/lambdas'), // Points to the lambda directory
            handler: 'importProductsFileLambda.handler', // Points to the 'importProductsFileLambda' file in the lambda directory
            environment: {
                IMPORT_BUCKET_NAME: importBucket.bucketName,
                LOG_LEVEL: 'INFO',
            },
            logRetention: RetentionDays.ONE_WEEK,
        });

        importBucket.grantReadWrite(importFileParserLambda);
        importBucket.grantDelete(importFileParserLambda);

        importFileParserLambda.addEventSource(
            new S3EventSource(importBucket as Bucket, {
              events: [EventType.OBJECT_CREATED],
              filters: [{ prefix: 'uploaded/' }],
            })
          );

        this.importFileParserLambda = importFileParserLambda;

    }
}

export { ImportFileParser }