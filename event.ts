import loadedTip = require('./loadedTip');

export class CEventModule implements orzPlugin.NOrzAllowList.IEventModule {
  private mainThis: orzPlugin.NOrzAllowList.IMainModule;

  public constructor(_this: orzPlugin.NOrzAllowList.IMainModule) {
    this.mainThis = _this
  };

  public init() {
    mc.listen('onServerStarted',
      () => {
        logger.setTitle('orz-AllowList');
        log('\n', loadedTip.getTipFormat(
          `${this.mainThis.name} - ${loadedTip.formatVersion(this.mainThis.version)}
GitRepo: ${this.mainThis.gitRepo}`, 5
        ));
      }
    );

    mc.listen('onPreJoin', player => { // 主动：对于进入前玩家 Permission 处理。
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
      var playerInfo = this.mainThis.playerList.get(player.uuid)!;
      this.mainThis._playerList.updatePlayerList(this.mainThis.playerList);

      var allowTimeOut = playerInfo.allowInfo.outdate;

      logger.info(`${this.mainThis.playerList.size} player information loaded. `);

      if (playerInfo.blockInfo.enable) {
        var blockOutdate = playerInfo.blockInfo.outdate
        var timeString = new Date(blockOutdate || 0).toDateString();

        player.disconnect(this.mainThis._config.config().messages.Was_Banned.replace('$reason$',
          playerInfo.blockInfo.duringReason.replace('$timeout$',
            (blockOutdate == null) ? 'Forever' : timeString)
        ));
        return;
      };

      if (!playerInfo.allowInfo.enable) {
        player.disconnect(this.mainThis._config.config().messages.No_AllowList_Permission);
        return;
      };

      if (allowTimeOut != null && allowTimeOut < (new Date).valueOf()) {
        player.disconnect(this.mainThis._config.config().messages.AllowList_Permission_Outdate);

        playerInfo.allowInfo.enable = false;
        this.mainThis.playerList.set(player.uuid, playerInfo);
        this.mainThis._playerList.updatePlayerList(this.mainThis.playerList);
        return;
      };
    });
  };

  public onMsgRefresh() { // 被动: 对于 OP 主动封禁后，在线玩家的 Permission 处理，on 文件变动产生 MSG。
    this.mainThis.playerList.clear();
    this.mainThis.playerList = this.mainThis._playerList.getPlayerList();

    mc.getOnlinePlayers().forEach(player => {
      var playerInfo = this.mainThis.playerList.get(player.uuid)!;
      var blockOutdate = playerInfo.blockInfo.outdate
      var timeString = new Date(blockOutdate || 0).toDateString();

      if (!playerInfo.allowInfo.enable) {
        player.disconnect(this.mainThis._config.config().messages.Was_AllowList_Outdate);
        return;
      }
      if (playerInfo.blockInfo.enable) {
        player.disconnect(this.mainThis._config.config().messages.Was_Banned.replace('$reason$',
          playerInfo.blockInfo.duringReason.replace('$timeout$',
            (blockOutdate == null) ? 'Forever' : timeString)
        ));
        return;
      };
    });
  };
};