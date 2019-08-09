{"title":"级联选择","meta":{"title":"级联选择","description":"\n<p>使用 Select 构建级联选择框</p>\n","order":"4"},"codes":{"jsx":"import { Select } from '@alifd/next';\n\nconst provinceData = ['Zhejiang', 'Hubei', 'Jiangsu'];\nconst cityData = {\n    Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],\n    Hubei: ['Wuhan', 'Yichang', 'Jingzhou'],\n    Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang']\n};\n\nclass Demo extends React.Component {\n    constructor(props) {\n        super(props);\n\n        this.state = {\n            data: [],\n            disabled: true\n        };\n\n        this.handleProvinceChange = this.handleProvinceChange.bind(this);\n        this.handleCityChange = this.handleCityChange.bind(this);\n    }\n\n    handleProvinceChange(value) {\n        const data = cityData[value];\n        this.setState({data, province: value, city: '', disabled: !data});\n    }\n\n    handleCityChange(value) {\n        this.setState({city: value});\n        console.log(this.state.province, value);\n    }\n\n    render() {\n        const {data, disabled, province, city} = this.state;\n\n        return (\n            <div className=\"demo-container\">\n                <Select placeholder=\"Select Province\" dataSource={provinceData} value={province} onChange={this.handleProvinceChange} />\n                <Select placeholder=\"Select City\" dataSource={data} value={city} onChange={this.handleCityChange} disabled={disabled}/>\n            </div>\n        );\n    }\n}\n\nReactDOM.render(<Demo/>, mountNode);\n","css":".next-select {\n    margin-right:10px;\n}\n\n.demo-container {\n    background-color: #F8F8F8;\n    padding: 16px;\n}\n"},"body":"\n\n````jsx\nimport { Select } from '@alifd/next';\n\nconst provinceData = ['Zhejiang', 'Hubei', 'Jiangsu'];\nconst cityData = {\n    Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],\n    Hubei: ['Wuhan', 'Yichang', 'Jingzhou'],\n    Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang']\n};\n\nclass Demo extends React.Component {\n    constructor(props) {\n        super(props);\n\n        this.state = {\n            data: [],\n            disabled: true\n        };\n\n        this.handleProvinceChange = this.handleProvinceChange.bind(this);\n        this.handleCityChange = this.handleCityChange.bind(this);\n    }\n\n    handleProvinceChange(value) {\n        const data = cityData[value];\n        this.setState({data, province: value, city: '', disabled: !data});\n    }\n\n    handleCityChange(value) {\n        this.setState({city: value});\n        console.log(this.state.province, value);\n    }\n\n    render() {\n        const {data, disabled, province, city} = this.state;\n\n        return (\n            <div className=\"demo-container\">\n                <Select placeholder=\"Select Province\" dataSource={provinceData} value={province} onChange={this.handleProvinceChange} />\n                <Select placeholder=\"Select City\" dataSource={data} value={city} onChange={this.handleCityChange} disabled={disabled}/>\n            </div>\n        );\n    }\n}\n\nReactDOM.render(<Demo/>, mountNode);\n````\n\n````css\n.next-select {\n    margin-right:10px;\n}\n\n.demo-container {\n    background-color: #F8F8F8;\n    padding: 16px;\n}\n````","html":"<script>(function(){'use strict';\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _next = require('@alifd/next');\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar provinceData = ['Zhejiang', 'Hubei', 'Jiangsu'];\nvar cityData = {\n    Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],\n    Hubei: ['Wuhan', 'Yichang', 'Jingzhou'],\n    Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang']\n};\n\nvar Demo = function (_React$Component) {\n    _inherits(Demo, _React$Component);\n\n    function Demo(props) {\n        _classCallCheck(this, Demo);\n\n        var _this = _possibleConstructorReturn(this, (Demo.__proto__ || Object.getPrototypeOf(Demo)).call(this, props));\n\n        _this.state = {\n            data: [],\n            disabled: true\n        };\n\n        _this.handleProvinceChange = _this.handleProvinceChange.bind(_this);\n        _this.handleCityChange = _this.handleCityChange.bind(_this);\n        return _this;\n    }\n\n    _createClass(Demo, [{\n        key: 'handleProvinceChange',\n        value: function handleProvinceChange(value) {\n            var data = cityData[value];\n            this.setState({ data: data, province: value, city: '', disabled: !data });\n        }\n    }, {\n        key: 'handleCityChange',\n        value: function handleCityChange(value) {\n            this.setState({ city: value });\n            console.log(this.state.province, value);\n        }\n    }, {\n        key: 'render',\n        value: function render() {\n            var _state = this.state,\n                data = _state.data,\n                disabled = _state.disabled,\n                province = _state.province,\n                city = _state.city;\n\n\n            return React.createElement(\n                'div',\n                { className: 'demo-container' },\n                React.createElement(_next.Select, { placeholder: 'Select Province', dataSource: provinceData, value: province, onChange: this.handleProvinceChange }),\n                React.createElement(_next.Select, { placeholder: 'Select City', dataSource: data, value: city, onChange: this.handleCityChange, disabled: disabled })\n            );\n        }\n    }]);\n\n    return Demo;\n}(React.Component);\n\nReactDOM.render(React.createElement(Demo, null), mountNode);})()</script><div class=\"highlight\"><pre class=\"language-jsx\"><code class=\"language-jsx\"><span class=\"token keyword\">import</span> <span class=\"token punctuation\">{</span> Select <span class=\"token punctuation\">}</span> <span class=\"token keyword\">from</span> <span class=\"token string\">'@alifd/next'</span><span class=\"token punctuation\">;</span>\n\n<span class=\"token keyword\">const</span> provinceData <span class=\"token operator\">=</span> <span class=\"token punctuation\">[</span><span class=\"token string\">'Zhejiang'</span><span class=\"token punctuation\">,</span> <span class=\"token string\">'Hubei'</span><span class=\"token punctuation\">,</span> <span class=\"token string\">'Jiangsu'</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">;</span>\n<span class=\"token keyword\">const</span> cityData <span class=\"token operator\">=</span> <span class=\"token punctuation\">{</span>\n    Zhejiang<span class=\"token punctuation\">:</span> <span class=\"token punctuation\">[</span><span class=\"token string\">'Hangzhou'</span><span class=\"token punctuation\">,</span> <span class=\"token string\">'Ningbo'</span><span class=\"token punctuation\">,</span> <span class=\"token string\">'Wenzhou'</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">,</span>\n    Hubei<span class=\"token punctuation\">:</span> <span class=\"token punctuation\">[</span><span class=\"token string\">'Wuhan'</span><span class=\"token punctuation\">,</span> <span class=\"token string\">'Yichang'</span><span class=\"token punctuation\">,</span> <span class=\"token string\">'Jingzhou'</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">,</span>\n    Jiangsu<span class=\"token punctuation\">:</span> <span class=\"token punctuation\">[</span><span class=\"token string\">'Nanjing'</span><span class=\"token punctuation\">,</span> <span class=\"token string\">'Suzhou'</span><span class=\"token punctuation\">,</span> <span class=\"token string\">'Zhenjiang'</span><span class=\"token punctuation\">]</span>\n<span class=\"token punctuation\">}</span><span class=\"token punctuation\">;</span>\n\n<span class=\"token keyword\">class</span> <span class=\"token class-name\">Demo</span> <span class=\"token keyword\">extends</span> <span class=\"token class-name\">React<span class=\"token punctuation\">.</span>Component</span> <span class=\"token punctuation\">{</span>\n    <span class=\"token function\">constructor</span><span class=\"token punctuation\">(</span><span class=\"token parameter\">props</span><span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n        <span class=\"token keyword\">super</span><span class=\"token punctuation\">(</span>props<span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n\n        <span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span>state <span class=\"token operator\">=</span> <span class=\"token punctuation\">{</span>\n            data<span class=\"token punctuation\">:</span> <span class=\"token punctuation\">[</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">,</span>\n            disabled<span class=\"token punctuation\">:</span> <span class=\"token boolean\">true</span>\n        <span class=\"token punctuation\">}</span><span class=\"token punctuation\">;</span>\n\n        <span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span>handleProvinceChange <span class=\"token operator\">=</span> <span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span><span class=\"token function\">handleProvinceChange</span><span class=\"token punctuation\">.</span><span class=\"token function\">bind</span><span class=\"token punctuation\">(</span><span class=\"token keyword\">this</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n        <span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span>handleCityChange <span class=\"token operator\">=</span> <span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span><span class=\"token function\">handleCityChange</span><span class=\"token punctuation\">.</span><span class=\"token function\">bind</span><span class=\"token punctuation\">(</span><span class=\"token keyword\">this</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n    <span class=\"token punctuation\">}</span>\n\n    <span class=\"token function\">handleProvinceChange</span><span class=\"token punctuation\">(</span><span class=\"token parameter\">value</span><span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n        <span class=\"token keyword\">const</span> data <span class=\"token operator\">=</span> cityData<span class=\"token punctuation\">[</span>value<span class=\"token punctuation\">]</span><span class=\"token punctuation\">;</span>\n        <span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span><span class=\"token function\">setState</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">{</span>data<span class=\"token punctuation\">,</span> province<span class=\"token punctuation\">:</span> value<span class=\"token punctuation\">,</span> city<span class=\"token punctuation\">:</span> <span class=\"token string\">''</span><span class=\"token punctuation\">,</span> disabled<span class=\"token punctuation\">:</span> <span class=\"token operator\">!</span>data<span class=\"token punctuation\">}</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n    <span class=\"token punctuation\">}</span>\n\n    <span class=\"token function\">handleCityChange</span><span class=\"token punctuation\">(</span><span class=\"token parameter\">value</span><span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n        <span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span><span class=\"token function\">setState</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">{</span>city<span class=\"token punctuation\">:</span> value<span class=\"token punctuation\">}</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n        console<span class=\"token punctuation\">.</span><span class=\"token function\">log</span><span class=\"token punctuation\">(</span><span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span>state<span class=\"token punctuation\">.</span>province<span class=\"token punctuation\">,</span> value<span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n    <span class=\"token punctuation\">}</span>\n\n    <span class=\"token function\">render</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n        <span class=\"token keyword\">const</span> <span class=\"token punctuation\">{</span>data<span class=\"token punctuation\">,</span> disabled<span class=\"token punctuation\">,</span> province<span class=\"token punctuation\">,</span> city<span class=\"token punctuation\">}</span> <span class=\"token operator\">=</span> <span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span>state<span class=\"token punctuation\">;</span>\n\n        <span class=\"token keyword\">return</span> <span class=\"token punctuation\">(</span>\n            <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>div</span> <span class=\"token attr-name\">className</span><span class=\"token attr-value\"><span class=\"token punctuation\">=</span><span class=\"token punctuation\">\"</span>demo-container<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span><span class=\"token plain-text\">\n                </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token class-name\">Select</span></span> <span class=\"token attr-name\">placeholder</span><span class=\"token attr-value\"><span class=\"token punctuation\">=</span><span class=\"token punctuation\">\"</span>Select Province<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">dataSource</span><span class=\"token script language-javascript\"><span class=\"token script-punctuation punctuation\">=</span><span class=\"token punctuation\">{</span>provinceData<span class=\"token punctuation\">}</span></span> <span class=\"token attr-name\">value</span><span class=\"token script language-javascript\"><span class=\"token script-punctuation punctuation\">=</span><span class=\"token punctuation\">{</span>province<span class=\"token punctuation\">}</span></span> <span class=\"token attr-name\">onChange</span><span class=\"token script language-javascript\"><span class=\"token script-punctuation punctuation\">=</span><span class=\"token punctuation\">{</span><span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span>handleProvinceChange<span class=\"token punctuation\">}</span></span> <span class=\"token punctuation\">/></span></span><span class=\"token plain-text\">\n                </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token class-name\">Select</span></span> <span class=\"token attr-name\">placeholder</span><span class=\"token attr-value\"><span class=\"token punctuation\">=</span><span class=\"token punctuation\">\"</span>Select City<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">dataSource</span><span class=\"token script language-javascript\"><span class=\"token script-punctuation punctuation\">=</span><span class=\"token punctuation\">{</span>data<span class=\"token punctuation\">}</span></span> <span class=\"token attr-name\">value</span><span class=\"token script language-javascript\"><span class=\"token script-punctuation punctuation\">=</span><span class=\"token punctuation\">{</span>city<span class=\"token punctuation\">}</span></span> <span class=\"token attr-name\">onChange</span><span class=\"token script language-javascript\"><span class=\"token script-punctuation punctuation\">=</span><span class=\"token punctuation\">{</span><span class=\"token keyword\">this</span><span class=\"token punctuation\">.</span>handleCityChange<span class=\"token punctuation\">}</span></span> <span class=\"token attr-name\">disabled</span><span class=\"token script language-javascript\"><span class=\"token script-punctuation punctuation\">=</span><span class=\"token punctuation\">{</span>disabled<span class=\"token punctuation\">}</span></span><span class=\"token punctuation\">/></span></span><span class=\"token plain-text\">\n            </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>div</span><span class=\"token punctuation\">></span></span>\n        <span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n    <span class=\"token punctuation\">}</span>\n<span class=\"token punctuation\">}</span>\n\nReactDOM<span class=\"token punctuation\">.</span><span class=\"token function\">render</span><span class=\"token punctuation\">(</span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token class-name\">Demo</span></span><span class=\"token punctuation\">/></span></span><span class=\"token punctuation\">,</span> mountNode<span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span></code></pre></div><style type=\"text/css\">.next-select {\n    margin-right:10px;\n}\n\n.demo-container {\n    background-color: #F8F8F8;\n    padding: 16px;\n}</style><div class=\"highlight\"><pre class=\"language-css\"><code class=\"language-css\"><span class=\"token selector\">.next-select</span> <span class=\"token punctuation\">{</span>\n    <span class=\"token property\">margin-right</span><span class=\"token punctuation\">:</span>10px<span class=\"token punctuation\">;</span>\n<span class=\"token punctuation\">}</span>\n\n<span class=\"token selector\">.demo-container</span> <span class=\"token punctuation\">{</span>\n    <span class=\"token property\">background-color</span><span class=\"token punctuation\">:</span> #F8F8F8<span class=\"token punctuation\">;</span>\n    <span class=\"token property\">padding</span><span class=\"token punctuation\">:</span> 16px<span class=\"token punctuation\">;</span>\n<span class=\"token punctuation\">}</span></code></pre></div>"}