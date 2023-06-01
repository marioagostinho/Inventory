using Core.Enums;
using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;

namespace Tests.Infrastructure
{
    [TestFixture]
    public class BatchHistoryServiceTests
    {
        private IBatchHistoryService _batchHistoryService; 
        private InventoryDbContext _dbContext;

        [SetUp]
        public void Setup()
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
            _batchHistoryService = new BatchHistoryService(new DbContextFactoryMock(_dbContext));
        }

        # region GetBatchHistories

        [Test]
        public async Task GetBatchHistories_Returns_All_BatchHistories()
        {
            // Arrange
            var product = new Product("Pasta", false);
            _dbContext.Products.Add(product);

            var batch = new Batch(product.Id, 10, DateTime.Now.AddDays(30), false);
            _dbContext.Batches.AddRange(batch);

            var batchHistories = new List<BatchHistory>
            {
                new BatchHistory(batch.Id, 10, DateTime.Now, EHistoryType.OrderIn, "Batch added"),
                new BatchHistory(batch.Id, 20, DateTime.Now, EHistoryType.Defect, "Batch updated"),
                new BatchHistory(batch.Id, 30, DateTime.Now, EHistoryType.Deleted, "Batch deleted")
            };

            _dbContext.BatchesHistory.AddRange(batchHistories);
            _dbContext.SaveChanges();

            // Act
            var result = await _batchHistoryService.GetBatchHistorieAsync();

            // Assert
            //Test if GetBatchHistories return all Batch History(3)
            Assert.That(result.Count, Is.EqualTo(3));
        }

        #endregion
    }
}
