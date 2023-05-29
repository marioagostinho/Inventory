import { gql } from 'apollo-boost';

export const ADD_UPDATE_PRODUCT_MUTATION = gql`
  mutation addProduct($product: ProductInput!) {
    addOrUpdateProduct (product: $product) {
      id
      name
      isDeleted
    }
  }
`;

export const DELETE_PRODUCT_BY_ID_MUTATION = gql`
  mutation deleteProduct($productId: Int!) {
    deleteProduct(productId: $productId)
  }
`;