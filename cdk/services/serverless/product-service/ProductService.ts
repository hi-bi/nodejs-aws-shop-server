import { Construct } from 'constructs';
import { GetProductsList } from './GetProductsList';
import { GetProductById } from './GetProductsById';
import { CreateProduct } from './CreateProduct';
import { ApiGatewayProductService } from './ApiGatewayProductService';
import { GetProductsTable } from '../../dynamodb/product-storage/getProductsTable';
import { GetStocksTable } from '../../dynamodb/product-storage/getStocksTable';


export class ProductService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const getProductsTable = new GetProductsTable( scope, 'ProductsTable').getProductsTable;

        const getStocksTable = new GetStocksTable( scope, 'StocksTable').getStocksTable;
  
        const getProductsList = new GetProductsList( scope, 'getProductsList',
            getProductsTable.tableName,
            getStocksTable.tableName
        ).getProductsList;

        const getProductById = new GetProductById( scope, 'getProductsById',
            getProductsTable.tableName,
            getStocksTable.tableName
        ).getProductById;

        const postCreateProduct = new CreateProduct( scope, 'postCreateProduct',
            getProductsTable.tableName,
            getStocksTable.tableName
        ).postCreateProduct

        getProductsTable.grantReadData(getProductsList);
        getProductsTable.grantReadData(getProductById);
        getProductsTable.grantWriteData(postCreateProduct);

        getStocksTable.grantReadData(getProductsList);
        getStocksTable.grantReadData(getProductById);
        getStocksTable.grantWriteData(postCreateProduct);

        const apiGatewayProductService = new ApiGatewayProductService( scope, 'product-service-api',
            getProductsList,
            getProductById,
            postCreateProduct
        ).apiGatewayProductService;

    }
}