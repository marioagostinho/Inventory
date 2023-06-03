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
        batchState
    }
}
`;

export const GET_BATCH_BY_ID_QUERY = gql`
query GetBatches($id: Int) {
  batches(where: {id: {eq: $id}})
  {
    id
    product {
      id
      name
    }
    quantity
    expirationDate
    batchState
  }
}
`;