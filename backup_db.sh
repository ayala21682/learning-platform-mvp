#!/bin/bash
# Backup script for PostgreSQL database
# Usage: ./backup_db.sh

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/learning_platform_backup_$TIMESTAMP.sql"

# Create backups directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Get PostgreSQL credentials from .env
if [ -f .env ]; then
    source .env
else
    echo "❌ Error: .env file not found"
    exit 1
fi

# Backup the database
docker compose exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup successful: $BACKUP_FILE"
    echo "📊 Size: $(du -h $BACKUP_FILE | cut -f1)"
else
    echo "❌ Backup failed"
    exit 1
fi
