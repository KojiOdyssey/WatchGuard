// ProcessEnv

export const isDev = process.env.NODE_ENV?.toLowerCase() === "development";
export const isProd = !isDev;
export const prefix = process.env.PREFIX;

// Customization

export enum Color {
    Primary = 0x1ABC9C,
    Secondary = 0x2F3136,
    Error = 0xED4245,
}

export enum Emoji {
    Check = '<:check:977953272163864587>',
    Cross = '<:cross:977953272277106702>',
    Warn = '<:warning:977961836890714134>',
    Leave = '<:leave:977960801900060743>',
    ShieldCheck = '<:shield_check:977956734222086194>',
}