﻿using Application.Core;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivities(string username, [FromQuery] string predicate)
        {
            return HandleResult(await Mediator.Send(new UserActivities.Query { Username = username, Predicate = predicate }));
        }

        [HttpPut]
        public async Task<IActionResult> EditProfile(Edit.Command profile)
        {
            return HandleResult(await Mediator.Send(profile));
        }
    }
}