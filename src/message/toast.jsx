import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Overlay from '../overlay';
import ConfigProvider from '../config-provider';
import { guid } from '../util';
import Message from './message';

const { config } = ConfigProvider;

let instance;
const timeouts = {};

class Mask extends React.Component {
    static contextTypes = {
        prefix: PropTypes.string,
    };

    static propTypes = {
        prefix: PropTypes.string,
        type: PropTypes.string,
        title: PropTypes.node,
        content: PropTypes.node,
        align: PropTypes.string,
        offset: PropTypes.array,
        hasMask: PropTypes.bool,
        afterClose: PropTypes.func,
        animation: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        overlayProps: PropTypes.object,
        onClose: PropTypes.func,
        timeoutId: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
    };

    static defaultProps = {
        prefix: 'next-',
        align: 'tc tc',
        offset: [0, 30],
        hasMask: false,
        animation: {
            in: 'pulse',
            out: 'zoomOut',
        },
        style: {},
        className: '',
    };

    state = {
        visible: true,
    };

    componentWillUnmount() {
        const { timeoutId } = this.props;

        if (timeoutId in timeouts) {
            const timeout = timeouts[timeoutId];
            clearTimeout(timeout);
            delete timeouts[timeoutId];
        }
    }

    handleClose = (silent = false) => {
        this.setState({
            visible: false,
        });

        if (!silent) {
            this.props.onClose && this.props.onClose();
        }
    };

    render() {
        /* eslint-disable no-unused-vars */
        const {
            prefix,
            type,
            title,
            content,
            align,
            offset,
            hasMask,
            afterClose,
            animation,
            overlayProps,
            timeoutId,
            className,
            style,
            ...others
        } = this.props;
        /* eslint-enable */
        const { visible } = this.state;
        return (
            <Overlay
                {...overlayProps}
                prefix={prefix}
                animation={animation}
                visible={visible}
                align={align}
                offset={offset}
                hasMask={hasMask}
                afterClose={afterClose}
            >
                <Message
                    {...others}
                    prefix={prefix}
                    visible
                    type={type}
                    shape="toast"
                    title={title}
                    style={style}
                    className={`${prefix}message-wrapper ${className}`}
                    onClose={this.handleClose}
                >
                    {content}
                </Message>
            </Overlay>
        );
    }
}

const NewMask = config(Mask);

const create = props => {
    /* eslint-disable no-unused-vars */
    const { duration, afterClose, contextConfig, ...others } = props;
    /* eslint-enable no-unused-vars */

    const div = document.createElement('div');
    document.body.appendChild(div);
    const closeChain = function() {
        ReactDOM.unmountComponentAtNode(div);
        document.body.removeChild(div);
        afterClose && afterClose();
    };

    let newContext = contextConfig;
    if (!newContext) newContext = ConfigProvider.getContext();

    let mask,
        myRef,
        destroyed = false;
    const destroy = () => {
        const inc = mask && mask.getInstance();
        inc && inc.handleClose(true);
        destroyed = true;
    };

    ReactDOM.render(
        <ConfigProvider {...newContext}>
            <NewMask
                afterClose={closeChain}
                {...others}
                ref={ref => {
                    myRef = ref;
                }}
            />
        </ConfigProvider>,
        div,
        function() {
            mask = myRef;
            if (mask && destroyed) {
                destroy();
            }
        }
    );

    return {
        component: mask,
        destroy,
    };
};

function handleConfig(config, type) {
    let newConfig = {};

    if (typeof config === 'string' || React.isValidElement(config)) {
        newConfig.title = config;
    } else if (isObject(config)) {
        newConfig = { ...config };
    }
    if (typeof newConfig.duration !== 'number') {
        newConfig.duration = 3000;
    }
    if (type) {
        newConfig.type = type;
    }

    return newConfig;
}

function isObject(obj) {
    return {}.toString.call(obj) === '[object Object]';
}

function open(config, type) {
    close();
    config = handleConfig(config, type);
    const timeoutId = guid();
    instance = create({ ...config, timeoutId });

    if (config.duration > 0) {
        const timeout = setTimeout(close, config.duration);
        timeouts[timeoutId] = timeout;
    }
}

function close() {
    if (instance) {
        instance.destroy();
        instance = null;
    }
}

/**
 * ??????????????????
 * @exportName show
 * @param {Object} props ????????????
 */
function show(config) {
    open(config);
}

/**
 * ??????????????????
 * @exportName hide
 */
function hide() {
    close();
}

/**
 * ????????????????????????
 * @exportName success
 * @param {Object} props ????????????
 */
function success(config) {
    open(config, 'success');
}

/**
 * ????????????????????????
 * @exportName warning
 * @param {Object} props ????????????
 */
function warning(config) {
    open(config, 'warning');
}

/**
 * ????????????????????????
 * @exportName error
 * @param {Object} props ????????????
 */
function error(config) {
    open(config, 'error');
}

/**
 * ????????????????????????
 * @exportName help
 * @param {Object} props ????????????
 */
function help(config) {
    open(config, 'help');
}

/**
 * ???????????????????????????
 * @exportName loading
 * @param {Object} props ????????????
 */
function loading(config) {
    open(config, 'loading');
}

/**
 * ????????????????????????
 * @exportName notice
 * @param {Object} props ????????????
 */
function notice(config) {
    open(config, 'notice');
}

export default {
    show,
    hide,
    success,
    warning,
    error,
    help,
    loading,
    notice,
};

export const withContext = WrappedComponent => {
    const HOC = props => {
        return (
            <ConfigProvider.Consumer>
                {contextConfig => (
                    <WrappedComponent
                        {...props}
                        contextMessage={{
                            show: (config = {}) => show({ ...config, contextConfig }),
                            hide,
                            success: (config = {}) => success({ ...config, contextConfig }),
                            warning: (config = {}) => warning({ ...config, contextConfig }),
                            error: (config = {}) => error({ ...config, contextConfig }),
                            help: (config = {}) => help({ ...config, contextConfig }),
                            loading: (config = {}) => loading({ ...config, contextConfig }),
                            notice: (config = {}) => notice({ ...config, contextConfig }),
                        }}
                    />
                )}
            </ConfigProvider.Consumer>
        );
    };
    return HOC;
};
