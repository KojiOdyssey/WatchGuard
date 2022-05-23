export interface Strike {
    striked: boolean,
    userId: string,
    guildId: string
}

export interface Settings {
    guildId: string,
    logChannelId: string,
    logsEnabled: boolean,
}