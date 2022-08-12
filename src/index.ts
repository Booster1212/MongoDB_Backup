import Database from "@stuyk/ezmongodb";
import cron from "cron";

import fs from "fs";

import { BackupConfig } from "./config";

export class Backup {
    static async init() {
        const connectedDatabase = await Database.init(
            BackupConfig.DATABASE_MONGO_URL,
            BackupConfig.DATABASE_NAME,
            BackupConfig.DEFAULT_COLLECTIONS
        );

        if (!connectedDatabase) {
            throw new Error(`Did not connect to the database.`);
        }

        console.log(`Database Connection successfully established.`);
    }

    static async backupCollection(collection: string, time: string) {
        const collectionData = await Database.fetchAllData(collection);

        if (!collectionData) {
            throw new Error(`Did not fetch data from the collection ${collection}.`);
        }

        const currentRealTimeStamp = new Date(Date.now()).toLocaleDateString(
            "de-DE",
            {
                hour12: false,
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );

        const path = `${BackupConfig.BACKUP_DIRECTORY}/${currentRealTimeStamp}/${time}`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
            console.log(`Backup directory didn't exist, created it.`);
        }

        const collectionBackupJSON = JSON.stringify(collectionData, undefined, 4);
        const collectionBackupDataFile = path + `/${collection}.json`;

        fs.writeFileSync(collectionBackupDataFile, collectionBackupJSON);
    }
}

cron
    .job(BackupConfig.BACKUP_INTERVAL, async () => {
        await Backup.init();

        const currentClockTime = new Date(Date.now()).toLocaleTimeString("de-DE", {
            hour12: false,
            minute: "2-digit",
            hour: "2-digit",
        });
        const convertedString = currentClockTime.replace(/:/g, "-");

        for (const collection of BackupConfig.DEFAULT_COLLECTIONS) {
            await Backup.backupCollection(collection, convertedString);
            console.log(`${collection} => Backup complete.`);
        }

        Database.close();
        console.log(`Database Connection closed.`);
    })
    .start();

console.log(`Backup service started.`);