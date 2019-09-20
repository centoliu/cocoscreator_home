//地图控制类

const {ccclass, property} = cc._decorator;

@ccclass
export default class mapCtrl extends cc.Component {
    @property(cc.Node)
    mapContent:cc.Node = null;
    @property(cc.Sprite)
    target: cc.Sprite = null;
    // LIFE-CYCLE CALLBACKS:

    moveToPos = cc.v2(0, 0);
    isMoving = false;
    followSpeed = 400;
    _map_size = new cc.Vec2(2048,2048);

    onLoad () {
        let windowSize=cc.view.getVisibleSize();
        let minScale = Math.ceil(windowSize.height/2048);
        var self = this, parent = this.node.parent;
        self.mapContent.on(cc.Node.EventType.TOUCH_START, function (event) {
            var touches = event.getTouches();
            var touchLoc = touches[0].getLocation();
            self.isMoving = true;
            self.moveToPos = self.target.node.parent.convertToNodeSpaceAR(touchLoc);
        }, self.node);
        self.mapContent.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var touches = event.getTouches();
            if (touches.length >= 2) {   //缩放
                //获取双指移动数据
                var touch1 = touches[0], touch2 = touches[1];
                var delta1 = touch1.getDelta(), delta2 = touch2.getDelta();
                //坐标转换为map坐标系
                var touchPoint1 = parent.convertToNodeSpaceAR(touch1.getLocation());
                var touchPoint2 = parent.convertToNodeSpaceAR(touch2.getLocation());

                //记录当前锚点
                let anchorPoint_before = self.target.node.getAnchorPoint();
                //新锚点距离map左、下边界距离
                let dis_left = self._map_size.x*anchorPoint_before.x*self.target.node.scale-self.target.node.x+(touchPoint1.x-touchPoint2.x)/2;  //减平均值（防溢出写法）
                let dis_bottom = self._map_size.y*anchorPoint_before.y*self.target.node.scale-self.target.node.y+(touchPoint1.y-touchPoint2.y)/2;
                //以两点中心为新的锚点
                let anchorPoint_after = cc.v2(dis_left/(self.target.node.scale*self._map_size.x), dis_bottom/(self.target.node.scale*self._map_size.y));
                self.target.node.setAnchorPoint(anchorPoint_after);
                //距离差
                let dis_X = self._map_size.x*(anchorPoint_before.x-anchorPoint_after.x)*self.target.node.scale;
                let dis_Y = self._map_size.y*(anchorPoint_before.y-anchorPoint_after.y)*self.target.node.scale;
                //位置纠正
                self.target.node.setPosition(self.target.node.x-dis_X, self.target.node.y-dis_Y);

                //缩放,手指移动距离的0.6倍
                var distance = touchPoint1.sub(touchPoint2);
                var delta = delta1.sub(delta2);
                var scale = 1;
                if (Math.abs(distance.x) > Math.abs(distance.y)) {
                    scale = (distance.x + delta.x*0.6) / distance.x * self.target.node.scale;
                }
                else {
                    scale = (distance.y + delta.y*0.6) / distance.y * self.target.node.scale;
                }
                let windowSize=cc.view.getVisibleSize();
                var minScale = windowSize.height/2048;
                if (self.target.node.scale>1) {
                    self.target.node.scale =1;
                }
                else if(self.target.node.scale<minScale){
                    self.target.node.scale = minScale;
                }
                else{
                    self.target.node.scale = scale;
                }
                // 防止出界 移动补位
                self.goboundary();
            }
            else if(touches.length == 1){    //拖动
                var delta=event.getDelta();
                let scale = self.target.node.scale;
                let anchorX = self.target.node.getAnchorPoint().x;
                let anchorY = self.target.node.getAnchorPoint().y;
                if (windowSize.width/2-(self._map_size.x*anchorX*scale-self.target.node.getPosition().x)<=0 && 
                    windowSize.width/2-(self._map_size.x*(1-anchorX)*scale+self.target.node.getPosition().x)<=0) {
                    self.target.node.x+=delta.x; 
                }
                if (windowSize.height/2-(self._map_size.y*anchorY*scale-self.target.node.getPosition().y)<=0 && 
                    windowSize.height/2-(self._map_size.y*(1-anchorY)*scale+self.target.node.getPosition().y)<=0) {
                    self.target.node.y+=delta.y;
                }
            } 
        }, self.node);
        self.mapContent.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.isMoving = false; // when touch ended, stop moving
            // 防止出界 移动补位
            self.goboundary();
            //self.target.node.scale = 1;
        }, self.node);
    }

    goboundary(){
        let self = this;
        let windowSize=cc.view.getVisibleSize();
        let minScale = Math.ceil(windowSize.height/2048);
        let _map_scale = self.target.node.scale;
        let anchorPoint_after = self.target.node.getAnchorPoint();
        var posX_left = windowSize.width/2-(self._map_size.x*anchorPoint_after.x*_map_scale-self.target.node.getPosition().x);
        if(posX_left > 0){
            let posx = (self._map_size.x*anchorPoint_after.x*_map_scale)-windowSize.width/2;
            self.target.node.setPosition(posx,self.target.node.y);
        }
        // 下侧空白距离
        var posX_bottom = windowSize.height/2-(self._map_size.y*anchorPoint_after.y*_map_scale-self.target.node.getPosition().y); 
        if (posX_bottom > 0){
            let posy = (self._map_size.y*anchorPoint_after.y*_map_scale)-windowSize.height/2;
            self.target.node.setPosition(self.target.node.x,posy);
        }
        // 右侧空白距离
        var posX_right = windowSize.width/2-(self._map_size.x*(1-anchorPoint_after.x)*_map_scale+self.target.node.getPosition().x);
        if (posX_right > 0){
            let posx = windowSize.width/2-(self._map_size.x*(1-anchorPoint_after.x)*_map_scale);
            self.target.node.setPosition(posx,self.target.node.y);
        }
        // 上侧空白距离
        var posX_top = windowSize.height/2-(self._map_size.y*(1-anchorPoint_after.y)*_map_scale+self.target.node.getPosition().y); 
        if (posX_top > 0){
            let posy = windowSize.height/2-(self._map_size.y*(1-anchorPoint_after.y)*_map_scale);
            self.target.node.setPosition(self.target.node.x,posy);
        }
    }

    start () {

    }

    update (dt) {
        //this.goboundary();
        // if (!this.isMoving) return;
        // var oldPos = this.target.node.position;
        // // get move direction
        // var direction = this.moveToPos.sub(oldPos).normalize();
        // // multiply direction with distance to get new position
        // var newPos = oldPos.add(direction.mul(this.followSpeed * dt));
        // // set new position
        // this.target.node.setPosition(newPos);
    }
}
