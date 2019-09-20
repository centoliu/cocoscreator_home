const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    @property(cc.Sprite)
    bar:cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bar.fillRange = 0;
        this.bar.fillStart = 0;
    }

    start () {

    }

    update (dt) {
        var fillRange = this.bar.fillRange;
        fillRange = fillRange < 1 ? fillRange += (dt) : 0;
        this.bar.fillRange = fillRange;
    }
}
