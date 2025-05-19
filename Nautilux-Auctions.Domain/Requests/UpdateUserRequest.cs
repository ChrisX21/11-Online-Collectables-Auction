namespace Nautilux_Auctions.Domain.Requests;

public class UpdateUserRequest
{
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string Email { get; init; }
}