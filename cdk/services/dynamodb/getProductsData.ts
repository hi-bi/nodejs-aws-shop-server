import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { GetCommand, ScanCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { IAvailableProduct, IStock, IProduct } from '../../entities/entity-product';
import { randomUUID } from 'crypto';

const dbClient = new DynamoDB({});

class GetProductsData {
    
    protected env = {
        PRODUCTS_TABLE: process.env.PRODUCTS_TABLE,
        STOCKS_TABLE: process.env.STOCKS_TABLE,
    }

    async getAvailableProducts(): Promise<IAvailableProduct[]> {

        const stocksData = await dbClient.send(
            new ScanCommand({
                TableName: this.env.STOCKS_TABLE,
            })
        );

        const stocksMap = new Map<IStock['product_id'], IStock>();
        
        (stocksData.Items as IStock[])?.forEach(
            item => {
                stocksMap.set(item.product_id, item);
            }
        );

        const productsData = await dbClient.send(
            new ScanCommand({
                TableName: this.env.PRODUCTS_TABLE,
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

        const productsData = await dbClient.send(
            new GetCommand({
                TableName: this.env.PRODUCTS_TABLE,
                Key: { id },
              })
        );

        if (!productsData.Item) {
            return undefined;
        }

        const stocksData = await dbClient.send(
            new GetCommand({
                TableName: this.env.STOCKS_TABLE,
                Key: { product_id: id },
              })
        );

        const productById = {
            ...(productsData.Item as IProduct),
            count: stocksData.Item?.count || 0
        }
  
      return productById;
    }

    async createProduct( newAvailableProduct: IAvailableProduct): Promise<IAvailableProduct> {

        const id = randomUUID();

        const newProduct: IProduct = { ...newAvailableProduct, id};
        const newStock: IStock = { ...newAvailableProduct, product_id: id};

        const trans = new TransactWriteCommand({
            TransactItems: [
              {
                Put: {
                  TableName: this.env.PRODUCTS_TABLE,
                  Item: newProduct,
                },
              },
              {
                Put: {
                  TableName: this.env.STOCKS_TABLE,
                  Item: newStock,
                },
              },
            ],
        });

        const transData = await dbClient.send(trans);

        console.log('transData response: ', transData);

        return { ...newAvailableProduct, id}
    }

}

const getProductsData = new GetProductsData();


export { getProductsData }