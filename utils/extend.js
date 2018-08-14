function extend(o, n, override) {
    for(var p in n) {
        if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)) {
            o[p] = n[p];
        }
    }
}

var options = {
    page: 1,
    pageSize: 20
};

var userOptions = {
    page: 8,
    pageSize: 100,
    count: 200
};

// extend(options, userOptions, true);

// console.log(options); // { page: 8, pageSize: 100, count: 200 }

extend(options, userOptions, false);

console.log(options); // { page: 1, pageSize: 20, count: 200 }