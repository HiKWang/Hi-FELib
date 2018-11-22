// 模仿jQuery $()
function $(selector, context) {
    // 默认从document中查找选择器
    context = arguments.length > 1 ? context : document;
    return context ? context.querySelectorAll(selector) : null;
}