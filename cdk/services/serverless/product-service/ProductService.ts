import { Construct } from 'constructs';
import { GetProductsList } from './GetProductsList';
import { GetProductById } from './GetProductsById';
import { ApiGatewayProductService } from './ApiGatewayProductService';
import { GetProductsTable } from '../../dynamodb/product-storage/getProductsTable';
import { GetStocksTable } from '../../dynamodb/product-storage/getStocksTable';


export class ProductService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const getProductsTable = new GetProductsTable( this, 'ProductsTable').getProductsTable;

        const getStocksTable = new GetStocksTable( this, 'StocksTable').getStocksTable;
  
        const getProductsList = new GetProductsList(this, 'ProductsListLambda').getProductsList;

        const getProductById = new GetProductById(this, 'ProductsByIdLambda').getProductById;

        getProductsTable.grantReadData(getProductsList);
        getProductsTable.grantReadData(getProductById);
        getStocksTable.grantReadData(getProductsList);
        getStocksTable.grantReadData(getProductById);

        const apiGatewayProductService = new ApiGatewayProductService(this, 'product-service-api',
            getProductsList,
            getProductById,
        ).apiGatewayProductService;

    }
}