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
import { httpRequst } from "./httpRequst";
import { gamemain } from "./gamemain";

@ccclass
export class GameData extends cc.Component {

    public static gd: GameData = new GameData();

    //玩家存储
    public openId:string = "";  //微信openid
    public userId:string = "";  //妖神传角色id
    public YSplayerName:string = "";  //妖神传角色名
    public level:number = 0;
    public nickName:string = "";   //玩家微信名字
    public experence:number = 0;
    public serverId:number = 0;  //妖神传服务器ID
    public Userdata ={};
    public IsGetExp = true;    //是否已签到
    public IsBind = false;    //是否已绑定
    public IsNewPlyer = true;
    public IsGetAward = null;//[false,false,false,false,false,false];
    public HelpList = [{'id':'id','name':'name','num':'0'}];
    public MyHelpFriendList:any;
    public IsGetData = false;

    //服务器列表
    public serverList:any;

    //奖励列表
    public item = {"id":0, "num":0}
    public awardId = [[851,2370,610],[506,2386,3281],[2310,2482,3288],[2920,2576,3301],[2921,564,3304],[2568,3341,3276]];
    public awardpicId = [[3014,2105,3503],[540,1004,10249],[2310,3502,10256],[5305,5061,10269],[5306,1817,10272],[3500,10293,10244]];
    public awardNum = [[10,20,10],[10,5,1],[20,1,1],[50,5,1],[2,10,1],[1,5,1]];
    public ExpLvTotal = [600,2100,5100,11100,12000];
    public selAward = -1;

    //提示消息列表
    public tipsList = new Array;

    //str
    public tips_help_succ = "帮助好友成功";
    public tips_test_succ = "查看帮助";
    public tips_help_fail = "您今日已帮助过该好友哦！";
    public tips_bind_succ = "绑定成功";
    public tips_getAward_succ = "获取奖励成功";
    public tips_getAward_fail = "获取奖励失败";
    public tips_action_succ = "操作成功";
    public go_my_home = "前往我的家园";
    public get_my_home = "获取我的家园";
    public help_rank_rank = "排名";
    public help_rank_name = "微信昵称";
    public help_rank_count = "累计照料次数";
    public getaward_btn_succ = "已领取";

