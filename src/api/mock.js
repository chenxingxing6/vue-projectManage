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

