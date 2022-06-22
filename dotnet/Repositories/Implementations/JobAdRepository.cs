using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implementations
{
    public class JobAdRepository : BaseRepository<JobAd>
    {
        public JobAdRepository(ProjectContext context) : base(context)
        {
            
        }

        public async Task<bool> DoesJobAdExist(int id)
        {
            return await _context.JobAds!.Where(u => u.Id == id).AnyAsync();
        }

        public async Task<int> GetUserId(int id)
        {
            return await _context.JobAds!.Where(u => u.Id == id).Select(u => u.EmployerId).FirstOrDefaultAsync();
        }

        public async Task<List<JobAd>> GetByEmployerId(int userId)
        {
            return await _context.JobAds!.Where(u=>u.EmployerId == userId).ToListAsync();
        }

        public async Task<List<JobAd>> GetByIds(List<int> list)
        {
            return await _context.JobAds!.Where(u => list.Contains(u.Id)).ToListAsync();
        }

        public async Task<int> GetAllCount(Expression<Func<JobAd, bool>> filter = null!)
        {
            if(filter == null)
                return await _context.JobAds!.CountAsync();
            else
                return await _context.JobAds!.Where(filter).CountAsync();

        }
    }
}
