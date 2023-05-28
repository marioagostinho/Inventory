import { gql } from 'apollo-boost';

export const ADD_UPDATE_BATCH_MUTATION = gql`
mutation addOrUpdateBatch($batch: BatchInput!) {
    addOrUpdateBatch (batch: $batch) {
        id
        productId
        quantity
        expirationDate
        isDeleted
  }
}
`;