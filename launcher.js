"use strict";
/// <reference path="D:/projects/project-minecraftBedrock/plugins/defineTypescript/dts/llaids/src/index.d.ts"/>
/// <reference path="plugin.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = void 0;
const config_1 = require("./config");
const event_1 = require("./event");
const playerListModule = require("./playerList");
class COrzAllowList {
    name = 'orz! AllowList';
    author = 'Kamenomi';
    license = 'Apache-2.0';
    version = [0, 0, 1];
    gitRepo = 'https://github.com/FurryKamenomi/orz-allowList';
    introduction = "A Minecraft Bedrock plugin in ORZ.";
    _config = new config_1.CConfigModule;
    _event = new event_1.CEventModule(this);
    _playerList = new playerListModule.CPlayerList;
    playerList = this._playerList.getPlayerList();
    constructor() {
        // onload
        ll.registerPlugin(this.name, this.introduction, this.version, {
            author: this.author,
            license: this.license,
            gitrepository: this.gitRepo
        });
        this._event.init();
    }
    ;
}
;
const OrzAllowList = new COrzAllowList;
setInterval(() => {
    mc.getOnlinePlayers().forEach(player => {
        var playerInfo = OrzAllowList.playerList.get(player.uuid);
        if (playerInfo.allowInfo.enable)
            if (playerInfo.allowInfo.outdate != null && playerInfo.allowInfo.outdate < (new Date()).valueOf()) {
                player.disconnect(OrzAllowList._config.config().messages.AllowList_Permission_Outdate);
                return;
            }
        ;
    });
    [...OrzAllowList.playerList.entries()].forEach(value => {
        var playerInfo = value[1];
        if (playerInfo.blockInfo.enable)
            if (playerInfo.blockInfo.outdate != null && playerInfo.blockInfo.outdate < (new Date()).valueOf()) {
                playerInfo.blockInfo.enable = false;
                playerInfo.blockInfo.outdate = null;
                OrzAllowList.playerList.set(value[0], playerInfo);
                OrzAllowList._playerList.updatePlayerList(OrzAllowList.playerList);
            }
        ;
    });
}, OrzAllowList._config.config().intervalServerMS);
exports.refresh = OrzAllowList._event.onMsgRefresh.bind(OrzAllowList._event);
