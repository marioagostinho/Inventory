import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';

import { GET_BATCH_HISTORY_BY_ID_QUERY, GET_BATCH_HISTORIES_BY_TYPE_QUERY, GET_BATCH_HISTORIES_QUERY } from './GraphQL/Queries/batchHistories-queries';
import { ADD_UPDATE_BATCH_HISTORY_MUTATION } from './GraphQL/Mutations/batchHistories-mutations';

export default class BatchHistoryService {
    private client: ApolloClient<any>;

    //CONSTRUCT APOLLO CLIENT TO DO REQUESTS
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

    //GET ALL PRODUCTS 
    async GetBatchHistories() {
        try {
            const { data } = await this.client.query({
                query: GET_BATCH_HISTORIES_QUERY
            })

            return data;
        } catch (error) {
            console.error(error);
            
            throw error;
        }
    }

    async GetBatchHistoryById(id: number) {
        try {
            const { data } = await this.client.query({
                query: GET_BATCH_HISTORY_BY_ID_QUERY,
                variables: { id }
            })

            return data;
        } catch (error) {
            console.error(error);
            
            throw error;
        }
    }

    async GetBatchHistoriesByType(type: "string") {
        try {
            const { data } = await this.client.query({
                query: GET_BATCH_HISTORIES_BY_TYPE_QUERY,
                variables: { type }
            })

            return data;
        } catch (error) {
            console.error(error);
            
            throw error;
        }
    }

    async AddBatchHistory(newBatchHistory: any) {
        console.log(newBatchHistory);
        try {
            const { data } = await this.client.mutate({
                mutation: ADD_UPDATE_BATCH_HISTORY_MUTATION,
                variables: {
                    batchHistory: newBatchHistory
                }
            })

            return data;
        } catch (error) {
            console.error(error);
            
            throw error;
        }
    }
}