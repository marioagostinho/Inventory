import { gql } from 'apollo-boost';

export const GET_PRODUCTS_QUERY = gql`
query GetProducts {
    products {
        id
        name
    }
}
`;

export const GET_PRODUCT_BY_ID_QUERY = gql`
query GetProducts($id: Int) {
  products(where: {id: {eq: $id}})
  {
    id
    name
  }
}
`;