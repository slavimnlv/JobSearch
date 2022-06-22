using ApplicationServices.DTOs;
using AutoMapper;
using Data.Entities;
using FinalProject.Data.Enums;
using Repositories.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationServices.Implementations
{
    public class ApplicationService
    {
        private readonly ApplicationRepository _applicationRepository;
        private readonly JobAdRepository _jobAdRepository;
        private readonly UserRepository _userRepository;
        private readonly IMapper _mapper;

        public ApplicationService(ApplicationRepository applicationRepository, JobAdRepository jobAdRepository, UserRepository userRepository,IMapper mapper)
        {
            _applicationRepository = applicationRepository;
            _jobAdRepository = jobAdRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<bool> InsertApplication(ApplicationDTO applicationDTO, ClaimsIdentity identity)
        {
            var role = identity.FindFirst(ClaimTypes.Role)!.Value;
            if (role == Role.Candidate.ToString())
            {
                var check = await _applicationRepository.DoesApplicationExist(applicationDTO.UserId, applicationDTO.JobAdId);
                if (!check)
                {
                    var application = _mapper.Map<ApplicationDTO, Application>(applicationDTO);
                    application.CreatedOn = DateTime.UtcNow;
                    await _applicationRepository.AddAsync(application);
                    return true;
                }
            }

            return false;
        }

        public async Task<bool> DoesApplicationExist(int id)
        {
            return await _applicationRepository.DoesApplicationExist(id);
        }

        public async Task<ApplicationDTO> UpdateApplication(ApplicationDTO applicationDTO, ClaimsIdentity identity)
        {
            if (identity != null)
            {
                var role = identity.FindFirst(ClaimTypes.Role)!.Value;
                string userId = identity.FindFirst(ClaimTypes.NameIdentifier)!.Value; 
                var application = await _applicationRepository.GetByIdAsync(applicationDTO.Id);

                if (role == Role.Candidate.ToString() && application.UserId.ToString() == userId)
                {
                    if(application.Rejected != true && application.Approved != true)
                    {
                        application.CoverLetter = applicationDTO.CoverLetter;

                        await _applicationRepository.UpdateAsync(application);
                        var dto = _mapper.Map<Application, ApplicationDTO>(application);
                        return dto;
                    }
                }

                var employerId = await _jobAdRepository.GetUserId(application.JobAdId);

                if (role == Role.Employer.ToString() && userId == employerId.ToString())
                {
                    if (applicationDTO.Approved)
                    {
                        application.Approved = true;
                        application.Rejected = false;
                    }
                    else
                    {
                        application.Approved = false;
                        application.Rejected = true;
                    }

                    await _applicationRepository.UpdateAsync(application);
                    var dto = _mapper.Map<Application, ApplicationDTO>(application);
                    return dto;
                }
            }

            return null!;
        }

        public async Task<List<ApplicationUserDTO>> GetApplicationsByJobId(int jobid)
        {

            var list = new List<ApplicationUserDTO>();
            var applications = await _applicationRepository.GetApplicationsByJobId(jobid);
            foreach (var application in applications)
            {
                var user = await _userRepository.GetByIdAsync(application.UserId);
                ApplicationUserDTO dto = new ApplicationUserDTO
                {
                    ApplicationId = application.Id,
                    UserId = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Rejected = application.Rejected,
                    Approved = application.Approved,
                    CoverLetter = application.CoverLetter
                };

                list.Add(dto);
            }

            return list;
            //purvo vzemam applicaciite s jobaa, posle foreach
        }

        public async Task<ApplicationDTO> GetApplicationByJobIdAndUserId(int jobid, int userid)
        {
            var applicationDTO = await _applicationRepository.GetApplicationByJobAndUser(jobid, userid);
            if (applicationDTO == null)
                return null!;
            return _mapper.Map<Application,ApplicationDTO>(applicationDTO);
        }

        public async Task<ApplicationDTO> GetApplicationById(int id)
        {
            var application = await _applicationRepository.GetByIdAsync(id);
            ApplicationDTO? applicationDTO = null;
            if (application != null)
            {
                applicationDTO = _mapper.Map<Application, ApplicationDTO>(application);
            }

            return applicationDTO!;
        }

        public async Task<bool> DeleteApplication(int id)
        {
            var application = await _applicationRepository.GetByIdAsync(id);

            if(application!= null && application.Rejected != true && application.Approved != true)
            {
                await _applicationRepository.DeleteAsync(id);
                var entity = _applicationRepository.GetByIdAsync(id);
                if (entity == null)
                    return true;
            }
            return false;
        }


        public async Task<bool> Authorize(ClaimsIdentity identity, int id)
        {
            if (identity != null)
            {
                string userId = identity.FindFirst(ClaimTypes.NameIdentifier)!.Value;
                var candidateId = await _applicationRepository.GetUserId(id);

                if (userId == candidateId.ToString())
                    return true;
            }
            return false;
        }

        public async Task<bool> Authorize(ClaimsIdentity identity, ApplicationDTO application)
        {
            if (identity != null)
            {
                string userId = identity.FindFirst(ClaimTypes.NameIdentifier)!.Value;
                var jobad = await _jobAdRepository.GetByIdAsync(application.JobAdId);

                if (userId == application.UserId.ToString() || jobad.EmployerId.ToString() == userId )
                    return true;
            }
            return false;
        }
    }
}

