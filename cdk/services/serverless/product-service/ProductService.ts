import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';


export class ProductService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const getProductsList = new NodejsFunction(this, 'getProductsListLambda', {
            entry: 'services/serverless/product-service/functions/cdk-products.js',
            runtime: Runtime.NODEJS_LATEST,
        });

        const getProduct = new NodejsFunction(this, 'getProductLambda', {
            entry: 'services/serverless/product-service/functions/cdk-product.js',
            runtime: Runtime.NODEJS_LATEST,
        });

        const api = new apigateway.RestApi(this, 'product-service-api', {
            description: 'Product service api.',
        });

        const getProductsListPath = api.root.addResource('products'); 
        // path name https://{createdId}.execute-api.{region}.amazonaws.com/prod/products

        getProductsListPath.addMethod(
            'GET',
            new apigateway.LambdaIntegration(getProductsList)
        );

        const getProductPath = getProductsListPath.addResource('{product_id}');
        // path name https://{createdId}.execute-api.{region}.amazonaws.com/prod/product-id

        getProductPath.addMethod(
            'GET',
            new apigateway.LambdaIntegration(getProduct)
        );

    }
}