import { isProd } from '../config';
import { dbconnect } from "../db";
import { Client } from "../types";
import { handleCommands } from "../utils/commandHandler";

export const execute = (client: Client) => {
    console.log('Logged in as: ' + client.user?.username);
    dbconnect(process.env.MONGODB_SRV!);
    handleCommands(client, process.cwd() + `/${isProd ? 'dist' : 'src'}/commands/**/*.${isProd ? 'js' : 'ts'}`);
}
