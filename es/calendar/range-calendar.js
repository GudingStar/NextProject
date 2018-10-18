import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import ConfigProvider from '../config-provider';
import locale from '../locale/zh-cn';
import { obj, func } from '../util';
import RangePanelHeader from './head/range-panel-header';
import MonthPanelHeader from './head/month-panel-header';
import YearPanelHeader from './head/year-panel-header';
import DateTable from './table/date-table';
import MonthTable from './table/month-table';
import YearTable from './table/year-table';
import { checkMomentObj, formatDateValue, getVisibleMonth, isSameYearMonth, CALENDAR_MODES, CALENDAR_MODE_DATE, CALENDAR_MODE_MONTH, CALENDAR_MODE_YEAR } from './utils';

var RangeCalendar = (_temp = _class = function (_React$Component) {
    _inherits(RangeCalendar, _React$Component);

    function RangeCalendar(props, context) {
        _classCallCheck(this, RangeCalendar);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

        _this.onSelectCell = function (date, nextMode) {
            _this.changeVisibleMonth(date, 'cellClick');

            if (_this.state.mode === CALENDAR_MODE_DATE) {
                _this.props.onSelect(date);
            }
            _this.changeMode(nextMode);
        };

        _this.changeMode = function (mode, activePanel) {
            if (typeof mode === 'string' && mode !== _this.state.mode) {
                _this.setState({ mode: mode });
            }
            if (activePanel && activePanel !== _this.state.activePanel) {
                _this.setState({ activePanel: activePanel });
            }
        };

        _this.changeVisibleMonth = function (date, reason) {
            if (!isSameYearMonth(date, _this.state.startVisibleMonth)) {
                _this.setState({ startVisibleMonth: date });
                _this.props.onVisibleMonthChange(date, reason);
            }
        };

        _this.changeVisibleMonthByOffset = function (offset, type) {
            var offsetDate = _this.state.startVisibleMonth.clone().add(offset, type);
            _this.changeVisibleMonth(offsetDate, 'buttonClick');
        };

        _this.goPrevDecade = function () {
            _this.changeVisibleMonthByOffset(-10, 'years');
        };

        _this.goNextDecade = function () {
            _this.changeVisibleMonthByOffset(10, 'years');
        };

        _this.goPrevYear = function () {
            _this.changeVisibleMonthByOffset(-1, 'years');
        };

        _this.goNextYear = function () {
            _this.changeVisibleMonthByOffset(1, 'years');
        };

        _this.goPrevMonth = function () {
            _this.changeVisibleMonthByOffset(-1, 'months');
        };

        _this.goNextMonth = function () {
            _this.changeVisibleMonthByOffset(1, 'months');
        };

        var startValue = formatDateValue(props.startValue || props.defaultStartValue);
        var endValue = formatDateValue(props.endValue || props.defaultEndValue);
        var visibleMonth = getVisibleMonth(props.defaultVisibleMonth, startValue);

        _this.state = {
            startValue: startValue,
            endValue: endValue,
            mode: props.mode,
            startVisibleMonth: visibleMonth,
            activePanel: undefined
        };
        _this.today = moment();
        return _this;
    }

    RangeCalendar.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if ('startValue' in nextProps) {
            var startValue = formatDateValue(nextProps.startValue);
            this.setState({
                startValue: startValue
            });

            if (startValue) {
                this.setState({
                    startVisibleMonth: startValue
                });
            }
        }

        if ('endValue' in nextProps) {
            var endValue = formatDateValue(nextProps.endValue);
            this.setState({
                endValue: endValue
            });
        }

        if ('mode' in nextProps) {
            this.setState({
                mode: nextProps.mode
            });
        }
    };

    /**
     * 根据日期偏移量设置当前展示的月份
     * @param {Number} offset 日期偏移量
     * @param {String} type 日期偏移类型 days, months, years
     */


    RangeCalendar.prototype.render = function render() {
        var _classnames;

        var _props = this.props,
            prefix = _props.prefix,
            dateCellRender = _props.dateCellRender,
            className = _props.className,
            locale = _props.locale,
            showOtherMonth = _props.showOtherMonth,
            disabledDate = _props.disabledDate,
            others = _objectWithoutProperties(_props, ['prefix', 'dateCellRender', 'className', 'locale', 'showOtherMonth', 'disabledDate']);

        var _state = this.state,
            startValue = _state.startValue,
            endValue = _state.endValue,
            mode = _state.mode,
            startVisibleMonth = _state.startVisibleMonth,
            activePanel = _state.activePanel;

        // reset moment locale

        if (locale.momentLocale) {
            startValue && startValue.locale(locale.momentLocale);
            endValue && endValue.locale(locale.momentLocale);
            startVisibleMonth.locale(locale.momentLocale);
        }

        var localeData = startVisibleMonth.localeData();
        var endVisibleMonth = startVisibleMonth.clone().add(1, 'months');

        var headerProps = {
            prefix: prefix,
            mode: mode,
            locale: locale,
            momentLocale: localeData,
            startVisibleMonth: startVisibleMonth,
            endVisibleMonth: endVisibleMonth,
            changeMode: this.changeMode
        };

        var tableProps = {
            prefix: prefix,
            value: startValue,
            startValue: startValue,
            endValue: endValue,
            mode: mode,
            locale: locale,
            momentLocale: localeData,
            showOtherMonth: showOtherMonth,
            today: this.today,
            disabledDate: disabledDate,
            dateCellRender: dateCellRender,
            changeMode: this.changeMode,
            changeVisibleMonth: this.changeVisibleMonth
        };

        var visibleMonths = {
            start: startVisibleMonth,
            end: endVisibleMonth
        };

        var visibleMonth = visibleMonths[activePanel];

        var header = void 0;
        var table = void 0;

        switch (mode) {
            case CALENDAR_MODE_DATE:
                {
                    table = [React.createElement(
                        'div',
                        { className: prefix + 'calendar-body-left', key: 'left-panel' },
                        React.createElement(DateTable, _extends({}, tableProps, { visibleMonth: startVisibleMonth, onSelectDate: this.onSelectCell }))
                    ), React.createElement(
                        'div',
                        { className: prefix + 'calendar-body-right', key: 'right-panel' },
                        React.createElement(DateTable, _extends({}, tableProps, { visibleMonth: endVisibleMonth, onSelectDate: this.onSelectCell }))
                    )];
                    header = React.createElement(RangePanelHeader, _extends({}, headerProps, {
                        goPrevYear: this.goPrevYear,
                        goPrevMonth: this.goPrevMonth,
                        goNextYear: this.goNextYear,
                        goNextMonth: this.goNextMonth }));
                    break;
                }
            case CALENDAR_MODE_MONTH:
                {
                    table = React.createElement(MonthTable, _extends({}, tableProps, { visibleMonth: visibleMonth, onSelectMonth: this.onSelectCell }));
                    header = React.createElement(MonthPanelHeader, _extends({}, headerProps, { visibleMonth: visibleMonth, goPrevYear: this.goPrevYear, goNextYear: this.goNextYear }));
                    break;
                }
            case CALENDAR_MODE_YEAR:
                {
                    table = React.createElement(YearTable, _extends({}, tableProps, {
                        visibleMonth: visibleMonth,
                        onSelectYear: this.onSelectCell,
                        goPrevDecade: this.goPrevDecade,
                        goNextDecade: this.goNextDecade }));
                    header = React.createElement(YearPanelHeader, _extends({}, headerProps, {
                        visibleMonth: visibleMonth,
                        goPrevDecade: this.goPrevDecade,
                        goNextDecade: this.goNextDecade }));
                    break;
                }
        }

        var classNames = classnames((_classnames = {}, _classnames[prefix + 'calendar'] = true, _classnames[prefix + 'calendar-range'] = true, _classnames), className);

        return React.createElement(
            'div',
            _extends({}, obj.pickOthers(RangeCalendar.propTypes, others), { className: classNames }),
            header,
            React.createElement(
                'div',
                { className: prefix + 'calendar-body' },
                table
            )
        );
    };

    return RangeCalendar;
}(React.Component), _class.propTypes = {
    /**
     * 样式前缀
     */
    prefix: PropTypes.string,
    /**
     * 默认的开始日期
     */
    defaultStartValue: checkMomentObj,
    /**
     * 默认的结束日期
     */
    defaultEndValue: checkMomentObj,
    /**
     * 开始日期（moment 对象）
     */
    startValue: checkMomentObj,
    /**
     * 结束日期（moment 对象）
     */
    endValue: checkMomentObj,
    // 面板模式
    mode: PropTypes.oneOf(CALENDAR_MODES),
    /**
     * 是否显示非本月的日期
     */
    showOtherMonth: PropTypes.bool,
    /**
     * 模板展示的月份（起始月份）
     */
    defaultVisibleMonth: PropTypes.func,
    /**
     * 展现的月份变化时的回调
     * @param {Object} value 显示的月份 (moment 对象)
     * @param {String} reason 触发月份改变原因
     */
    onVisibleMonthChange: PropTypes.func,
    /**
     * 不可选择的日期
     * @param {Object} calendarDate 对应 Calendar 返回的自定义日期对象
     * @returns {Boolean}
     */
    disabledDate: PropTypes.func,
    /**
     * 选择日期单元格时的回调
     * @param {Object} value 对应的日期值 (moment 对象)
     */
    onSelect: PropTypes.func,
    /**
     * 自定义日期单元格渲染
     */
    dateCellRender: PropTypes.func,
    locale: PropTypes.object,
    className: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    mode: CALENDAR_MODE_DATE,
    dateCellRender: function dateCellRender(value) {
        return value.date();
    },
    onSelect: func.noop,
    onVisibleMonthChange: func.noop,
    locale: locale.Calendar,
    showOtherMonth: false
}, _temp);
RangeCalendar.displayName = 'RangeCalendar';


export default ConfigProvider.config(RangeCalendar, { componentName: 'Calendar' });