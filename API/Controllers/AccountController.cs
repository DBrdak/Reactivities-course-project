using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public AccountController(UserManager<AppUser> userManager, TokenService tokenService,
            IConfiguration config)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _config = config;
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri("https://graph.facebook.com")
            };
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

            if (user == null)
            {
                return BadRequest();
            }

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
            {
                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            return BadRequest();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var isUserNameTaken = await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username);
            var isEmailTaken = await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email);

            if (isUserNameTaken)
            {
                ModelState.AddModelError("username", "Username taken");
                return ValidationProblem();
            }

            if (isEmailTaken)
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            return BadRequest(result.Errors);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            await SetRefreshToken(user);

            return CreateUserObject(user);
        }

        [AllowAnonymous]
        [HttpPost("fbLogin")]
        public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
        {
            var fbVerifyKeys = _config["Facebook:AppId"] + "|" + _config["Facebook:ApiSecret"];

            var verifyTokenResponse = await _httpClient
                .GetAsync($"debug_token?input_token={accessToken}&access_token={fbVerifyKeys}");

            if (!verifyTokenResponse.IsSuccessStatusCode)
                return Unauthorized();

            var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";

            var fbInfo = await _httpClient.GetFromJsonAsync<FacebookDto>(fbUrl);

            var user = await _userManager.Users
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == fbInfo.Email);

            if (user is not null) return CreateUserObject(user);

            user = CreateUserFromFB(fbInfo);

            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded) return BadRequest("Problem while creating a user from fb");

            await SetRefreshToken(user);

            return CreateUserObject(user);
        }

        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users
                .Include(u => u.RefreshTokens)
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(u => u.UserName == User.FindFirstValue(ClaimTypes.Name));

            if (user is null) return Unauthorized();

            var oldToken = user.RefreshTokens.SingleOrDefault(r => r.Token == refreshToken);

            if (oldToken is not null && !oldToken.IsActive) return Unauthorized();

            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user)
            };
        }

        private static AppUser CreateUserFromFB(FacebookDto fbInfo)
            =>  new()
            {
                DisplayName = fbInfo.Name,
                Email = fbInfo.Email,
                UserName = fbInfo.Email.Split('@', 2)[0],
                Photos = new List<Photo>
                {
                    new Photo
                    {
                        Id = string.Concat("fb_" + fbInfo.Id),
                        IsMain = true,
                        Url = fbInfo.Picture.Data.Url
                    }
                }
            };

        private async Task SetRefreshToken(AppUser user)
        {
            var refreshToken = _tokenService.GeneRefreshToken();

            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
            };

            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
        }
    }
}