# Database Backup and Disaster Recovery Procedure

## PostgreSQL Automated Backup Plan
For production PostgreSQL databases:

### 1. Daily Automated Snapshots
- Configure daily automated backups with a 30-day point-in-time recovery (PITR) window.

### 2. Manual Backup Command (`pg_dump`)
```bash
pg_dump -h <DB_HOST> -U <DB_USER> -d reality_forecast -F c -b -v -f ./backups/reality_forecast_backup_$(date +%Y%m%d).dump
```

### 3. Restore Procedure (`pg_restore`)
```bash
pg_restore -h <DB_HOST> -U <DB_USER> -d reality_forecast -v ./backups/reality_forecast_backup_YYYYMMDD.dump
```
