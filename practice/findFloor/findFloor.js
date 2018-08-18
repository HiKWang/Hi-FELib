// @Desc 递归循环查找子机构中的楼层
// @Author Kuang Heng
// @Date 2018.08.16

var json = {"msg":"","retCode":0,"success":true,"data":[{"area":"","children":[{"area":"","children":[{"area":"","children":[{"area":"","children":[{"area":"","children":[{"area":"","children":[{"area":"","children":[],"createTime":null,"creator":"","desc":"","floorPicId":73,"floorPicInfo":null,"groupId":7,"groupIdName":"1112","id":95,"name":"1112F","parentId":94,"parentName":"","reserved":"","type":1}],"createTime":null,"creator":"","desc":"","floorPicId":0,"floorPicInfo":null,"groupId":7,"groupIdName":"","id":10254,"name":"1112","parentId":10726,"parentName":"","reserved":"","type":0}],"createTime":null,"creator":"","desc":"","floorPicId":0,"floorPicInfo":null,"groupId":5,"groupIdName":"","id":10726,"name":"111","parentId":10435,"parentName":"","reserved":"","type":0}],"createTime":null,"creator":"","desc":"","floorPicId":0,"floorPicInfo":null,"groupId":4,"groupIdName":"","id":10435,"name":"11","parentId":10300,"parentName":"","reserved":"","type":0}],"createTime":null,"creator":"","desc":"","floorPicId":0,"floorPicInfo":null,"groupId":2,"groupIdName":"","id":10300,"name":"1","parentId":10753,"parentName":"","reserved":"","type":0,"treeStatus":32},{"area":"","children":[{"area":"","children":[{"area":"","children":[{"area":"","children":[],"createTime":null,"creator":"","desc":"","floorPicId":72,"floorPicInfo":null,"groupId":10,"groupIdName":"221","id":84,"name":"221F","parentId":93,"parentName":"","reserved":"","type":1}],"createTime":null,"creator":"","desc":"","floorPicId":0,"floorPicInfo":null,"groupId":10,"groupIdName":"","id":10996,"name":"221","parentId":10006,"parentName":"","reserved":"","type":0}],"createTime":null,"creator":"","desc":"","floorPicId":0,"floorPicInfo":null,"groupId":8,"groupIdName":"","id":10006,"name":"22","parentId":10204,"parentName":"","reserved":"","type":0}],"createTime":null,"creator":"","desc":"","floorPicId":0,"floorPicInfo":null,"groupId":3,"groupIdName":"","id":10204,"name":"2","parentId":10753,"parentName":"","reserved":"","type":0,"treeStatus":32}],"createTime":null,"creator":"","desc":"","floorPicId":0,"floorPicInfo":null,"groupId":1,"groupIdName":"","id":10753,"name":"总行","parentId":0,"parentName":"","reserved":"","type":0,"treeStatus":16}],"createTime":null,"creator":"","desc":"","floorPicId":0,"floorPicInfo":null,"groupId":-1,"groupIdName":"","id":0,"name":"全部","parentId":-1,"parentName":"","reserved":"","type":-1,"treeStatus":0}],"userGroupId":1,"userAndChildernGroupIdList":null};

// 可以使用chrome devtools工具的call stack查看函数调用情况

// 设置全局变量isFindFloor便于从最深层的循环中跳出
var isFindFloor = false;
function findFloor(floorGroups) {
    for(var i=0; i<floorGroups.length; i++) {
        var groupChildren = floorGroups[i].children;
        var len = groupChildren.length;
        if(len>0) {
            if(groupChildren[0].type == 1 && !isFindFloor) {
                floor = groupChildren[0];
                floorId = floor['floorPicId'];
                fTId = floorTreeId = floor['id'];
                isFindFloor = true;
                console.log('Find done! FloorId:', floorId);
                // return 退出函数调用
                // break 退出当前循环并不会退出函数调用
                // 此处由于递归的原因，在找到floor时已经调用了四次findFloor函数
                // 只有在退出这四次函数调用后才能正常返回值，因此要用return而不是break
                return isFindFloor;
            }

            if(!isFindFloor) {
                // 判断全局变量isFindFloor可以防止在找到floor退出一层函数后再循环进入再次递归
                findFloor(groupChildren);
            }else {
                // 在找到目标值后使用return逐次退出函数调用
                return isFindFloor;
            }
        }
    }
}

findFloor(json.data[0].children);
