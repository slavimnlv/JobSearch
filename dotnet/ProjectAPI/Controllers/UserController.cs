using ApplicationServices.DTOs;
using ApplicationServices.Implementations;
using FinalProject.Data.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ProjectAPI.Controllers
{
    [Route("api/user")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JobAdService _jobAdService;

        public UserController(UserService userService, JobAdService jobAdService)
        {
            _userService = userService;
            _jobAdService = jobAdService;

        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser([FromBody] UserDTO userDTO)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            var authorized = _userService.Authorize(identity!, userDTO.Id);
            if (!authorized)
                return Unauthorized();

            if (!await _userService.DoesUserExist(userDTO.Id))
                return NotFound();
            var user =  await _userService.UpdateUser(userDTO);
            if (user == null)
                return BadRequest("Email already in use");
            return Ok(user);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteUser(int id)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            var authorized = _userService.Authorize(identity!, id);
            if (!authorized)
                return Unauthorized();

            var userDTO = await _userService.GetUser(id);

            if (userDTO == null)
                return NotFound();

            await _userService.DeleteUser(id);
            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetUserById(int id)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            var authorized = _userService.Authorize(identity!, id);
            if (!authorized)
                return Unauthorized();

            var user = await _userService.GetUser(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpGet("name")]
        public async Task<ActionResult> GetUserNameId(int id)
        {
            
            var user = await _userService.GetUser(id);

            if (user == null)
                return NotFound();
            if(user.Role != Role.Employer)
                return BadRequest();

            return Ok(user.Name);
        }

        //[HttpGet("jobid")]
        //public async Task<ActionResult> GetUserByJobId(int jobid)
        //{
        //    ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

        //    var authorized = await _jobAdService.Authorize(identity!, jobid);
        //    if (!authorized)
        //        return Unauthorized();

        //    var users = await _userService.GetUsersByJobId(jobid);

        //    if (users == null)
        //        return NotFound();

        //    return Ok(users);
        //}
    }
}
