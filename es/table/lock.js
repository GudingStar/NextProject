import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Children } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import shallowElementEquals from 'shallow-element-equals';
import { dom, log, obj, events } from '../util';
import LockRow from './lock/row';
import LockBody from './lock/body';
import LockHeader from './lock/header';
import LockWrapper from './fixed/wrapper';
import { statics } from './util';

export default function lock(BaseComponent) {
    var _class, _temp;

    /** Table */
    var LockTable = (_temp = _class = function (_React$Component) {
        _inherits(LockTable, _React$Component);

        function LockTable(props, context) {
            _classCallCheck(this, LockTable);

            var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

            _this.getTableInstance = function (type, instance) {
                type = type ? type.charAt(0).toUpperCase() + type.substr(1) : '';
                _this['table' + type + 'Inc'] = instance;
            };

            _this.getNode = function (type, node, lockType) {
                lockType = lockType ? lockType.charAt(0).toUpperCase() + lockType.substr(1) : '';
                _this['' + type + lockType + 'Node'] = node;
                if (type === 'header' && !_this.innerHeaderNode && !lockType) {
                    _this.innerHeaderNode = _this.headerNode.querySelector('div');
                }
            };

            _this.onRowMouseEnter = function (record, index) {
                if (_this.isLock()) {
                    var row = _this.getRowNode(index);
                    var leftRow = _this.getRowNode(index, 'left');
                    var rightRow = _this.getRowNode(index, 'right');
                    [row, leftRow, rightRow].forEach(function (row) {
                        row && dom.addClass(row, 'hovered');
                    });
                }
            };

            _this.onRowMouseLeave = function (record, index) {
                if (_this.isLock()) {
                    var row = _this.getRowNode(index);
                    var leftRow = _this.getRowNode(index, 'left');
                    var rightRow = _this.getRowNode(index, 'right');
                    [row, leftRow, rightRow].forEach(function (row) {
                        row && dom.removeClass(row, 'hovered');
                    });
                }
            };

            _this.onLockBodyWheel = function (e) {
                var y = e.deltaY;
                if (_this.isLock()) {
                    var lockRightBody = _this.bodyRightNode,
                        lockLeftBody = _this.bodyLeftNode,
                        scrollNode = _this.bodyNode,
                        scrollTop = scrollNode.scrollTop,
                        clientHeight = scrollNode.clientHeight,
                        scrollHeight = scrollNode.scrollHeight;


                    if (lockLeftBody) {
                        lockLeftBody.scrollTop = y;
                    }
                    if (lockRightBody) {
                        lockRightBody.scrollTop = y;
                    }
                    scrollNode.scrollTop = scrollTop + y;
                    var newScrollTop = scrollNode.scrollTop;

                    if (newScrollTop + clientHeight < scrollHeight && newScrollTop) {
                        e.preventDefault();
                    }
                }
            };

            _this.onLockBodyScroll = function () {
                if (_this.isLock()) {
                    var lockRightBody = _this.bodyRightNode,
                        lockLeftBody = _this.bodyLeftNode,
                        lockRightTable = _this.getWrapperNode('right'),
                        lockLeftTable = _this.getWrapperNode('left'),
                        shadowClassName = 'shadow';

                    var x = _this.bodyNode.scrollLeft,
                        y = _this.bodyNode.scrollTop;

                    if (lockLeftBody) {
                        lockLeftBody.scrollTop = y;
                    }
                    if (lockRightBody) {
                        lockRightBody.scrollTop = y;
                    }
                    if (x === 0) {
                        lockLeftTable && dom.removeClass(lockLeftTable, shadowClassName);
                        lockRightTable && dom.addClass(lockRightTable, shadowClassName);
                    } else if (x === _this.bodyNode.scrollWidth - _this.bodyNode.clientWidth) {
                        lockLeftTable && dom.addClass(lockLeftTable, shadowClassName);
                        lockRightTable && dom.removeClass(lockRightTable, shadowClassName);
                    } else {
                        lockLeftTable && dom.addClass(lockLeftTable, shadowClassName);
                        lockRightTable && dom.addClass(lockRightTable, shadowClassName);
                    }
                }
            };

            _this.lockLeftChildren = [];
            _this.lockRightChildren = [];
            return _this;
        }

        LockTable.prototype.getChildContext = function getChildContext() {
            return {
                getTableInstance: this.getTableInstance,
                getLockNode: this.getNode,
                onLockBodyWheel: this.onLockBodyWheel,
                onLockBodyScroll: this.onLockBodyScroll,
                onRowMouseEnter: this.onRowMouseEnter,
                onRowMouseLeave: this.onRowMouseLeave
            };
        };

        LockTable.prototype.componentDidMount = function componentDidMount() {
            this.adjustSize = this.adjustSize.bind(this);

            this.adjustSize();
            this.scroll();

            events.on(window, 'resize', this.adjustSize);
        };

        LockTable.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
            if (nextProps.pure) {
                var isEqual = shallowElementEquals(nextProps, this.props);
                return !(isEqual && obj.shallowEqual(nextContext, this.context));
            }

            return true;
        };

        LockTable.prototype.componentWillUpdate = function componentWillUpdate() {
            this._isLock = false;
        };

        LockTable.prototype.componentDidUpdate = function componentDidUpdate() {
            this.adjustSize();
        };

        LockTable.prototype.componentWillUnmount = function componentWillUnmount() {
            events.off(window, 'resize', this.adjustSize);
        };

        LockTable.prototype.normalizeChildrenState = function normalizeChildrenState(props) {
            var children = props.children;

            children = this.normalizeChildren(children);
            var splitChildren = this.splitFromNormalizeChildren(children);
            var lockLeftChildren = splitChildren.lockLeftChildren,
                lockRightChildren = splitChildren.lockRightChildren;

            return {
                lockLeftChildren: lockLeftChildren,
                lockRightChildren: lockRightChildren,
                children: this.mergeFromSplitLockChildren(splitChildren)
            };
        };

        // 将React结构化数据提取props转换成数组


        LockTable.prototype.normalizeChildren = function normalizeChildren(children) {
            var isLock = false;
            var getChildren = function getChildren(children) {
                var ret = [];
                Children.forEach(children, function (child) {
                    if (child) {
                        var props = _extends({}, child.props);
                        if ([true, 'left', 'right'].indexOf(props.lock) > -1) {
                            isLock = true;
                            if (!('width' in props)) {
                                log.warning('Should config width for lock column named [ ' + props.dataIndex + ' ].');
                            }
                        }
                        ret.push(props);
                        if (child.props.children) {
                            props.children = getChildren(child.props.children);
                        }
                    }
                });
                return ret;
            };
            var ret = getChildren(children);
            ret.forEach(function (child) {
                // 为自定义的列特殊处理
                if (child.__normalized && isLock) {
                    child.lock = 'left';
                    delete child.__normalized;
                }
            });
            this._isLock = isLock;
            return ret;
        };

        //从数组中分离出lock的列和正常的列


        LockTable.prototype.splitFromNormalizeChildren = function splitFromNormalizeChildren(children) {
            var originChildren = deepCopy(children);
            var lockLeftChildren = deepCopy(children);
            var lockRightChildren = deepCopy(children);
            var loop = function loop(lockChildren, condition) {
                var ret = [];
                lockChildren.forEach(function (child) {
                    if (child.children) {
                        var res = loop(child.children, condition);
                        if (!res.length) {
                            ret.push(child);
                        }
                    } else {
                        var order = condition(child);
                        if (!order) {
                            ret.push(child);
                        }
                    }
                });
                ret.forEach(function (res) {
                    var index = lockChildren.indexOf(res);
                    lockChildren.splice(index, 1);
                });
                return lockChildren;
            };
            loop(lockLeftChildren, function (child) {
                if (child.lock === true || child.lock === 'left') {
                    return 'left';
                }
            });
            loop(lockRightChildren, function (child) {
                if (child.lock === 'right') {
                    return 'right';
                }
            });
            loop(originChildren, function (child) {
                return child.lock !== true && child.lock !== 'left' && child.lock !== 'right';
            });
            return {
                lockLeftChildren: lockLeftChildren,
                lockRightChildren: lockRightChildren,
                originChildren: originChildren
            };
        };

        //将左侧的锁列树和中间的普通树及右侧的锁列树进行合并


        LockTable.prototype.mergeFromSplitLockChildren = function mergeFromSplitLockChildren(splitChildren) {
            var lockLeftChildren = splitChildren.lockLeftChildren,
                lockRightChildren = splitChildren.lockRightChildren;
            var originChildren = splitChildren.originChildren;

            Array.prototype.unshift.apply(originChildren, lockLeftChildren);
            originChildren = originChildren.concat(lockRightChildren);
            return originChildren;
        };

        LockTable.prototype.scroll = function scroll() {
            var _props = this.props,
                _props$scrollToCol = _props.scrollToCol,
                scrollToCol = _props$scrollToCol === undefined ? 0 : _props$scrollToCol,
                _props$scrollToRow = _props.scrollToRow,
                scrollToRow = _props$scrollToRow === undefined ? 0 : _props$scrollToRow;

            if (!scrollToCol && !scrollToRow) {
                return;
            }
            var colCellNode = this.getCellNode(0, scrollToCol);
            var rowCellNode = this.getCellNode(scrollToRow, 0);
            var bodyNodeOffset = this.bodyNode.getBoundingClientRect();
            if (colCellNode) {
                var cellNodeoffset = colCellNode.getBoundingClientRect();
                var scrollLeft = cellNodeoffset.left - bodyNodeOffset.left;
                this.bodyNode.scrollLeft = scrollLeft;
            }
            if (rowCellNode) {
                var _cellNodeoffset = rowCellNode.getBoundingClientRect();
                var scrollTop = _cellNodeoffset.top - bodyNodeOffset.top;
                this.bodyNode.scrollTop = scrollTop;
            }
        };

        // Table处理过后真实的lock状态
        LockTable.prototype.isLock = function isLock() {
            return this.lockLeftChildren.length || this.lockRightChildren.length;
        };

        // 用户设置的lock状态


        LockTable.prototype.isOriginLock = function isOriginLock() {
            return this._isLock;
        };

        LockTable.prototype.adjustSize = function adjustSize() {
            if (!this.adjustIfTableNotNeedLock()) {
                this.adjustHeaderSize();
                this.adjustBodySize();
                this.adjustCellSize();
                this.onLockBodyScroll();
            }
        };

        LockTable.prototype.adjustIfTableNotNeedLock = function adjustIfTableNotNeedLock() {
            var _this2 = this;

            if (this.isOriginLock() && this.tableInc.props.dataSource.length) {
                var configWidths = this.tableInc.flatChildren.map(function (item, index) {
                    var row = _this2.getCellNode(0, index);
                    return row && row.clientWidth || 0;
                }).reduce(function (a, b) {
                    return a + b;
                }, 0);

                var node = findDOMNode(this);
                var width = node.clientWidth;
                var lockLeftLen = this.lockLeftChildren.length;
                var lockRightLen = this.lockRightChildren.length;

                if (configWidths <= width && configWidths > 0) {
                    if (lockLeftLen) {
                        this._notNeedAdjustLockLeft = true;
                    }
                    if (lockRightLen) {
                        this._notNeedAdjustLockRight = true;
                    }
                    if (lockRightLen || lockLeftLen) {
                        this.forceUpdate();
                        return true;
                    }
                } else if (this._notNeedAdjustLockLeft || this._notNeedAdjustLockRight) {
                    this._notNeedAdjustLockLeft = this._notNeedAdjustLockRight = false;
                    this.forceUpdate();
                } else {
                    this._notNeedAdjustLockLeft = this._notNeedAdjustLockRight = false;
                    return false;
                }
            }

            return false;
        };

        LockTable.prototype.adjustBodySize = function adjustBodySize() {
            if (this.isLock()) {
                var body = this.bodyNode,
                    lockLeftBody = this.bodyLeftNode,
                    lockRightBody = this.bodyRightNode,
                    lockRightBodyWrapper = this.getWrapperNode('right'),
                    scrollbar = dom.scrollbar(),
                    bodyHeight = body.offsetHeight,
                    hasHozScroll = body.scrollWidth > body.clientWidth,
                    hasVerScroll = body.scrollHeight > body.clientHeight,
                    width = hasVerScroll ? scrollbar.width : 0,
                    lockBodyHeight = bodyHeight - (hasHozScroll ? scrollbar.height : 0);

                lockLeftBody && dom.setStyle(lockLeftBody, 'max-height', lockBodyHeight);
                lockRightBody && dom.setStyle(lockRightBody, 'max-height', lockBodyHeight);
                lockRightBodyWrapper && dom.setStyle(lockRightBodyWrapper, 'right', width);
            }
        };

        LockTable.prototype.adjustHeaderSize = function adjustHeaderSize() {
            var _this3 = this;

            if (this.isLock()) {
                this.tableInc.groupChildren.forEach(function (child, index) {
                    var lastIndex = _this3.tableInc.groupChildren[index].length - 1;
                    var headerRightRow = _this3.getHeaderCellNode(index, lastIndex),
                        headerLeftRow = _this3.getHeaderCellNode(index, 0),
                        headerRightLockRow = _this3.getHeaderCellNode(index, 0, 'right'),
                        headerLeftLockRow = _this3.getHeaderCellNode(index, 0, 'left');
                    var headerRightLockRowHeight = 0,
                        headerLeftLockRowHeight = 0;
                    // 如果不需要锁列的出现，就不要在计算锁列的header的高度
                    // 这在浏览器缩放的时候可能会造成高度计算的问题
                    if (headerRightLockRow && !_this3._notNeedAdjustLockRight) {
                        headerRightLockRowHeight = headerRightLockRow.offsetHeight;
                    }

                    if (headerLeftLockRow && !_this3._notNeedAdjustLockLeft) {
                        headerLeftLockRowHeight = headerLeftLockRow.offsetHeight;
                    }

                    if (headerRightRow) {
                        var maxRightRowHeight = Math.max(headerRightLockRowHeight, headerRightRow.offsetHeight);
                        headerRightLockRow && dom.setStyle(headerRightLockRow, 'height', maxRightRowHeight);
                    }

                    if (headerLeftRow) {
                        var maxLeftRowHeight = Math.max(headerLeftLockRowHeight, headerLeftRow.offsetHeight);
                        headerLeftLockRow && dom.setStyle(headerLeftLockRow, 'height', maxLeftRowHeight);
                    }
                });
            }
        };

        LockTable.prototype.adjustCellSize = function adjustCellSize() {
            var _this4 = this;

            if (this.isLock()) {
                this.tableInc.props.dataSource.forEach(function (item, index) {
                    var lockLeftRow = _this4.getCellNode(index, 0, 'left'),
                        lockRightRow = _this4.getCellNode(index, 0, 'right'),
                        row = _this4.getFirstNormalCellNode(index),
                        rowHeight = row && row.offsetHeight || 0;
                    var lockLeftHeight = 0,
                        lockRightHeight = 0;

                    if (lockLeftRow) {
                        lockLeftHeight = lockLeftRow.offsetHeight;
                    }
                    if (lockRightRow) {
                        lockRightHeight = lockRightRow.offsetHeight;
                    }
                    if (lockLeftRow && rowHeight !== lockLeftHeight) {
                        dom.setStyle(lockLeftRow, 'height', rowHeight);
                    }
                    if (lockRightRow && rowHeight !== lockRightHeight) {
                        dom.setStyle(lockRightRow, 'height', rowHeight);
                    }
                });
            }
        };

        LockTable.prototype.getWrapperNode = function getWrapperNode(type) {
            type = type ? type.charAt(0).toUpperCase() + type.substr(1) : '';
            return findDOMNode(this.refs['lock' + type]);
        };

        LockTable.prototype.getFirstNormalCellNode = function getFirstNormalCellNode(index) {
            var i = 0;
            var row = void 0;
            do {
                row = this.getCellNode(index, i);
                i++;
            } while ((!row || row && row.rowSpan && row.rowSpan > 1) && this.tableInc.flatChildren.length > i);

            return row;
        };

        LockTable.prototype.getRowNode = function getRowNode(index, type) {
            type = type ? type.charAt(0).toUpperCase() + type.substr(1) : '';
            var table = this['table' + type + 'Inc'];
            return findDOMNode(table.getRowRef(index));
        };

        LockTable.prototype.getHeaderCellNode = function getHeaderCellNode(index, i, type) {
            type = type ? type.charAt(0).toUpperCase() + type.substr(1) : '';
            var table = this['table' + type + 'Inc'];
            return findDOMNode(table.getHeaderCellRef(index, i));
        };

        LockTable.prototype.getCellNode = function getCellNode(index, i, type) {
            type = type ? type.charAt(0).toUpperCase() + type.substr(1) : '';
            var table = this['table' + type + 'Inc'];
            return findDOMNode(table.getCellRef(index, i));
        };

        LockTable.prototype.render = function render() {
            /* eslint-disable no-unused-vars, prefer-const */
            var _props2 = this.props,
                children = _props2.children,
                prefix = _props2.prefix,
                components = _props2.components,
                className = _props2.className,
                others = _objectWithoutProperties(_props2, ['children', 'prefix', 'components', 'className']);

            var _normalizeChildrenSta = this.normalizeChildrenState(this.props),
                lockLeftChildren = _normalizeChildrenSta.lockLeftChildren,
                lockRightChildren = _normalizeChildrenSta.lockRightChildren,
                normalizedChildren = _normalizeChildrenSta.children;

            if (this._notNeedAdjustLockLeft) {
                lockLeftChildren = [];
            }
            if (this._notNeedAdjustLockRight) {
                lockRightChildren = [];
            }
            this.lockLeftChildren = lockLeftChildren;
            this.lockRightChildren = lockRightChildren;

            if (this.isOriginLock()) {
                var _classnames;

                components = _extends({}, components);
                components.Body = components.Body || LockBody;
                components.Header = components.Header || LockHeader;
                components.Wrapper = components.Wrapper || LockWrapper;
                components.Row = components.Row || LockRow;
                className = classnames((_classnames = {}, _classnames[prefix + 'table-lock'] = true, _classnames[className] = className, _classnames));
                var content = [React.createElement(BaseComponent, _extends({}, others, { key: 'lock-left', columns: lockLeftChildren, className: prefix + 'table-lock-left', prefix: prefix, lockType: 'left', components: components, ref: 'lockLeft', loading: false })), React.createElement(BaseComponent, _extends({}, others, { key: 'lock-right', columns: lockRightChildren, className: prefix + 'table-lock-right', prefix: prefix, lockType: 'right', components: components, ref: 'lockRight', loading: false }))];
                return React.createElement(BaseComponent, _extends({}, others, { columns: normalizedChildren, prefix: prefix, wrapperContent: content, components: components, className: className }));
            }
            return React.createElement(BaseComponent, this.props);
        };

        return LockTable;
    }(React.Component), _class.LockRow = LockRow, _class.LockBody = LockBody, _class.LockHeader = LockHeader, _class.propTypes = _extends({
        scrollToCol: PropTypes.number,
        /**
         * 指定滚动到某一行，仅在`useVirtual`的时候生效
         */
        scrollToRow: PropTypes.number
    }, BaseComponent.propTypes), _class.defaultProps = _extends({}, BaseComponent.defaultProps), _class.childContextTypes = {
        getTableInstance: PropTypes.func,
        getLockNode: PropTypes.func,
        onLockBodyScroll: PropTypes.func,
        onLockBodyWheel: PropTypes.func,
        onRowMouseEnter: PropTypes.func,
        onRowMouseLeave: PropTypes.func
    }, _temp);
    LockTable.displayName = 'LockTable';

    statics(LockTable, BaseComponent);
    return LockTable;
}

function deepCopy(arr) {
    var copy = function copy(arr) {
        return arr.map(function (item) {
            var newItem = _extends({}, item);
            if (item.children) {
                item.children = copy(item.children);
            }
            return newItem;
        });
    };
    return copy(arr);
}