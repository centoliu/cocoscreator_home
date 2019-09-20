//获取奖励
const {ccclass, property} = cc._decorator;
import { GameData } from "./gameData";

@ccclass
export default class getAwardTS extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    @property(cc.ScrollView)
    awardScroll:cc.ScrollView = null;
    @property(cc.Prefab)
    completeItem: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        //加载奖励列表
        this.RankCallBack();
        // for(let i=0;i<6;i++)
        // {
        //     console.log("IsGetAward[%d]------->%s",i,GameData.gd.IsGetAward[i]);
        // }
    }

    start () {
        //this.schedule(this.tipsTimeRun, 60);
    }

    update (dt) {

    }

    tipsTimeRun(){
        let self = this;
        const db = wx.cloud.database({       //获取数据库
            env: 'test-x1fb3'
        });
        db.collection('todos').doc(GameData.gd.openId).get({
            success: function(res) {
                // res.data 包含该记录的数据
                console.log("getMyScoreById()----------->",res.data)
                GameData.gd.IsGetAward = res.data.IsGetAward;
                self.RankCallBack();
            },
            fail:function(){
            }
        })

    }

    public RankCallBack(){
        this.awardScroll.content.removeAllChildren();
        let size = GameData.gd.awardNum.length;
        this.awardScroll.content.setContentSize(640, 100*size > 600 ? 100*size : 600);
        let i:number = 0;
        for(i=0; i < size; i++)
        {
            let node = cc.instantiate(this.completeItem);
            node.position = new cc.Vec2(0,-55-i*100);
            this.AlterPrefabCompleteItem(node, i);
            this.awardScroll.content.addChild(node);
        }
    }

    AlterPrefabCompleteItem(completeItem:cc.Node, index:any){
        let itemid = GameData.gd.awardpicId[index];
        let itemnum = GameData.gd.awardNum[index];

        let txt_level = completeItem.getChildByName("txt_lv").getComponent(cc.Label).string = (index+1)+"级";
        let itemNode:Array<cc.Node> = new Array<cc.Node>();
        itemNode[0] = completeItem.getChildByName("wupingkuang1");
        itemNode[1] = completeItem.getChildByName("wupingkuang2");
        itemNode[2] = completeItem.getChildByName("wupingkuang3");

        for (let j = 0; j < 3; j++) {
            cc.loader.loadRes("img/equip"+itemid[j], cc.SpriteFrame, function(err, ret) {
                if (err) {
                    console.log(err);
                    return;
                }
                itemNode[j].getChildByName("award").getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("img/equip"+itemid[j], cc.SpriteFrame);
            }.bind(this));
            itemNode[j].getChildByName("num").getComponent(cc.Label).string = itemnum[j]+"";
        }
        let btn_get = completeItem.getChildByName("btn_getAward").getComponent(cc.Button);
        GameData.gd.level = GameData.gd.getLevelByExp();
        console.log("index--------->",index,GameData.gd.level,GameData.gd.IsGetAward[index]);
        if (index+1>GameData.gd.level) {   //不可领取
            //btn_get.node.color = cc.color(145,114,81);   //(248,232,207)
            btn_get.interactable = false;
        }
        else if((!GameData.gd.IsGetAward[index])&&index<=GameData.gd.level){   //已领取
            btn_get.interactable = false;
            completeItem.getChildByName("txt_getAward").getComponent(cc.Label).string = GameData.gd.getaward_btn_succ;
        }
        else{    //未领取
            btn_get.node.on(cc.Node.EventType.TOUCH_START, httpGetAward, this, true);
        }
        function httpGetAward()
        {
            GameData.gd.httpGetAward(index);
            //btn_get.node.color = cc.color(145,114,81);    //(145,114,81);
            btn_get.interactable = false;
            completeItem.getChildByName("txt_getAward").getComponent(cc.Label).string = GameData.gd.getaward_btn_succ;
            btn_get.node.off(cc.Node.EventType.TOUCH_START, httpGetAward, this, true);
        }
    }
}
