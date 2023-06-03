import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';

import { GET_BATCHES_QUERY, GET_BATCH_BY_ID_QUERY } from './GraphQL/Queries/batches-queries';
import { ADD_BATCH_ORDER_OUT_MUTATION, ADD_UPDATE_BATCH_MUTATION, DELETE_BATCH_BY_ID_MUTATION } from './GraphQL/Mutations/batches-mutations';

export default class BatchService {
    private client: ApolloClient<any>;

    //CONSTRUCTOR
    constructor() {
        const API_BASE_URL = 'http://localhost:5037/graphql'

        const httpLink = new HttpLink({
            uri: `${API_BASE_URL}`
        });

        const link = ApolloLink.from([httpLink]);

        this.client = new ApolloClient({
            link,
            cache: new InMemoryCache(),
        });
    }

    //Get all product that aren't deleted 
    async GetBatches() {
        try {
            const { data } = await this.client.query({
                query: GET_BATCHES_QUERY
            })

            return data;
        } catch (error) {
            console.error(error);
            
            throw error;
        }
    }

    //Get batch by id
    async GetBatchById(id: number) {
        try {
            const { data } = await this.client.query({
                query: GET_BATCH_BY_ID_QUERY,
                variables: { id }
            })

            return data;
        } catch (error) {
            console.error(error);
            
            throw error;
        }
    }

    //Add or updated batch, if batch id equal 0 then add, otherwise update
    async AddOrUpdateBatch(newBatch: any, newBatchHistory: any) {
        try {
            const { data } = await this.client.mutate({
                mutation: ADD_UPDATE_BATCH_MUTATION,
                variables: {
                    batch: newBatch,
                    batchHistory: newBatchHistory
                }
            })

            return data;
        } catch (error) {
            throw error;
        }
    }

    //Add batch order out
    async AddBatchOrderOut(productId: number, newBatchHistory: any) {
        try {
            const { data } = await this.client.mutate({
                mutation: ADD_BATCH_ORDER_OUT_MUTATION,
                variables: {
                    productId: productId,
                    batchHistory: newBatchHistory
                }
            })

            return data;
        } catch (error) {
            console.error(error);
            
            throw error;
        }
    }

    //Delete batch by Id
    async DeleteBatchById(batchId: number) {
        try {
            const { data } = await this.client.mutate({
                mutation: DELETE_BATCH_BY_ID_MUTATION,
                variables: {  batchId: batchId }
            })

            return data;
        } catch (error) {
            console.error(error);
            
            throw error;
        }
    }
}