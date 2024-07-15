import { Construct } from 'constructs';
import * as cdk from "aws-cdk-lib";
import { ITable} from "aws-cdk-lib/aws-dynamodb";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
//import { DynamoDB, } from '@aws-sdk/client-dynamodb';
import { DYNAMODB } from '../../constants/constants';


export class GetProductsTable {
    getProductsTable: ITable

    constructor(scope: Construct, id: string) {

        const getProductsTable = new dynamodb.Table(
            scope,
            id,
            {
              partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
              tableName: DYNAMODB.PRODUCTS_TABLE,
              removalPolicy: cdk.RemovalPolicy.DESTROY,
            }
        );

        this.getProductsTable = getProductsTable;

/*
        const dynamoDB = new DynamoDB({});

        const tables = dynamoDB.listTables()

        if (tables!.TableNames!.indexOf(DYNAMODB.PRODUCTS_TABLE) < 0) {
            const getProductsTable = new dynamodb.Table(
                scope,
                id,
                {
                  partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
                  tableName: DYNAMODB.PRODUCTS_TABLE,
                  removalPolicy: cdk.RemovalPolicy.DESTROY,
                  //removalPolicy: cdk.RemovalPolicy.RETAIN,
                }
            );

            this.getProductsTable = getProductsTable;

        } else {
            const getProductsTable = dynamodb.Table.fromTableName(
                scope,
                id,
                DYNAMODB.PRODUCTS_TABLE
            )

            this.getProductsTable = getProductsTable;
        }
*/        
    }
}
