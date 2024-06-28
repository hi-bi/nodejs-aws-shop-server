//import { NodeJsClient } from "@smithy/types";
import { S3Event } from 'aws-lambda';
import { Readable, Stream, Transform, TransformCallback } from "node:stream";
import { GetObjectCommand, PutObjectCommand, S3Client, S3 } from '@aws-sdk/client-s3'
import { Upload } from "@aws-sdk/lib-storage";
import { Logger } from '@aws-lambda-powertools/logger';
import csvParser from "csv-parser"; 

const s3Client = new S3Client({})
const s3 = new S3({})

const logger = new Logger();

export const handler = async (
    event: S3Event,
    ): Promise<any> => {

    try {
        console.log('ImportFileParser lambda event: ', JSON.stringify(event, null, 4));

        //for (const record of event.Records) {
            const bucketName = event.Records[0].s3?.bucket?.name || '';
            const objectKey = event.Records[0].s3?.object?.key || '';
            
            logger.info("starting download from s3", { bucketName }, { objectKey });
            console.log("starting download from s3");

            const readableStream = (
                await s3Client.send(
                    new GetObjectCommand({
                        Bucket: bucketName,
                        //Key: `${BASE_PATH}/${path}`,
                        Key: objectKey,
                    }),
                )
            ).Body as Readable;

            logger.info("readableStream created", { readableStream });
            console.log("readableStream created", { readableStream });
//            console.log("readableStream created");

            const csvStream = readableStream.pipe(csvParser())
            .on('data', function(data){
                logger.info("Products record: ", { data });
                console.log("Products record: ", { data });

                //console.log("Product title is: "+data.title);
        
                //perfsorm the operation
            })
            .on('end',function(){
                //some final operation
                //logger.info("Products parsed");
                console.log("Products parsed");

            });  

/*
            const response = await s3Client.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: 'parsed/test.txt',
                    Body: csvStream,
                })
            );
*/

/*
            async function streamToBuffer(readableStream: Readable): Promise<Buffer> {
                return new Promise((resolve, reject) => {
                    const chunks: any[] = [];
                    readableStream.on('data', data => {
                        if (typeof data === 'string') {
                            // Convert string to Buffer assuming UTF-8 encoding
                            chunks.push(Buffer.from(data, 'utf-8'));
                        } else if (data instanceof Buffer) {
                            chunks.push(data);
                            } else {
                                // Convert other data types to JSON and then to a Buffer
                                const jsonData = JSON.stringify(data);
                                chunks.push(Buffer.from(jsonData, 'utf-8'));
                        }
                    });
                    readableStream.on('end', () => {
                        resolve(Buffer.concat(chunks));
                    });
                    readableStream.on('error', reject);
                });
            }

            const bufferStream = await streamToBuffer(csvStream);

            logger.info("Products buffered", { bufferStream });
            console.log("Products buffered", { bufferStream });
*/

            const bufferTransform = new Transform({
                objectMode: true,
                transform(chunk, encoding, callback) {
                    const buff = Buffer.from(JSON.stringify(chunk));
                    console.log("transform", buff)
                    callback(null, buff);
                },
            });

            const bufferData = csvStream.pipe(bufferTransform);

            const upload = new Upload({
                client: new S3({}),
                params: {
                    Bucket: bucketName,
                    Key: 'parsed/test.txt',
                    //Body: bufferStream,
                    Body: bufferData,
                    ContentType: 'application/json', //text/plain
                }
            });

            //upload.on('s3 upload progress', (p) => console.log(p));

            const response = await upload.done();

            logger.info("Products uploaded", { response });
            console.log("Products uploaded", { response });

        //}
        return {
            response
        }
            
    } catch (error) {

        logger.info("importFileParserLambda error: ", { error });
        console.log('error: ', error);

//        return {
//        };
            
    }    
};