export { }

declare global {
  namespace orzPlugin {
    interface IOrzBase {
      name: string,
      author: 'Kamenomi',
      license: string,
      version: Array<number>,
      gitRepo: string,
      introduction: 'A Minecraft Bedrock plugin in ORZ.'
    }
    namespace NOrzAllowList {
      interface IMainModule extends IOrzBase {
        _playerList: IPlayerModule
        playerList: Map<String, TPlayerInfomation>
      }
      interface IPlayerModule {
        getPlayerList(): Map<String, TPlayerInfomation>,
        updatePlayerList(data: Map<String, TPlayerInfomation>)
      }
      interface IConfigMoudule {

      }
      interface IEventModule {

      }
      interface ICommandModule {
        
      }
    }

    type TPlayerInfomation = {
      realName: string,
      xuid: string,
      allowInfo: {
        enable: boolean,
        outdate: number | null,
        timeoutTip: string | 'Your AllowList was lost efficacy'
      },
      blockInfo: {
        enable: boolean,
        outdate: number | null,
        duringReason: string | 'You was banned. $timeout'
      }
    }
  }
}