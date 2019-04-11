import {message,} from 'ant-design-vue'
import Axios from "axios"
import * as utils from './utils'
import {getStore} from './storage'
import $store from '../../store/index';
import $router from '../../router/index';
import {notice} from './notice';
import config from "../../config/config";

const HOME_PAGE = config.HOME_PAGE;
const crossDomain = config.crossDomain;

let axiosConfig = {};
if (crossDomain) {
    axiosConfig.withCredentials = true;
    axiosConfig.crossDomain = true;
}
const $http = Axios.create(axiosConfig);

// Before request
$http.interceptors.request.use(
    config => {
        //正在请求更新token时，其他接口等待
        config.url = utils.getApiUrl(config.url);
        if (config.method === 'post') {
            const querystring = require('querystring');
            config.data = querystring.stringify(config.data);
        }
        /*如果是mock数据，就用get方法*/
        if (config.url.indexOf("mock") >=0){
            config.method = 'get';
        }
      /*  let tokenList = getStore('tokenList', true);
        if (tokenList) {
            let accessToken = tokenList.accessToken;
            let tokenType = tokenList.tokenType;
            config.headers.Authorization = `${tokenType} ${accessToken}`;
        }*/
       /* let organization = getStore('currentOrganization', true);
        if (organization) {
            config.headers.organizationCode = organization.code;
        }*/
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// After request
$http.interceptors.response.use(
    response => {
        response = response.data;
        response.code = Number(response.code);
        switch (response.code) {
            case 200:
                response.msg !== '' && notice(response.msg, 'message', 'success');
                return Promise.resolve(response);
            case 401:
                $router.replace('/member/login?redirect=' + $router.currentRoute.fullPath);
                $store.dispatch('SET_LOGOUT');
                return Promise.resolve(response);
            case 403:
                notice({
                    title: response.msg !== '' ? response.msg : '无权限操作资源，访问被拒绝',
                }, 'notice', 'error', 5);
                return Promise.resolve(response);
            case 4031:
                //无权限操作资源
                notice({
                    title: response.msg !== '' ? response.msg : '无权限操作资源，访问被拒绝',
                }, 'notice', 'error', 5);
                $router.replace(HOME_PAGE);
                return Promise.resolve(response);
            case 404:
                //资源不存在
                notice({
                    title: response.msg !== '' ? response.msg : '资源不存在',
                }, 'notice', 'warning', 5);
                $router.replace(HOME_PAGE);
                return Promise.resolve(response);
        }
        if (response.code === 200) {
            notice({
                title: '请求错误 ' + response.code,
                desc: response.msg
            }, 'notice', 'warning', 5);
            return Promise.resolve(response);
        } else {
            response.msg !== '' && notice({
                title: response.msg,
            }, 'notice', 'error', 5);
            return Promise.resolve(response);
        }
    },
    error => {
        const response = error.response.data;
        console.log(response);
        response.code = Number(response.code);
        message.destroy();
        switch (response.code) {
            default:
                response.msg !== '' && notice({
                    title: response.msg,
                }, 'notice', 'error', 5);
                return Promise.reject(error);
        }
    }
);

export default $http;
