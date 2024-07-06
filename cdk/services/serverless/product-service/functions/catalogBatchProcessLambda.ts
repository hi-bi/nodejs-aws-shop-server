    import { snsClient } from '../snsClient';
    import { PublishCommand } from "@aws-sdk/client-sns";
    import { SQSEvent, SQSHandler} from "aws-lambda";
    import { getProductsData } from "../../../dynamodb/product-storage/getProductsData";

    export const handler: SQSHandler = async (
        event: SQSEvent,
        ): Promise<any> => {

        try {
            console.log('catalogItemsQueue event: ', JSON.stringify(event, null, 4));

            const records = event.Records;

            for (const record of records) {
                
                const product = JSON.parse(record?.body);

                product.price = Number(product.price);
                product.count = Number(product.count);

                console.log("product: ", product);

                const createdAvailableProduct = await getProductsData.createProduct( product );

                console.log('New available product: ', createdAvailableProduct);

                const publishCommand = new PublishCommand({
                    Subject: 'New product added to Products catalog',   //?
                    Message: JSON.stringify(createdAvailableProduct),
                    TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN,
                    MessageAttributes: {
                        'count': {
                            DataType: 'Number',
                            StringValue: createdAvailableProduct.count.toString(),
                        }
                    }
                })

                console.log('publishCommand: ', publishCommand);

                await snsClient.send(publishCommand);

            }

            return {
                statusCode: 200,
                body: JSON.stringify(records),
            }
                
        } catch (error) {

            console.log('error: ', error);

            return {
                statusCode: 400,
                body: JSON.stringify({"message": "Error"}),
            };
               
        }    
    };