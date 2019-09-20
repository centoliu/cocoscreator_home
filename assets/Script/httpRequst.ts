// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { GameData } from "./gameData";
import { gamemain } from "./gamemain";

@ccclass
export class httpRequst extends cc.Component {
    public static requst: httpRequst = new httpRequst();

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    SUCC:string = "sucess";
    ERROR:string = "error";

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    getAward(i:any)
    {
      //http://ios.imod.cn/hqg-ios/api_home.php?action=award&server=3&id=4008190&award={"60000":"100","801":"222"}&sign=[SIGN]
      let list = "{\""+GameData.gd.awardId[i][0]+"\":"+GameData.gd.awardNum[i][0]+",\""+GameData.gd.awardId[i][1]+"\":"+GameData.gd.awardNum[i][1]+",\""+GameData.gd.awardId[i][2]+"\":"+GameData.gd.awardNum[i][2]+"}&sign=[SIGN]";
      let str = "https://ssl.imod.cn/hqg/api_home.php?action=award&server="+GameData.gd.serverId+"&id="+GameData.gd.userId+"&award="+list;
      console.log(str);
      wx.request({
          url: str,    //url
          data: {
            x: '',
            y: ''
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          fail	(res)
          {
            console.log("request getAward fail--------------->",res.data)
            return res.data.msg;
          },
          success (res) {
            console.log("request getAward succ--------------->",res.data)
            if(res.data.status=="success")
            {
              //获取成功
              GameData.gd.tipsList.push(GameData.gd.tips_getAward_succ);
              GameData.gd.resetBtnGetAward(true);
            }
            else{
              GameData.gd.tipsList.push(GameData.gd.tips_getAward_fail+res.data.msg);
              GameData.gd.resetBtnGetAward(false);
            }
            return res.data.msg;
          }
      })
    }

    getName(id:any):string
    {
      //"https://ssl.imod.cn/hqg/api_home.php?action=getserver"
        //http://ios.imod.cn/hqg-ios/api_home.php?action=getrole&server=[SERVER]&id=[ID]&sign=[SIGN]
        let str = "https://ssl.imod.cn/hqg/api_home.php?action=getrole&server="+GameData.gd.serverId+"&id="+GameData.gd.userId+"&sign=[SIGN]";//[SIGN]"

        wx.request({
            url: str,    //url
            data: {
              x: '',
              y: ''
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            fail	(res)
            {
              console.log("request http fail--------------->",res.data)
              GameData.gd.YSplayerName = res.data.msg;
              //GameData.gd.setPlayerName();
              return res.data.msg;
            },
            success (res) {
              console.log("request http succ--------------->",res.data)
              GameData.gd.YSplayerName = res.data.msg;
              //GameData.gd.setPlayerName();
              return res.data.msg;
            }
        })
        return "";
    }

    goBind(id:any):boolean
    {
      let self = this;
        //http://ios.imod.cn/hqg-ios/api_home.php?action=bind&server=[SERVER]&id=[ID]&OpenId=[OpenId]&sign=[SIGN] 
        let str = "https://ssl.imod.cn/hqg/api_home.php?action=bind&server="+GameData.gd.serverId+"&id="+GameData.gd.userId+"&OpenId="+GameData.gd.openId+"&sign=[SIGN]";
        console.log(str);
        wx.request({
          url: str,    //url
          data: {
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success (res) {
            console.log("request http bind succ--------------->",res.data,res.data.status)
            if (res.data.status=="succes") {
              console.log("res.data.status==succes");
              GameData.gd.tipsList.push(GameData.gd.tips_bind_succ);
              GameData.gd.IsBind = true;
              GameData.gd.upIsNewPlayer();
              return true;
            }
            else if(res.data.status=="bind"){
              console.log("res.data.status==bind");
              GameData.gd.tipsList.push(res.data.msg);
              GameData.gd.IsBind = true;
              GameData.gd.upIsNewPlayer();
              return true;
            }
            else{
              GameData.gd.tipsList.push(res.data.msg);
            }
          }
        })
        return false; 
    }

    getServerlist()
    {
        //https://ssl.imod.cn/hqg/api_home.php?action=getserver
        let str = "https://ssl.imod.cn/hqg/api_home.php?action=getserver";
        wx.request({
            url: str,    //url
            data: {
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success (res) {
              console.log("request http serverlist1 succ--------------->",res.data)
              GameData.gd.serverList = res.data;
              console.log("request GameData.gd.serverList[8888] succ--------------->",GameData.gd.serverList[8888]);
            }
        })
    }
    // update (dt) {}
}
