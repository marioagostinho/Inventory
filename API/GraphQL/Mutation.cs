using Core.Helpers;
using Core.Interfaces;
using Core.Models;

namespace API.GraphQL
{
    public class Mutation
    {
        //GraphQL: Add or Update Product base on the ID
        public async Task<Product> AddOrUpdateProduct([Service] IProductService productService, Product product)
        {
            try
            {
                //Check if the product is valid by following it's requirements
                var validProduct = ModelValidations.IsFollowingDataAnotations<Product>(product);

                return await productService.AddOrUpdateProductAsync(validProduct);
            }
            catch (Exception ex) 
            {
                throw new Exception($"Error in AddOrUpdateProduct: {ex.Message}");
            }
            
        }

        //GraphQL: Add or Update Batch base on the ID
        public async Task<Batch> AddOrUpdateBatch([Service] IBatchService batchService, Batch batch, BatchHistory batchHistory)
        {
            try
            {
                //Check if batch and bachHistory are valid by following their requirements
                var validBatch = ModelValidations.IsFollowingDataAnotations<Batch>(batch);
                var validBatchHistory = ModelValidations.IsFollowingDataAnotations<BatchHistory>(batchHistory);

                return await batchService.AddOrUpdateBatchAsync(validBatch, validBatchHistory);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in AddOrUpdateBatchAsync: {ex.Message}");
            }
        }

        //GraphQL: Add or Update Batch base on the ID
        public async Task<bool> AddBatchOrderOut([Service] IBatchService batchService, int productId, BatchHistory batchHistory)
        {
            try
            {
                //If productId equal or minor than 0 thow an exception
                if(productId <= 0)
                {
                    throw new Exception($"Error in AddBatchOrderOut: productId must be greater than 0");
                }

                //Check if batchHistory is valid by following its requirements
                var validBatchHistory = ModelValidations.IsFollowingDataAnotations<BatchHistory>(batchHistory);

                return await batchService.AddBatchOrderOutAsync(productId, validBatchHistory);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in AddBatchOrderOut: {ex.Message}");
            }
        }

        //GraphQL: Delete product by id
        public async Task<bool> DeleteProduct([Service] IProductService productService, int productId)
        {
            try
            {
                //If productId equal or minor than 0 thow an exception
                if (productId <= 0)
                {
                    throw new Exception($"Error in AddBatchOrderOut: productId must be greater than 0");
                }

                return await productService.DeleteProductAsync(productId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in DeleteProduct: {ex.Message}");
            }
        }

        //GraphQL: Delete batch by id
        public async Task<bool> DeleteBatch([Service] IBatchService batchService, int batchId)
        {
            try
            {
                //If batchId equal or minor than 0 thow an exception
                if (batchId <= 0)
                {
                    throw new Exception($"Error in AddBatchOrderOut: productId must be greater than 0");
                }

                return await batchService.DeleteBatchAsync(batchId);
            }
            catch(Exception ex)
            {
                throw new Exception($"Error in DeleteBatch: {ex.Message}");
            }
            
        }
    }
}
