﻿namespace Nautilux_Auctions.Infrastructure.Options
{
    public class JwtOptions
    {
        public const string JwtOptionsKey = "JwtOptions";

        public string Secret { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int ExpirationInMinutes { get; set; }
    }
}
