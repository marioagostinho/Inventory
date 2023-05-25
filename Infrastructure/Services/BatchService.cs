using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class BatchService : IBatchService
    {
        private readonly IDbContextFactory<InventoryDbContext> _dbContext;

        public BatchService(IDbContextFactory<InventoryDbContext> dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<Batch> GetBatches()
        {
            var context = _dbContext.CreateDbContext();
            context.Database.EnsureCreated();

            return context.Batches
                .Where(b => !b.IsDeleted)
                .Include(b => b.Product);
        }
    }
}
