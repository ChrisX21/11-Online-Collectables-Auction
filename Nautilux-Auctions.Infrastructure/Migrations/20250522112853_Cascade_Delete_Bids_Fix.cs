using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nautilux_Auctions.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Cascade_Delete_Bids_Fix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bids_Listings_ListingId",
                table: "Bids");

            migrationBuilder.AddForeignKey(
                name: "FK_Bids_Listings_ListingId",
                table: "Bids",
                column: "ListingId",
                principalTable: "Listings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bids_Listings_ListingId",
                table: "Bids");

            migrationBuilder.AddForeignKey(
                name: "FK_Bids_Listings_ListingId",
                table: "Bids",
                column: "ListingId",
                principalTable: "Listings",
                principalColumn: "Id");
        }
    }
}
