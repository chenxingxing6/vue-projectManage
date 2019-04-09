import $http from '@/assets/js/http'


export function del(code) {
    return $http.post('project/task_tag/delete', {tagCode: code});
}


export function edit(data) {
    return $http.post('project/task_tag/edit', data);
}


export function sort(preCode, nextCode, projectCode) {
    return $http.post('project/task_stages/sort', {preCode: preCode, nextCode: nextCode, projectCode: projectCode});
}
