import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import assert from 'power-assert';
import sinon from 'sinon';
import Upload from '../../src/upload/index';
import request from '../../src/upload/runtime/request'
import { func } from '../../src/util';

Enzyme.configure({ adapter: new Adapter() });

const CardUpload = Upload.Card;
const DragUpload = Upload.Dragger;

const defaultValue = [
  {
      name: 'IMG.png',
      state: 'done',
      size: 1024,
      url: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg',
  }
];

function fixBinary (bin) {
    let length = bin.length;
    let buf = new ArrayBuffer(length);
    let arr = new Uint8Array(buf);
    for (let i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return buf;
  }

describe('Upload', () => {
    let requests;
    let xhr;

    beforeEach(() => {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = req => requests.push(req);
    });

    afterEach(() => {
        xhr.restore();
    });

    describe('render', () => {
        it('should render a wrapper upload', () => {
            const wrapper = mount(<Upload listType="text" defaultValue={defaultValue}/>);
            assert(wrapper.find('.next-upload').length === 1);
            // remove item
            assert(wrapper.find('.next-upload-list-item').length === 1);
        });
    });

    describe('behavior', () => {
        it('should support defaultValue and can be changed', (done) => {

            const wrapper = mount(
                <Upload
                    action="https://www.easy-mock.com/mock/5b713974309d0d7d107a74a3/alifd/upload"
                    listType="card" defaultValue={defaultValue}  onChange={(value) => {
                    assert(value.length === 2);
                    done();
                }}/>
            );

            assert(wrapper.find('.next-upload-list-item').length === 1);

            if (typeof atob === 'function' && typeof Blob  === 'function' && typeof File === 'function') {
                // 模拟文件上传
                let base64 ='iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggkFBTzlUWEwwWTRPSHdBQUFBQkpSVTVFcmtKZ2dnPT0=';

                let binary = fixBinary(atob(base64));

                let blob = new Blob([binary], {type: 'image/png'});

                let file = new File([blob], 'test.png', {type: 'image/png'});
                wrapper.find('input').simulate('change', { target: { files: [ file ] } });
                requests[0].respond(200, {}, '{"success": true, "url":"https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg"}');
            } else {
                done();
            }
        });
        it('should support limit', (done) => {
            const onSelect = (files) => {
                assert(files.length === 1)
                done();
            };

            const wrapper = mount(<Upload autoUplod={false} limit={1} onSelect={onSelect} />);

            if (typeof atob === 'function' && typeof Blob  === 'function' && typeof File === 'function') {
                // 模拟文件上传
                let base64 ='iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggkFBTzlUWEwwWTRPSHdBQUFBQkpSVTVFcmtKZ2dnPT0=';

                let binary = fixBinary(atob(base64));

                let blob = new Blob([binary], {type: 'image/png'});

                let file = new File([blob], 'test.png', {type: 'image/png'});
                wrapper.find('input').simulate('change', { target: { files: [ file, file ] } });
            } else {
                done();
            }

        });

        it('should support onChange/onRemove events', (done) => {
            const onChange = sinon.spy();
            const onRemove = sinon.spy();
            const wrapper = mount(<Upload listType="text" defaultValue={defaultValue} onChange={onChange} onRemove={onRemove} />);

            wrapper.find('i.next-icon-close').at(0).simulate('click');
            assert(onChange.calledOnce);
            assert(onRemove.calledOnce);
            done();
        });
    });

    describe('[render] drag', ()=> {
        it('should render a drag upload', (done) => {
            const drag = mount(<DragUpload />);
            assert(drag.find('.next-upload-drag').length === 1);

            if (typeof Blob  === 'function' && typeof File === 'function') {
                let blob = new Blob(['hello'], {type: 'text/plain'});
                let file = new File([blob], 'test.png', {type: 'image/png'});

                drag.find('div.next-upload-inner').simulate('dragover', { dataTransfer: { files: [file] } });
                drag.find('div.next-upload-inner').simulate('dragleave', { dataTransfer: { files: [file] } });
                drag.find('div.next-upload-inner').simulate('drop', { dataTransfer: { files: [file] } });
                // expect(drag.find('.next-upload-list-item-done')).to.have.length(1)
            };

            done();
        });
    });

    describe('[behavior] CardUpload', () => {
        it('should support controlled `value`', () => {
            const wrapper = mount(
                <CardUpload value={[]} />
            );
            assert(wrapper.props().value.length === 0);
            assert(wrapper.find('div.next-upload-list-item').length === 1);

            wrapper.setProps({
                value: [{
                    name: 'IMG_20140109_121958.jpg',
                    state: 'uploading',
                    url: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg',
                    imgURL: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg'
                }]
            });

            assert(wrapper.props().value.length === 1);
            assert(wrapper.find('div.next-upload-list-item').length === 2);
        });
    });

    describe('[behavior] Upload Request', () => {
        it('should support header', done => {

            const formatter = res => {
                assert(res.test === 123);
                done();
            }
            const wrapper = mount(<Upload autoUplod={false} data={{'test-data': 'test-data'}} headers={{'test-head': 'test-head'}}  formatter={formatter}/>);
            if (typeof atob === 'function' && typeof Blob  === 'function' && typeof File === 'function') {
                // 模拟文件上传
                let base64 ='iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggkFBTzlUWEwwWTRPSHdBQUFBQkpSVTVFcmtKZ2dnPT0=';

                let binary = fixBinary(atob(base64));

                let blob = new Blob([binary], {type: 'image/png'});

                let file = new File([blob], 'test.png', {type: 'image/png'});
                wrapper.find('input').simulate('change', { target: { files: [ file ] } });
                const request = requests[0];

                assert(request.requestHeaders['test-head'] === 'test-head');
                assert(request.requestBody.get('test-data') === 'test-data');

                requests[0].respond(200, {}, '{"success": true, "url":"https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg", "test": 123}');
            } else {
                done();
            }
        });
        it('should support custom request', done => {
            const pass = {isPass: false};
            const customRequest = function customRequest(options) {
                pass.isPass = true;
                return request(options);
            }
            const onSuccess = function onSuccess() {
                assert(pass.isPass);
                done();
            }
            const wrapper = mount(<Upload autoUplod={false} request={customRequest} onSuccess={onSuccess}/>);
            if (typeof atob === 'function' && typeof Blob  === 'function' && typeof File === 'function') {
                // 模拟文件上传
                let base64 ='iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggkFBTzlUWEwwWTRPSHdBQUFBQkpSVTVFcmtKZ2dnPT0=';

                let binary = fixBinary(atob(base64));

                let blob = new Blob([binary], {type: 'image/png'});

                let file = new File([blob], 'test.png', {type: 'image/png'});
                wrapper.find('input').simulate('change', { target: { files: [ file ] } });
                const request = requests[0];

                request.respond(200, {}, '{"success": true, "url":"https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg", "test": 123}');
            } else {
                done();
            }
        });
        it('should throw error when response json invalid', done => {

            const onError = function onError() {
                done();
            }
            const wrapper = mount(<Upload autoUplod={false} onError={onError}/>);
            if (typeof atob === 'function' && typeof Blob  === 'function' && typeof File === 'function') {
                // 模拟文件上传
                let base64 ='iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggkFBTzlUWEwwWTRPSHdBQUFBQkpSVTVFcmtKZ2dnPT0=';

                let binary = fixBinary(atob(base64));

                let blob = new Blob([binary], {type: 'image/png'});

                let file = new File([blob], 'test.png', {type: 'image/png'});
                wrapper.find('input').simulate('change', { target: { files: [ file ] } });
                const request = requests[0];

                request.respond(200, {}, '{"succe3}');
            } else {
                done();
            }
        });
        it('should throw error when response.success=false', done => {

            const onError = function onError() {
                done();
            }
            const wrapper = mount(<Upload autoUplod={false} onError={onError}/>);
            if (typeof atob === 'function' && typeof Blob  === 'function' && typeof File === 'function') {
                // 模拟文件上传
                let base64 ='iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggkFBTzlUWEwwWTRPSHdBQUFBQkpSVTVFcmtKZ2dnPT0=';

                let binary = fixBinary(atob(base64));

                let blob = new Blob([binary], {type: 'image/png'});

                let file = new File([blob], 'test.png', {type: 'image/png'});
                wrapper.find('input').simulate('change', { target: { files: [ file ] } });
                const request = requests[0];

                request.respond(200, {}, '{"success": false}');
            } else {
                done();
            }
        });
    });
    describe('[behavior] CardUpload Request', () => {
        it('should supprt header', done => {

            const formatter = res => {
                assert(res.test === 123);
                done();
            }
            const wrapper = mount(<CardUpload autoUplod={false} data={{'test-data': 'test-data'}} headers={{'test-head': 'test-head'}}  formatter={formatter}/>);
            if (typeof atob === 'function' && typeof Blob  === 'function' && typeof File === 'function') {
                // 模拟文件上传
                let base64 ='iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggkFBTzlUWEwwWTRPSHdBQUFBQkpSVTVFcmtKZ2dnPT0=';

                let binary = fixBinary(atob(base64));

                let blob = new Blob([binary], {type: 'image/png'});

                let file = new File([blob], 'test.png', {type: 'image/png'});
                wrapper.find('input').simulate('change', { target: { files: [ file ] } });
                const request = requests[0];

                assert(request.requestHeaders['test-head'] === 'test-head');
                assert(request.requestBody.get('test-data') === 'test-data');

                requests[0].respond(200, {}, '{"success": true, "url":"https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg", "test": 123}');
            } else {
                done();
            }
        });
        it('should support onChange/onRemove events', (done) => {
            const onChange = sinon.spy();
            const onRemove = sinon.spy();
            const wrapper = mount(<CardUpload defaultValue={[{
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
            }]} onChange={onChange} onRemove={onRemove} />);

            wrapper.find('i.next-icon-ashbin').at(0).simulate('click');
            assert(onRemove.calledOnce);
            assert(onChange.calledOnce);
            assert(wrapper.find('.next-upload-list-item-wrapper').length === 2);
            done();
        });
        it('should support onChange/onCancel events', (done) => {
            const onChange = sinon.spy();
            const onCancel = sinon.spy();
            const wrapper = mount(<CardUpload defaultValue={[{
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
            }]} onChange={onChange} onCancel={onCancel} />);

            wrapper.find('.next-upload-list-item-handler .next-btn').at(0).simulate('click');
            assert(onCancel.calledOnce);
            assert(onChange.calledOnce);
            assert(wrapper.find('.next-upload-list-item-wrapper').length === 2);
            done();
        });
        it('should support change Data/Action/Headers in BeforeUpload', (done) => {
            const beforeUpload = () => {};

            class App extends React.Component {
                constructor() {
                    super();
                    this.state = {
                        action: '/upload/files/123',
                        data: {'test-data': 'test-data'},
                        headers: {'test-head': 'test-head'},
                    };
                }

                beforeUpload = (file, options) => {
                    return {
                        action: '/upload/files/beforeUpload',
                        data: {'test-data': 'beforeUpload'},
                        headers: {'test-head': 'beforeUpload'},
                    };
                }
                render() {
                    return <CardUpload autoUplod={false}  beforeUpload={this.beforeUpload} {...this.state}/>;
                }
            };
            const wrapper = mount(<App />);

            if (typeof atob === 'function' && typeof Blob  === 'function' && typeof File === 'function') {
                // 模拟文件上传
                let base64 ='iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggkFBTzlUWEwwWTRPSHdBQUFBQkpSVTVFcmtKZ2dnPT0=';

                let binary = fixBinary(atob(base64));

                let blob = new Blob([binary], {type: 'image/png'});

                let file = new File([blob], 'test.png', {type: 'image/png'});
                wrapper.find('input').simulate('change', { target: { files: [ file ] } });
                const request = requests[0];

                assert(request.url === '/upload/files/beforeUpload');
                assert(request.requestHeaders['test-head'] === 'beforeUpload');
                assert(request.requestBody.get('test-data') === 'beforeUpload');
                requests[0].respond(200, {}, '{"success": true, "url":"https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg", "test": 123}');
                done();
            } else {
                done();
            }
        });
    });
});
