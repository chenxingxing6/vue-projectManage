import $http from '@/assets/js/http'




/*获取菜单*/
export function getMenu() {
    return $http.post('/mock/getMenu');
}


/*登陆*/
export function Login() {
    return $http.post('/mock/login');
}


/*获取通知*/
export function getNotice(page, pageSize) {
    return $http.post('/mock/getNotice', {page: page, pageSize: pageSize});
}


/*获取验证码*/
export function getCaptcha(mobile) {
    return $http.post('/mock/getCaptcha', {mobile: mobile});
}

/*获取文件列表*/
export function getFiles(data) {
    return $http.post('/mock/getFiles', data);
}

/*获取文件上传日志*/
export function getFileLog(data) {
    return $http.post('/mock/getFileLog', data);
}

/*获取关注用户列表*/
export function getFollowUser(data) {
    return $http.post('/mock/getFollowUser');
}

