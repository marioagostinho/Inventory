using Core.Models;

namespace Core.Interfaces
{
    public interface IBatchHistoryService
    {
        Task<IQueryable<BatchHistory>> GetBatchHistorieAsync();
    }
}
