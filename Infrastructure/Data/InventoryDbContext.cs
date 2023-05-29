using Core.Enums;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class InventoryDbContext : DbContext
    {
        public InventoryDbContext(DbContextOptions options)
            : base(options)
        {
            
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Batch> Batches { get; set; }
        public DbSet<BatchHistory> BatchesHistory { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Inject Product data in the inMemory database
            modelBuilder.Entity<Product>().HasData(
                new Product(1, "Pasta", false),
                new Product(2, "Rice", false),
                new Product(3, "Beans", false),
                new Product(4, "Milk", false),
                new Product(5, "Lettuce", false),
                new Product(6, "Tomato", false)
            );

            //Inject Batch data in the inMemory database
            modelBuilder.Entity<Batch>().HasData(
                new Batch(1, 1, 1000, new DateTime(2023,12,30), false),
                new Batch(2, 2, 500, new DateTime(2024, 04, 30), false),
                new Batch(3, 3, 150, new DateTime(2024, 12, 30), false),
                new Batch(4, 1, 1000, new DateTime(2023, 12, 30), false),
                new Batch(5, 1, 1000, new DateTime(2023, 12, 30), false)
            );

            //Inject BatchHistory data in the inMemory database
            modelBuilder.Entity<BatchHistory>().HasData(
                new BatchHistory(1, 1, 1000, new DateTime(2022, 01, 10), EHistoryType.OrderIn, "Arrived order from supplier"),
                new BatchHistory(2, 2, 500, new DateTime(2022, 01, 10), EHistoryType.OrderIn, "Arrived order from supplier"),
                new BatchHistory(3, 3, 150, new DateTime(2022, 01, 10), EHistoryType.OrderIn, "Arrived order from supplier"),
                new BatchHistory(4, 1, 1000, new DateTime(2022, 01, 10), EHistoryType.OrderIn, "Arrived order from supplier"),
                new BatchHistory(5, 1, 1000, new DateTime(2022, 01, 10), EHistoryType.OrderIn, "Arrived order from supplier")
            );
        }
    }
}
