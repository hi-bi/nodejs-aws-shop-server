import { Construct } from 'constructs';
import { GetProductsList } from './GetProductsList';
import { GetProductById } from './GetProductsById';
import { CreateProduct } from './CreateProduct';
import { ApiGatewayProductService } from './ApiGatewayProductService';
import { GetProductsTable } from '../dynamodb/getProductsTable';
import { GetStocksTable } from '../dynamodb/getStocksTable';
import { taskNum } from '../../constants/constants';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { CreateProductTopic } from './CreateProductTopic';
import { QUEUE } from '../../constants/constants';
import { CatalogBatchProcessLambda } from './catalogBatchProcess';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { CfnOutput } from 'aws-cdk-lib';


export class ProductService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const getProductsTable = new GetProductsTable( scope, `ProductsTable-${taskNum}`).getProductsTable;

        const getStocksTable = new GetStocksTable( scope, `StocksTable-${taskNum}`).getStocksTable;
  
        const getProductsList = new GetProductsList( scope, `getProductsList-${taskNum}`,
            getProductsTable.tableName,
            getStocksTable.tableName
        ).getProductsList;

        const getProductById = new GetProductById( scope, `getProductsById-${taskNum}`,
            getProductsTable.tableName,
            getStocksTable.tableName
        ).getProductById;

        const createProduct = new CreateProduct( scope, `createProduct-${taskNum}`,
            getProductsTable.tableName,
            getStocksTable.tableName
        ).createProduct

        getProductsTable.grantReadData(getProductsList);
        getProductsTable.grantReadData(getProductById);
        getProductsTable.grantWriteData(createProduct);

        getStocksTable.grantReadData(getProductsList);
        getStocksTable.grantReadData(getProductById);
        getStocksTable.grantWriteData(createProduct);


        const apiGatewayProductService = new ApiGatewayProductService( scope, `product-service-api-${taskNum}`,
            getProductsList,
            getProductById,
            createProduct
        ).apiGatewayProductService;


        const catalogItemsQueue = new Queue( scope, QUEUE.CATALOG_ITEMS_QUEUE_ID,
            {
                queueName: QUEUE.CATALOG_ITEMS_QUEUE_NAME
            }
        );

        new CfnOutput(scope, `catalogItemsQueueOtput-${taskNum}`,
            {
                value: catalogItemsQueue.queueArn,
            }
        );
        
        const createProductTopic = new CreateProductTopic( scope, QUEUE.IMPORT_PRODUCTS_TOPIC_ID,
                QUEUE.IMPORT_PRODUCTS_TOPIC_NAME,
        )


        const catalogBatchProcessLambda = new CatalogBatchProcessLambda( scope, `catalogBatchProcess-${taskNum}`,
            createProductTopic.createProductTopicArn,
            getProductsTable.tableName,
            getStocksTable.tableName
        ).catalogBatchProcessLambda

        getProductsTable.grantWriteData(catalogBatchProcessLambda);
        getStocksTable.grantWriteData(catalogBatchProcessLambda);

        createProductTopic.createProductTopic.grantPublish(catalogBatchProcessLambda);
        catalogBatchProcessLambda.addEventSource( new SqsEventSource( catalogItemsQueue, 
            {
                batchSize: 5,
            }
        ))

    }
}