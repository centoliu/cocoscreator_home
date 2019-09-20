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

@ccclass
export default class Login extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';


    //
    flag:boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    start () {
        // wx.getSetting({
        //         success (res) {
        //         console.log(res.authSetting)
        //         if(res.authSetting.scope.userInfo==true)
        //         {
        //             this.flag=true;
        //         }
        //         // res.authSetting = {
        //         //   "scope.userInfo": true,
        //         //   "scope.userLocation": true
        //         // }
        //     }
        // })

        // if (this.flag==true) {
            
        // }
        // let button = wx.createUserInfoButton({      //获取授权界面
        //     type: 'text',
        //     text: '获取用户信息',
        //     style: {
        //       left: 10,
        //       top: 76,
        //       width: 200,
        //       height: 40,
        //       lineHeight: 40,
        //       backgroundColor: '#ff0000',
        //       color: '#ffffff',
        //       textAlign: 'center',
        //       fontSize: 16,
        //       borderRadius: 4
        //     }
        // })
        // button.onTap((res) => {
        //     this.onClickUserInfo()
        // })
    }

    onClickUserInfo()
    {
        wx.authorize({scope: "scope.userInfo"})   //获取用户信息
    }
    // update (dt) {}
    protected onDestroy () {
        // button.offTap();
    }
}
