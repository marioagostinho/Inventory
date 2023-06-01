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
                var context = _dbContext.CreateDbContext();
                context.Database.EnsureCreated();

                Product NewProduct;

                if (product.Id == null || product.Id == 0)
                {
                    NewProduct = new Product(product.Name, product.IsDeleted);

                    await context.Products.AddAsync(NewProduct);
                }
                else
                {
                    NewProduct = await context.Products
                        .Where(p => p.Id == product.Id)
                        .FirstOrDefaultAsync();

                    if (NewProduct == null)
                    {
                        throw new Exception($"Product with id {product.Id} was not found");
                    }
                    else
                    {
                        NewProduct.Name = product.Name;
                        NewProduct.IsDeleted = product.IsDeleted;

                        context.Products.Update(NewProduct);
                    }
                }

                await context.SaveChangesAsync();

                return NewProduct;
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
                var context = _dbContext.CreateDbContext();
                context.Database.EnsureCreated();

                var product = await context.Products
                                        .Where(p => p.Id == productId)
                                        .FirstOrDefaultAsync();

                if (product == null)
                {
                    throw new Exception($"Product with id {productId} was not found");
                }

                product.IsDeleted = true;

                var batches = await context.Batches
                                        .Where(b => b.ProductId == productId)
                                        .ToListAsync();

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

                context.Products.Update(product);
                context.Batches.UpdateRange(batches);

                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in DeleteProductAsync: {ex.Message}");
            }
        }
    }
}
