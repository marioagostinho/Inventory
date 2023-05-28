using Core.Models;

namespace Core.Interfaces
{
    public interface IBatchHistoryService
    {
        IQueryable<BatchHistory> GetBatchHistories();
        Task<BatchHistory> AddBatchHistory(BatchHistory batchHistory);
    }
}
