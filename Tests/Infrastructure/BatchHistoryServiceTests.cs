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
        private IBatchHistoryService batchHistoryService; 
        private InventoryDbContext dbContext;

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

            dbContext = new InventoryDbContext(options);
            batchHistoryService = new BatchHistoryService(new DbContextFactoryMock(dbContext));
        }

        [TearDown]
        public void TearDown()
        {
            // Clear the database after each test
            dbContext.Database.EnsureDeleted();
        }

        # region GetBatchHistories

        [Test]
        public async Task GetBatchHistories_Returns_All_BatchHistories()
        {
            // Arrange
            var product = new Product("Pasta", false);
            dbContext.Products.Add(product);

            var batch = new Batch(product.Id, 10, DateTime.Now.AddDays(30), false);
            dbContext.Batches.AddRange(batch);

            var batchHistories = new List<BatchHistory>
            {
                new BatchHistory(batch.Id, 10, DateTime.Now, EHistoryType.OrderIn, "Batch added"),
                new BatchHistory(batch.Id, 20, DateTime.Now, EHistoryType.Defect, "Batch updated"),
                new BatchHistory(batch.Id, 30, DateTime.Now, EHistoryType.Deleted, "Batch deleted")
            };

            dbContext.BatchesHistory.AddRange(batchHistories);
            dbContext.SaveChanges();

            // Act
            var result = await batchHistoryService.GetBatchHistories().ToListAsync();

            // Assert
            //Test if GetBatchHistories return all Batch History(3)
            Assert.That(result.Count, Is.EqualTo(3));
        }

        #endregion
    }
}
