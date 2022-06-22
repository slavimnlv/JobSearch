using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationServices.DTOs
{
    public class ApplicationDTO
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public bool Approved { get; set; }
        [Required]
        public bool Rejected { get; set; }
        [Required]
        [StringLength(500, MinimumLength = 50, ErrorMessage = "Minimum of 50 and maximum of 500 characters")]
        public string? CoverLetter { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int JobAdId { get; set; }
    }
}
