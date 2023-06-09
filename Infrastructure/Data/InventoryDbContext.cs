﻿using Core.Enums;
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
                new Product(1, "Spätzli with Autumnal Veggies"),
                new Product(2, "Beef Bolo with Rice Noodles"),
                new Product(3, "Conchiglie alla caprese"),
                new Product(4, "Mediterrean Salad Bowl"),
                new Product(5, "Chicken Protein Bowl"),
                new Product(6, "Salmon Poke Bowl"),
                new Product(7, "Bulgur Lemon Tahini"),
                new Product(8, "Grisons Barley Soup"),
                new Product(9, "Saaländ Müesli - Blueberry"),
                new Product(10, "Noix Nobs"),
                new Product(11, "Strawberry Cheesecake"),
                new Product(12, "Bio Chrütli Tee - Mate Minze"),
                new Product(13, "Gavettis Kaffee")
            );

            //Inject Batch data in the inMemory database
            modelBuilder.Entity<Batch>().HasData(
                new Batch(1, 1, 1000, new DateTime(2023,12,30)),
                new Batch(2, 2, 500, new DateTime(2024, 04, 30)),
                new Batch(3, 3, 150, new DateTime(2024, 12, 30)),
                new Batch(4, 4, 600, new DateTime(2023, 12, 30)),
                new Batch(5, 5, 1000, new DateTime(2023, 12, 30)),
                new Batch(6, 13, 750, new DateTime(2023, 12, 30)),
                new Batch(7, 10, 1500, new DateTime(2023, 12, 30))
            );

            //Inject BatchHistory data in the inMemory database
            modelBuilder.Entity<BatchHistory>().HasData(
                new BatchHistory(1, 1, 1000, new DateTime(2022, 01, 10), EHistoryType.OrderIn, "Arrived order from supplier"),
                new BatchHistory(2, 2, 500, new DateTime(2022, 01, 10), EHistoryType.OrderIn, "Arrived order from supplier"),
                new BatchHistory(3, 3, 150, new DateTime(2022, 01, 10), EHistoryType.OrderIn, "Arrived order from supplier"),
                new BatchHistory(4, 4, 600, new DateTime(2022, 01, 10), EHistoryType.OrderIn, "Arrived order from supplier"),
                new BatchHistory(5, 5, 1000, new DateTime(2022, 01, 10), EHistoryType.OrderIn, "Arrived order from supplier"),
                new BatchHistory(6, 13, 750, new DateTime(2022, 01, 10), EHistoryType.OrderIn, "Arrived order from supplier"),
                new BatchHistory(7, 10, 1500, new DateTime(2022, 01, 10), EHistoryType.OrderIn, "Arrived order from supplier")
            );
        }
    }
}
