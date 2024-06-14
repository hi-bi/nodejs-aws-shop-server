// 1) Create the FunctionProps interface for the function parameters that we read in from redirect.ts
interface FunctionProps {
    from: string,
    to: string,
}

// 2) Create a function that uses FunctionProps to create a new redirect function
export function createRedirectFunction(props: FunctionProps) {
    return `function handler(event) {
    var domain = event.context.distributionDomainName;
    
    var response = {
        statusCode: 302,
        statusDescription: 'Found',
        headers:
            { "location": { "value": "https://" + domain + ${JSON.stringify(props.to)} + "/index.html" } }
        };
    return response;
    
    return event.request;
}`
}
