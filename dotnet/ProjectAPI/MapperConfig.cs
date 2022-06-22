using ApplicationServices.DTOs;
using AutoMapper;
using Data.Entities;

namespace ProjectAPI
{
    public class MapperConfig : Profile
    {
        public MapperConfig()
        {
            CreateMap<User, UserDTO>().ReverseMap()
                .ForMember(u => u.CreatedOn, opt => opt.Ignore());
            CreateMap<JobAd, JobAdDTO>().ReverseMap()
                .ForMember(u => u.CreatedOn, opt => opt.Ignore());
            CreateMap<Application, ApplicationDTO>().ReverseMap()
                .ForMember(u => u.CreatedOn, opt => opt.Ignore());
            //CreateMap<User, ApplicationUserDTO>().ReverseMap()
            //    .ForMember(u => u.Bulgarian, opt => opt.Ignore())
            //    .ForMember(u => u.Password, opt => opt.Ignore())
            //    .ForMember(u => u.Role, opt => opt.Ignore())
            //    .ForMember(u => u.Password, opt => opt.Ignore());

        }

    }
}
