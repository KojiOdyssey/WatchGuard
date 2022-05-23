import { isProd } from '../config';
import { dbConnect } from "../db";
import { Client } from "../types";
import { handleCommands } from "../utils/commandHandler";

export const execute = (client: Client) => {
    console.log(`Logged in as: ${client.user!.username}`);
    dbConnect(process.env.MONGODB_SRV!);
    handleCommands(client, process.cwd() + `/${isProd ? 'dist' : 'src'}/commands/**/*.${isProd ? 'js' : 'ts'}`);
}
