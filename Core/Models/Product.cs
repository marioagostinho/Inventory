using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
    public class Product
    {
        [Key]
        public int? Id { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }

        public Product(string name, bool isDeleted)
        {
            Name = name;
            IsDeleted = isDeleted;
        }

        public Product(int id, string name, bool isDeleted)
        {
            Id = id;
            Name = name;
            IsDeleted = isDeleted;
        }
    }
}
