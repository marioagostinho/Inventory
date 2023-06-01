using Core.Enums;
using Core.Helpers;
using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace Infrastructure.Services
{
    public class BatchService : IBatchService
    {
        private readonly IDbContextFactory<InventoryDbContext> _dbContext;

        public BatchService(IDbContextFactory<InventoryDbContext> dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IQueryable<Batch>> GetBatchesAsync()
        {
            try
            {
                //Create DB context while is being used
                using (var context = _dbContext.CreateDbContext())
                {
                    //Ensure that is created cause is InMemory
                    await context.Database.EnsureCreatedAsync();

                    //Get list of Batches
                    //That aren't deleted and have a quantity bigger than 0
                    //Includes it's Product
                    var batches = await context.Batches
                        .Where(b => !b.IsDeleted && b.Quantity > 0)
                        .OrderByDescending(b => b.Id)
                        .Include(b => b.Product)
                        .ToListAsync();

                    if(batches == null)
                    {
                        throw new Exception("Error in GetBatchesAsync: batches was null");
                    }

                    //Convert batches to IQueryable
                    return batches.AsQueryable();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Batch> AddOrUpdateBatchAsync(Batch batch, BatchHistory batchHistory)
        {
            try
            {
                var context = _dbContext.CreateDbContext();
                context.Database.EnsureCreated();

                Batch NewBatch;

                if (batch.Id == null || batch.Id == 0)
                {
                    NewBatch = new Batch(
                        batch.ProductId,
                        batch.Quantity,
                        batch.ExpirationDate,
                        batch.IsDeleted
                    );

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

                    NewBatch.ProductId = batch.ProductId;
                    NewBatch.Quantity = batch.Quantity;
                    NewBatch.ExpirationDate = batch.ExpirationDate;
                    NewBatch.IsDeleted = batch.IsDeleted;

                    context.Batches.Update(NewBatch);
                }

                BatchHistory newBatchHistory = new BatchHistory(
                    NewBatch.Id,
                    batchHistory.Quantity,
                    DateTime.Now,
                    batchHistory.Type,
                    batchHistory.Comment
                );

                context.BatchesHistory.Add(newBatchHistory);

                await context.SaveChangesAsync();

                return NewBatch;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in AddOrUpdateBatchAsync: {ex.Message}");
            }
        }

        public async Task<bool> AddBatchOrderOutAsync(int productId, BatchHistory batchHistory)
        {
            try
            {
                var context = _dbContext.CreateDbContext();
                context.Database.EnsureCreated();

                int quantity = batchHistory.Quantity;

                var batchList = await context.Batches
                    .Where(b => b.ProductId == productId && b.ExpirationDate > DateTime.Now && b.IsDeleted == false)
                    .ToListAsync();

                if (quantity > batchList.Sum(b => b.Quantity))
                    return false;

                foreach (var batch in batchList)
                {
                    int recordedBatchQuantity = batch.Quantity;

                    if (batch.Quantity > quantity)
                    {
                        recordedBatchQuantity = -quantity;
                        batch.Quantity -= quantity;
                        quantity = 0;
                    }
                    else
                    {
                        recordedBatchQuantity = -batch.Quantity;
                        quantity -= batch.Quantity;
                        batch.Quantity = 0;
                        batch.IsDeleted = true;
                    }

                    BatchHistory newBatchHistory = new BatchHistory(
                        batch.Id,
                        recordedBatchQuantity,
                        DateTime.Now,
                        batchHistory.Type,
                        batchHistory.Comment
                    );

                    context.Batches.Update(batch);
                    context.BatchesHistory.Add(newBatchHistory);

                    if (quantity == 0)
                    {
                        break;
                    }
                }

                await context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in AddBatchOrderOutAsync: {ex.Message}");
            }
        }

        public async Task<bool> DeleteBatchAsync(int batchId)
        {
            try
            {
                var context = _dbContext.CreateDbContext();
                context.Database.EnsureCreated();

                var batch = await context.Batches
                                        .Where(b => b.Id == batchId)
                                        .FirstOrDefaultAsync();

                if (batch == null)
                {
                    throw new Exception($"Batch with id {batchId} was not found");
                }

                batch.IsDeleted = true;

                BatchHistory NewBatchHistory = new BatchHistory(
                    batch.Id,
                    -batch.Quantity,
                    DateTime.Now,
                    EHistoryType.Deleted,
                    "Batch deleted"
                );

                context.BatchesHistory.Add(NewBatchHistory);
                context.Batches.Update(batch);

                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in DeleteBatchAsync: {ex.Message}");
            }
        }
    }
}

