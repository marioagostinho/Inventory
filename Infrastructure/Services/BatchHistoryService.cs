using Core.Enums;
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

        public IQueryable<BatchHistory> GetBatchHistories()
        {
            var context = _dbContext.CreateDbContext();
            context.Database.EnsureCreated();

            return context.BatchesHistory
                .Include(b => b.Batch)
                .Include(b => b.Batch.Product);
        }
    }
}
