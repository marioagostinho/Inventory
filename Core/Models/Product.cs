using HotChocolate;
using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
    public class Product
    {
        [Key]
        public int? Id { get; set; }
        [Required(ErrorMessage = "Name is required")]
        [StringLength(50, ErrorMessage = "Name must not exceed 50 characters")]
        [RegularExpression(@"^(?!\s*$).+", ErrorMessage = "Name must have at least 1 non-whitespace character")]
        public string Name { get; set; }
        [GraphQLIgnore]
        public bool IsDeleted { get; set; }

        public Product(string name)
        {
            Name = name;
            IsDeleted = false;
        }

        public Product(int? id, string name)
        {
            Id = id;
            Name = name;
            IsDeleted = false;
        }

        //TestUnit Constructor
        public Product(string name, bool isDeleted)
        {
            Name = name;
            IsDeleted = isDeleted;
        }

        //TestUnit Constructor
        public Product(int? id, string name, bool isDeleted)
        {
            Id = id;
            Name = name;
            IsDeleted = isDeleted;
        }
    }
}
