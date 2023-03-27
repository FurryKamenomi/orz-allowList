import ndoeFs = require('node:fs');

export class CPlayerList implements orzPlugin.NOrzAllowList.IPlayerModule {
  private playerListPath = `${__dirname}/database/playerList.json`;

  public constructor() {
    ndoeFs.watchFile(this.playerListPath, (curr, prev) => {
      if (curr.mtime != prev.mtime) { // was edited.
        logger.info(`已上载 ${this.getPlayerList().size} 条玩家数据。`);
        require('./launcher').refresh();
      };
    });
  };

  public getPlayerList(): Map<String, orzPlugin.TPlayerInfomation> {
    var resultData: Map<String, orzPlugin.TPlayerInfomation> = new Map;
    
    var fileString = ndoeFs.readFileSync(this.playerListPath).toString('utf-8');
    if (fileString.length == 0)
      return resultData;

    var fileJson = JSON.parse(fileString);
    var infoArray = (fileJson as Object);
    for (const key in infoArray) {
      resultData.set(key, fileJson[key]);
    };
    return resultData;
  };

  public updatePlayerList(data: Map<String, orzPlugin.TPlayerInfomation>) {
    var resultObjString: string = '';
    [...data.keys()].forEach(key => {
      resultObjString += `"${key}": ${JSON.stringify(data.get(key))}`;
    })
    ndoeFs.writeFileSync(this.playerListPath, `{${resultObjString}}`);
  };
};