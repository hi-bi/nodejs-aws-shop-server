import { NodeJsClient } from "@smithy/types";
import { S3Event } from 'aws-lambda';
import { Readable } from "node:stream";
import * as fs from 'fs';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Logger } from '@aws-lambda-powertools/logger';
import csvParser from "csv-parser"; 

const s3Client = new S3Client({})

const logger = new Logger();

export const handler = async (
    event: S3Event,
    ): Promise<any> => {

    try {
        console.log('ImportProductsFile lambda event: ', JSON.stringify(event, null, 4));

        for (const record of event.Records) {
            const bucketName = record?.s3?.bucket?.name || '';
            const objectKey = record?.s3?.object?.key || '';
            
            logger.info("starting download from s3", { bucketName, objectKey });


            const readableStream = (
                await s3Client.send(
                    new GetObjectCommand({
                        Bucket: bucketName,
                        //Key: `${BASE_PATH}/${path}`,
                        Key: objectKey,
                    }),
                )
            ).Body as Readable;


            const csvStream = readableStream.pipe(csvParser())
            .on('data', function(data){
                logger.info("Products record: ", { data });

                //console.log("Product title is: "+data.title);
        
                //perform the operation
            })
            .on('end',function(){
                //some final operation
                logger.info("Products parsed");

            });  

            const response = await s3Client.send(new PutObjectCommand({
                Bucket: 'my-bucket',
                Key: 'parsed/test.txt',
                Body: csvStream,
            }));

        }
            
    } catch (error) {
        console.log('error: ', error);

//        return {
//        };
            
    }    
};