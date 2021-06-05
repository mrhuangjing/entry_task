/**
 * request请求组件
 */
/**
 * 使用方法：
 * const request = require('@webank/request');
 * request.init(options, requestInterceptor, responseInterceptor); // 可以省略  采用默认配置
 * request.get({
 *     url: 'url',
 *     data: {
 *          k1: v1,
 *          k2: v2
 *          ...
 *     },
 *     timeout: '12000',
 *     responseType: 'json'
 *     ...
 * })
 * .then(res => {
 * 
 * })
 * .catch(err => {
 * 
 * });
 */
const axios = require('axios');

let instance = null;

function create (...args) {
    const opts = args[0] || {};
    const requestInterceptor = args[1] || defaultInterceptor;
    const responseInterceptor = args[2] || defaultInterceptor;

    const config = Object.assign({
        timeout: 8000, // 请求超时时间 默认8秒
        responseType: "json", // 返回数据格式默认为json
    }, opts);

    Object.assign(config.headers || {}, {
        "Content-Type": "application/json;charset=utf-8",
        "withCredentials": true,
        "Authorization": "authorization",
        "Access-Control-Allow-Credentials": true,
        'Cache-Control': 'no-cache',
        "Access-Control-Allow-Origin": "*"
    });

    const req = axios.create(config);

    // const req = axios.create(Object.assign({
    //     timeout: 8000, // 请求超时时间 默认8秒
    //     responseType: "json", // 返回数据格式默认为json
    //     headers: {
    //         "Content-Type": "application/json;charset=utf-8",
    //         "withCredentials": true,
    //         "Authorization": "authorization",
    //         "Access-Control-Allow-Credentials": true,
    //         'Cache-Control': 'no-cache',
    //         "Access-Control-Allow-Origin": "*"
    //     }
    // }, opts));

    // 添加请求拦截器
    req.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        return requestInterceptor(config);
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 添加响应拦截器
    req.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
            let data = response.data;

            return responseInterceptor(data);
        }
        return {
            code: -1,
            msg: '响应状态码status异常'
        };
    }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });

    instance = req;
}

// 占位拦截器
function defaultInterceptor (config) {
    return config;
}

function appendQuery(url, query) {
    if (query == '') return url;
    return (url + '&' + query).replace(/[&?]{1,2}/, '?');
}

function deepCopy(source) {
    if (source instanceof FormData) return source; // 针对FormData实例，直接返回
    let result = source instanceof Array ? [] : {};
    for (let key in source) {
        result[key] = typeof source[key]==='object'? deepCopy(source[key]): source[key];
    }
    return result;
}

function addMethod(opts) {
    if (opts.method.toLowerCase() === 'get') {
        if (opts.data) {
            opts.params = opts.data;
            delete opts.data;
        }
        opts.url = appendQuery(opts.url, '_=' + Date.now());
    }

    return instance(opts);
}

const request = {
    /**
     * @param  {options} 实例选项设置
     * @param  {requestInterceptor} 请求拦截器
     * @param  {responseInterceptor} 响应拦截器
     */
    init (...args) {
        create.apply(null, args);
    }
};

const methods = ['post', 'get', 'put', 'delete']; // 请求方法列表

methods.forEach(el => {
    request[el] = (options) => {
        if (!instance) { // 帮使用者调用init方法
            request.init();
        }
        if (!options.url) {
            console.log('%c来自request的提示: 请设置请求url', 'color: red; font-size: 20px;');
            return Promise.reject('请设置请求url'); // 未提供请求url直接打回
        }
        let opts = deepCopy(options); // 深拷贝输入配置项
        opts.method = el; // 指定请求方法
        return addMethod(opts);
    };
});

export default request;
// module.exports = request;
