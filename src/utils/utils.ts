export const hasSharedKeys = (obj1: any, obj2: any, keys: any[]) => {
    for (const key of keys) {
        if (obj1[key] === obj2[key]) {
            return true;
        }
        continue;
    }
    return false;
}

String.prototype.toTitleCase = function (): string {
    return this.replace(
        /\w\S*/g, (x) => x.charAt(0).toUpperCase() + x.substr(1).toLowerCase());
};