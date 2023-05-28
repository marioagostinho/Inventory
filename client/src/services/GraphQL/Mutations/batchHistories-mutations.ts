import { gql } from 'apollo-boost';

export const ADD_UPDATE_BATCH_HISTORY_MUTATION = gql`
mutation addOrUpdateBatch($batchHistory: BatchHistoryInput!) {
    addBatchHistory (batchHistory: $batchHistory) {
        id
        batchId
        quantity
        date
        type
        comment
    }
}
`;