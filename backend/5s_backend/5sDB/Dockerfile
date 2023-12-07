FROM mcr.microsoft.com/mssql/server:2022-latest

ENV ACCEPT_EULA=Y

ENV SA_PASSWORD="123456@A" 

USER root
RUN apt-get -y update  && \
  apt-get install -y dos2unix

# Create a directory for database deployment
RUN mkdir -p /usr/db/sql

# Copy the database project files to the container
COPY . /usr/db/sql

# Set the working directory
WORKDIR /usr/db/sql

RUN chmod +x /usr/db/sql/import-data.sh

# Expose the SQL Server port
EXPOSE 1433

USER mssql
ENTRYPOINT /bin/bash ./entrypoint.sh