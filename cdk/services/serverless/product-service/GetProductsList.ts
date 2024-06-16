import { Construct } from 'constructs';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda';
//import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
//import { Runtime } from 'aws-cdk-lib/aws-lambda';


export class GetProductsList {
    getProductsList: IFunction

    constructor(scope: Construct, id: string) {

        //!!! cdk deploy error for NodejsFunction: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
        
        //const getProductsList = new NodejsFunction(this, 'getProductsListLambda', {
        //    entry: 'services/serverless/product-service/functions/cdk-products.js',
        //    runtime: Runtime.NODEJS_LATEST,
        //});

        // Define the Lambda function resource
        const getProductsList = new lambda.Function(scope, id, {
            runtime: lambda.Runtime.NODEJS_16_X, // Choose any supported Node.js runtime
            code: lambda.Code.fromAsset('services/serverless/product-service/functions'), // Points to the lambda directory
            handler: 'cdk-products.handler', // Points to the 'cdk-products' file in the lambda directory
        });

        this.getProductsList = getProductsList;

    }
}