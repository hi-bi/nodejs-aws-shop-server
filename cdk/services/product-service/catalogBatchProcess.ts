import { Construct } from 'constructs';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
//import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
//import { Runtime } from 'aws-cdk-lib/aws-lambda';


class CatalogBatchProcessLambda {
    catalogBatchProcessLambda: IFunction

    constructor(scope: Construct, id: string,
        createProductTopicArn: string, 
        productsTableName: string, 
        stocksTableName: string, 
        ) {

        const catalogBatchProcessLambda = new lambda.Function(scope, id, {
            runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
            code: lambda.Code.fromAsset('dist/product-service/lambdas'), // Points to the lambda directory
            handler: 'catalogBatchProcessLambda.handler', // Points to the 'cdk-products' file in the lambda directory
            environment: {
                CREATE_PRODUCT_TOPIC_ARN: createProductTopicArn,
                LOG_LEVEL: 'INFO',
                PRODUCTS_TABLE: productsTableName,
                STOCKS_TABLE: stocksTableName,
            },
            logRetention: RetentionDays.THREE_DAYS,
        });
/*
        catalogBatchProcessLambda.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: [
                    'sns:Publish',
                ],
                resources: [
                    createProductTopicArn,
                ]
            })
        );
*/
        this.catalogBatchProcessLambda = catalogBatchProcessLambda;

    }
}


export { CatalogBatchProcessLambda }