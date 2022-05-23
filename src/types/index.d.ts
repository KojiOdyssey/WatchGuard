import { Client as BaseClient, Collection } from "discord.js";

export interface Client extends BaseClient {
    commands: Collection<unknown, any>
}

export interface Match {
    threatType: string;
    platformType: string;
    threat: Threat;
    cacheDuration: string;
    threatEntryType: string;
}

export interface Threat {
    url: string;
}

declare global {
    interface String {
        toTitleCase(): string;
    }
}

export { };
