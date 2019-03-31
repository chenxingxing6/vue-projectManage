import $http from '@/assets/js/http'

export function list(data) {
    return $http.post('project/project', data);
}
export function selfList(data) {
    return $http.post('project/project/selfList', data);
}

export function doData(data) {
    let url = 'project/project/save';
    if (data.projectCode) {
        url = 'project/project/edit';
    }
    return $http.post(url, data);
}

export function quit(code) {
    return $http.post('project/project/quit', {projectCode: code});
}
export function recycle(code) {
    return $http.post('project/project/recycle', {projectCode: code});
}
export function recovery(code) {
    return $http.post('project/project/recovery', {projectCode: code});
}
export function archive(code) {
    return $http.post('project/project/archive', {projectCode: code});
}
export function recoveryArchive(code) {
    return $http.post('project/project/recoveryArchive', {projectCode: code});
}
export function del(code) {
    return $http.post('project/project/delete', {projectCode: code});
}
export function read(code) {
    return $http.post('project/project/read', {projectCode: code});
}
