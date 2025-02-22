using Microsoft.AspNetCore.Diagnostics;
using Nautilux_Auctions.Domain.Exceptions;
using System.Net;
using System.Text.Json;

namespace Nautilux_Auctions.Handlers
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            var (statusCode, message) = GetExceptionDetails(exception);
            
            _logger.LogError(exception, message);

            httpContext.Response.StatusCode = (int)statusCode;
            httpContext.Response.ContentType = "application/json";
            await httpContext.Response.WriteAsJsonAsync(message, cancellationToken);

            return true;
        }

        private (HttpStatusCode statusCode, string message) GetExceptionDetails(Exception exception)
        {
            return exception switch
            {
                UserAlreadyExistsException e => (HttpStatusCode.Conflict, exception.Message),
                LoginFailedException e => (HttpStatusCode.Unauthorized, exception.Message),
                UserRegistrationFailedException e => (HttpStatusCode.BadRequest, exception.Message),
                InvalidRefreshTokenException e => (HttpStatusCode.BadRequest, exception.Message),
                _ => (HttpStatusCode.InternalServerError, $"An error occurred {exception.Message}")
            };
        }
    }
}
