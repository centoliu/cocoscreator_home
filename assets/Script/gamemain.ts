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
export class gamemain extends cc.Component {
    public static game: gamemain = new gamemain();

    static instance:any;

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Label)
    txt_level:cc.Label = null;

    @property(cc.Label)
    txt_experence:cc.Label = null;
    @property(cc.Node)
    bindNode:cc.Node = null;
    @property(cc.Node)
    getExpNode:cc.Node = null;
    @property(cc.Node)
    getAwardNode:cc.Node = null;
    @property(cc.Node)
    getRankHelpList:cc.Node = null;
    @property(cc.Node)
    rankNode:cc.Node = null;
    @property(cc.Node)
    helpDesc:cc.Node = null;
    @property(cc.Sprite)
    map:cc.Sprite = null;
    @property(cc.Button)
    btn_checkin:cc.Button = null;

    // LIFE-CYCLE CALLBACKS:
    _isShow:boolean = false;
    _showAction:cc.Action = null;
    _hideAction:cc.Action = null;
    tag = true;
    ac = null;
    pos = null;

    exp = 0;

    onLoad () {
        this.initData();
        this. resetMap();
        gamemain.instance = this;
        gamemain.instance.getAwardNode = this.getAwardNode;
        gamemain.instance.node = this.node;
        gamemain.instance.txt_experence = this.txt_experence;
        gamemain.instance.map = this.map;
        gamemain.instance.btn_checkin = this.btn_checkin;
        //加载玩家等级数据
        this.txt_experence.string = "EXP:"+GameData.gd.experence;
        this.exp = GameData.gd.experence;
        this.txt_level.getComponent(cc.Label).string = GameData.gd.nickName+"lv:"+GameData.gd.getLevelByExp()
        this.bindNode.active = false;
        console.log("onLoad GameScene----------->",GameData.gd.IsNewPlyer);
        if (GameData.gd.IsNewPlyer==true) {
            this.bindNode.active = true;
        }
        else{
                this.bindNode.active = false;
        }
        this.schedule(this.tipsTimeRun, 1);
        this.helpDesc.on(cc.Node.EventType.TOUCH_START, this.showHelpDesc, this, true);
    }

    start () {
        wx.cloud.init({ env: "test-x1fb3"});
        if (typeof wx === 'undefined') {
            console.log("wx is undedined----------------->");
            return;
        }
        wx.showShareMenu();
        wx.onShareAppMessage(() => {
            return {
                title: '帮助我照顾家园',
                imageUrl: '', // 图片 URL,
                success(res) {
                console.log("转发成功");
                },
                fail(res) {
                    console.log("转发失败");
                }
            }
        })
        this.initAction();

        wx.onShow(this.Lisencallback);
        //wx.offHide(this.closeSelf);
    }

    showHelpDesc(){
        GameData.gd.tipsList.push(GameData.gd.tips_test_succ);
    }

    // closeSelf(){
    //     wx.exitMiniProgram({
    //         success(){

    //         }
    //     });
    // }

    Lisencallback(){
        //cc.director.loadScene("login");
    }

    update (dt) {
        if(this.exp<GameData.gd.experence){
            this.txt_experence.string = "EXP:"+GameData.gd.experence;
        }
        if(this.bindNode.active == true){
            if (GameData.gd.IsBind==true) {
                this.bindNode.active = false;                
            }
        }
    }

    //刷新经验值显示
    resetExp(){
        let self = this;
        console.log("EXP:------->",GameData.gd.experence);
        gamemain.instance.txt_experence.string = "EXP:"+GameData.gd.experence;
    }

    resetAward(){
        let self = this;
        console.log("resetAward()------------->");
        if (gamemain.instance.node!=null){
            gamemain.instance.getAwardNode.getComponent("getAwardTS").RankCallBack();
        }
    }
    
    initAction() {
        this._isShow = false;
        this.rankNode.y = 1300;
        this._showAction = cc.moveTo((this.rankNode.y)/2600, this.rankNode.x, 0);
        this._hideAction = cc.moveTo((this.rankNode.y)/2600, this.rankNode.x, 1300);
    }

    buttonActhelp(){
        
    }

    //显示获取经验界面
    showGetExpNode(){
        this.getExpNode.active = !this.getExpNode.active;
        this.btn_checkin.interactable = false;
        this.getAwardNode.active = false;
        this.getRankHelpList.active = false;
        if (this._isShow==true) {
            this.rankNode.runAction(this._hideAction);
        }
        
        if (this.getExpNode.active) {
            let self = this;
            const db = wx.cloud.database({       //获取数据库
                env: 'test-x1fb3'
            })
            db.collection('todos').doc(GameData.gd.openId).get({
                success: function(res) {
                    // res.data 包含该记录的数据
                    console.log("getMyScoreById()----------->",res.data.IsGetExp);
                    self.tag = res.data.IsGetExp;
                    if (!self.tag) {
                        gamemain.instance.btn_checkin.interactable = true;
                    }
                }
            })   
        }
    }

    //显示获取奖励列表
    showGetAward(){
        this.getAwardNode.active = !this.getAwardNode.active;
        this.getExpNode.active = false;
        this.getRankHelpList.active = false;
        if (this._isShow==true) {
            this.rankNode.runAction(this._hideAction);
        }
    }

    //显示微信好友经验排行榜
    showRankNode()
    {
        this._isShow = !this._isShow;
        this.getAwardNode.active = false;
        this.getExpNode.active = false;
        this.getRankHelpList.active = false;

        if (this._isShow==true) {
            console.log("showRankNode------------------>")
            this.rankNode.runAction(this._showAction);

            var openDataContext = wx.getOpenDataContext();
            var sharedCanvas = openDataContext.canvas;
            if (sharedCanvas) {
                console.log("sharedCanvas---------------------------->");
                sharedCanvas.width = cc.game.canvas.width * 2;
                sharedCanvas.height = cc.game.canvas.height * 2;
            }
            wx.getOpenDataContext().postMessage({
                text: "rankList",
            });
        }
        else {
            this.rankNode.runAction(this._hideAction);
        }
    }

    //显示好友帮助排行榜
    showRankHelpList(){
        if (this._isShow==true) {
            this.rankNode.runAction(this._hideAction);
        }
        this.getAwardNode.active = false;
        this.getExpNode.active = false;
        this.getRankHelpList.active = !this.getRankHelpList.active;
    }

    //绑定成功
    bindSucc(){
        GameData.gd.upIsNewPlayer();
    }
    
    //刷新背景地图
    resetMap(){
        // this.awardScroll.content.setContentSize(640, 100*size > 600 ? 100*size : 600);
        console.log("resetMap()");
        let lv = GameData.gd.getLevelByExp();
        let self = this;
        cc.loader.loadRes("map/lv"+lv, cc.SpriteFrame, function(err, ret) {
            if (err) {
                console.log(err);
                return;
            }
            gamemain.instance.map.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes("map/lv"+lv, cc.SpriteFrame);
        }.bind(this));
    }

    //初始化数据
    initData(){
        var action1 = cc.moveBy(1, 0, 80);
        var action2 = cc.fadeOut(1);
        var action = cc.spawn(action1, action2);
        var fun = cc.callFunc(this.cleanCellbyTag, this);
        var ac = cc.sequence(fun,action);
        this.ac = ac;

        let x = cc.view.getVisibleSize().width;
        let y = cc.view.getVisibleSize().height;
        this.pos = cc.v2(x/2,y/2);
    }

    //轮询tips队列
    tipsTimeRun (dt) {
        if (GameData.gd.tipsList.length>0) {
            //shift()
            var node = new cc.Node();
            var sprite = node.addComponent(cc.Sprite);
            //sprite.spriteFrame = new cc.SpriteFrame(tex);
            var txt = node.addComponent(cc.Label);
            txt.fontSize = 24;
            txt.string = GameData.gd.tipsList.shift()+"";
            node.setPosition(this.pos);
            cc.director.getScene().addChild(node);

            var action1 = cc.moveBy(1, 0, 80);
            var action2 = cc.fadeOut(1);
            var action = cc.spawn(action1, action2);
            var fun = cc.callFunc(this.cleanCellbyTag, this);
            var ac = cc.sequence(fun,action);
            node.runAction(ac);
        }
    }

    cleanCellbyTag()
    {

    }
}
