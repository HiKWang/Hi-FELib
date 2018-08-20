/**
 * @Desc 分页风格-1： 当前页前后保持相同页数的页码
 */

// 当前页前后保留的页数
var showP = 2;
var totalCount = 10;

for(var currentPage=1; currentPage<=totalCount; currentPage++) {
    // 循环触发1-10页
    showPages(currentPage, totalCount, showP);
}

function showPages(curr, total, show) {
    var pageStr = '';
    if(curr < show+1) {
        for(var x=1; x<=show*2+1; x++) {
            pageStr += ' ' + x;
        }
    }else if(curr > total-show*2) {
        for(var y=total-show*2; y<=total; y++) {
            pageStr += ' ' + y;
        }
    }else {
        for(var z=curr-show; z<=curr+show; z++) {
            pageStr += ' ' + z;
        }
    }

    console.log(pageStr);
}