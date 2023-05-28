using Core.Models;

namespace Core.Interfaces
{
    public interface IBatchService
    {
        IQueryable<Batch> GetBatches();
        Task<Batch> AddOrUpdateBatchAsync(Batch batch);
        Task<bool> DeleteBatchAsync(int batchId);
    }
}
