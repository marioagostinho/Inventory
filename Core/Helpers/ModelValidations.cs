using System.ComponentModel.DataAnnotations;

namespace Core.Helpers
{
    public class ModelValidations
    {
        public static T IsFollowingDataAnotations<T>(T model)
        {
            // Validate the product object
            var validationContext = new ValidationContext(model);
            var validationResults = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(model, validationContext, validationResults, true);

            if (!isValid)
            {
                // Handle validation errors
                string errorMessages = string.Join(Environment.NewLine, validationResults.Select(r => r.ErrorMessage));
                throw new ArgumentException(errorMessages);
            }

            return model;
        }
    }
}
