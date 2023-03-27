"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CEventModule = void 0;
const loadedTip = require("./loadedTip");
class CEventModule {
    mainThis;
    constructor(_this) {
        this.mainThis = _this;
    }
    ;
    init() {
        mc.listen('onServerStarted', () => {
            logger.setTitle('orz-AllowList');
            log('\n', loadedTip.getTipFormat(`${this.mainThis.name} - ${loadedTip.formatVersion(this.mainThis.version)}
GitRepo: ${this.mainThis.gitRepo}`, 5));
        });
        mc.listen('onPreJoin', player => {
            if (!this.mainThis.playerList.has(player.uuid))
                this.mainThis.playerList.set(player.uuid, {
                    realName: player.realName,
                    xuid: player.xuid,
                    allowInfo: {
                        enable: false,
                        outdate: null,
                        timeoutTip: ''
                    },
                    blockInfo: {
                        enable: false,
                        outdate: 0,
                        duringReason: ''
                    }
                });
            var playerInfo = this.mainThis.playerList.get(player.uuid);
            this.mainThis._playerList.updatePlayerList(this.mainThis.playerList);
            var allowTimeOut = playerInfo.allowInfo.outdate;
            logger.info(`已上载 ${this.mainThis.playerList.size} 条玩家数据。`);
            if (playerInfo.blockInfo.enable) {
                var blockTimeOut = playerInfo.blockInfo.outdate;
                var timeString = new Date(blockTimeOut || 0).toDateString();
                player.disconnect(playerInfo.blockInfo.duringReason.replace('$timeout$', (blockTimeOut == null) ? 'Infinity' : timeString));
                return;
            }
            ;
            if (!playerInfo.allowInfo.enable) {
                player.disconnect('You have not a AllowList permission');
                return;
            }
            ;
            if (allowTimeOut != null && allowTimeOut < (new Date).valueOf()) {
                player.disconnect('Your AllowList permission was outted! ');
                playerInfo.allowInfo.enable = false;
                this.mainThis.playerList.set(player.uuid, playerInfo);
                this.mainThis._playerList.updatePlayerList(this.mainThis.playerList);
                return;
            }
            ;
        });
    }
    ;
    onMsgRefresh() {
        this.mainThis.playerList.clear();
        this.mainThis.playerList = this.mainThis._playerList.getPlayerList();
        mc.getOnlinePlayers().forEach(player => {
            var playerInfo = this.mainThis.playerList.get(player.uuid);
            var blockOutdate = playerInfo.blockInfo.outdate;
            var timeString = new Date(blockOutdate || 0).toDateString();
            if (!playerInfo.allowInfo.enable) {
                player.disconnect('You was deprived the allowList permission! ');
                return;
            }
            if (playerInfo.blockInfo.enable) {
                player.disconnect(`You was banned! ${playerInfo.blockInfo.duringReason.replace('$timeout$', (blockOutdate == null) ? 'Infinity' : timeString)}`);
                return;
            }
            ;
        });
    }
    ;
}
exports.CEventModule = CEventModule;
;