    //向数据库插入玩家数据
    public writeUserInfo(){
        let tag= true;
        console.log("writeUserInfo()-------------------->",this.openId,this.nickName,this.experence,this.userId);
        wx.cloud.init({ env: "test-x1fb3"})   //云能力初始化(测试环境ID：test-x1fb3)
        const db = wx.cloud.database({       //获取数据库
            env: 'test-x1fb3'
        })
        const todos = db.collection('todos')
        if (db==null) {
            console.log(">>>>>>>>db is null");
        }
        db.collection('todos').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                _id: this.openId, // 可选自定义 _id，使用玩家openID
                name: this.nickName,   //玩家名字
                experence: 0,   //玩家微信家园经验值
                userId: this.userId,
                serverId: GameData.gd.serverId,
                Level: 0,
                IsNewPlyer: true,
                IsGetExp:false,
                IsGetAward:[true,true,true,true,true,true],
                HelpList:[{'id':'id','name':'name','num':'0'}],
                MyHelpFriendList:[GameData.gd.openId],
            },
            success: function(res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                console.log("writeUserInfo-----SUCC----------------------------->%s",res)
                GameData.gd.IsGetExp = false;
                GameData.gd.level = 0;
                GameData.gd.experence = 0;
                GameData.gd.IsGetAward = [true,true,true,true,true,true];
                //cc.director.loadScene("game");
                GameData.gd.IsGetData = true;
            },
            fail:function(){
                GameData.gd.IsGetData = false;
            }
        });
        this.onwriteExpNum(0,1);
    }

    //根据OpenId获取成绩
    public getMyScoreById(){
        let tag = false;
        console.log("getMyScoreById---------------->");
        const db = wx.cloud.database({       //获取数据库
            env: 'test-x1fb3'
        })
        db.collection('todos').doc(GameData.gd.openId).get({
            success: function(res) {
                // res.data 包含该记录的数据
                console.log("getMyScoreById()----------->",res.data)
                GameData.gd.Userdata = res.data;
                GameData.gd.experence = res.data.experence;
                GameData.gd.IsGetExp = res.data.IsGetExp;
                GameData.gd.IsNewPlyer = res.data.IsNewPlyer;
                GameData.gd.IsGetAward = res.data.IsGetAward;
                GameData.gd.HelpList = res.data.HelpList;
                GameData.gd.userId = res.data.userId;
                GameData.gd.serverId = res.data.serverId;
                GameData.gd.MyHelpFriendList  = res.data.MyHelpFriendList;
                GameData.gd.IsGetData = true;
                //cc.director.loadScene("game");
                // if (GameData.gd.IsNewPlyer==true) {    //如果是新玩家
                //     GameData.gd.writeUserInfo();
                // }
                //cc.director.loadScene("game");
            },
            fail:function(){
                console.log("get my info fail------------->");
                GameData.gd.writeUserInfo();
                //GameData.gd.IsGetData = false;
            }
        })
        //GameData.gd.writeUserInfo();
        console.log("reLoad GameScene----------->",GameData.gd.IsNewPlyer);
    }

    //获取玩家微信家园等级
    getLevelByExp(){
        if (this.experence>=0 && this.experence<=this.ExpLvTotal[0]) {
            return 1;
        }
        else if (this.experence>this.ExpLvTotal[0] && this.experence<=this.ExpLvTotal[1]) {
            return 2;
        }
        else if (this.experence>this.ExpLvTotal[1] && this.experence<=this.ExpLvTotal[2]) {
            return 3;
        }
        else if (this.experence>this.ExpLvTotal[2] && this.experence<=this.ExpLvTotal[3]) {
            return 4;
        }
        else if (this.experence>this.ExpLvTotal[3] && this.experence<=this.ExpLvTotal[4]) {
            return 5;
        }
        else if (this.experence>this.ExpLvTotal[4]){
            return 6;
        }
        else
            return 0;
    }

    //每日签到后刷新数据库
    upDataExp(){
        // GameData.gd.level = this.getLevelByExp();
        // if(GameData.gd.level<=6){
        //     for(let i=0; i<GameData.gd.level; i++){
        //         GameData.gd.IsGetAward[i] = true;                    
        //     }
        // }
        // else{
        //     GameData.gd.IsGetAward[5] = true;
        // }
        
        //gamemain.game.resetExp();
        //gamemain.game.txt_experence.string = "EXP:"+GameData.gd.experence;
        const db = wx.cloud.database({       //获取数据库
            env: 'test-x1fb3'
        });
        db.collection('todos').doc(this.openId).update({
            // data 传入需要局部更新的数据
            data: {
              // 表示将 done 字段置为 true
              IsGetExp: true,
              experence: GameData.gd.experence,
              level: GameData.gd.getLevelByExp(),
              IsGetAward: GameData.gd.IsGetAward,
            },
            success: function(res) {
                GameData.gd.tipsList.push(GameData.gd.tips_action_succ);
                gamemain.game.resetMap();
                //console.log(res.data);
            }
        });
    }

    //绑定成功后刷新数据库
    upIsNewPlayer(){
        const db = wx.cloud.database({       //获取数据库
            env: 'test-x1fb3'
        })
        db.collection('todos').doc(this.openId).update({
            // data 传入需要局部更新的数据
            data: {
              // 表示将 done 字段置为 true
              IsNewPlyer: false,
              userId: GameData.gd.userId,
              serverId: GameData.gd.serverId,
            },
            success: function(res) {
              console.log(res.data)
            }
        })
    }

    //向微信开放数据存储
    onwriteExpNum(expNum, lv){     //写入经验值与等级
        if (expNum<GameData.gd.experence) {
            return;
        }
        wx.setUserCloudStorage({
            // Array.<KVData>
            KVDataList: [
                { key: "expNum", value: GameData.gd.experence+"" },
                { key: "LV", value: lv+"" }
                ],
            // KVDataList: [{"expNum":expNum,"LV":lv}],
            success:function(res){
                console.log("存储数据成功")
            },
            fail:function(res){
                console.log("存储数据失败")
            },
            complete:function(res){
                console.log("存储数据完成")
            }
        });
    }

    //刷新领奖界面
    resetBtnGetAward(tag:boolean)
    {
        if (!tag) {   //失败
            console.log("刷新领奖界面");
            gamemain.game.resetAward();   
        }
        else{
            GameData.gd.IsGetAward[GameData.gd.selAward] = false ;
            const db = wx.cloud.database({       //获取数据库
                env: 'test-x1fb3'
            })
            db.collection('todos').doc(this.openId).update({
                // data 传入需要局部更新的数据
                data: {
                  // 表示将 done 字段置为 true
                  IsGetAward: GameData.gd.IsGetAward,
                },
                success: function(res) {
                  console.log(res.data)
                }
            })
        }
    }

    //设置玩家妖神传角色名
    setPlayerName(){
        const db = wx.cloud.database({       //获取数据库
            env: 'test-x1fb3'
        })
        db.collection('todos').doc(this.openId).update({
            // data 传入需要局部更新的数据
            data: {
                // 表示将 done 字段置为 true
                userId: GameData.gd.userId,
                serverId: GameData.gd.serverId,
            },
            success: function(res) {
                console.log(res.data)
            }
        })
    }

    //获取奖励发邮件给玩家游戏角色
    httpGetAward(i:any){
        httpRequst.requst.getAward(i);
        GameData.gd.selAward = i;
    }

    //获取玩家角色名
    httpGetName(id:any):string{
        return httpRequst.requst.getName(id);
    }

    //请求绑定
    httpGoBind(id:any):boolean{
        return httpRequst.requst.goBind(id);
    }

    //请求服务器列表
    httpGetServerList(){
        httpRequst.requst.getServerlist();
    }
}
