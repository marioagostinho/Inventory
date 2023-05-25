
using API.GraphQL;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

//DB Context
builder.Services.AddDbContextFactory<InventoryDbContext>(options =>
{
    options.UseInMemoryDatabase("InMemoryDb");
});

//ADD services to access DB
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IBatchService, BatchService>();
builder.Services.AddScoped<IBatchHistoryService, BatchHistoryService>();

//Add GraphQL services
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddFiltering();


var app = builder.Build();

//GraphQL
app.MapGraphQL();

app.Run();
