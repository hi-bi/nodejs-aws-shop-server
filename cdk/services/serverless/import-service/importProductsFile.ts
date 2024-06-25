import { Construct } from 'constructs';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda';
//import { DYNAMODB } from '../../../constants/cdk-constants';


class ImportProductsFile {
    importProductsFileLambda: IFunction
    

    constructor(scope: Construct, id: string,
        importBucketName: string, 
        ) {

        // Define the Lambda function resource
        const importProductsFileLambda = new lambda.Function(scope, id, {
            runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
            code: lambda.Code.fromAsset('dist/import-service/lambdas'), // Points to the lambda directory
            handler: 'importProductsFileLambda.handler', // Points to the 'importProductsFileLambda' file in the lambda directory
            environment: {
                IMPORT_BUCKET_NAME: importBucketName,
            }
            
        });

        this.importProductsFileLambda = importProductsFileLambda;

    }
}

export { ImportProductsFile }