const appName = "ShopSite";
const taskNum = "306"

const DOMANE_NAME = "execute-api.eu-north-1.amazonaws.com"

const API_PATHS = {
    s3: `s3.${DOMANE_NAME}`,
    product: "https://.execute-api.eu-west-1.amazonaws.com/dev",
    order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
    import: "https://.execute-api.eu-west-1.amazonaws.com/dev",
    bff: "https://.execute-api.eu-west-1.amazonaws.com/dev",
    cart: "https://.execute-api.eu-west-1.amazonaws.com/dev",
};
  
  

export {API_PATHS, appName, taskNum}