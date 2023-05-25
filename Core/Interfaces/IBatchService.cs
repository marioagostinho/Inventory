using Core.Models;

namespace Core.Interfaces
{
    public interface IBatchService
    {
        IQueryable<Batch> GetBatches();
    }
}
