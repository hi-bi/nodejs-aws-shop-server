import { Construct } from 'constructs';
import { IRestApi } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';


export class ApiGatewayProductService {
    apiGatewayProductService: IRestApi

    constructor(scope: Construct, id: string, getProductsList: IFunction, getProductById: IFunction) {

        const api = new apigateway.RestApi(scope, id, {
            description: 'Product service api.',
        });

        const getProductsListPath = api.root.addResource('products', {
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                //allowMethods: apigateway.Cors.ALL_METHODS,
                //allowOrigins: ['cloudfront.net'],
                allowHeaders: apigateway.Cors.DEFAULT_HEADERS.concat(['x-api-key'])
            }
        }); 
        // path name https://{createdId}.execute-api.us-east.amazonaws.com/prod/products

        getProductsListPath.addMethod(
            'GET',
            new apigateway.LambdaIntegration(getProductsList)
        );

        const getProductPath = getProductsListPath.addResource('{product_id}', {
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                //allowMethods: apigateway.Cors.ALL_METHODS,
                //allowOrigins: ['cloudfront.net'],
                allowHeaders: apigateway.Cors.DEFAULT_HEADERS.concat(['x-api-key'])
            }
        });
        // path name https://{createdId}.execute-api.us-east.amazonaws.com/prod/{product-id}

        getProductPath.addMethod(
            'GET',
            new apigateway.LambdaIntegration(getProductById)
        );


    }
}