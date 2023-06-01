using Core.Interfaces;
using Core.Models;

namespace API.GraphQL
{
    public class Query
    {
        [UseFiltering]
        public async Task<IQueryable<Product>> GetProducts([Service] IProductService productService)
        {
            return  await productService.GetProductsAsync();
        }

        [UseFiltering]
        public async Task<IQueryable<Batch>> GetBatchesAsync([Service] IBatchService batchService)
        {
            return await batchService.GetBatchesAsync();
        }

        [UseFiltering]
        public async Task<IQueryable<BatchHistory>> GetBatchHistories([Service] IBatchHistoryService batchHistoryService)
        {
            return await batchHistoryService.GetBatchHistorieAsync();
        }
    }
}
