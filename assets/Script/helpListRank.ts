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

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.ScrollView)
    Scroll:cc.ScrollView = null;
    @property(cc.Prefab)
    completeItem: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //加载好友帮助记录
        this.rankShow()
    }

    rankShow(){
        this.Scroll.content.removeAllChildren();
        let size = GameData.gd.HelpList.length;
        this.Scroll.content.setContentSize(640, 100*size > 600 ? 100*size : 600);
        let i:number = 0;
        let count = 0;

        let node = cc.instantiate(this.completeItem);
        node.position = new cc.Vec2(0,-50-count*100);
        this.tableTitle(node);
        this.Scroll.content.addChild(node);
        count=count+1;

        for(i=1; i < size; i++){
            if (GameData.gd.HelpList[i].id=="" || GameData.gd.HelpList[i].num=="0") {
                //
            }
            else{
                let node = cc.instantiate(this.completeItem);
                node.position = new cc.Vec2(0,-50-count*100);
                this.AlterPrefabCompleteItem(node, count);
                this.Scroll.content.addChild(node);
                count=count+1;
            }
        }
    }

    tableTitle(completeItem:cc.Node){
        completeItem.getChildByName("rank").getComponent(cc.Label).string = GameData.gd.help_rank_rank;
        completeItem.getChildByName("name").getComponent(cc.Label).string = GameData.gd.help_rank_name;
        completeItem.getChildByName("number").getComponent(cc.Label).string = GameData.gd.help_rank_count;
    }

    AlterPrefabCompleteItem(completeItem:cc.Node, index:any){
        completeItem.getChildByName("rank").getComponent(cc.Label).string = (index+1)+'';
        completeItem.getChildByName("name").getComponent(cc.Label).string = 'a'+1;//GameData.gd.HelpList[index].name;
        completeItem.getChildByName("number").getComponent(cc.Label).string = index+'00';//GameData.gd.HelpList[index].num;
    }

    start () {

    }

    // update (dt) {}
}
