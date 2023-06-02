using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace Tests.Infrastructure
{
    [TestFixture]
    public class ProductServicesTests
    {
        private IProductService _productService;
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
            _productService = new ProductService(new DbContextFactoryMock(_dbContext));
        }

        #region GetProducts

        [Test]
        public async Task GetProducts_Returns_All_NonDeleted_ProductsAsync()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product("Product 1", false),
                new Product("Product 2", false),
                new Product("Product 3", true) // Deleted product
            };

            _dbContext.Products.AddRange(products);
            _dbContext.SaveChanges();

            // Act
            var result = await _productService.GetProductsAsync();

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
            var result = await _productService.AddOrUpdateProductAsync(product);

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
            _dbContext.Products.Add(existingProduct);
            _dbContext.SaveChanges();

            var updatedProduct = new Product(existingProduct.Id, "Updated Product", true);

            // Act
            var result = await _productService.AddOrUpdateProductAsync(updatedProduct);

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
            Assert.ThrowsAsync<Exception>(async () => await _productService.AddOrUpdateProductAsync(product));
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

            await _dbContext.Products.AddAsync(product);
            await _dbContext.Batches.AddRangeAsync(batch1, batch2);
            _dbContext.SaveChangesAsync();

            // Act
            var result = await _productService.DeleteProductAsync(productId);

            // Assert
            // Test if DeleteProductAsync() deleted the product
            Assert.IsTrue(result);

            // Test if the deleted product how has the IsDeleted equal true
            var deletedProduct = _dbContextAlwaysOpen.Products.Find(productId);
            Assert.That(deletedProduct.IsDeleted, Is.True);

            // Test if DeleteProductAsync() deleted all it's batches
            var deletedBatches = _dbContextAlwaysOpen.Batches.Where(b => b.ProductId == productId).ToList();
            Assert.IsTrue(deletedBatches.All(b => b.IsDeleted));

            // Test if DeleteProductAsync() created an history for the deleted batches
            var batchHistories = _dbContextAlwaysOpen.BatchesHistory.ToList();
            Assert.That(batchHistories.Count, Is.EqualTo(2));
        }
    }

    #endregion
}
