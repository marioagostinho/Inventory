using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Enums;
using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace Tests.Infrastructure
{
    [TestFixture]
    public class BatchServiceTests
    {
        private IBatchService batchService;
        private InventoryDbContext _dbContext;
        private InventoryDbContext _dbContextAlwaysOpen;

        [SetUp]
        public void SetUp()
        {
            // Set up the database in memory
            var serviceProvider = new ServiceCollection()
                .AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();

            var options = new DbContextOptionsBuilder<InventoryDbContext>()
                .UseInMemoryDatabase("testdb")
                .UseInternalServiceProvider(serviceProvider)
                .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
                .Options;

            _dbContext = new InventoryDbContext(options);
            _dbContextAlwaysOpen = new InventoryDbContext(options);
            batchService = new BatchService(new DbContextFactoryMock(_dbContext));
        }

        #region GetBatches

        [Test]
        public async Task GetBatches_Returns_NonDeleted_Batches_With_Positive_QuantityAsync()
        {
            // Arrange
            var product = new Product("Product", false);
            _dbContext.Products.Add(product);

            var batches = new List<Batch>
            {
                new Batch(product.Id, 10, DateTime.Now.AddDays(30), false ), 
                new Batch(product.Id, 0, DateTime.Now.AddDays(30), false ), // Zero quantity
                new Batch(product.Id, -5, DateTime.Now.AddDays(30), false ), // Negative quantity
                new Batch(product.Id, 15, DateTime.Now.AddDays(30), true ), // Deleted batch
            };
            _dbContext.Batches.AddRange(batches);

            _dbContext.SaveChanges();

            // Act
            var result = await batchService.GetBatchesAsync();

            // Assert
            // Test if GetBatches() only returns the Batches that aren't deleted
            Assert.That(result.Count(), Is.EqualTo(1));
            // Test if GetBatches() quantity of the first batch is equal to 10
            Assert.That(result.First().Quantity, Is.EqualTo(10));
            // Test if GetBatches() first batch product.ID is equal to the product ID
            Assert.That(result.First().Product.Id, Is.EqualTo(product.Id));
            // Test if GetBatches() first batch isn't deleted
            Assert.IsFalse(result.First().IsDeleted);
        }

        #endregion

        #region AddOrUpdateBatchAsync

        [Test]
        public async Task AddOrUpdateBatchAsync_Adds_New_Batch()
        {
            // Arrange
            var product = new Product("Product", false);
            _dbContext.Products.Add(product);
            _dbContext.SaveChanges();

            var batch = new Batch(product.Id, 10, DateTime.Now.AddDays(30), false);
            var batchHistory = new BatchHistory(0,10, DateTime.Now, EHistoryType.OrderIn, "New batch added");

            // Act
            var result = await batchService.AddOrUpdateBatchAsync(batch, batchHistory);

            // Assert
            Assert.IsNotNull(result.Id);
            Assert.That(result.ProductId, Is.EqualTo(batch.ProductId));
            Assert.That(result.Quantity, Is.EqualTo(batch.Quantity));
            Assert.That(result.ExpirationDate, Is.EqualTo(batch.ExpirationDate));
            Assert.That(result.IsDeleted, Is.EqualTo(batch.IsDeleted));
            Assert.IsFalse(result.IsDeleted);

            var batchHistories = _dbContextAlwaysOpen.BatchesHistory.ToList();
            Assert.That(batchHistories.Count, Is.EqualTo(1));
            Assert.That(batchHistories.First().BatchId, Is.EqualTo(result.Id));
        }

        [Test]
        public async Task AddOrUpdateBatchAsync_Updates_Existing_Batch()
        {
            // Arrange
            var product = new Product("Product", false);
            _dbContext.Products.Add(product);
            _dbContext.SaveChanges();

            var existingBatch = new Batch(product.Id, 10, DateTime.Now.AddDays(30),  false);

            _dbContext.Batches.Add(existingBatch);
            _dbContext.SaveChanges();

            var updatedBatch = new Batch(existingBatch.Id, product.Id, 20, DateTime.Now.AddDays(60), false);

            var batchHistory = new BatchHistory(1, existingBatch.Id, 20, DateTime.Now, EHistoryType.OrderIn, "Batch updated");

            // Act
            var result = await batchService.AddOrUpdateBatchAsync(updatedBatch, batchHistory);

            // Assert
            Assert.That(result.Id, Is.EqualTo(existingBatch.Id));
            Assert.That(result.ProductId, Is.EqualTo(updatedBatch.ProductId));
            Assert.That(result.Quantity, Is.EqualTo(updatedBatch.Quantity));
            Assert.That(result.ExpirationDate, Is.EqualTo(updatedBatch.ExpirationDate));
            Assert.That(result.IsDeleted, Is.EqualTo(updatedBatch.IsDeleted));
            Assert.IsFalse(result.IsDeleted);

            var batchHistories = _dbContextAlwaysOpen.BatchesHistory.ToList();
            Assert.That(batchHistories.Count, Is.EqualTo(1));
            Assert.That(batchHistories.First().BatchId, Is.EqualTo(result.Id));
        }

        #endregion

        #region AddBatchOrderOutAsync

        [Test]
        public async Task AddBatchOrderOutAsync_Adds_Batches_To_Order()
        {
            // Arrange
            var product = new Product("Product", false);
            _dbContext.Products.Add(product);
            _dbContext.SaveChanges();

            var batches = new List<Batch>
            {
                new Batch(product.Id, 10, DateTime.Now.AddDays(30), false),
                new Batch(product.Id, 5, DateTime.Now.AddDays(60), false),
                new Batch(product.Id, 20, DateTime.Now.AddDays(90), false)
            };

            _dbContext.Batches.AddRange(batches);
            _dbContext.SaveChanges();

            var batchHistory = new BatchHistory(1, 35, DateTime.Now, EHistoryType.OrderOut, "Order out");

            // Act
            var result = await batchService.AddBatchOrderOutAsync((int)product.Id, batchHistory);

            // Assert
            Assert.IsTrue(result);

            var updatedBatches = _dbContextAlwaysOpen.Batches.ToList();
            Assert.That(updatedBatches.Count, Is.EqualTo(3));
            Assert.That(updatedBatches.Sum(b => b.Quantity), Is.EqualTo(0));
            Assert.IsTrue(updatedBatches.All(b => b.IsDeleted));

            var batchHistories = _dbContextAlwaysOpen.BatchesHistory.ToList();
            Assert.That(batchHistories.Count, Is.EqualTo(3));
        }

        [Test]
        public async Task AddBatchOrderOutAsync_Returns_False_If_Insufficient_Batches()
        {
            // Arrange
            var product = new Product("Product", false);
            _dbContext.Products.Add(product);
            _dbContext.SaveChanges();

            var batches = new List<Batch>
            {
                new Batch(product.Id, 10, DateTime.Now.AddDays(30), false),
                new Batch(product.Id, 5, DateTime.Now.AddDays(60), false )
            };

            _dbContext.Batches.AddRange(batches);
            _dbContext.SaveChanges();

            var batchHistory = new BatchHistory(1, 25, DateTime.Now, EHistoryType.OrderOut, "Order out");

            // Act
            var result = await batchService.AddBatchOrderOutAsync((int)product.Id, batchHistory);

            // Assert
            Assert.IsFalse(result);

            var updatedBatches = _dbContextAlwaysOpen.Batches.ToList();
            Assert.That(updatedBatches.Count, Is.EqualTo(2));
            Assert.That(updatedBatches.Sum(b => b.Quantity), Is.EqualTo(15));
            Assert.IsFalse(updatedBatches.All(b => b.IsDeleted));

            var batchHistories = _dbContextAlwaysOpen.BatchesHistory.ToList();
            Assert.That(batchHistories.Count, Is.EqualTo(0));
        }

        #endregion

        #region DeleteBatchAsync

        [Test]
        public async Task DeleteBatchAsync_Deletes_Batch()
        {
            // Arrange
            var batch = new Batch(1, 10, DateTime.Now.AddDays(30), false);

            _dbContext.Batches.Add(batch);
            _dbContext.SaveChanges();

            // Act
            var result = await batchService.DeleteBatchAsync((int)batch.Id);

            // Assert
            Assert.IsTrue(result);

            var updatedBatch = await _dbContextAlwaysOpen.Batches.FindAsync(batch.Id);
            Assert.That(updatedBatch.IsDeleted, Is.True);

            var batchHistory = _dbContextAlwaysOpen.BatchesHistory.FirstOrDefault();
            Assert.IsNotNull(batchHistory);
            Assert.That(batchHistory.BatchId, Is.EqualTo(batch.Id));
            Assert.That(batchHistory.Quantity, Is.EqualTo(-batch.Quantity));
            Assert.That(batchHistory.Type, Is.EqualTo(EHistoryType.Deleted));
            Assert.That(batchHistory.Comment, Is.EqualTo("Batch deleted"));
        }

        #endregion
    }
}
