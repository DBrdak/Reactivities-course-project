using API.DTOs;
using Domain;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace API.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CreateToken(AppUser user)
        {
            var authenticationSettings = new AuthenticationSettings();
            _config.GetSection("Authentication").Bind(authenticationSettings);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSettings.JwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(authenticationSettings.JwtExpireDays),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }

    //public string CreateToken(AppUser user, AuthenticationSettings authenticationSettings)
    //{
    //    var claims = new List<Claim>
    //        {
    //            new Claim(ClaimTypes.Name, user.UserName),
    //            new Claim(ClaimTypes.NameIdentifier, user.Id),
    //            new Claim(ClaimTypes.Email, user.Email)
    //        };

    //    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSettings.JwtKey));
    //    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

    //    var tokenDescriptor = new SecurityTokenDescriptor
    //    {
    //        Subject = new ClaimsIdentity(claims),
    //        Expires = DateTime.UtcNow.AddDays(authenticationSettings.JwtExpireDays),
    //        SigningCredentials = creds
    //    };

    //    var tokenHandler = new JwtSecurityTokenHandler();

    //    var token = tokenHandler.CreateToken(tokenDescriptor);

    //    return tokenHandler.WriteToken(token);
    //}
}