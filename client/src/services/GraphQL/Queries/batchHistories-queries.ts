import { gql } from 'apollo-boost';

export const GET_BATCH_HISTORIES_QUERY = gql`
query GetBatchHistories {
    batchHistories {
        id
        batch {
            id
            product {
                id
                name
            }
            expirationDate
        }
        quantity
        type
        date
        comment
    }
}
`;

export const GET_BATCH_HISTORIES_BY_TYPE_QUERY = gql`
query GetBatchesHistoryByType($type: EHistoryType) {
    batchHistories(where: {type: {eq: $type}}) {
        id
        batch {
            id
            product {
                id
                name
            }
            expirationDate
        }
        quantity
        type
        date
        comment
    }
}
`;