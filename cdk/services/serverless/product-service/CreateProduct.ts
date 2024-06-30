import { Construct } from 'constructs';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda';
//import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
//import { Runtime } from 'aws-cdk-lib/aws-lambda';


export class CreateProduct {
    putCreateProduct: IFunction

    constructor(scope: Construct, id: string,
        productsTableName: string, 
        stocksTableName: string, 
        ) {

        //!!! cdk deploy error for NodejsFunction: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
        
        //const getProduct = new NodejsFunction(this, 'getProductLambda', {
        //    entry: 'services/serverless/product-service/functions/cdk-product.js',
        //    runtime: Runtime.NODEJS_LATEST,
        //});

        const putCreateProduct = new lambda.Function(scope, id, {
            runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
            code: lambda.Code.fromAsset('dist/product-service/lambdas'), // Points to the lambda directory
            handler: 'cdk-create-product.handler', // Points to the 'cdk-products' file in the lambda directory
            environment: {
                PRODUCTS_TABLE: productsTableName,
                STOCKS_TABLE: stocksTableName,
            }
        });

        this.putCreateProduct = putCreateProduct;

    }
}