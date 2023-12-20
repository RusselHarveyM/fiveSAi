for i in {1..100};
do
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 123456@A -d master -i schema.sql
    if [ $? -eq 0 ]
    then
        echo "schema.sql completed"
        break
    else
        echo "not ready yet..."
        sleep 1
    fi
done

# Keep the container running for some time (adjust the sleep duration based on your needs)
echo "Waiting for a while to keep the container running..."
sleep 86400  # Sleep for 1 day, adjust as needed