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
    public class ProductServicesTests
    {
        private IProductService productService;
        private InventoryDbContext dbContext;

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

            dbContext = new InventoryDbContext(options);
            productService = new ProductService(new DbContextFactoryMock(dbContext));
        }

        [TearDown]
        public void TearDown()
        {
            // Clear the database after each test
            dbContext.Database.EnsureDeleted();
        }

        #region GetProducts

        [Test]
        public void GetProducts_Returns_All_NonDeleted_Products()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product("Product 1", false),
                new Product("Product 2", false),
                new Product("Product 3", true) // Deleted product
            };

            dbContext.Products.AddRange(products);
            dbContext.SaveChanges();

            // Act
            var result = productService.GetProducts();

            // Assert
            // Test if GetProducts() return all non deleted products(2)
            Assert.That(result.Count(), Is.EqualTo(2)); 
            //Test if GetProducts() return an non deleted product
            CollectionAssert.DoesNotContain(result.ToList(), products[2]); 
        }

        #endregion

        #region AddOrUpdateProductAsync


        [Test]
        public async Task AddOrUpdateProductAsync_Adds_New_Product()
        {
            // Arrange
            var product = new Product("New Product", false);

            // Act
            var result = await productService.AddOrUpdateProductAsync(product);

            // Assert
            //Test if AddOrUpdateProductAsync() added product isn't null
            Assert.IsNotNull(result.Id); 
            //Test if AddOrUpdateProductAsync() added product has the same name as the one passed
            Assert.That(result.Name, Is.EqualTo(product.Name)); 
            //Test if AddOrUpdateProductAsync() added product has the same IsDeleted as the one passed
            Assert.That(result.IsDeleted, Is.EqualTo(product.IsDeleted));
        }

        [Test]
        public async Task AddOrUpdateProductAsync_Updates_Existing_Product()
        {
            // Arrange
            var existingProduct = new Product("Existing Product", false);
            dbContext.Products.Add(existingProduct);
            dbContext.SaveChanges();

            var updatedProduct = new Product(existingProduct.Id, "Updated Product", true);

            // Act
            var result = await productService.AddOrUpdateProductAsync(updatedProduct);

            // Assert
            //Test if AddOrUpdateProductAsync() updated product has the same name as the one passed
            Assert.That(result.Name, Is.EqualTo(updatedProduct.Name));
            //Test if AddOrUpdateProductAsync() updated product has the same IsDeleted as the one passed
            Assert.That(result.IsDeleted, Is.EqualTo(updatedProduct.IsDeleted));
        }

        [Test]
        public async Task AddOrUpdateProductAsync_Throws_Exception_When_Product_Not_Found()
        {
            // Arrange
            var product = new Product(100, "Non-existent Product", false);

            // Act & Assert
            // Test if AddOrUpdateProductAsync() throw an exception
            Assert.ThrowsAsync<Exception>(async () => await productService.AddOrUpdateProductAsync(product));
        }

        #endregion

        #region DeleteProductAsync

        [Test]
        public async Task DeleteProductAsync_Deletes_Product_And_Batches()
        {
            // Arrange
            var productId = 1;

            var product = new Product("Product", false);
            var batch1 = new Batch(productId, 10, DateTime.Now, false);
            var batch2 = new Batch(productId, 5, DateTime.Now, false);

            dbContext.Products.Add(product);
            dbContext.Batches.AddRange(batch1, batch2);
            dbContext.SaveChanges();

            // Act
            var result = await productService.DeleteProductAsync(productId);

            // Assert
            // Test if DeleteProductAsync() deleted the product
            Assert.IsTrue(result);

            // Test if the deleted product how has the IsDeleted equal true
            var deletedProduct = dbContext.Products.Find(productId);
            Assert.That(deletedProduct.IsDeleted, Is.True);

            // Test if DeleteProductAsync() deleted all it's batches
            var deletedBatches = dbContext.Batches.Where(b => b.ProductId == productId).ToList();
            Assert.IsTrue(deletedBatches.All(b => b.IsDeleted));

            // Test if DeleteProductAsync() created an history for the deleted batches
            var batchHistories = dbContext.BatchesHistory.ToList();
            Assert.That(batchHistories.Count, Is.EqualTo(2));
        }
    }

    #endregion
}
