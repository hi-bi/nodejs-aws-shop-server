import { Construct } from 'constructs';
import { GetProductsList } from './GetProductsList';
import { GetProductById } from './GetProductsById';
import { ApiGatewayProductService } from './ApiGatewayProductService';


export class ProductService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const getProductsList = new GetProductsList(this, 'getProductsListLambda').getProductsList;

        const getProductById = new GetProductById(this, 'getProductsByIdLambda').getProductById;

        const apiGatewayProductService = new ApiGatewayProductService(this, 'product-service-api',
            getProductsList,
            getProductById,
        ).apiGatewayProductService;

    }
}