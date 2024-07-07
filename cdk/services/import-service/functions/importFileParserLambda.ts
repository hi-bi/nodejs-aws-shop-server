    //import { NodeJsClient } from "@smithy/types";
    import { S3Event } from 'aws-lambda';
    import { Readable, Writable, Stream, Transform } from "node:stream";
    import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
    import csvParser from "csv-parser";
    import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { IProduct } from '../../../entities/entity-product';

    const s3Client = new S3Client({})
    const sqsClient = new SQSClient({});
    
    export const handler = async (
        event: S3Event,
        ): Promise<any> => {

        try {
            console.log('ImportFileParser lambda event: ', JSON.stringify(event, null, 4));

            //for (const record of event.Records) {
                const bucketName = event.Records[0].s3?.bucket?.name || '';
                const objectKey = event.Records[0].s3?.object?.key || '';
                
                //console.log("starting parse from s3");
                const sourceFileParam = {
                    Bucket: bucketName,
                    Key: objectKey,
                }

                const getFileCommand = new GetObjectCommand(sourceFileParam);

                const readableFileStream = (await s3Client.send(getFileCommand)).Body as Readable;
                
                console.log("readableStream created");

                const parsedProducts: IProduct[] = [];

                async function streamParser(readableStream: Transform) {
                    return new Promise((resolve, reject) => {
                        readableStream
                        .on('data', function(data){
                            console.log("Products record: ", { data });
                            //perform the operation
                            parsedProducts.push(data);
                        })
                        .on('end',function(){
                            //some final operation
                            console.log("Products file parsed and logged");
                            return resolve(parsedProducts);
                        })
                        .on('error', reject);
                    });
                }

                const parseData = await streamParser(readableFileStream.pipe(csvParser()));
                console.log("Parsed data: ", parsedProducts, parseData);

                parsedProducts.forEach(async (product, index) => {
                    const sendProduct = await sqsClient.send(
                        new SendMessageCommand(
                            {
                                QueueUrl: process.env.IMPORT_SQS_URL,
                                MessageBody: JSON.stringify(product)
                            }
                        )
                    );
                    console.log("sendProduct: ", sendProduct);
                })

                const fileName = objectKey.split('/').slice(1);
                const targetKey = 'parsed/' + fileName;
                console.log("Starting Products file move", { targetKey });

                async function copyFileBucket() {
                    const copyCommand = new CopyObjectCommand({
                        CopySource: bucketName + '/' + objectKey,
                        Bucket: bucketName,
                        Key: targetKey,
                    }); 

                    const response = await s3Client.send(copyCommand);
                }

                const copyFile = await copyFileBucket();

                console.log("Starting Products file move", { bucketName }, { targetKey });

                async function deleteFileBucket() {

                    const deleteFileCommand = new DeleteObjectCommand(sourceFileParam);

                    const response = await s3Client.send(deleteFileCommand);
                }

                const deleteFile = await deleteFileBucket();

                console.log("Products file deleted", { sourceFileParam } )

                console.log("Products uploaded");

            //}
    //        return {
    //        }
                
        } catch (error) {

            console.log('error: ', error);

    //        return {
    //        };
                
        }    
    };