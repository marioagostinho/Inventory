using Core.Interfaces;
using Core.Models;

namespace API.GraphQL
{
    public class Mutation
    {
        //GraphQL: Add or Update Product base on the ID
        public async Task<Product> AddOrUpdateProduct([Service] IProductService productService, Product product)
        {
            return await productService.AddOrUpdateProductAsync(product);
        }

        //GraphQL: Add or Update Batch base on the ID
        public async Task<Batch> AddOrUpdateBatch([Service] IBatchService batchService, Batch batch)
        {
            return await batchService.AddOrUpdateBatchAsync(batch);
        }

        //GraphQL: Add History Batch
        public async Task<BatchHistory> AddBatchHistory([Service] IBatchHistoryService batchHistoryService, BatchHistory batchHistory)
        {
            return await batchHistoryService.AddBatchHistory(batchHistory);
        }

        //GraphQL: Delete product by id
        public async Task<bool> DeleteProduct([Service] IProductService productService, int productId)
        {
            return await productService.DeleteProductAsync(productId);
        }

        //GraphQL: Delete batch by id
        public async Task<bool> DeleteBatch([Service] IBatchService batchService, int batchId)
        {
            return await batchService.DeleteBatchAsync(batchId);
        }
    }
}
