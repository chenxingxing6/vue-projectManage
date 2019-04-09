/**
 * Home 自定义路由
 */
export default [
  /*  {
        //任务看板
        name: 'files',
        path: '/project/space/files',
        component: resolve => require(['@/views/project/space/files'], resolve),
        meta: {model: 'Project', info: {show_slider: true, is_inner: false, pid: 122, id: 152, innerText: '导航'}},
        children: [
            {
                //任务详情
                name: 'taskdetail',
                path: 'detail/:taskCode',
                component: resolve => require(['@/views/project/space/taskdetail'], resolve),
                meta: {model: 'Project', info: {show_slider: false}},
            },
        ]
    },*/
    {
        //任务看板
        name: 'inviteFromLink',
        path: '/invite_from_link/:code',
        component: resolve => require(['@/views/common/inviteFromLink'], resolve),
        meta: {model: 'Common', info: {show_slider: false}},
    },
    {
        name: 'demo',
        path: '/demo',
        component: resolve => require(['@/views/member/demo'], resolve),
        meta: {model: 'diskdemo', info:{show_slider: false}},
    },
    {
        name: 'detail',
        path: '/followuser/detail',
        component: resolve => require(['@/views/followuser/detail'], resolve),
        meta: {model: 'followuser', info:{show_slider: false}},
    },
 /*   {
        name: 'files',
        path: '/disk/files',
        component: resolve => require(['@/views/disk/files'], resolve),
        meta: {model: 'diskdemo', info:{show_slider: false}},
    },*/
    /*{
        name: 'overview',
        path: '/disk/overview',
        component: resolve => require(['@/views/disk/overview'], resolve),
        meta: {model: 'diskdemo', info:{show_slider: false}},
    }*/
];
