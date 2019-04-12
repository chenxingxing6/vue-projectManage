import $http from '@/assets/js/http'

/*登陆*/
export function Login(data) {
    //return $http.post('/mock/login');
    return $http.post('login', data);
}


/*获取菜单*/
export function getMenu() {
    return $http.post('/mock/getMenu');
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


/*获取分享列表*/
export function getShares(data) {
    return $http.get('/mock/getShares');
}


/*获取资源列表*/
export function getSource(data) {
    return $http.get('/mock/getSource');
}

/*文件重命名*/
export function fileRename(data) {
    return $http.post('/mock/file/rename');
}

/*获取操作记录*/
export function getOperateLog(data) {
    return $http.post('/mock/getOperateLog');
}


/*获取首页数据*/
export function getIndexData(data) {
    return $http.post('/mock/getIndexData');
}


/*分享查询分享的用户*/
export function findUser(data) {
    return $http.post('/mock/findUser');
}

/*分享给用户*/
export function shareToUser(data) {
    return $http.post('/mock/file/rename');
}

/*创建分享链接*/
export function createShareUrl(data) {
    return $http.post('/mock/createShareUrl');
}





