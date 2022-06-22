using ApplicationServices.JWT;
using FinalProject.Data.Enums;
using Microsoft.IdentityModel.Tokens;
using Repositories.Implementations;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationServices.Implementations
{
    public class SecurityService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly UserRepository _userRepo;

        public SecurityService(JwtSettings settings, UserRepository userRepository)
        {
            _jwtSettings = settings;
            _userRepo = userRepository;
        }

        public async Task<LoginData?> GenerateJwtTonkenAsync(string username, string password)
        {
            var user = await _userRepo.VerifyUserAsync(username, password);
            if (user == null) return null;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
              
            };

            if (user.Role == Role.Employer)
            {
                claims.Add(new Claim(ClaimTypes.Role, "Employer"));
            }
            else if (user.Role == Role.Candidate)
            {
                claims.Add(new Claim(ClaimTypes.Role, "Candidate"));
            }
            else
            {
                claims.Add(new Claim(ClaimTypes.Role, "no access"));
            }

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
                signingCredentials: credentials
                );

            var jwt  =  new JwtSecurityTokenHandler().WriteToken(token);

            LoginData loginData = new LoginData();
            loginData.Id = user.Id;
            loginData.Role = user.Role;
            loginData.Token = jwt;

            return loginData;
        }
    }
}
