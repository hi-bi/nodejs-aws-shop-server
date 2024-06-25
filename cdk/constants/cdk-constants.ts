const appName = "ShopServer";
const taskNum = "511"
const DYNAMODB = {
    PRODUCTS_TABLE: 'products' + taskNum,
    STOCKS_TABLE: 'stocks' + taskNum,
    IMPORT_BUCKET_NAME: 'importBucket' + taskNum,
}

export {appName, taskNum, DYNAMODB}