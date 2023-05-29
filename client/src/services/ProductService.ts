import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';

import { GET_PRODUCTS_QUERY, GET_PRODUCT_BY_ID_QUERY } from './GraphQL/Queries/products-queries';
import { ADD_UPDATE_PRODUCT_MUTATION, DELETE_PRODUCT_BY_ID_MUTATION } from './GraphQL/Mutations/products-mutations';

export default class ProductService {
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
    async GetProducts() {
        try {
            const { data } = await this.client.query({
                query: GET_PRODUCTS_QUERY
            })

            return data;
        } catch (error) {
            console.error(error);
            
            throw error;
        }
    }

    async GetProductById(id: number) {
        try {
            const { data } = await this.client.query({
                query: GET_PRODUCT_BY_ID_QUERY,
                variables: { id }
            })

            return data;
        } catch (error) {
            console.error(error);
            
            throw error;
        }
    }

    async AddOrUpdateProduct(newProduct: any) {
        try {
            const { data } = await this.client.mutate({
                mutation: ADD_UPDATE_PRODUCT_MUTATION,
                variables: {
                    product: newProduct
                }
            })

            return data;
        } catch (error) {
            console.error(error);
            
            throw error;
        }
    }

    async DeleteProductById(productId: number) {
        console.log(productId);
        try {
            const { data } = await this.client.mutate({
                mutation: DELETE_PRODUCT_BY_ID_MUTATION,
                variables: {  productId: productId }
            })

            return data;
        } catch (error) {
            console.error(error);
            
            throw error;
        }
    }
}