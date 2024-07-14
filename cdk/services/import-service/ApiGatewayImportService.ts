import { Construct } from 'constructs';
import { IRestApi, IResource, MockIntegration, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { Function, IFunction } from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { AUTH } from '../../constants/constants';


class ApiGatewayImportService {
    apiGatewayProductService: IRestApi

    constructor(scope: Construct, id: string, importProductsFileLambda: IFunction) {

        const api = new apigateway.RestApi(scope, id, {
            description: 'Import service api.',
            cloudWatchRole: true,
        });

        const apiImportProductsFilePath = api.root.addResource('import'); 

        const basicAuthorizerHandler = Function.fromFunctionArn(
          scope,
          'basicAuthorizer',
          AUTH.BASIC_AUTHORIZER_HANDLER_ARN
        );

        const tokenAuthorizer = new TokenAuthorizer(scope, 'tokenAuthorizer', {
          handler: basicAuthorizerHandler,
          identitySource: "method.request.header.Authorization",
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
            authorizationType: apigateway.AuthorizationType.CUSTOM,
            authorizer: tokenAuthorizer,
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