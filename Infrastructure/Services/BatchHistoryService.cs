using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class BatchHistoryService : IBatchHistoryService
    {
        private readonly IDbContextFactory<InventoryDbContext> _dbContext;

        public BatchHistoryService(IDbContextFactory<InventoryDbContext> dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IQueryable<BatchHistory>> GetBatchHistorieAsync()
        {
            try
            {
                //Create DB context while is being used
                using (var context = _dbContext.CreateDbContext())
                {
                    //Ensure that is created cause is InMemory
                    context.Database.EnsureCreated();

                    //Get List of BatchHistory
                    //Includes it's Batch
                    var batchHistories = await context.BatchesHistory
                        .OrderByDescending(b => b.Id)
                        .Include(b => b.Batch)
                        .ToListAsync();

                    //Convert batchHistories to IQueryable
                    return batchHistories.AsQueryable();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in GetBatchHistories: {ex.Message}");
            }
        }
    }
}
