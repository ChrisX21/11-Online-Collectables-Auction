# Use the official ASP.NET Core runtime as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the official ASP.NET Core SDK as a build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["Online_Auction.Server.csproj", "./"]
RUN dotnet restore "Online_Auction.Server.csproj"

# Copy the rest of the application and build
COPY . .
RUN dotnet build "Online_Auction.Server.csproj" -c Release -o /app/build

# Publish the app
FROM build AS publish
RUN dotnet publish "Online_Auction.Server.csproj" -c Release -o /app/publish

# Use the base image to run the application
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Online_Auction.Server.dll"]
