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
        _config: IConfigMoudule
        _playerList: IPlayerModule
        playerList: Map<String, TPlayerInfomation>
      }
      interface IPlayerModule {
        getPlayerList(): Map<String, TPlayerInfomation>,
        updatePlayerList(data: Map<String, TPlayerInfomation>)
      }
      interface IConfigMoudule {
        config(conf: TConfigStruc): void
        config(): TConfigStruc
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
    
    type TConfigStruc = {
      messages: {
        No_AllowList_Permission: string,
        AllowList_Permission_Outdate: string,
        Was_Deprvied_AllowList_Permission: string,
        Was_Banned: string,
        Was_AllowList_Outdate: string
      },
      intervalServerMS: number,
      intervalConfigMS: number
    }
  }
}