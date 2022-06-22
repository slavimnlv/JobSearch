using ApplicationServices.DTOs;
using AutoMapper;
using Data.Entities;
using Repositories.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationServices.Implementations
{
    public class UserService
    {
        private readonly UserRepository _userRepository;
        private readonly ApplicationRepository _applicationRepository;
        private readonly IMapper _mapper;

        public UserService(UserRepository userRepository, ApplicationRepository applicationRepository ,IMapper mapper)
        {
            _userRepository = userRepository;
            _applicationRepository = applicationRepository;
            _mapper = mapper;
        }

        public async Task InsertUser(UserDTO userDTO)
        {
            var user = _mapper.Map<UserDTO, User>(userDTO);
            user.CreatedOn = DateTime.UtcNow;
            await _userRepository.AddAsync(user);
        }

        public async Task<bool> VerifyEmail(string email)
        {
            return await _userRepository.DoesEmailExistAsync(email);
        }

        public async Task<bool> DoesUserExist(int id)
        {
            return await _userRepository.DoesUserExist(id);
        }

        public async Task<UserDTO> UpdateUser(UserDTO userDTO)
        {
            var user = await _userRepository.GetByIdAsync(userDTO.Id);

            if (string.IsNullOrEmpty(userDTO.Email) || ((userDTO.Email != user.Email) && (await _userRepository.DoesEmailExistAsync(userDTO.Email!))))
                return null!;

            user.Email = userDTO.Email;
            user.Name = userDTO.Name;
            user.Password = user.Password;
            //user.Bulgarian = userDTO.Bulgarian;

            await _userRepository.UpdateAsync(user);

            var dto = _mapper.Map<User, UserDTO>(user);
            return dto;
        }

        public async Task<UserDTO> GetUser(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            UserDTO? userDTO = null;
            if (user != null)
            {
                 userDTO = _mapper.Map<User, UserDTO>(user);
            }

            return userDTO!;
        }

        public async Task<bool> DeleteUser(int id)
        {
            await _userRepository.DeleteAsync(id);
            var user = _userRepository.GetByIdAsync(id);
            if (user == null)
                return true;
            return false;
        }

        public bool Authorize(ClaimsIdentity identity, int id)
        {
            if (identity != null)
            {
                string userId = identity.FindFirst(ClaimTypes.NameIdentifier)!.Value;

                if (userId == id.ToString())
                    return true;
            }
            return false;
        }

        //public async Task<List<ApplicationUserDTO>> GetUsersByJobId(int jobid)
        //{
        //    var ids = await _applicationRepository.GetUserIds(jobid);
        //    var users = await _userRepository.GetUsersByIds(ids);
        //    return _mapper.Map<List<User>, List<ApplicationUserDTO>>(users);
        //}
    }
}
