import { gql } from 'apollo-boost';

export const ADD_UPDATE_BATCH_MUTATION = gql`
  mutation addOrUpdateBatch($batch: BatchInput!, $batchHistory: BatchHistoryInput!) {
      addOrUpdateBatch (batch: $batch, batchHistory: $batchHistory) {
          id
          productId
          quantity
          expirationDate
    }
  }
`;

export const ADD_BATCH_ORDER_OUT_MUTATION = gql`
  mutation addBatchOrderOut($productId: Int! $batchHistory:BatchHistoryInput!) {
  addBatchOrderOut(productId: $productId, batchHistory: $batchHistory)
}
`;

export const DELETE_BATCH_BY_ID_MUTATION = gql`
  mutation deleteBatch($batchId: Int!) {
    deleteBatch(batchId: $batchId)
  }
`;