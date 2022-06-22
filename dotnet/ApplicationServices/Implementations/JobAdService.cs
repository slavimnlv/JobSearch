using ApplicationServices.DTOs;
using ApplicationServices.Filter;
using AutoMapper;
using Data.Entities;
using FinalProject.Data.Enums;
using Repositories.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationServices.Implementations
{
    public class JobAdService
    {
        private readonly JobAdRepository _jobAdRepository;
        private readonly ApplicationRepository _applicationRepository;
        private readonly IMapper _mapper;

        public JobAdService(JobAdRepository jobAdRepository, ApplicationRepository applicationRepository, IMapper mapper)
        {
            _jobAdRepository = jobAdRepository;
            _applicationRepository = applicationRepository;
            _mapper = mapper;
        }

        public async Task InsertJobAd(JobAdDTO jobAdDTO, ClaimsIdentity identity)
        {
            if(identity != null)
            {
                var role = identity.FindFirst(ClaimTypes.Role)!.Value;
                if(role == Role.Employer.ToString())
                {
                    var jobAd = _mapper.Map<JobAdDTO, JobAd>(jobAdDTO);
                    jobAd.CreatedOn = DateTime.UtcNow;
                    await _jobAdRepository.AddAsync(jobAd);
                }
            }
        }


        public async Task<JobAdDTO> UpdateJobAd(JobAdDTO jobAdDTO)
        {
            var jobAd = await _jobAdRepository.GetByIdAsync(jobAdDTO.Id);

            jobAd.Title = jobAdDTO.Title!;
            jobAd.Description = jobAdDTO.Description!;
            jobAd.Salary = jobAdDTO.Salary;
            jobAd.Category = jobAdDTO.Category;
            jobAd.Type = jobAdDTO.Type;

            await _jobAdRepository.UpdateAsync(jobAd);

            var dto = _mapper.Map<JobAd, JobAdDTO>(jobAd);
            return dto;
        }

        public async Task<JobAdDTO> GetJobAd(int id)
        {
            var user = await _jobAdRepository.GetByIdAsync(id);
            JobAdDTO? userDTO = null;
            if (user != null)
            {
                userDTO = _mapper.Map<JobAd, JobAdDTO>(user);
            }

            return userDTO!;
        }

        public async Task<bool> DoesJobAdExist(int id)
        {
            return await _jobAdRepository.DoesJobAdExist(id);
        }

        public async Task<bool> DeleteJobAd(int id)
        {
            await _jobAdRepository.DeleteAsync(id);
            var jobad = _jobAdRepository.GetByIdAsync(id);
            if (jobad == null)
                return true;
            return false;
        }

        public async Task<bool> Authorize(ClaimsIdentity identity, int id)
        {
            if (identity != null)
            {
                var userId = identity.FindFirst(ClaimTypes.NameIdentifier)!.Value;

                var employerId = await _jobAdRepository.GetUserId(id);
                

                if (userId == employerId.ToString())
                    return true;
            }
            return false;
        }

        public async Task<List<JobAdDTO>> GetJobAds(JobAdFilter filter)
        {
            int page = filter.Page;
            int size = 3;

            Expression<Func<JobAd, bool>> expression = null!;
            expression = j =>
                     (filter.Type == null || j.Type == filter.Type) &&
                     (filter.Category == null || j.Category == filter.Category);

            var jobAds = await _jobAdRepository.GetPaginatedAsync(page,size,expression);

            return _mapper.Map<List<JobAd>, List<JobAdDTO>>(jobAds.ToList());
        }

        public async Task<int> GetCount(JobAdFilter filter)
        {
            Expression<Func<JobAd, bool>> expression = null!;

            if (filter != null)
            {
                expression = j =>
                         (filter.Type == null || j.Type == filter.Type) &&
                         (filter.Category == null || j.Category == filter.Category);
            }           

            return await _jobAdRepository.GetAllCount(expression);
        }

        public async Task<List<JobAdDTO>> GetJobAdByUserId(int userId, ClaimsIdentity identity)
        {
            if(identity != null)
            {
                var role = identity.FindFirst(ClaimTypes.Role)!.Value;
                var id = identity.FindFirst(ClaimTypes.NameIdentifier)!.Value;
                if(role == Role.Candidate.ToString())
                {
                    var list = await _applicationRepository.GetJobAdIds(userId);
                    var jobAds = await _jobAdRepository.GetByIds(list);

                    return _mapper.Map<List<JobAd>, List<JobAdDTO>>(jobAds);
                }

                if (role == Role.Employer.ToString())
                {
                    var jobAds = await _jobAdRepository.GetByEmployerId(userId);

                    return _mapper.Map<List<JobAd>, List<JobAdDTO>>(jobAds);
                }
            }

            return null!;
        }
    }
}
