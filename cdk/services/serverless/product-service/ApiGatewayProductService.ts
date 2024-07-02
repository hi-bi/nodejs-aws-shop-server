import { Construct } from 'constructs';
import { IRestApi } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { availableProductDto } from '../../../entities/apiGatewayDto';


export class ApiGatewayProductService {
    apiGatewayProductService: IRestApi

    constructor(scope: Construct, id: string, getProductsList: IFunction, getProductById: IFunction, createProduct: IFunction) {

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


        const createProductModel = new apigateway.Model( scope, 'createProductModel', 
            {
                restApi: api,
                schema: availableProductDto,
                contentType: 'application/json',
            }
        );

        const createProductRequestValidator = new apigateway.RequestValidator( scope, 'createProductRequestValidator',
            {
                restApi: api,
                validateRequestBody: true
            }
        )
        getProductsListPath.addMethod(
            'POST',
            new apigateway.LambdaIntegration(createProduct),
            {
                requestModels: {
                    'application/json': createProductModel
                },
                requestValidator: createProductRequestValidator
            }
        );

    }
}