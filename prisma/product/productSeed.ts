const productData = [
  {
    id: 'generated',
    name: 'Product_1',
    barcode: 1223444444,
  },
  {
    id: 'generated',
    name: 'Product_2',
    barcode: 1223444444,
  },
  {
    id: 'generated',
    name: 'Product_3',
    barcode: 1223444444,
  },
  {
    id: 'generated',
    name: 'Product_4',
    barcode: 1223444444,
  },
  {
    id: 'generated',
    name: 'Product_5',
    barcode: 1223444444,
  },
  {
    id: 'generated',
    name: 'Product_6',
    barcode: 1223444444,
  },
  {
    id: 'generated',
    name: 'Product_7',
    barcode: 1223444444,
  },
];

export async function getProductDataForSeed() {
  return productData;
}

export const productSeed = {
  getProductDataForSeed,
};
