using Core.Enums;
using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
                .OrderByDescending(b => b.Id)
                .Include(b => b.Batch)
                .Include(b => b.Batch.Product);
        }
    }
}
