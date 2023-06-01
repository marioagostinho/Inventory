using Core.Models;

namespace Core.Interfaces
{
    public interface IBatchService
    {
        Task<IQueryable<Batch>> GetBatchesAsync();
        Task<Batch> AddOrUpdateBatchAsync(Batch batch, BatchHistory batchHistory);
        Task<bool> AddBatchOrderOutAsync(int productId, BatchHistory batchHistory);
        Task<bool> DeleteBatchAsync(int batchId);
    }
}
