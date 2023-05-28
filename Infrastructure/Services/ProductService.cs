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

        public IQueryable<Product> GetProducts()
        {
            var context = _dbContext.CreateDbContext();
            context.Database.EnsureCreated();

            return context.Products
                .Where(b => !b.IsDeleted);
        }

        public async Task<Product> AddOrUpdateProductAsync(Product product)
        {
            var context = _dbContext.CreateDbContext();
            context.Database.EnsureCreated();

            Product NewProduct;

            if(product.Id == null || product.Id == 0)
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

        public async Task<bool> DeleteProductAsync(int productId)
        {
            var context = _dbContext.CreateDbContext();
            context.Database.EnsureCreated();

            var product = await context.Products
                                    .Where(p => p.Id == productId)
                                    .FirstOrDefaultAsync();

            if(product == null)
            {
                throw new Exception($"Product with id {productId} was not found");
            }

            product.IsDeleted = true;

            var batches = await context.Batches
                                    .Where(b => b.ProductId == productId)
                                    .ToListAsync();

            foreach(var batch in batches) 
            {
                batch.IsDeleted = true;
            }

            context.Products.Update(product);
            context.Batches.UpdateRange(batches);

            return await context.SaveChangesAsync() > 0;
        }
    }
}
