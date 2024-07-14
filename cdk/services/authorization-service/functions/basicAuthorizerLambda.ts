import { AuthResponse, APIGatewayTokenAuthorizerEvent, PolicyDocument } from 'aws-lambda'

export async function handle (event: APIGatewayTokenAuthorizerEvent): Promise<AuthResponse> {
    try {
        console.log('Auth token event: ', JSON.stringify(event));

        if (!event.authorizationToken) {
            throw new Error('Unauthorized');
        }
    
        const encodedCredentials = event.authorizationToken.split(' ')[1];
        
        const buffer = Buffer.from(encodedCredentials, 'base64');
        const credentials = buffer.toString('utf-8').split(':');
        const [accountLogin, pass] = credentials;

        const envPass = process.env[accountLogin];

        const effect = !envPass || pass != envPass ? 'Deny' : 'Allow';

        const policyDocument = {} as PolicyDocument
        policyDocument.Version = '2012-10-17';
        
        policyDocument.Statement = [];

        const statementOne: any = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = event.methodArn;
        policyDocument.Statement[0] = statementOne;

        console.log('policyDocument: ', policyDocument);
  
        return {
            principalId: encodedCredentials,
            policyDocument: policyDocument
        } as AuthResponse
    
    } catch (error) {
        console.error('an error happened during authorization', error);
        throw new Error('Unauthorized');
    }
}