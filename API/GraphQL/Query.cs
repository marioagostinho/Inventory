using Core.Interfaces;
using Core.Models;

namespace API.GraphQL
{
    public class Query
    {
        [UseFiltering]
        public IQueryable<Product> GetProducts([Service] IProductService productService)
        {
            return productService.GetProducts();
        }

        [UseFiltering]
        public IQueryable<Batch> GetBatches([Service] IBatchService batchService)
        {
            return batchService.GetBatches();
        }

        [UseFiltering]
        public IQueryable<BatchHistory> GetBatchHistories([Service] IBatchHistoryService batchHistoryService)
        {
            return batchHistoryService.GetBatchHistories();
        }
    }
}
