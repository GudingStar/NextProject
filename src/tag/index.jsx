import ConfigProvider from '../config-provider';
import { log } from '../util';
import Tag from './tag';
import Group from './tag-group';
import Selectable from './selectable';
import Closable from './closeable';

const ConfigTag = ConfigProvider.config(Tag, {
    transfrom: /* istanbul ignore next */ (props, deprecated) => {
        const { shape, type } = props;
        if (shape === 'selectable') {
            deprecated('shape=selectable', 'Tag.Selectable', 'Tag');
        }

        if (shape === 'deletable') {
            deprecated('shape=deletable', 'Tag.Closeable', 'Tag');
        }

        if (shape === 'link') {
            deprecated('shape=link', '<Tag><a href="x">x</a></Tag>', 'Tag');
        }

        if (shape === 'readonly' || shape === 'interactive') {
            log.warning(`Warning: [ shape=${shape} ] is deprecated at [ Tag ]`);
        }

        if (type === 'secondary') {
            log.warning('Warning: [ type=secondary ] is deprecated at [ Tag ]');
        }

        ['count', 'marked', 'value', 'onChange'].forEach(key => {
            if (key in props) {
                log.warning(`Warning: [ ${key} ] is deprecated at [ Tag ]`);
            }
        });

        if ('selected' in props || 'defaultSelected' in props) {
            log.warning(
                'Warning: [ selected|defaultSelected  ] is deprecated at [ Tag ], use [ checked|defaultChecked ] at [ Tag.Selectable ] instead of it'
            );
        }

        if ('closed' in props) {
            log.warning(
                'Warning: [ closed  ] is deprecated at [ Tag ], use [ onClose ] at [ Tag.Closeable ] instead of it'
            );
        }

        if ('onSelect' in props) {
            deprecated('onSelect', '<Tag.Selectable onChange/>', 'Tag');
        }

        if ('afterClose' in props) {
            log.warning(
                'Warning: [ afterClose  ] is deprecated at [ Tag ], use [ afterClose ] at [ Tag.Closeable ] instead of it'
            );
        }

        return props;
    },
});

ConfigTag.Group = ConfigProvider.config(Group);

ConfigTag.Selectable = ConfigProvider.config(Selectable);

// ?????????????????? Closeable ???????????????Closeable, ?????????????????? ??????????????? Closeable, Closeable???????????????
ConfigTag.Closable = ConfigProvider.config(Closable);
ConfigTag.Closeable = ConfigTag.Closable;

export default ConfigTag;
