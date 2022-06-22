using FinalProject.Data.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationServices.JWT
{
    public class LoginData
    {
        public string? Token { get; set; }
        public Role Role { get; set; }
        public int Id { get; set; }
    }
}
