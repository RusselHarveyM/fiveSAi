FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 7124

ENV ASPNETCORE_URLS=http://+:7124
ENV ASPNETCORE_ENVIRONMENT=Development

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
ARG configuration=Release
WORKDIR /src
# COPY ["./5s.csproj", "backend/5s_backend/5s/"]
# COPY ["./Program.cs", "backend/5s_backend/5s/"]
COPY ["./", "backend/5s_backend/5s/"]
# COPY ["./Context", "backend/5s_backend/5s/"]
# COPY ["./Repositories", "backend/5s_backend/5s/"]
# COPY ["./Services", "backend/5s_backend/5s/"]
RUN dotnet restore "backend/5s_backend/5s/5s.csproj"
COPY . .
WORKDIR "/src/backend/5s_backend/5s"
# RUN dotnet build "5s.csproj" -c $configuration -o /app/build
RUN dotnet build -c $configuration -o /app/build --no-restore

FROM build AS publish
ARG configuration=Release
# RUN dotnet publish "5s.csproj" -c $configuration -o /app/publish /p:UseAppHost=false
RUN dotnet publish "5s.csproj" -c $configuration -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "5s.dll"]