"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPlayerList = void 0;
const ndoeFs = require("node:fs");
class CPlayerList {
    playerListPath = `${__dirname}/database/playerList.json`;
    constructor() {
        ndoeFs.watchFile(this.playerListPath, (curr, prev) => {
            if (curr.mtime != prev.mtime) { // was edited.
                logger.info(`已上载 ${this.getPlayerList().size} 条玩家数据。`);
                require('./launcher').refresh();
            }
            ;
        });
    }
    ;
    getPlayerList() {
        var resultData = new Map;
        var fileString = ndoeFs.readFileSync(this.playerListPath).toString('utf-8');
        if (fileString.length == 0)
            return resultData;
        var fileJson = JSON.parse(fileString);
        var infoArray = fileJson;
        for (const key in infoArray) {
            resultData.set(key, fileJson[key]);
        }
        ;
        return resultData;
    }
    ;
    updatePlayerList(data) {
        var resultObjString = '';
        [...data.keys()].forEach(key => {
            resultObjString += `"${key}": ${JSON.stringify(data.get(key))}`;
        });
        ndoeFs.writeFileSync(this.playerListPath, `{${resultObjString}}`);
    }
    ;
}
exports.CPlayerList = CPlayerList;
;
