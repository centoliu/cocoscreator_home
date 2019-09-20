const {ccclass, property} = cc._decorator;
import { GameData } from "./gameData";

@ccclass
export default class Helloworld extends cc.Component {
    static instance:any;
    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Button)
    btnHelp: cc.Button = null;
    @property(cc.Button)
    btnGetHome:cc.Button = null;
    @property(cc.Label)
    txt_getHome:cc.Label = null;
    @property(cc.Sprite)
    loadingbar:cc.Sprite = null;
    @property(cc.Sprite)
    bar:cc.Sprite = null;

    friendInfo = {'openId':'','name':''};
    ac = null;
    pos = null;
    array = [];
    tag = false;
    diyData = "";
    friendId = "";
    friendName = "";
    IsHelped = false;
    IsOnshow = false;

    start () {
        this.loadingbar.node.active = true;
        this.btnHelp.node.active = false;
        this.btnGetHome.node.active = false;
        Helloworld.instance = this;
        Helloworld.instance.btnGetHome = this.btnGetHome;
        Helloworld.instance.btnHelp = this.btnHelp;
        Helloworld.instance.txt_getHome = this.txt_getHome;
        Helloworld.instance.bar = this.loadingbar;
        // init logic
        this.initData();
        wx.cloud.init({ env: "test-x1fb3"});  //云能力初始化(测试环境ID：test-x1fb3)
        //this.dowload();
        this.label.node.on(cc.Node.EventType.TOUCH_START, this.OnClickBacklogin, this, true);

        let exportJson = {};
        let sysInfo = window.wx.getSystemInfoSync();
        //获取微信界面大小
        let width = sysInfo.screenWidth;
        let height = sysInfo.screenHeight;
        window.wx.getSetting({
            success (res) {
                console.log(res.authSetting);
                if (res.authSetting["scope.userInfo"]) {
                    console.log("用户已授权");
                    window.wx.getUserInfo({
                        success(res){
                            console.log(res);
                            exportJson.userInfo = res.userInfo;
                            //此时可进行登录操作
                        }
                    });
                }else {
                    console.log("用户未授权");
                    let button = window.wx.createUserInfoButton({
                        type: 'text',
                        text: '',
                        style: {
                            left: 0,
                            top: 0,
                            width: width,
                            height: height,
                            backgroundColor: '#00000000',//最后两位为透明度
                            color: '#ffffff',
                            fontSize: 20,
                            textAlign: "center",
                            lineHeight: height,
                        }
                    });
                    button.onTap((res) => {
                        if (res.userInfo) {
                            console.log("用户授权:", res);
                            exportJson.userInfo = res.userInfo;
                            //此时可进行登录操作
                            button.destroy();
                        }else {
                            console.log("用户拒绝授权:", res);
                        }
                    });
                }
            }
        })
        this.login();
    }

    onLoad () {
        this.schedule(this.tipsTimeRun, 1);
    }

    dowload(){
        wx.cloud.downloadFile({
            fileID: 'cloud://test-x1fb3.7465-test-x1fb3-1259586013/awardImg/equip1004.png', // 文件 ID
            success: res => {
              // 返回临时文件路径
              console.log("downLoad---------->",res.tempFilePath)
            },
            fail: console.error
          })
    }

    Lisencallback(res){
        console.log("onShow------->",res.query);
        let self = this;
        var queryData = res.query;
        Helloworld.instance.friendInfo = queryData;
        Helloworld.instance.diyData = queryData.diy;
        Helloworld.instance.friendId = queryData.openId;
        Helloworld.instance.friendName = queryData.name;
        console.log("微信透传参数：" + Helloworld.instance.diyData + Helloworld.instance.friendId + Helloworld.instance.friendName);

        if (Helloworld.instance.diyData != null && Helloworld.instance.diyData != "") {
            //展开帮助照顾家园页面
            Helloworld.instance.btnGetHome.node.active = true;
            Helloworld.instance.IsOnshow = true;
            Helloworld.instance.txt_getHome.string = GameData.gd.get_my_home;

            //查找是否已帮主过该好友
            let tag = Helloworld.instance.findIsHelped();
        }
        else {
            console.log("微信平台无透传参数");
        }
    }

    initShareLayer(){
        if (cc.sys.isMobile && typeof (wx) !== "undefined") { //WX小游戏移动设备环境下
            wx.onShow(this.Lisencallback);
        }
    }

    //添加我的帮助记录
    addHelpedList(){
        let self = this;
        self.btnHelp.interactable = false;
        self.IsHelped = true;
        var size = GameData.gd.MyHelpFriendList.length;
        wx.cloud.init({ env: "test-x1fb3"})
        const db = wx.cloud.database({       //获取数据库
            env: 'test-x1fb3'
        })
        //查找我是否今日帮助过该好友MyHelpFriendList
        GameData.gd.MyHelpFriendList.push(Helloworld.instance.friendId);
        console.log("addHelpedList-------->");
        db.collection('todos').doc(GameData.gd.openId).update({
            // data 传入需要局部更新的数据
            data: {
                MyHelpFriendList:GameData.gd.MyHelpFriendList,
            },
            success: function(res) {
                console.log("addMyHelpedList-------->succ",res.data)
            },
            fail:function(){
                console.log("addMyHelpedList-------->fail");
            }
        });

        //刷新好友的帮助排行榜
        self.helpFriend();
    }

    //在我的今日帮助过的好友列表里查找是否有已帮助过该好友的记录
    findIsHelped(){
        let self = this;
        self.tag = false;
        wx.cloud.init({ env: "test-x1fb3"})
        const db = wx.cloud.database({       //获取数据库
            env: 'test-x1fb3'
        })
        console.log("self.friendId------------->",Helloworld.instance.friendId);
        db.collection('todos').doc(GameData.gd.openId).get({
            success: function(res) {
                // res.data 包含该记录的数据
                console.log("getMyHelpFriendList()----------->",Helloworld.instance.friendId,res.data,res.data.MyHelpFriendList);
                let array = res.data.MyHelpFriendList;
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    console.log("array[index]------>",array[index]);
                    if (array[index]==Helloworld.instance.friendId) {
                        self.btnHelp.interactable = false;
                        self.IsHelped=true;     //今日已帮助过该好友
                    }
                }
            }
        })
    }

    login() {
        // 提前获取 openid
        wx.cloud.callFunction({
            name: 'login',
            success: res => {
                //window.openid = res.result.openid
                //this.prefetchHighScore()
                console.log("loadlogin----openId------------>%s",res.result.openid);
                GameData.gd.openId = res.result.openid;
                GameData.gd.getMyScoreById();
            },
            fail: err => {
                console.error('get openid failed with error', err)
            }
        })

        // 必须是在用户已经授权的情况下调用
        wx.getUserInfo({
            success: function(res) {
                var userInfo = res.userInfo
                GameData.gd.nickName = userInfo.nickName   //微信名（用户昵称）
                var avatarUrl = userInfo.avatarUrl    //头像
                var gender = userInfo.gender //性别 0：未知、1：男、2：女
                var province = userInfo.province   //省市
                var city = userInfo.city    //城市
                var country = userInfo.country  //国家
            }
        })
    }

    onClickUserInfo(){
        //wx.authorize({scope: "scope.userInfo"})   //获取用户信息
    }

    protected onDestroy () {
        if(this.label.node!=null)
        {
            this.label.node.off(cc.Node.EventType.TOUCH_START, this.OnClickBacklogin, this, true);
        }
        this.unschedule(this.tipsTimeRun);
    }


    //帮助好友并刷新好友的排行榜
    helpFriend(){
        let self = this;
        const db = wx.cloud.database({       //获取数据库
            env: 'test-x1fb3'
        })
        GameData.gd.tipsList.push(GameData.gd.tips_help_succ);
        console.log("id---------------->",Helloworld.instance.friendId);
        db.collection('todos').doc(Helloworld.instance.friendId).get({
            success: function(res) {
                // res.data 包含该记录的数据
                console.log("getMyScoreById()----------->",res.data.HelpList);
                self.array = res.data.HelpList;
                let tag = self.find(self.array,self.friendId);
                console.log("findFriendHelpList------contain--------->",tag);
                if(!tag)
                {
                    console.log("addList---myhelp---tofriend-->");
                    let size = self.array.length;
                    self.array[size] = {'id':GameData.gd.openId,'name':GameData.gd.nickName,'num':'1'};
                    console.log("addList----->",self.array[size]);
                }
                self.updataCode(self.array);   //刷新已有记录
            }
        })
    }

    //查找好友的帮助Rank里是否有自己
    find(array,id:string){
        console.log("find----------------->",array.length);
        let self = this;
        if (self.array.length<=0) {
            return false;
        }
        for (let index = 0; index < self.array.length; index++) {
            console.log("list-------------->",index,self.array[index]);
            if (self.array[index].id==id) {
                self.array[index].num = (Number(self.array[index].num)+1)+"";
                this.sortList(index);
                return true;
            }            
        }
        return false;
    }

    //刷新好友的帮助Rank
    updataCode(array){
        console.log("updataCode-------->");
        let self = this;
        const db = wx.cloud.database({       //获取数据库
            env: 'test-x1fb3'
        });
        db.collection('todos').doc(self.friendId).update({
            // data 传入需要局部更新的数据
            data: {
              HelpList:self.array,
            },
            success: function(res) {
                console.log(res.data)
            }
        });
    }

    //排序，插入数据
    sortList(index){   
        let self = this;
        if (index-1>=0) {
            let x = Number(self.array[index])
            let y = Number(self.array[index-1])
            if (x>y) {
                let tmp = self.array[index];
                self.array[index] = self.array[index-1];
                self.array[index-1] = tmp;
            }
        }
    }

    public OnClickBacklogin() {
        console.log("OnClickBacklogin()----------------->");
        //GameData.gd.getMyScoreById();
        cc.director.loadScene("game");
    }

    public loadGameScene(){
        //cc.director.loadScene("game");
    }

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

    tipsTimeRun (dt) {
        Helloworld.instance.pos = this.pos;
        if (GameData.gd.tipsList.length>0) {
            var node = new cc.Node();
            var sprite = node.addComponent(cc.Sprite);
            //sprite.spriteFrame = new cc.SpriteFrame(tex);
            var txt = node.addComponent(cc.Label);
            txt.fontSize = 32;
            txt.string = GameData.gd.tipsList.shift()+"";
            node.setPosition(Helloworld.instance.pos);
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

    update (dt:number) {
        if (!GameData.gd.IsGetData) {
            
        }
        else if(GameData.gd.IsGetData && !this.tag)
        {
            this.tag = true;
            this.btnGetHome.node.active = true;
            this.loadingbar.node.active = false;
            this.txt_getHome.string = GameData.gd.go_my_home;
            this.initShareLayer();
        }

        if (!this.IsHelped && this.IsOnshow) {   //没有帮助过并接收到透传参数
            Helloworld.instance.btnHelp.node.active = true;
            this.btnHelp.interactable = true;
        }
        else{
            //GameData.gd.tipsList.push(GameData.gd.tips_help_fail);
            this.btnHelp.interactable = false;
        }
    }
}
