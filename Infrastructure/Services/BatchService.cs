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
                .Where(b => !b.IsDeleted && b.Quantity > 0)
                .Include(b => b.Product);
        }

        public async Task<Batch> AddOrUpdateBatchAsync(Batch batch)
        {
            var context = _dbContext.CreateDbContext();
            context.Database.EnsureCreated();

            Batch NewBatch;

            if (batch.Id == null || batch.Id == 0)
            {
                NewBatch = new Batch(batch.ProductId, batch.Quantity, batch.ExpirationDate, batch.IsDeleted);

                await context.Batches.AddAsync(NewBatch);
            }
            else
            {
                NewBatch = await context.Batches
                    .Where(b => b.Id == batch.Id)
                    .FirstOrDefaultAsync();

                if (NewBatch == null)
                {
                    throw new Exception($"Batch with id {NewBatch.Id} was not found");
                }
                else
                {
                    NewBatch.ProductId = batch.ProductId;
                    NewBatch.Quantity = batch.Quantity;
                    NewBatch.ExpirationDate = batch.ExpirationDate;
                    NewBatch.IsDeleted = batch.IsDeleted;

                    context.Batches.Update(NewBatch);
                }
            }

            await context.SaveChangesAsync();

            return NewBatch;
        }

        public async Task<bool> DeleteBatchAsync(int batchId)
        {
            var context = _dbContext.CreateDbContext();
            context.Database.EnsureCreated();

            var batch = await context.Batches
                                    .Where(b => b.Id == batchId)
                                    .FirstOrDefaultAsync();

            if(batch == null)
            {
                throw new Exception($"Batch with id {batchId} was not found");
            }

            batch.IsDeleted = true;

            context.Batches.Update(batch);

            return await context.SaveChangesAsync() > 0;
        }
    }
}

