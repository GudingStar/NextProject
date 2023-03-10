import { Demo, DemoGroup, initDemo } from '../../../src/demo-helper';
import Input from '../../../src/input';
import Select from '../../../src/select';
import TimePicker from '../../../src/time-picker';
import Form from '../../../src/form';
import Rating from '../../../src/rating';
import Range from '../../../src/range';
import '../../../src/demo-helper/style.js';
import '../../../src/input/style.js';
import '../../../src/time-picker/style.js';
import '../../../src/select/style.js';
import '../../../src/form/style.js';
import '../../../src/rating/style.js';
import '../../../src/range/style.js';
import '../../../src/core/form-element.scss';

const FormItem = Form.Item;

const dataSource = [
    { label: 'AAAA', value: 'a' },
    { label: 'BBBB', value: 'b' },
    { label: 'CCCC', value: 'c' },
    { label: 'DDDD', value: 'd' }
];

const fileList = [{
    uid: '0',
    name: 'IMG.png',
    state: 'done',
    url: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg',
    downloadURL: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg',
    imgURL: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg'
}, {
    uid: '1',
    name: 'IMG.png',
    percent: 50,
    state: 'uploading',
    url: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg',
    downloadURL: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg',
    imgURL: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg'
}, {
    uid: '2',
    name: 'IMG.png',
    state: 'error',
    url: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg',
    downloadURL: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg',
    imgURL: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg'
}];

class FormElementDemo extends React.Component {
    render() {
        const { size } = this.props;
        const elementProps = {
            className: 'next-form-element',
            size,
            style: {
                width: '200px'
            }
        };

        return (
            <table>
                <tbody>
                    <tr>
                        <td><Input placeholder="?????????" {...elementProps} /></td>
                        <td><Select {...elementProps} dataSource={dataSource} /></td>
                        <td><TimePicker {...elementProps} /></td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

const formItemLayout = {
    labelCol: {
        span: 7
    },
    wrapperCol: {
        span: 16
    }
};
class FormElementPreviewDemo extends React.Component {
    render() {
        const { size } = this.props;
        const itemProps = {
            className: 'next-form-element'
        };
        return (
            <table>
                <tbody>
                    <tr>
                        <td>
                        <Form {...formItemLayout} isPreview size={size} style={{maxWidth: '800px'}}>
                            <FormItem {...itemProps} required label="Username:">
                                <Input defaultValue="Fusion" placeholder="Please enter your username" id="username" name="username" aria-required="true"   />
                            </FormItem>

                            <FormItem {...itemProps} required label="Link:">
                                <Input name="link" addonTextBefore="http://" addonTextAfter=".com" defaultValue="alibaba" aria-label="input with config of addonTextBefore and addonTextAfter" />
                            </FormItem>

                            <FormItem {...itemProps} required label="Time:">
                                <TimePicker value="17:16:23" aria-required="true" />
                            </FormItem>

                            <FormItem {...itemProps} required label="autoComplete:">
                                <Select.AutoComplete name="autoComplete" defaultValue="selected" />
                            </FormItem>

                            <FormItem {...itemProps} required label="multiple Select:">
                                <Select name="select" defaultValue={["apple", "banana"]} mode="multiple" >
                                    <Select.Option value="apple">Apple</Select.Option>
                                    <Select.Option value="banana">Banana</Select.Option>
                                </Select>
                            </FormItem>

                            <FormItem {...itemProps} required label="Rating:">
                                <Rating defaultValue={4.5} name="rate" aria-label="what's the rate score" />
                            </FormItem>

                            <FormItem {...itemProps} required label="Range:">
                                <Range name="range" slider="double" defaultValue={[10, 80]} />
                            </FormItem>

                            <FormItem {...itemProps} label="Note:">
                                <Input.TextArea placeholder="description" name="a11yRemark" defaultValue="Fusion ???????????????????????????UI??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????" />
                            </FormItem>

                            <FormItem {...itemProps} wrapperCol={{offset: 7}}>
                                <Form.Submit validate type="primary" onClick={this.submitHandler}>Submit</Form.Submit>
                                <Form.Reset style={{marginLeft: 10}}>Reset</Form.Reset>
                            </FormItem>
                        </Form>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

window.renderDemo = function () {

    ReactDOM.render(
        <div>
            <Demo title="FormElement">
                <tr className="demo-group">
                    <td className="label"></td>
                    <td style={{ fontSize: '14px', height: '40px', lineHeight: '40px' }}>
                        ?????????????????????Size???Font???Icon(size)???Corner????????????????????????????????????????????????Input???Select???TreeSelect???CascaderSelect???Timepicker???DatePicker???NumberPicker
                    </td>
                </tr>
                <DemoGroup label="Large">
                    <FormElementDemo size="large" />
                </DemoGroup>
                <DemoGroup label="Medium">
                    <FormElementDemo />
                </DemoGroup>
                <DemoGroup label="Small">
                    <FormElementDemo size="small"  />
                </DemoGroup>
            </Demo>
            <Demo title="FormElement Preview">
                <DemoGroup label="Large">
                    <FormElementPreviewDemo size="large" />
                </DemoGroup>
                <DemoGroup label="Medium">
                    <FormElementPreviewDemo />
                </DemoGroup>
                <DemoGroup label="Small">
                    <FormElementPreviewDemo size="small"  />
                </DemoGroup>
            </Demo>
        </div>
        , document.getElementById('container'));
};

renderDemo();

initDemo('form-element');
