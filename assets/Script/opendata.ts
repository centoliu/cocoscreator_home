//微信开放域排行榜
const {ccclass, property} = cc._decorator;
import { GameData } from "./gameData";
@ccclass
export default class openData extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    start () {

    }

    sendMsg()
    {
        let openDataContext = wx.getOpenDataContext();    //开放数据实例
        openDataContext.postMessage({
            text: 'writeExpNum',
            expNum:GameData.gd.experence,//cc.sys.localStorage.getItem("wipeBubbleTotalNum"),
            LV:GameData.gd.level,//cc.sys.localStorage.getItem("GameLv"),
        });
    }
    update (dt) {
        let openDataContext = wx.getOpenDataContext();    //开放数据实例
        let sharedCanvas = openDataContext.canvas
        sharedCanvas.width = 650;
        sharedCanvas.height = 900;
    }
}
