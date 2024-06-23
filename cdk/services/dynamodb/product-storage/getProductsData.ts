import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DYNAMODB } from '../../../constants/cdk-constants';
import { IAvailableProduct, IStock, IProduct } from '../../../entities/entity-product';

const dynamodb = new DynamoDB({});

class GetProductsData {

    async getAvailableProducts(): Promise<IAvailableProduct[]> {

        const stocksData = await dynamodb.send(
            new ScanCommand({
                TableName: DYNAMODB.STOCKS_TABLE,
            })
        );

        const stocksMap = new Map<IStock['product_id'], IStock>();
        
        (stocksData.Items as IStock[])?.forEach(
            item => {
                stocksMap.set(item.product_id, item);
            }
        );

        const productsData = await dynamodb.send(
            new ScanCommand({
                TableName: DYNAMODB.PRODUCTS_TABLE,
            })
        );

        const availableProducts = (productsData.Items as IProduct[])?.map(
            item => {
                return {
                    ...item,
                    count: stocksMap.get(item.id)?.count || 0
                }
            }
        ) || [];

  
      return availableProducts;
    }


    async getProductById(id: IProduct['id']): Promise<IAvailableProduct | undefined> {

        const productsData = await dynamodb.send(
            new GetCommand({
                TableName: DYNAMODB.PRODUCTS_TABLE,
                Key: { id },
              })
        );

        if (!productsData.Item) {
            return undefined;
        }

        const stocksData = await dynamodb.send(
            new GetCommand({
                TableName: DYNAMODB.STOCKS_TABLE,
                Key: { product_id: id },
              })
        );

        const productById = {
            ...(productsData.Item as IProduct),
            count: stocksData.Item?.count || 0
        }
  
      return productById;
    }

}

const getProductsData = new GetProductsData();


export { getProductsData }