using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implementations
{
    public class UserRepository : BaseRepository<User>
    {
        public UserRepository(ProjectContext context) : base(context)
        {
        }
        public async Task<User> VerifyUserAsync(string email, string password)
        {
            User? user = await _context.Users!.Where(u => u.Email == email && u.Password == password).FirstOrDefaultAsync();

            return user!;
        }

        public async Task<bool> DoesEmailExistAsync(string email)
        {
            return await _context.Users!.Where(x => x.Email == email).AnyAsync();
        }

        public async Task<bool> DoesUserExist(int id)
        {
            return await _context.Users!.Where(u => u.Id == id).Select(u => u).AnyAsync();
        }


        //public async Task<List<User>> GetUsersByIds(List<int> ids)
        //{
        //    return await _context.Users!.Where(u => ids.Contains(u.Id)).ToListAsync();
        //}

    }
}
