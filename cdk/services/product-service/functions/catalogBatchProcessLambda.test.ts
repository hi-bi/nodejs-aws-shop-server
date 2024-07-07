import { handler } from './catalogBatchProcessLambda';
import { getProductsData } from '../../../dynamodb/product-storage/getProductsData';
import snsClient from '../snsClient'; 
import { beforeEach, describe, it } from 'node:test';


jest.mock( '../../../dynamodb/product-storage/getProductsData');
jest.mock( '../snsClient', () => ({
    send: (command) => command
}));

const PRODUCT_MOCK = {
    title: 'Mock Product',
    description: 'Mock Description',
    price: 99.99,
    count: 99,
}

describe( 'catalogBatchProcess', () => {
    beforeEach( () => {
        jest.clearAllMocks();
    });

    it( 'should return result', () => {
        getProductsData.createProduct.mockReturnValueOnce( Promise.resolve(PRODUCT_MOCK));
        const response = await handler( { Records: [{  body: JSON.stringify(PRODUCT_MOCK) }] });
        expect(response.statusCode).toBe( 201);
    });


    it( 'should return result', () => {
        getProductsData.createProduct.mockReturnValueOnce( Promise.reject('Error'));
        const response = await handler( { Records: [{  body: JSON.stringify(PRODUCT_MOCK) }] });
        expect(response.statusCode).toBe( 500);
    });

});