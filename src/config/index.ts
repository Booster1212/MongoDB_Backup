export const BackupConfig = {
    DATABASE_MONGO_URL: "mongodb://127.0.0.1/27017",
    DATABASE_NAME: "athena",
    DEFAULT_COLLECTIONS: [
        'accounts',
        'characters',
        'options',
        'interiors',
        'vehicles',
        'storage',
    ],
    BACKUP_INTERVAL: '0 */4 * * *', // CRON! https://crontab.guru/every-4-hours
    BACKUP_DIRECTORY: "./backups",
};

export const enum COLLECTIONS {
    ACCOUNTS = "accounts",
    CHARACTERS = "characters",
    OPTIONS = "options",
    INTERIORS = "interiors",
    VEHICLES = "vehicles",
    STORAGE = "storage",
}
