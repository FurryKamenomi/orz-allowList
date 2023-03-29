"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CConfigModule = void 0;
const nodeFs = require("node:fs");
class CConfigModule {
    configDefault = {
        messages: {
            No_AllowList_Permission: "You DO NOT have this server allowlist permission! ",
            AllowList_Permission_Outdate: "Your allowlist permission was outdated! ",
            Was_Deprvied_AllowList_Permission: "You have been deprived of this server allowlist permission!",
            Was_Banned: "You were taken in the blocklist! $reason$",
            Was_AllowList_Outdate: "Your allowlist permission is outdated now!"
        },
        intervalServerMS: 3600000,
        intervalConfigMS: 10000
    };
    configPath = `${__dirname}/config/plugin.json.conf`;
    configStruc;
    constructor() {
        this.configStruc = this.readConfig();
        nodeFs.watchFile(this.configPath, {
            bigint: true,
            interval: this.configStruc.intervalConfigMS
        }, (curr, prev) => {
            if (curr.mtimeNs != prev.mtimeNs)
                this.readConfig();
        });
    }
    ;
    config(configStruc) {
        if (typeof configStruc != 'object')
            return this.configStruc;
        this.configStruc = configStruc;
        nodeFs.writeFileSync(this.configPath, JSON.stringify(configStruc));
    }
    ;
    readConfig() {
        if (!nodeFs.existsSync(this.configPath))
            nodeFs.writeFileSync(this.configPath, JSON.stringify(this.configDefault));
        try {
            this.configStruc = JSON.parse(nodeFs.readFileSync(this.configPath, { encoding: 'utf-8' }));
        }
        catch (error) {
            this.configStruc = this.configDefault;
            logger.error('Error, Unknown config format! The plugin doesn\'t support it. ');
        }
        ;
        logger.info('Loaded the config! ');
        return this.configStruc;
    }
    ;
}
exports.CConfigModule = CConfigModule;
;
