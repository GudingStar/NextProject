import React, { Component, Children, isValidElement, cloneElement } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from '../select';
import Tree from '../tree';
import {
    normalizeToArray,
    getAllCheckedKeys,
    filterChildKey,
    filterParentKey,
    isDescendantOrSelf,
} from '../tree/view/util';
import { func, obj, KEYCODE, str } from '../util';
import zhCN from '../locale/zh-cn';
import { getValueDataSource, valueToSelectKey } from '../select/util';

const noop = () => {};
const { Node: TreeNode } = Tree;
const { bindCtx } = func;

const flatDataSource = props => {
    const _k2n = {};
    const _p2n = {};
    const _v2n = {};

    if ('dataSource' in props) {
        const loop = (data, prefix = '0') =>
            data.map((item, index) => {
                const { value, children } = item;
                const pos = `${prefix}-${index}`;
                const key = item.key || pos;

                const newItem = { ...item, key, pos };
                if (children && children.length) {
                    newItem.children = loop(children, pos);
                }

                _k2n[key] = _p2n[pos] = _v2n[value] = newItem;
                return newItem;
            });

        loop(props.dataSource);
    } else if ('children' in props) {
        const loop = (children, prefix = '0') =>
            Children.map(children, (node, index) => {
                if (!React.isValidElement(node)) {
                    return;
                }

                const { value, children } = node.props;
                const pos = `${prefix}-${index}`;
                const key = node.key || pos;
                const newItem = { ...node.props, key, pos };
                if (children && Children.count(children)) {
                    newItem.children = loop(children, pos);
                }

                _k2n[key] = _p2n[pos] = _v2n[value] = newItem;
                return newItem;
            });
        loop(props.children);
    }

    return { _k2n, _p2n, _v2n };
};

const isSearched = (label, searchedValue) => {
    let labelString = '';

    searchedValue = String(searchedValue);

    const loop = arg => {
        if (isValidElement(arg) && arg.props.children) {
            Children.forEach(arg.props.children, loop);
        } else {
            labelString += arg;
        }
    };
    loop(label);

    if (
        labelString.length >= searchedValue.length &&
        labelString.toLowerCase().indexOf(searchedValue.toLowerCase()) > -1
    ) {
        return true;
    }

    return false;
};

const getSearchKeys = (searchedValue, _k2n, _p2n) => {
    const searchedKeys = [];
    const retainedKeys = [];
    Object.keys(_k2n).forEach(k => {
        const { label, pos } = _k2n[k];

        if (isSearched(label, searchedValue)) {
            searchedKeys.push(k);
            const posArr = pos.split('-');
            posArr.forEach((n, i) => {
                if (i > 0) {
                    const p = posArr.slice(0, i + 1).join('-');
                    const kk = _p2n[p].key;
                    if (retainedKeys.indexOf(kk) === -1) {
                        retainedKeys.push(kk);
                    }
                }
            });
        }
    });

    return { searchedKeys, retainedKeys };
};

/**
 * TreeSelect
 */
