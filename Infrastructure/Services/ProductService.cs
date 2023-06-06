using Core.Enums;
using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class ProductService : IProductService
    {
        private readonly IDbContextFactory<InventoryDbContext> _dbContext;

        public ProductService(IDbContextFactory<InventoryDbContext> dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IQueryable<Product>> GetProductsAsync()
        {
            try
            {
                //Create DB context while is being used
                using (var context = _dbContext.CreateDbContext())
                {
                    //Ensure that is created cause is InMemory
                    await context.Database.EnsureCreatedAsync();

                    //Get list of Products
                    //That aren't deleted
                    var products = await context.Products
                        .Where(b => !b.IsDeleted)
                        .OrderByDescending(b => b.Id)
                        .ToListAsync();

                    if(products == null)
                    {
                        throw new Exception("Error in GetProductsAsync: Products are null");
                    }

                    //Convert products to IQueryable
                    return products.AsQueryable();
                } 
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in GetProductsAsync: {ex.Message}");
            }
        }

        public async Task<Product> AddOrUpdateProductAsync(Product product)
        {
            try
            {
                //Create DB context while is being used
                using (var context = _dbContext.CreateDbContext())
                {
                    //Ensure that is created cause is InMemory
                    await context.Database.EnsureCreatedAsync();

                    Product NewProduct;

                    //If Product Id == null or 0 creates a new Product
                    if (product.Id == null || product.Id == 0)
                    {
                        NewProduct = new Product(product.Name);

                        await context.Products.AddAsync(NewProduct);
                    }
                    else
                    {
                        //Else updates the Product by it's Id
                        NewProduct = await context.Products
                            .Where(p => p.Id == product.Id)
                            .FirstOrDefaultAsync();

                        //If by any reason the product is null throw an exception
                        if (NewProduct == null)
                        {
                            throw new Exception($"Error in AddOrUpdateProductAsync: Id {product.Id} was not found");
                        }

                        NewProduct.Name = product.Name;
                        NewProduct.IsDeleted = product.IsDeleted;
                    }

                    await context.SaveChangesAsync();

                    return NewProduct;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in AddOrUpdateProductAsync: {ex.Message}");
            }
        }

        public async Task<bool> DeleteProductAsync(int productId)
        {
            try
            {
                //Create DB context while is being used
                using (var context = _dbContext.CreateDbContext())
                {
                    //Ensure that is created cause is InMemory
                    context.Database.EnsureCreated();

                    //Get product by Id
                    var product = await context.Products
                                            .Where(p => p.Id == productId)
                                            .FirstOrDefaultAsync();

                    //If product equal null throw exception
                    if (product == null)
                    {
                        throw new Exception($"Error in DeleteProductAsync: Id {productId} was not found");
                    }

                    //Set product's IsDeleted to true
                    product.IsDeleted = true;

                    //Get product's existing batches
                    var batches = await context.Batches
                                            .Where(b => b.ProductId == productId && b.IsDeleted == false && b.Quantity > 0)
                                            .ToListAsync();

                    //Create a batch history for every deleted batch
                    foreach (var batch in batches)
                    {
                        batch.IsDeleted = true;

                        BatchHistory NewBatchHistory = new BatchHistory(
                            batch.Id,
                            -batch.Quantity,
                            DateTime.Now,
                            EHistoryType.Deleted,
                            "Batch deleted"
                        );

                        context.BatchesHistory.Add(NewBatchHistory);
                    }

                    //If any was any change returns true else false
                    return await context.SaveChangesAsync() > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in DeleteProductAsync: {ex.Message}");
            }
        }
    }
}
