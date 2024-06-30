const appName = "ShopServer";
const taskNum = "513"
const DYNAMODB = {
    PRODUCTS_TABLE: 'products' + taskNum,
    STOCKS_TABLE: 'stocks' + taskNum,
}

const S3 = {
    IMPORT_BUCKET_ID: 'importBacket' + taskNum,
    IMPORT_BUCKET_NAME: 'importbacketrss',
}

export {appName, taskNum, DYNAMODB, S3}