class TreeSelect extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        pure: PropTypes.bool,
        locale: PropTypes.object,
        className: PropTypes.string,
        /**
         * ?????????
         */
        children: PropTypes.node,
        /**
         * ???????????????
         */
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        /**
         * ??????????????????
         */
        placeholder: PropTypes.string,
        /**
         * ????????????
         */
        disabled: PropTypes.bool,
        /**
         * ?????????????????????
         */
        hasArrow: PropTypes.bool,
        /**
         * ???????????????
         */
        hasBorder: PropTypes.bool,
        /**
         * ?????????????????????
         */
        hasClear: PropTypes.bool,
        /**
         * ??????????????? label
         */
        label: PropTypes.node,
        /**
         * ???????????????????????????????????????????????????????????????
         */
        readOnly: PropTypes.bool,
        /**
         * ?????????????????????????????????
         */
        autoWidth: PropTypes.bool,
        /**
         * ???????????????????????????????????? children
         */
        dataSource: PropTypes.arrayOf(PropTypes.object),
        /**
         * value/defaultValue ??? dataSource ??????????????????????????????
         * @version 1.25
         */
        preserveNonExistentValue: PropTypes.bool,
        /**
         * ?????????????????????
         */
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.arrayOf(PropTypes.any)]),
        /**
         * ????????????????????????
         */
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.arrayOf(PropTypes.any)]),
        /**
         * ???????????????????????????????????????
         * @param {String|Array} value ???????????????????????????????????????????????????????????????
         * @param {Object|Array} data ???????????????????????? value, label, pos, key???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
         */
        onChange: PropTypes.func,
        /**
         * ??????????????????????????? multiple ??? treeCheckable ??? true ?????????
         * @version 1.25
         */
        tagInline: PropTypes.bool,
        /**
         * ???????????? tag ???????????????????????? tagInline ??????????????????
         * @param {Object[]} selectedValues ????????????????????????
         * @param {Object[]} totalValues ???????????????
         * @returns {reactNode}
         * @version 1.25
         */
        maxTagPlaceholder: PropTypes.func,
        /**
         * ??????????????????????????? searchValue
         * @version 1.26
         */
        autoClearSearch: PropTypes.bool,
        /**
         * ?????????????????????
         */
        showSearch: PropTypes.bool,
        /**
         * 	???????????????????????????????????????????????????????????????????????????
         */
        filterLocal: PropTypes.bool,
        /**
         * ?????????????????????????????????????????????
         * @param {String} keyword ??????????????????
         */
        onSearch: PropTypes.func,
        onSearchClear: PropTypes.func,
        /**
         * ????????????????????????
         */
        notFoundContent: PropTypes.node,
        /**
         * ??????????????????
         */
        multiple: PropTypes.bool,
        /**
         * ??????????????????????????????????????????????????????
         */
        treeCheckable: PropTypes.bool,
        /**
         * ???????????????????????????????????????????????????????????????????????????????????????????????????
         */
        treeCheckStrictly: PropTypes.bool,
        /**
         * ??????????????????????????????
         * @enumdesc ???????????????????????????, ??????????????????????????????????????????, ??????????????????????????????????????????
         */
        treeCheckedStrategy: PropTypes.oneOf(['all', 'parent', 'child']),
        /**
         * ????????????????????????????????????????????????
         */
        treeDefaultExpandAll: PropTypes.bool,
        /**
         * ????????????????????????????????????key?????????
         */
        treeDefaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
        /**
         * ???????????????????????????????????????????????????????????????[Tree?????????????????????Demo](https://fusion.design/pc/component/tree?themeid=2#dynamic-container)
         * @param {ReactElement} node ????????????????????????
         */
        treeLoadData: PropTypes.func,
        /**
         * ????????? Tree ???????????????
         */
        treeProps: PropTypes.object,
        /**
         * ???????????????????????????
         */
        defaultVisible: PropTypes.bool,
        /**
         * ???????????????????????????
         */
        visible: PropTypes.bool,
        /**
         * ??????????????????????????????????????????????????????
         * @param {Boolean} visible ????????????
         * @param {String} type ?????????????????????????????????
         */
        onVisibleChange: PropTypes.func,
        /**
         * ??????????????????????????????
         */
        popupStyle: PropTypes.object,
        /**
         * ??????????????????????????????
         */
        popupClassName: PropTypes.string,
        /**
         * ??????????????????????????????
         */
        popupContainer: PropTypes.any,
        /**
         * ????????? Popup ???????????????
         */
        popupProps: PropTypes.object,
        /**
         * ??????????????????
         */
        followTrigger: PropTypes.bool,
        /**
         * ??????????????????
         */
        isPreview: PropTypes.bool,
        /**
         * ?????????????????????????????????
         * @param {Array<data>} value ????????? { label: , value:}
         */
        renderPreview: PropTypes.func,
        /**
         * ????????????????????????
         */
        useVirtual: PropTypes.bool,
        /**
         * ????????????????????????
         * @version 1.23
         */
        immutable: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
        pure: false,
        locale: zhCN.TreeSelect,
        size: 'medium',
        disabled: false,
        hasArrow: true,
        hasBorder: true,
        hasClear: false,
        autoWidth: true,
        defaultValue: null,
        onChange: noop,
        tagInline: false,
        autoClearSearch: true,
        showSearch: false,
        filterLocal: true,
        onSearch: noop,
        onSearchClear: noop,
        notFoundContent: 'Not Found',
        multiple: false,
        treeCheckable: false,
        treeCheckStrictly: false,
        treeCheckedStrategy: 'parent',
        treeDefaultExpandAll: false,
        treeDefaultExpandedKeys: [],
        treeProps: {},
        defaultVisible: false,
        onVisibleChange: noop,
        useVirtual: false,
        /**
         * TODO
         * ?????? select/cascade select ???????????????????????? 2.x ????????? tree-select ??????????????????
         */
        preserveNonExistentValue: false,
    };

    constructor(props, context) {
        super(props, context);

        const { defaultVisible, visible, defaultValue, value } = props;

        this.state = {
            visible: typeof visible === 'undefined' ? defaultVisible : visible,
            value: normalizeToArray(typeof value === 'undefined' ? defaultValue : value),
            searchedValue: '',
            expandedKeys: [],
            searchedKeys: [],
            retainedKeys: [],
            autoExpandParent: false,
            // map of value => item, includes value not exist in dataSource
            mapValueDS: {},
            ...flatDataSource(props),
        };

        // init value/mapValueDS when defaultValue is not undefined
        if (this.state.value !== undefined) {
            this.state.mapValueDS = getValueDataSource(this.state.value, this.state.mapValueDS).mapValueDS;
            this.state.value = this.state.value.map(v => {
                return valueToSelectKey(v);
            });
        }

        bindCtx(this, [
            'handleSelect',
            'handleCheck',
            'handleSearch',
            'handleSearchClear',
            'handleVisibleChange',
            'handleChange',
            'handleRemove',
            'handleExpand',
            'handleKeyDown',
            'saveTreeRef',
            'saveSelectRef',
            'renderMaxTagPlaceholder',
        ]);
    }

    static getDerivedStateFromProps(props, state) {
        const st = {};

        if ('value' in props) {
            const valueArray = normalizeToArray(props.value);
            // convert value to string[]
            st.value = valueArray.map(v => {
                return valueToSelectKey(v);
            });
            // re-calculate map
            st.mapValueDS = getValueDataSource(props.value, state.mapValueDS).mapValueDS;
        }
        if ('visible' in props) {
            st.visible = props.visible;
        }

        const { _k2n, _p2n, _v2n } = flatDataSource(props);

        if (props.showSearch && state.searchedValue) {
            const { searchedKeys, retainedKeys } = getSearchKeys(state.searchedValue, _k2n, _p2n);
            st.searchedKeys = searchedKeys;
            st.retainedKeys = retainedKeys;
        }

        return {
            ...st,
            _k2n,
            _p2n,
            _v2n,
        };
    }

    getKeysByValue(value) {
        return value.reduce((ret, v) => {
            const k = this.state._v2n[v] && this.state._v2n[v].key;
            if (k) {
                ret.push(k);
            }
            return ret;
        }, []);
    }

    getValueByKeys(keys) {
        return keys.map(k => this.state._k2n[k].value);
    }

    getValueForSelect(value) {
        const { treeCheckedStrategy } = this.props;
        const nonExistentValueKeys = this.getNonExistentValueKeys();

        let keys = this.getKeysByValue(value);

        keys = getAllCheckedKeys(keys, this.state._k2n, this.state._p2n);

        switch (treeCheckedStrategy) {
            case 'parent':
                keys = filterChildKey(keys, this.state._k2n, this.state._p2n);
                break;
            case 'child':
                keys = filterParentKey(keys, this.state._k2n, this.state._p2n);
                break;
            default:
                break;
        }

        const values = this.getValueByKeys(keys);

        return [...values, ...nonExistentValueKeys];
    }

    getData(value, forSelect) {
        const { preserveNonExistentValue } = this.props;
        const { mapValueDS } = this.state;

        const ret = value.reduce((ret, v) => {
            const k = this.state._v2n[v] && this.state._v2n[v].key;
            if (k) {
                const { label, pos, disabled, checkboxDisabled } = this.state._k2n[k];
                const d = {
                    value: v,
                    label,
                    pos,
                };
                if (forSelect) {
                    d.disabled = disabled || checkboxDisabled;
                } else {
                    d.key = k;
                }
                ret.push(d);
            } else if (preserveNonExistentValue) {
                // ???????????? dataSource ??????????????? value
                const item = mapValueDS[v];
                if (item) {
                    ret.push(item);
                }
            }
            return ret;
        }, []);

        return ret;
    }

    getNonExistentValues() {
        const { preserveNonExistentValue } = this.props;
        const { value } = this.state;

        if (!preserveNonExistentValue) {
            return [];
        }
        const nonExistentValues = value.filter(v => !this.state._v2n[v]);
        return nonExistentValues;
    }

    getNonExistentValueKeys() {
        const nonExistentValues = this.getNonExistentValues();
        return nonExistentValues.map(v => {
            if (typeof v === 'object' && v.hasOwnProperty('value')) {
                return v.value;
            }
            return v;
        });
    }

    saveTreeRef(ref) {
        this.tree = ref;
    }

    saveSelectRef(ref) {
        this.select = ref;
    }

    handleVisibleChange(visible, type) {
        if (!('visible' in this.props)) {
            this.setState({
                visible,
            });
        }

        if (['fromTree', 'keyboard'].indexOf(type) !== -1 && !visible) {
            this.select.focusInput();
        }

        this.props.onVisibleChange(visible, type);
    }

    handleSelect(selectedKeys, extra) {
        const { multiple, onChange, autoClearSearch } = this.props;
        const { selected } = extra;

        if (multiple || selected) {
            let value = this.getValueByKeys(selectedKeys);
            const nonExistentValues = this.getNonExistentValues();
            value = [...nonExistentValues, ...value];

            if (!('value' in this.props)) {
                this.setState({
                    value,
                });
            }
            if (!multiple) {
                this.handleVisibleChange(false, 'fromTree');
            }

            const data = this.getData(value);
            multiple ? onChange(value, data) : onChange(value[0], data[0]);

            // clear search value manually
            if (autoClearSearch) {
                this.select.handleSearchClear('select');
            }
        } else {
            this.handleVisibleChange(false, 'fromTree');
        }
    }

    handleCheck(checkedKeys) {
        const { onChange, autoClearSearch } = this.props;

        let value = this.getValueByKeys(checkedKeys);
        const nonExistentValues = this.getNonExistentValues();
        value = [...nonExistentValues, ...value];

        if (!('value' in this.props)) {
            this.setState({
                value,
            });
        }

        onChange(value, this.getData(value));

        // clear search value manually
        if (autoClearSearch) {
            this.select.handleSearchClear('select');
        }
    }

    handleRemove(removedItem) {
        const { value: removedValue } = removedItem;
        const { treeCheckable, treeCheckStrictly, treeCheckedStrategy, onChange } = this.props;

        let value;
        if (
            // there's linkage relationship among nodes
            treeCheckable &&
            !treeCheckStrictly &&
            ['parent', 'all'].indexOf(treeCheckedStrategy) !== -1 &&
            // value exits in datasource
            this.state._v2n[removedValue]
        ) {
            const removedPos = this.state._v2n[removedValue].pos;
            value = this.state.value.filter(v => {
                const p = this.state._v2n[v].pos;
                return !isDescendantOrSelf(removedPos, p);
            });

            const nums = removedPos.split('-');
            for (let i = nums.length; i > 2; i--) {
                const parentPos = nums.slice(0, i - 1).join('-');
                const parentValue = this.state._p2n[parentPos].value;
                const parentIndex = value.indexOf(parentValue);
                if (parentIndex > -1) {
                    value.splice(parentIndex, 1);
                } else {
                    break;
                }
            }
        } else {
            value = this.state.value.filter(v => v !== removedValue);
        }

        if (!('value' in this.props)) {
            this.setState({
                value,
            });
        }

        const data = this.getData(value);
        onChange(value, data);
    }

    handleSearch(searchedValue) {
        const { _k2n, _p2n } = this.state;
        const { searchedKeys, retainedKeys } = getSearchKeys(searchedValue, _k2n, _p2n);

        this.setState({
            searchedValue,
            expandedKeys: searchedKeys,
            searchedKeys,
            retainedKeys,
            autoExpandParent: true,
        });

        this.props.onSearch(searchedValue);
    }

    handleSearchClear(triggerType) {
        this.setState({
            searchedValue: '',
            expandedKeys: [],
        });
        this.props.onSearchClear(triggerType);
    }

    handleExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    handleKeyDown(e) {
        const { onKeyDown } = this.props;
        const { visible } = this.state;

        if (onKeyDown) {
            onKeyDown(e);
        }

        if (!visible) {
            return;
        }

        switch (e.keyCode) {
            case KEYCODE.UP:
            case KEYCODE.DOWN:
                this.tree.setFocusKey();
                e.preventDefault();
                break;
            default:
                break;
        }
    }

    handleChange(value, triggerType) {
        if (this.props.hasClear && triggerType === 'clear') {
            if (!('value' in this.props)) {
                this.setState({
                    value: [],
                });
            }

            this.props.onChange(null, null);
        }
    }

    searchNodes(children) {
        const { searchedKeys, retainedKeys } = this.state;

        const loop = children => {
            const retainedNodes = [];
            Children.forEach(children, child => {
                if (searchedKeys.indexOf(child.key) > -1) {
                    retainedNodes.push(child);
                } else if (retainedKeys.indexOf(child.key) > -1) {
                    const retainedNode = child.props.children
                        ? cloneElement(child, {}, loop(child.props.children))
                        : child;
                    retainedNodes.push(retainedNode);
                } else {
                    const hideNode = cloneElement(child, {
                        style: { display: 'none' },
                    });
                    retainedNodes.push(hideNode);
                }
            });
            return retainedNodes;
        };

        return loop(children);
    }

    createNodesByData(data, searching) {
        const { searchedKeys, retainedKeys } = this.state;

        const loop = (data, isParentMatched, prefix = '0') => {
            const retainedNodes = [];

            data.forEach((item, index) => {
                const { children, ...others } = item;
                const pos = `${prefix}-${index}`;
                const key = this.state._p2n[pos].key;
                const addNode = (isParentMatched, hide) => {
                    if (hide) {
                        others.style = { display: 'none' };
                    }

                    retainedNodes.push(
                        <TreeNode {...others} key={key}>
                            {children && children.length ? loop(children, isParentMatched, pos) : null}
                        </TreeNode>
                    );
                };

                if (searching) {
                    if (searchedKeys.indexOf(key) > -1 || isParentMatched) {
                        addNode(true);
                    } else if (retainedKeys.indexOf(key) > -1) {
                        addNode(false);
                    } else {
                        addNode(false, true);
                    }
                } else {
                    addNode();
                }
            });

            return retainedNodes;
        };

        return loop(data, false);
    }

    /*eslint-disable max-statements*/
    renderPopupContent() {
        const prefix = this.props.prefix;
        const treeSelectPrefix = `${prefix}tree-select-`;

        if (!this.state.visible) {
            return <div className={`${treeSelectPrefix}dropdown`} />;
        }

        const {
            multiple,
            treeCheckable,
            treeCheckStrictly,
            treeCheckedStrategy,
            treeDefaultExpandAll,
            treeDefaultExpandedKeys,
            treeLoadData,
            treeProps: customTreeProps = {},
            showSearch,
            filterLocal,
            dataSource,
            children,
            readOnly,
            notFoundContent,
            useVirtual,
        } = this.props;

        const { value, searchedValue, expandedKeys, autoExpandParent, searchedKeys } = this.state;

        const treeProps = {
            multiple,
            ref: this.saveTreeRef,
            loadData: treeLoadData,
            defaultExpandAll: treeDefaultExpandAll,
            defaultExpandedKeys: treeDefaultExpandedKeys,
            useVirtual,
        };

        // ?????????????????? ??????????????????
        if (useVirtual) {
            customTreeProps.style = {
                maxHeight: '260px',
                overflow: 'auto',
                boxSizing: 'border-box',
                ...customTreeProps.style,
            };
        }

        const keys = this.getKeysByValue(value);
        if (treeCheckable) {
            treeProps.checkable = treeCheckable;
            treeProps.checkStrictly = treeCheckStrictly;
            treeProps.checkedStrategy = treeCheckStrictly ? 'all' : treeCheckedStrategy;
            treeProps.checkedKeys = keys;
            if (!readOnly) {
                treeProps.onCheck = this.handleCheck;
            }
        } else {
            treeProps.selectedKeys = keys;
            if (!readOnly) {
                treeProps.onSelect = this.handleSelect;
            }
        }

        let notFound = false;
        let newChildren;
        if (filterLocal && showSearch && searchedValue) {
            treeProps.expandedKeys = expandedKeys;
            treeProps.autoExpandParent = autoExpandParent;
            treeProps.onExpand = this.handleExpand;
            treeProps.filterTreeNode = node => {
                return searchedKeys.indexOf(node.props.eventKey) > -1;
            };

            if (searchedKeys.length) {
                newChildren = dataSource ? this.createNodesByData(dataSource, true) : this.searchNodes(children);
            } else {
                notFound = true;
            }
        } else {
            // eslint-disable-next-line
            if (dataSource) {
                if (dataSource.length) {
                    newChildren = this.createNodesByData(dataSource);
                } else {
                    notFound = true;
                }
            } else {
                // eslint-disable-next-line
                if (Children.count(children)) {
                    newChildren = children;
                } else {
                    notFound = true;
                }
            }
        }
        const contentClass = `${treeSelectPrefix}dropdown-content`;

        return (
            <div className={`${treeSelectPrefix}dropdown`}>
                {notFound ? (
                    <div className={`${treeSelectPrefix}not-found contentClass`}>{notFoundContent}</div>
                ) : (
                    <Tree {...treeProps} {...customTreeProps} className={contentClass}>
                        {newChildren}
                    </Tree>
                )}
            </div>
        );
    }

    renderPreview(data, others) {
        const { prefix, className, renderPreview } = this.props;

        const previewCls = classNames(className, `${prefix}form-preview`);
        const items = data && !Array.isArray(data) ? [data] : data;

        if (typeof renderPreview === 'function') {
            return (
                <div {...others} className={previewCls}>
                    {renderPreview(items, this.props)}
                </div>
            );
        }

        return (
            <p {...others} className={previewCls}>
                {items && items.map(({ label }) => label).join(', ')}
            </p>
        );
    }

    /**
     * TreeSelect ?????????????????? Select ??? maxTagPlaceholder ??????
     * Select ??? totalValue ????????? leaf ?????????TreeSelect ??? totalValue ??? treeCheckedStrategy ??? treeCheckStrictly ??????
     *
     * treeCheckStrictly = true: totalValue ???????????????
     *
     * treeCheckStrictly = false: ?????? treeCheckedStrategy ??????
     *   treeCheckedStrategy = 'all': totalValue ???????????????
     *   treeCheckedStrategy = 'parent': totalValue ?????????????????????
     *   treeCheckedStrategy = 'child': totalValue ????????? leaf ??????
     */
    renderMaxTagPlaceholder(value, totalValue) {
        // ????????? totalValue ????????? leaf ??????
        const { treeCheckStrictly, maxTagPlaceholder, treeCheckedStrategy, locale } = this.props;
        const { _v2n } = this.state;

        let treeSelectTotalValue = totalValue; // all the leaf nodes

        // calculate total value
        if (treeCheckStrictly) {
            // all the nodes
            treeSelectTotalValue = obj.values(_v2n);
        } else if (treeCheckedStrategy === 'all') {
            // all
            treeSelectTotalValue = obj.values(_v2n);
        } else if (treeCheckedStrategy === 'parent') {
            // totalValue is pointless when treeCheckedStrategy = 'parent'
            treeSelectTotalValue = undefined;
        }

        // custom render function
        if (maxTagPlaceholder) {
            return maxTagPlaceholder(value, treeSelectTotalValue);
        }

        // default render function
        if (treeCheckedStrategy === 'parent') {
            // don't show totalValue when treeCheckedStrategy = 'parent'
            return `${str.template(locale.shortMaxTagPlaceholder, {
                selected: value.length,
            })}`;
        }
        return `${str.template(locale.maxTagPlaceholder, {
            selected: value.length,
            total: treeSelectTotalValue.length,
        })}`;
    }

    /*eslint-enable*/
    render() {
        const {
            prefix,
            size,
            placeholder,
            disabled,
            hasArrow,
            hasBorder,
            hasClear,
            label,
            readOnly,
            autoWidth,
            popupStyle,
            popupClassName,
            showSearch,
            multiple,
            treeCheckable,
            treeCheckStrictly,
            className,
            popupContainer,
            popupProps,
            followTrigger,
            isPreview,
            dataSource,
            tagInline,
        } = this.props;
        const others = obj.pickOthers(Object.keys(TreeSelect.propTypes), this.props);
        const { value, visible } = this.state;

        // if (non-leaf ???????????? & ????????????????????????????????????)???????????????????????????????????????????????????
        const valueForSelect = treeCheckable && !treeCheckStrictly ? this.getValueForSelect(value) : value;

        let data = this.getData(valueForSelect, true);
        if (!multiple && !treeCheckable) {
            data = data[0];
        }

        if (isPreview) {
            return this.renderPreview(data, others);
        }

        return (
            <Select
                prefix={prefix}
                className={className}
                size={size}
                hasBorder={hasBorder}
                hasArrow={hasArrow}
                hasClear={hasClear}
                placeholder={placeholder}
                disabled={disabled}
                autoWidth={autoWidth}
                label={label}
                readOnly={readOnly}
                ref={this.saveSelectRef}
                dataSource={dataSource}
                value={data}
                onChange={this.handleChange}
                visible={visible}
                onVisibleChange={this.handleVisibleChange}
                showSearch={showSearch}
                onSearch={this.handleSearch}
                onSearchClear={this.handleSearchClear}
                popupContainer={popupContainer}
                popupStyle={popupStyle}
                popupClassName={popupClassName}
                popupProps={popupProps}
                followTrigger={followTrigger}
                tagInline={tagInline}
                maxTagPlaceholder={this.renderMaxTagPlaceholder}
                {...others}
                onRemove={this.handleRemove}
                onKeyDown={this.handleKeyDown}
                popupContent={this.renderPopupContent()}
                mode={treeCheckable || multiple ? 'multiple' : 'single'}
            />
        );
    }
}

TreeSelect.Node = TreeNode;

export default polyfill(TreeSelect);
