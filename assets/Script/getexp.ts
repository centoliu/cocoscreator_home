//底部获取经验按钮弹出节点

const {ccclass, property} = cc._decorator;
import { GameData } from "./gameData";
import { gamemain } from "./gamemain";

@ccclass
export default class getExp extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    @property(cc.Button)
    btn_getExp:cc.Button = null;
    @property(cc.Button)
    btn_share:cc.Button = null;

    tag = true;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let self = this;


    }

    start () {

    }


    getExp()
    {
        this.btn_getExp.interactable = false;
        //this.btn_getExp.node.color = cc.color(145,114,81);
        //this.node.getChildByName("btn_checkin").getComponent(cc.Button).interactable = false;
        let EXP = GameData.gd.ExpLvTotal;
        GameData.gd.experence=GameData.gd.experence+100;
        GameData.gd.upDataExp();
        GameData.gd.onwriteExpNum(GameData.gd.experence, GameData.gd.getLevelByExp());
    }

    goShare()
    {
        console.log("diy=" + "help"+"&openId="+GameData.gd.openId + "&name"+GameData.gd.nickName);
        wx.shareAppMessage({
            title: '帮助照顾家园',
            query: "diy=" + "help"+"&openId="+GameData.gd.openId + "&name"+GameData.gd.nickName,
            success(res) {
                wx.showToast({
                    title: "分享成功",
                });
                console.log("分享成功" + res);
            },
            fail(res) {
                console.log("分享失败" + res);
            }
        })
        wx.updateShareMenu({
            withShareTicket: true
        })
    }

    UpDataScore()
    {
        // 向子域发送消息 请注意此处key的值，和之前上传的key一致
        // 若实现的是群排行，则需要传shareTicket(可从onShow中获得)
        wx.getOpenDataContext().postMessage({
            text: "writeExpNum",
            info: { 'score': GameData.gd.experence, 'LV':GameData.gd.getLevelByExp()},
        });
    }
    // update (dt) {}
}
