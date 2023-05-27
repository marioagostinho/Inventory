import { gql } from 'apollo-boost';

export const GET_BATCHES_QUERY = gql`
query GetBatches {
    batches {
        id
        product {
            id
            name
        }
        quantity
        expirationDate
    }
}
`;