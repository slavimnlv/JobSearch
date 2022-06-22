using ApplicationServices.DTOs;
using ApplicationServices.Implementations;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ProjectAPI.Controllers
{
    [Route("api/authenticate")]
    [ApiController]
    public class AuthorizationController : ControllerBase
    {
        private readonly SecurityService _securityService;
        private readonly UserService _userService;

        public AuthorizationController(SecurityService securityService, UserService userService)
        {
            _securityService = securityService;
            _userService = userService;
        }


        [HttpPost("login")]
        public async Task<ActionResult> Login(string email, string password)
        {
            var loginData = await _securityService.GenerateJwtTonkenAsync(email, password);

            if (loginData == null)
                return Unauthorized();


            return Ok(loginData);
        }

        [HttpPost("registration")]
        public async Task<ActionResult> Registration([FromBody] UserDTO user)
        {
            var taken = await _userService.VerifyEmail(user.Email!);
            if (!taken)
            {
                await _userService.InsertUser(user);
                return Ok();
            }
            else
            {
                return BadRequest("Email already in use");
            }
        }
    }
}