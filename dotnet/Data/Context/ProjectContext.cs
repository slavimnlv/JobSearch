using Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Context
{
    public class ProjectContext : DbContext
    {
        public DbSet<User>? Users { get; set; }
        public DbSet<JobAd>? JobAds { get; set; }
        public DbSet<Application>? Applications { get; set; }

        public ProjectContext(DbContextOptions<ProjectContext> options) : base(options)
        {
        }


    }
}
