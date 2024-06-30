import { Construct } from 'constructs';
import { IRestApi, IResource, MockIntegration, PassthroughBehavior } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';


class ApiGatewayImportService {
    apiGatewayProductService: IRestApi

    constructor(scope: Construct, id: string, importProductsFileLambda: IFunction) {

        const api = new apigateway.RestApi(scope, id, {
            description: 'Import service api.',
        });

        const apiImportProductsFilePath = api.root.addResource('import'); 

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

        addCorsOptions(apiImportProductsFilePath);

    }
}

function addCorsOptions(apiResource: IResource) {
    apiResource.addMethod('OPTIONS', new MockIntegration({
      // In case you want to use binary media types, uncomment the following line
      // contentHandling: ContentHandling.CONVERT_TO_TEXT,
      integrationResponses: [{
        statusCode: '200',
        responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'Oigin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials': "'false'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
        },
      }],
      // In case you want to use binary media types, comment out the following line
      //passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": "{\"statusCode\": 200}"
      },
    }), {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Credentials': false,
          'method.response.header.Access-Control-Allow-Origin': true,
        },
      }]
    })
  }

export { ApiGatewayImportService }