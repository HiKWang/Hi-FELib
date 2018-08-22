// 分页插件
(function (root, factory) {
    // 兼容AMD
    if(typeof define == 'function' && define.amd) {
        define([], factory);
    }
    // 兼容Node
    else if(typeof module == 'object' && module.exports) {
        module.exports = factory();
    }
    // 兼容浏览器环境
    else {
        root.Pagination = factory();
    }
}(self !== undefined ? self : this, function () {
    'use strict';

    // 定义类名常量
    var CLASS_NAME = {
        'ITEM': 'pagination-item',
        'LINK': 'pagination-link'
    };

    // polyfill
    var EventUtil = {
        // 绑定事件
        addEvent: function (element, type, handler) {
            // 兼容DOM Level 2
            if(element.addEventListener) {
                element.addEventListener(type, handler);
            }
            // 兼容IE
            else if(element.attachEvent) {
                element.attachEvent('on'+type, handler);
            }
            // 兼容DOM Level 0
            else {
                element['on'+type] = handler;
            }
        },
        // 解除事件绑定
        removeEvent: function (element, type, handler) {
            // 兼容DOM Level 2
            if(element.removeEventListener) {
                element.removeEventListener(type, handler);
            }
            // 兼容IE8-
            else if(element.detachEvent) {
                element.detachEvent('on'+type, handler);
            }
            // 兼容DOM Level 0
            else {
                element['on'+type] = handler;
            }
        }
    };

    // 合并对象
    function extend(o, n, override) {
        for(var p in n) {
            if(!o.hasOwnProperty(p) || (o.hasOwnProperty(p) && override)) {
                o[p] = n[p];
            }
        }
    }

    // 模仿query $()
    function $(selector, context) {
        context = arguments.length > 1 ? context : document;
        return context ? context.querySelectorAll(selector) : null;
    }

    var Pagination = function (selector, pageOptions) {
        // 默认配置
        this.options = {
            curr: 1,
            pageShow: 2,
            ellipsis: false,
            hash: false
        };

        // 合并配置
        extend(this.options, pageOptions, true);

        // 分页容器元素
        this.pageElement = $(selector)[0];
        // 当前页
        this.pageNumber = this.options.curr;
        // 总数量
        this.count = this.options.count;
        // 每页数量
        this.limit = this.options.limit;
        // 总页数
        this.total = Math.ceil(this.count / this.limit);

        this.renderPages();

        this.options.callback && this.options.callback({
            curr: this.pageNumber,
            limit: this.limit,
            isFirst: true
        });

        this.changePage();
    };

    Pagination.prototype = {
        constructor: Pagination,
        pageInfos: [
            {id: 'first', content: '首页'},
            {id: 'prev', content: '上一页'},
            {id: 'next', content: '下一页'},
            {id: 'last', content: '尾页'},
            {id: '', content: '...'}
        ],
        getPageInfos: function (className, content) {
            return {
                id: 'page',
                className: className,
                content: content
            };
        },
        renderPages: function () {
            var pageElement = this.pageElement;
            pageElement.innerHTML = '';
            if(this.options.ellipsis) {
                pageElement.appendChild(this.renderEllipsis());
            }else {
                pageElement.appendChild(this.renderNoEllipsis());
            }
        },
        renderEllipsis: function () {

        },
        renderNoEllipsis: function () {
            var fragment = document.createDocumentFragment();
            var show = this.options.pageShow;
            if(this.pageNumber < show+1) {
                fragment.appendChild(this.renderDom(1, show*2+1));
            }else if(this.pageNumber > this.total-show*2) {
                fragment.appendChild(this.renderDom(this.total-show*2, this.total));
            }else {
                fragment.appendChild(this.renderDom(this.pageNumber-show, this.pageNumber+show));
            }

            if(this.pageNumber > 1) {
                this.addFragmentBefore(fragment, [
                    this.pageInfos[0],
                    this.pageInfos[1]
                ]);
            }else if(this.pageNumber < this.total) {
                this.addFragmentAfter(fragment, [
                    this.pageInfos[2],
                    this.pageInfos[3]
                ]);
            }

            return fragment;
        },
        renderDom: function (begin, end) {
            var fragment = document.createDocumentFragment();
            var str = '';
            for(var i = begin; i <= end; i++) {
                str = this.pageNumber == i ? CLASS_NAME.LINK + ' current' : CLASS_NAME.LINK;
                this.addFragmentAfter(fragment, [
                    this.getPageInfos(str, i)
                ]);
            }
            return fragment;
        },
        addFragmentBefore: function (fragment, datas) {
            fragment.insertBefore(this.createHtml(datas), fragment.firstChild);
        },
        addFragmentAfter: function (fragment, datas) {
            fragment.appendChild(this.createHtml(datas));
        },
        createHtml: function (elemsData) {
            var fragment = document.createDocumentFragment();
            var liEle = document.createElement('li');
            var aEle = document.createElement('a');
            elemsData.forEach(function (elementData, index) {
                liEle = liEle.cloneNode(false);
                aEle = aEle.cloneNode(false);
                liEle.className = CLASS_NAME.ITEM;
                aEle.href = 'javascript:;';
                aEle.id = elementData.id;
                aEle.innerHTML = elementData.content;
                if(elementData.id != 'page') {
                    aEle.className = CLASS_NAME.LINK;
                }else {
                    aEle.className = elementData.className;
                }

                liEle.appendChild(aEle);
                fragment.appendChild(liEle);
            });

            return fragment;
        },
        pageHash: function () {
            if(this.options.hash) {
                window.location.hash = '#!'+this.options.hash+'='+this.pageNumber;
            }
        },
        changePage: function () {
            // 事件委托
            var self = this;
            EventUtil.addEvent(self.pageElement, 'click', function (ev) {
                var e = ev || window.ev;
                var target = e.target || e.srcElement;
                if(target.nodeName.toLocaleLowerCase() == 'a') {
                    switch(target.id) {
                        case 'first':
                            self.firstPage();
                            break;
                        case 'prev':
                            self.prevPage();
                            break;
                        case 'next':
                            self.nextPage();
                            break;
                        case 'last':
                            self.lastPage();
                            break;
                        case 'page':
                        default:
                            self.goPage(parseInt(target.innerHTML));
                            break;
                    }

                    self.renderPages();
                    self.options.callback && self.options.callback({
                        curr: self.pageNumber,
                        limit: self.limit,
                        isFirst: false
                    });
                }
            });
        },
        firstPage: function () {
            this.pageNumber = 1;
        },
        prevPage: function () {
            this.pageNumber--;
        },
        nextPage: function () {
            this.pageNumber++;
        },
        lastPage: function () {
            this.pageNumber = this.total;
        },
        goPage: function (pageNumber) {
            this.pageNumber = pageNumber;
        }
    };

    return Pagination;
}));