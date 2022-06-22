using ApplicationServices.DTOs;
using ApplicationServices.Implementations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ProjectAPI.Controllers
{
    [Route("api/application")]
    [ApiController]
    [Authorize]
    public class ApplicationController : ControllerBase
    {
        private readonly ApplicationService _applicationService;
        public readonly JobAdService _jobAdService;
        private readonly UserService _userService;

        public ApplicationController(ApplicationService applicationService, JobAdService jobAdService, UserService userService)
        {
            _applicationService = applicationService;
            _jobAdService = jobAdService;
            _userService = userService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult> AddApplication([FromBody] ApplicationDTO applicationDTO)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            var authorize = _userService.Authorize(identity!, applicationDTO.UserId);

            if (!authorize)
            {
                return Unauthorized();
            }
            var application = await _applicationService.InsertApplication(applicationDTO, identity!);
            if(!application)
                return BadRequest();

            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateApplication([FromBody] ApplicationDTO applicationDTO)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            if (!await _applicationService.DoesApplicationExist(applicationDTO.Id))
                return NotFound();

            var application = await _applicationService.UpdateApplication(applicationDTO, identity!);

            if(application == null)
                return Unauthorized();

            return Ok(application);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteApplication(int id)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            var authorized = await _applicationService.Authorize(identity!, id);
            if (!authorized)
                return Unauthorized();

            var applicationDTO = await _applicationService.GetApplicationById(id);

            if (applicationDTO == null)
                return NotFound();

            await _applicationService.DeleteApplication(id);
            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetApplicationById(int id)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            var application = await _applicationService.GetApplicationById(id);

            var canAuthorized = await _applicationService.Authorize(identity!, id);
            var empAuthorized = await _jobAdService.Authorize(identity!, application.JobAdId);
            if (!canAuthorized && !empAuthorized)
                return Unauthorized();

            if (application == null)
                return NotFound();

            return Ok(application);
        }

        [HttpGet("jobid")]
        public async Task<ActionResult> GetApplicationsByJobId(int jobid)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            var authorized = await _jobAdService.Authorize(identity!, jobid);
            if (!authorized)
                return Unauthorized();

            var applications = await _applicationService.GetApplicationsByJobId(jobid);

            return Ok(applications);
        }

        [HttpGet("jobid&userid")]
        public async Task<ActionResult> GetApplicationByJobIdAndUserId(int jobid, int userid)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

            var application = await _applicationService.GetApplicationByJobIdAndUserId(jobid, userid);
            if (application == null)
                return NotFound();

            var authorized = await _applicationService.Authorize(identity!, application);
            if (!authorized)
                return Unauthorized();

            return Ok(application);
        }

        //get application by userid and jobid

    }
}

