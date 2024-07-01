interface IProduct {
    id: string;
    title: string;
    description?: string;
    price: number;
}
  
interface IStock {
    product_id: IProduct['id'];
    count: number;
}
  
interface IAvailableProduct extends IProduct, Omit<IStock, 'product_id'> {}


export type { IProduct, IStock, IAvailableProduct }
