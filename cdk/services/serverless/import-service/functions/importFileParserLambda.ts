//import { NodeJsClient } from "@smithy/types";
import { S3Event } from 'aws-lambda';
import { Readable, Writable, Stream, Transform } from "node:stream";
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client, S3 } from '@aws-sdk/client-s3'
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
            
            logger.info("starting s3 file parse", { bucketName }, { objectKey });
            //console.log("starting parse from s3");
            const sourceFileParam = {
                Bucket: bucketName,
                Key: objectKey,
            }

            const getFileCommand = new GetObjectCommand(sourceFileParam);

            const readableFileStream = (await s3Client.send(getFileCommand)).Body as Readable;

            logger.info("readableStream created");
            console.log("readableStream created");

            logger.info("Starting Products file parse", { readableFileStream });

/*
            const csvStream = readableFileStream.pipe(csvParser())
            .on('data', function(data){
                logger.info("Products record: ", { data });
                console.log("Products record: ", { data });
                //perfsorm the operation
            })
            .on('end',function(){
                //some final operation
                logger.info("Products file parsed and logged");
                console.log("Products file parsed");

            });  
*/

            async function streamParser(readableStream: Transform) {
                return new Promise((resolve, reject) => {
                    readableStream
                    .on('data', function(data){
                        logger.info("Products record: ", { data });
                        console.log("Products record: ", { data });
                        //perfsorm the operation
                    })
                    .on('end',function(){
                        //some final operation
                        logger.info("Products file parsed and logged");
                        console.log("Products file parsed and logged");
        
                    })
                    .on('close',function(){
                        resolve("parsed");
                    })
                    .on('error', reject);
                });
            }

            const parseData = await streamParser(readableFileStream.pipe(csvParser()));


            const fileName = objectKey.split('/').slice(1);
            const targetKey = 'parsed/' + fileName;
            logger.info("Starting Products file move", { targetKey });
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

            logger.info("Products file copied to ", { bucketName }, { targetKey });
            console.log("Starting Products file move", { bucketName }, { targetKey });

            logger.info("Starting Products file delete");


            async function deleteFileBucket() {

                const deleteFileCommand = new DeleteObjectCommand(sourceFileParam);

                const response = await s3Client.send(deleteFileCommand);
            }

            const deleteFile = await deleteFileBucket();

            logger.info("Products file deleted", { sourceFileParam });
            console.log("Products file deleted", { sourceFileParam } )

/* 
            const response = await s3Client.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: 'parsed/test.txt',
                    Body: csvStream, //!!! Error, type missmatch 
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
/* OR
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

            const response = await upload.done();
*/

            logger.info("Products uploaded");
            console.log("Products uploaded");

            const result = 0

        //}
        return {
            result
        }
            
    } catch (error) {

        logger.info("importFileParserLambda error: ", { error });
        console.log('error: ', error);

//        return {
//        };
            
    }    
};