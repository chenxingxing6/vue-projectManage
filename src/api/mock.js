import $http from '@/assets/js/http'
import {getApiUrl} from "../assets/js/utils";
import {getStore} from "../assets/js/storage";

/**---------------登陆--------------**/
/*登陆*/
export function Login(data) {
    return $http.post('login', data);
}

/*获取验证码*/
export function getCaptcha(mobile) {
    return $http.post('getCaptcha', {mobile: mobile});
}

/*获取qq授页面*/
export function getQqLoginUrl() {
    return $http.post('qq/login');
}

/*获取qq关联url*/
export function getQqConnUrl() {
    return $http.post('qq/conn');
}


/*获取qq登陆用户信息*/
export function qqCallback() {
    return $http.post('qq/callback');
}

/*获取微博授页面*/
export function getSinaLoginUrl() {
    return $http.post('sina/login');
}

/*忘記密碼*/
export function forget(data) {
    return $http.post('forget', data);
}


/**---------------菜单--------------**/
/*获取菜单*/
export function getMenu() {
    return $http.post('getMenu');
}

/*获取通知*/
export function getNotice(data) {
    return $http.post('getNotice', data);
}




/**---------------首页--------------**/
/*获取操作记录*/
export function getOperateLog(data) {
    return $http.post('/getOperateLog', data);
}


/*获取首页数据*/
export function getIndexData(data) {
    return $http.post('/getIndexData', data);
}



/**---------------网盘--------------**/
/*获取文件上传日志*/
export function getFileLog(data) {
    return $http.post('/getFileLog', data);
}

/*获取文件列表*/
export function getFiles(data) {
    return $http.post('/getFiles', data);
}


/*分享查询分享的用户*/
export function findToShareUser(userName) {
    return $http.post('findToShareUser', {userName: userName});
}

/*分享给用户*/
export function shareToUser(userId, fileId) {
    return $http.post('/toShare', {userId: userId, fileId: fileId});
}

/*创建分享链接*/
export function createShareUrl(data) {
    return $http.post('createLink', data);
}

/*文件加入网盘*/
export function addDisk(fileId) {
    return $http.post('addDisk', {fileId: fileId});
}

/*我的网盘删除文件*/
export function delFileById(fileId) {
    return $http.post('delFileById', {fileId: fileId});
}


/**---------分享--------**/
/*获取分享列表*/
export function getShares(data) {
    return $http.post('getShares', data);
}

export function delByShareId(data) {
    return $http.post('delByShareId', data);
}

export function uploadFiles() {
    return "http://localhost:9000/front/app/uploadFile";
}

export function getUserId(userId) {
    let accessToken = userId;
    return {userId: `${accessToken}`};
}

export function getLinkInfo(data) {
    return $http.post('getLinkInfo', data);
}



/**--------资源库-------**/
/*获取网盘文件类型*/
export function getSourceType() {
    return $http.post('getSourceType');
}

/*获取资源列表*/
export function getSource(data) {
    return $http.post('getSource', data);
}


/*获取资源列表*/
export function fileDownload(data) {
    return $http.post('fileDownload', data);
}

/*文件重命名*/
export function fileRename(data) {
    return $http.post('/file/rename', data);
}




/**--------关注用户-------**/
/*获取关注用户列表*/
export function getFollowUser(data) {
    return $http.post('getFollowUser', data);
}
export function getUserDetail(data) {
    return $http.post('getUserDetail', data);
}

export function addOrCancleUser(data) {
    return $http.post('addOrCancleUser', data);
}



/**--------更多-------**/
export function editPersonal(data) {
    return $http.post('updateUserInfo', data);
}

export function _bindMail(data) {
    return $http.post('bindUpdate', data);
}

export function _bindMobile(data) {
    return $http.post('bindUpdate', data);
}

export function editPassword(data) {
    return $http.post('bindUpdate', data);
}



