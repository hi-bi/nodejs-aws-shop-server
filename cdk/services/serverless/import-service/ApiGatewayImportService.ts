import { Construct } from 'constructs';
import { IRestApi } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';


class ApiGatewayImportService {
    apiGatewayProductService: IRestApi

    constructor(scope: Construct, id: string, importProductsFileLambda: IFunction) {

        const api = new apigateway.RestApi(scope, id, {
            description: 'Import service api.',
        });

        const apiImportProductsFilePath = api.root.addResource('import', {
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
                //allowOrigins: ['cloudfront.net'],
                //allowHeaders: apigateway.Cors.DEFAULT_HEADERS.concat(['x-api-key'])
            }
        }); 

        apiImportProductsFilePath.addMethod(
            'GET',
            new apigateway.LambdaIntegration(importProductsFileLambda),
            {
                requestParameters: {
                    "method.request.querystring.name": true,
                },
                requestValidatorOptions: {
                    requestValidatorName: "ImportProductsFile-querystring-validator",
                    validateRequestParameters: true,
                    validateRequestBody: false,
                },
            }
        );

    }
}

export { ApiGatewayImportService }