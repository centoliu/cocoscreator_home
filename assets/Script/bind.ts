const {ccclass, property} = cc._decorator;
import { GameData } from "./gameData";

@ccclass
export default class Bind extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.EditBox)
    input:cc.EditBox = null;
    @property(cc.Label)
    txt_name:cc.Label = null;
    @property(cc.Button)
    btn_bind:cc.Button = null;
    @property(cc.Node)
    btn_SelServer1:cc.Node = null;
    @property(cc.Node)
    btn_SelServer2:cc.Node = null;
    @property(cc.ScrollView)
    scroll_list1:cc.ScrollView = null;
    @property(cc.ScrollView)
    scroll_list2:cc.ScrollView = null;
    @property(cc.Prefab)
    completeItem1: cc.Prefab = null;

    sel_serNum:number = -1;    //大区区号
    sel_server:number = -1;    //服务器区号
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        console.log("bindNode start()------------------>");
        //this.btn_bind.node.active = false;
        GameData.gd.httpGetServerList();
        this.btn_bind.node.active = true;

        //监听选择服务器按钮
        this.btn_SelServer1.on(cc.Node.EventType.TOUCH_START, this.OnClickSelServer1, this, true);
        this.btn_SelServer2.on(cc.Node.EventType.TOUCH_START, this.OnClickSelServer2, this, true);
        this.input.node.on('editing-return', this.onEditingReturn, this);
    }

    //请求绑定
    httpBind()
    {
        GameData.gd.userId = this.input.string;
        let name = GameData.gd.httpGetName(this.input.string);
        this.txt_name.getComponent(cc.Label).string = name;
        if (this.input.string!="" && this.input.string.length<11) {
            let flag = GameData.gd.httpGoBind(this.input.string);
            if(flag==true)
            {
                //绑定成功
                this.node.active = false;
            }
        }
    }

    onEditingReturn()
    {
        this.btn_bind.node.active = false;
        GameData.gd.userId = this.input.string;
        let name = GameData.gd.httpGetName(this.input.string);
        this.txt_name.getComponent(cc.Label).string = name;
        if(name!=null && name!="")
        {
            this.btn_bind.node.active = true;
        }
    } 

    OnClickSelServer1()
    {
        console.log("OnClickSelServer1--------------------->");
        this.scroll_list1.node.active = true;
        this.scroll_list2.node.active = false;

        this.scroll_list1.content.getChildByName("serverList").removeAllChildren();
        let size = parseInt(GameData.gd.serverList[8888]);//GameData.gd.serverList[8888].parseInt;
        console.log("server_small_size-------------------------->%d",size);
        if (size<=0) {
            return
        }
        this.scroll_list1.content.setContentSize(120, 40*size > 160 ? 40*size : 160);
        for(let i:number = 0; i < size; i++)
        {
            let node = cc.instantiate(this.completeItem1);
            node.position = new cc.Vec2(0,-20-i*40);
            this.AlterPrefabCompleteItem1(node, i);
            this.scroll_list1.content.getChildByName("serverList").addChild(node);
        }
    }

    OnClickSelServer2()    //选择服务器
    {
        if (this.sel_serNum<0) {
            return;
        }
        this.scroll_list2.node.active = true;
        this.scroll_list1.node.active = false;

        this.scroll_list2.content.getChildByName("serverList").removeAllChildren();
        let size = parseInt(GameData.gd.serverList[this.sel_serNum][8888]);//GameData.gd.serverList[8888].parseInt();
        console.log("List_size-------------------------->%d",size);
        if (size<=0) {
            return
        }
        let data = GameData.gd.serverList[this.sel_serNum];
        this.scroll_list2.content.setContentSize(120, 40*size > 160 ? 40*size : 160);
        for(let i:number = 0; i < size; i++)
        {
            let node = cc.instantiate(this.completeItem1);
            node.position = new cc.Vec2(0,-20-i*40);
            this.AlterPrefabCompleteItem2(node, data[i]);
            this.scroll_list2.content.getChildByName("serverList").addChild(node);
        }
    }

    AlterPrefabCompleteItem1(node:any, index:number)    //大区区号选择内容
    {
        let ServerNum = "";
        if(index==0)
            ServerNum = "测试区";
        else
            ServerNum = index+"区";
        node.getChildByName("server").getComponent(cc.Label).string = ServerNum;
        function OnClickServer1()
        {
            this.sel_serNum = index;
            this.scroll_list1.node.active = false;
            this.btn_SelServer1.getChildByName("txt").getComponent(cc.Label).string = ServerNum;
            console.log("this.sel_serNum========>",this.sel_serNum);
        }
        node.on('toggle', OnClickServer1, this);
    }

    AlterPrefabCompleteItem2(node:any, data:any)    //服务器选择内容
    {
        node.getChildByName("server").getComponent(cc.Label).string = ""+data.name;
        function OnClickServer1()
        {
            this.sel_server = parseInt(data.id);//data.id.parseInt();
            GameData.gd.serverId = parseInt(data.id);//data.id.parseInt();
            this.scroll_list2.node.active = false;
            this.btn_SelServer2.getChildByName("txt").getComponent(cc.Label).string = ""+data.name;
            console.log("this.sel_server========>",this.sel_server);
        }
        node.on('toggle', OnClickServer1, this);
    }

    update (dt) {
        this.txt_name.getComponent(cc.Label).string = GameData.gd.YSplayerName;
        if (this.btn_bind.node.active == false) {
            if(GameData.gd.YSplayerName!=null && GameData.gd.YSplayerName!="")
            {
                this.btn_bind.node.active = true;
            }
        }
    }
}
