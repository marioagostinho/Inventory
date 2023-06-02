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
                //Create DB context while is being used
                using (var context = _dbContext.CreateDbContext())
                {
                    //Ensure that is created cause is InMemory
                    context.Database.EnsureCreated();

                    Batch NewBatch;

                    //If Batch Id == null or 0 creates a new Batch
                    if (batch.Id == null || batch.Id == 0)
                    {
                        NewBatch = new Batch(
                            batch.ProductId,
                            batch.Quantity,
                            batch.ExpirationDate
                        );

                        await context.Batches.AddAsync(NewBatch);
                    }
                    else
                    {
                        //Else update by its Id

                        //Get batch by Id
                        NewBatch = await context.Batches
                            .Where(b => b.Id == batch.Id)
                            .FirstOrDefaultAsync();

                        //If NewBatch equals null throw exception
                        if (NewBatch == null)
                        {
                            throw new Exception($"Batch with id {NewBatch.Id} was not found");
                        }

                        NewBatch.ProductId = batch.ProductId;
                        NewBatch.Quantity = batch.Quantity;
                        NewBatch.ExpirationDate = batch.ExpirationDate;

                        context.Batches.Update(NewBatch);
                    }

                    //Create a BatchHistory for the batch addition or update
                    BatchHistory newBatchHistory = new BatchHistory(
                        NewBatch.Id,
                        batchHistory.Quantity,
                        DateTime.Now,
                        batchHistory.Type,
                        batchHistory.Comment
                    );

                    await context.BatchesHistory.AddAsync(newBatchHistory);
                    await context.SaveChangesAsync();

                    return NewBatch;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in AddOrUpdateBatchAsync: {ex.Message}");
            }
        }

        //Will Remove quantity required from the existing batches
        public async Task<bool> AddBatchOrderOutAsync(int productId, BatchHistory batchHistory)
        {
            try
            {
                //Create DB context while is being used
                using (var context = _dbContext.CreateDbContext())
                {
                    //Ensure that is created cause is InMemory
                    context.Database.EnsureCreated();

                    //Save needed quantity to be subtracted
                    int quantity = batchHistory.Quantity;

                    //Get all the existing batches for the required product
                    //Check if isn't expired, quantity is bigger than 0 and isn't deleted
                    var batchList = await context.Batches
                        .Where(b => b.ProductId == productId && b.ExpirationDate > DateTime.Now && b.Quantity > 0 && b.IsDeleted == false)
                        .ToListAsync();

                    //If the sum of all existing product batches are smaller that the required quantity return false
                    if (quantity > batchList.Sum(b => b.Quantity))
                        return false;

                    foreach (var batch in batchList)
                    {
                        //Recorded original batch quantity to added in the Batch History
                        int recordedBatchQuantity = batch.Quantity;

                        //Check if the quantity of the batch is bigger that the required
                        //Mean that the actual batch quantity is more than enough
                        if (batch.Quantity > quantity)
                        {
                            recordedBatchQuantity = -quantity;
                            batch.Quantity -= quantity;
                            quantity = 0;
                        }
                        else //Mean that actual batch isn't enough or just enough
                        {
                            recordedBatchQuantity = -batch.Quantity;
                            quantity -= batch.Quantity;
                            batch.Quantity = 0;
                            batch.IsDeleted = true;
                        }

                        //Create a BatchHistory for batch change
                        BatchHistory newBatchHistory = new BatchHistory(
                            batch.Id,
                            recordedBatchQuantity,
                            DateTime.Now,
                            batchHistory.Type,
                            batchHistory.Comment
                        );

                        context.Batches.Update(batch);
                        await context.BatchesHistory.AddAsync(newBatchHistory);

                        //If quantity is 
                        if (quantity == 0)
                        {
                            break;
                        }
                    }

                    await context.SaveChangesAsync();

                    return true;
                }
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
                //Create DB context while is being used
                using (var context = _dbContext.CreateDbContext())
                {
                    //Ensure that is created cause is InMemory
                    context.Database.EnsureCreated();

                    //Get batch by Id
                    var batch = await context.Batches
                                            .Where(b => b.Id == batchId)
                                            .FirstOrDefaultAsync();

                    //If batch equals null throw exception
                    if (batch == null)
                    {
                        throw new Exception($"Batch with id {batchId} was not found");
                    }

                    //Set IsDeleted to true
                    batch.IsDeleted = true;

                    //Create a BatchHistory for the batch change
                    BatchHistory NewBatchHistory = new BatchHistory(
                        batch.Id,
                        -batch.Quantity,
                        DateTime.Now,
                        EHistoryType.Deleted,
                        "Batch deleted"
                    );

                    context.Batches.Update(batch);
                    await context.BatchesHistory.AddAsync(NewBatchHistory);

                    return await context.SaveChangesAsync() > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in DeleteBatchAsync: {ex.Message}");
            }
        }
    }
}

