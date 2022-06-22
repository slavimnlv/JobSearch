using FinalProject.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationServices.DTOs
{
    public class UserDTO
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Minimum of 1 and maximum of 100 characters")]
        public string? Name { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 5, ErrorMessage = "Minimum of 5 and maximum of 100 characters")]
        public string? Email { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 5, ErrorMessage = "Minimum of 5 and maximum of 50 characters")]
        public string? Password { get; set; }
        [Required]
        public bool Bulgarian { get; set; }
        [Required]
        public Role Role { get; set; }
    }
}
