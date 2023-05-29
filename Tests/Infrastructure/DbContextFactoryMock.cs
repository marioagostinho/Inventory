using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests.Infrastructure
{
    public class DbContextFactoryMock : IDbContextFactory<InventoryDbContext>
    {
        private readonly InventoryDbContext dbContext;

        public DbContextFactoryMock(InventoryDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public InventoryDbContext CreateDbContext()
        {
            return dbContext;
        }
    }
}
