import { Construct } from 'constructs';
import * as cdk from "aws-cdk-lib";
import { ITable} from "aws-cdk-lib/aws-dynamodb";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
//import { DynamoDB, } from '@aws-sdk/client-dynamodb';
import { DYNAMODB } from '../../../constants/constants';


export class GetStocksTable {
    getStocksTable: ITable

    constructor(scope: Construct, id: string) {

        const getStocksTable = new dynamodb.Table(
            scope,
            id,
            {
              partitionKey: { name: "product_id", type: dynamodb.AttributeType.STRING },
              tableName: DYNAMODB.STOCKS_TABLE,
              removalPolicy: cdk.RemovalPolicy.DESTROY,
              //removalPolicy: cdk.RemovalPolicy.RETAIN,
            }
        );

        this.getStocksTable = getStocksTable;

/*
        const dynamoDB = new DynamoDB({});

        const tables = dynamoDB.listTables()

        if (tables!.TableNames!.indexOf(DYNAMODB.STOCKS_TABLE) < 0) {
            const getStocksTable = new dynamodb.Table(
                scope,
                id,
                {
                  partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
                  tableName: DYNAMODB.STOCKS_TABLE,
                  removalPolicy: cdk.RemovalPolicy.DESTROY,
                  //removalPolicy: cdk.RemovalPolicy.RETAIN,
                }
            );

            this.getStocksTable = getStocksTable;

        } else {
            const getStocksTable = dynamodb.Table.fromTableName(
                scope,
                id,
                DYNAMODB.STOCKS_TABLE
            )

            this.getStocksTable = getStocksTable;
        }
*/        
    }
}
