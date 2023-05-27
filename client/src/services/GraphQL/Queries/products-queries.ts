import { gql } from 'apollo-boost';

export const GET_PRODUCTS_QUERY = gql`
query GetProducts {
    products {
        id
        name
    }
}
`;