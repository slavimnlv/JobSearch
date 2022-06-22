using ApplicationServices.DTOs;
using ApplicationServices.Filter;
using ApplicationServices.Implementations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ProjectAPI.Controllers
{
    [Route("api/jobad")]
    [ApiController]
    [Authorize]
    public class JobAdController : ControllerBase
    {
        private readonly JobAdService _jobAdService;
        private readonly UserService _userService;

        public JobAdController(JobAdService jobAdService, UserService userService)
        {
            _jobAdService = jobAdService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult> AddJobAd([FromBody] JobAdDTO jobAdDto)
        {

            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            var authorize = _userService.Authorize(identity!, jobAdDto.EmployerId);

            if (!authorize)
            {
                return Unauthorized();
            }

            await _jobAdService.InsertJobAd(jobAdDto, identity!);

            return Ok(); 
        }

        [HttpPut]
        public async Task<ActionResult> UpdateJobAd([FromBody] JobAdDTO jobAdDTO)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            var authorized = await _jobAdService.Authorize(identity!, jobAdDTO.Id);
            if (!authorized)
                return Unauthorized();

            if (!await _jobAdService.DoesJobAdExist(jobAdDTO.Id))
                return NotFound();
            var user = await _jobAdService.UpdateJobAd(jobAdDTO);
            return Ok(user);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteJobAd(int id)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            var authorized = await _jobAdService.Authorize(identity!, id);
            if (!authorized)
                return Unauthorized();

            var jobAdDTO = await _jobAdService.GetJobAd(id);

            if (jobAdDTO == null)
                return NotFound();

            await _jobAdService.DeleteJobAd(id);
            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetJobAdById(int id)
        {
            var jobAdDTO = await _jobAdService.GetJobAd(id);

            if (jobAdDTO == null)
                return NotFound();

            return Ok(jobAdDTO);
        }

        [HttpPost("jobads")]
        public async Task<IActionResult> GetJobAds(JobAdFilter filter)
        {
            var jobAds = await _jobAdService.GetJobAds(filter);
            return Ok(jobAds);
        }


        [HttpGet("userid")]
        public async Task<IActionResult> GetJobAdsByUserId(int userid)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            var jobAds = await _jobAdService.GetJobAdByUserId(userid, identity!);
            if (jobAds == null)
                return NotFound();
            return Ok(jobAds);
        }

        [HttpPost("count")]
        public async Task<IActionResult> GetJobAdsCount(JobAdFilter filter)
        {
            return Ok(await _jobAdService.GetCount(filter));

        }

    }
}

