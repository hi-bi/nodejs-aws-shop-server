const appName = "ShopServer";
const taskNum = "711"
const DYNAMODB = {
    PRODUCTS_TABLE: 'products' + taskNum,
    STOCKS_TABLE: 'stocks' + taskNum,
}
const S3 = {
    REGION: 'eu-north-1',
    IMPORT_BUCKET_ID: 'importBacket' + taskNum,
    IMPORT_BUCKET_NAME: 'importbacketrss',
    IMPORT_UPLOADED_PREFIX: 'uploaded/',
    IMPORT_UPLOADED_SUFFIX: 'csv',
}

const QUEUE = {
    CATALOG_ITEMS_QUEUE_ID: `catalogsItemQueue${taskNum}`,
    CATALOG_ITEMS_QUEUE_NAME: 'catalogsItemQueue',
    CATALOG_ITEMS_QUEUE_ARN: `arn:aws:sqs:eu-north-1:XXXXXXXXXXXX:catalogsItemQueue`,
    IMPORT_PRODUCTS_TOPIC_ID: `importProductsTopic${taskNum}`,
    IMPORT_PRODUCTS_TOPIC_NAME: 'importProductsTopic',
    SUBSCRIPTION_ID: `importProductsSubscription${taskNum}`,
    FILTER_SUBSCRIPTION_ID: `importProductsFilterSubscription${taskNum}`,
    SUBSCRIPTION_EMAIL: 'test@test.com',
    FILTER_SUBSCRIPTION_EMAIL: 'test@test.com'
}

const AUTH = {
    BASIC_AUTHORIZER_HANDLER_ARN: 'arn:aws:lambda:eu-north-1:123456789012:function:my-function'
}
const LOGGING = {
    IMPORT_FILE_PARSER: 'INFO',
}

export {appName, taskNum, AUTH, DYNAMODB, S3, LOGGING, QUEUE}