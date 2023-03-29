import nodeFs = require('node:fs');

export class CConfigModule implements orzPlugin.NOrzAllowList.IConfigMoudule {
  readonly configDefault = {
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
  readonly configPath = `${__dirname}/config/plugin.json.conf`;

  private configStruc: orzPlugin.TConfigStruc;

  public constructor() {
    this.configStruc = this.readConfig();

    nodeFs.watchFile(this.configPath, {
      bigint: true,
      interval: this.configStruc.intervalConfigMS
    }, (curr, prev) => {
      if (curr.mtimeNs != prev.mtimeNs)
        this.readConfig();
    })
  };

  public config(): orzPlugin.TConfigStruc
  public config(configStruc: orzPlugin.TConfigStruc): void
  public config(configStruc?: orzPlugin.TConfigStruc): orzPlugin.TConfigStruc | void {
    if (typeof configStruc != 'object')
      return this.configStruc!
    this.configStruc = configStruc;
    nodeFs.writeFileSync(this.configPath, JSON.stringify(configStruc));
  };

  protected readConfig() {
    if (!nodeFs.existsSync(this.configPath))
      nodeFs.writeFileSync(this.configPath, JSON.stringify(this.configDefault));
    
    try {
      this.configStruc = JSON.parse(nodeFs.readFileSync(this.configPath, { encoding: 'utf-8' }));
    } catch (error) {
      this.configStruc = this.configDefault;
      logger.error('Error, Unknown config format! The plugin doesn\'t support it. ');
    };

    logger.info('Loaded the config! ');
    return this.configStruc;
  };
};