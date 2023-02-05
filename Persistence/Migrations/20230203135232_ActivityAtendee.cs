using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ActivityAtendee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccessFailedCount",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "EmailConfirmed",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "LockoutEnabled",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "LockoutEnd",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "NormalizedEmail",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "NormalizedUserName",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "PhoneNumberConfirmed",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "SecurityStamp",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "TwoFactorEnabled",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "UserName",
                table: "Activities");

            migrationBuilder.CreateTable(
                name: "ActivityAppUser",
                columns: table => new
                {
                    ActivitiesId = table.Column<Guid>(type: "TEXT", nullable: false),
                    AttendeesId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityAppUser", x => new { x.ActivitiesId, x.AttendeesId });
                    table.ForeignKey(
                        name: "FK_ActivityAppUser_Activities_ActivitiesId",
                        column: x => x.ActivitiesId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActivityAppUser_AspNetUsers_AttendeesId",
                        column: x => x.AttendeesId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAppUser_AttendeesId",
                table: "ActivityAppUser",
                column: "AttendeesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityAppUser");

            migrationBuilder.AddColumn<int>(
                name: "AccessFailedCount",
                table: "Activities",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EmailConfirmed",
                table: "Activities",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "LockoutEnabled",
                table: "Activities",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LockoutEnd",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NormalizedEmail",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NormalizedUserName",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PhoneNumberConfirmed",
                table: "Activities",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SecurityStamp",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TwoFactorEnabled",
                table: "Activities",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "Activities",
                type: "TEXT",
                nullable: true);
        }
    }
}
