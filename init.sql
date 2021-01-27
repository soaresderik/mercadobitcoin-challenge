SELECT 'CREATE DATABASE mercadobitcoin'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mercadobitcoin')\gexec
