using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class UserActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            async Task<Result<List<UserActivityDto>>> IRequestHandler<Query, Result<List<UserActivityDto>>>.Handle(Query request, CancellationToken cancellationToken)
            {
                var userActivities = _context.ActivitiesAtendees
                    .Where(x => x.AppUser.UserName == request.Username)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider);

                switch (request.Predicate)
                {
                    case "past":
                        userActivities = userActivities.Where(x => x.Date < DateTime.UtcNow).OrderBy(x => x.Date);
                        break;

                    case "future":
                        userActivities = userActivities.Where(x => x.Date >= DateTime.UtcNow).OrderBy(x => x.Date);
                        break;

                    case "hosting":
                        userActivities = userActivities.Where(x => x.HostUsername == request.Username).OrderBy(x => x.Date);
                        break;
                }

                var result = await userActivities.ToListAsync();

                return Result<List<UserActivityDto>>.Success(result);
            }
        }
    }
}