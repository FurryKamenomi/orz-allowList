/// <reference path="D:/projects/project-minecraftBedrock/plugins/defineTypescript/dts/llaids/src/index.d.ts"/>
/// <reference path="plugin.d.ts"/>

import { CConfigModule } from './config';
import { CEventModule } from './event';
import playerListModule = require('./playerList');

class COrzAllowList implements orzPlugin.NOrzAllowList.IMainModule {
  readonly name = 'orz! AllowList';
  readonly author = 'Kamenomi';
  readonly license = 'Apache-2.0';
  readonly version = [0, 0, 1];
  readonly gitRepo = 'https://github.com/FurryKamenomi/orz-allowList';
  readonly introduction = "A Minecraft Bedrock plugin in ORZ.";

  public _config = new CConfigModule;
  public _event = new CEventModule(this);

  public _playerList = new playerListModule.CPlayerList;
  public playerList = this._playerList.getPlayerList();

  public constructor() {
    // onload
    ll.registerPlugin(
      this.name,
      this.introduction,
      this.version,
      {
        author: this.author,
        license: this.license,
        gitrepository: this.gitRepo
      }
    );
    this._event.init()
  };
};

const OrzAllowList = new COrzAllowList;

setInterval(() => { // 定时: 对于在线玩家 timeout 的处理。
  mc.getOnlinePlayers().forEach(player => {
    var playerInfo = OrzAllowList.playerList.get(player.uuid)!;

    if (playerInfo.allowInfo.enable)
      if (playerInfo.allowInfo.outdate != null && playerInfo.allowInfo.outdate < (new Date()).valueOf()) {
        player.disconnect(OrzAllowList._config.config().messages.AllowList_Permission_Outdate);
        return;
      };
  });

  [...OrzAllowList.playerList.entries()].forEach(value => {
    var playerInfo = value[1];
    if (playerInfo.blockInfo.enable)
      if (playerInfo.blockInfo.outdate != null && playerInfo.blockInfo.outdate < (new Date()).valueOf()) {
        playerInfo.blockInfo.enable = false;
        playerInfo.blockInfo.outdate = null;

        OrzAllowList.playerList.set(value[0], playerInfo);
        OrzAllowList._playerList.updatePlayerList(OrzAllowList.playerList);
      };
  });
}, OrzAllowList._config.config().intervalServerMS);

export const refresh = OrzAllowList._event.onMsgRefresh.bind(OrzAllowList._event);