﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.Email
{
    public class EmailSender
    {
        private readonly IConfiguration _config;

        public EmailSender(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string userEmail, string emailSubject, string emailBody)
        {
            var client = new SendGridClient(_config["Sendgrid:Key"]);
            var message = new SendGridMessage
            {
                From = new EmailAddress("brdak02dominik@outlook.com", _config["Sendgrid:User"]),
                Subject = emailSubject,
                PlainTextContent = emailBody,
                HtmlContent = emailBody
            };
            message.AddTo(new EmailAddress(userEmail));

            await client.SendEmailAsync(message);
        }
    }
}
