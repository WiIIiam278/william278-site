export const useLinkIcon = (link) => {
    switch(link.id) {
        case "twitter": return "fa6-brands:twitter";
        case "discord": return "fa6-brands:discord";
        case "youtube": return "fa6-brands:youtube";
        case "patreon": return "fa6-brands:patreon";
        case "paypal": return "fa6-brands:paypal";
        case "buymeacoffee": return "fa6-solid:heart";
        case "github": return "fa6-brands:github";
        case "curseforge": return "fa6-solid:fire";
        case "hangar" : return "fa6-solid:paper-plane";
        case "spigot": return "fa6-solid:faucet";
        case "polymart": return "fa6-solid:p";
        case "modrinth": return "fa6-solid:wrench";
        case "builtbybit": return "fa6-solid:cube";
        case "bstats": return "fa6-solid:chart-simple";
        case "universaldb": return "fa6-solid:down-long";
        case "itch": return "fa6-brands:itch-io";
        default: return "fa6-solid:link";
    }
}