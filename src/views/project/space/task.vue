<template>

</template>

<script>
    import {mapState} from 'vuex'
    import _ from 'lodash'
    import moment from 'moment'
    import draggable from 'vuedraggable'
    import inviteProjectMember from '@/components/project/inviteProjectMember'
    import projectConfig from '@/components/project/projectConfig'
    import RecycleBin from '@/components/project/recycleBin'

    import {list as getTaskStages, sort, tasks as getTasks} from "../../../api/taskStages";
    import {read as getProject} from "../../../api/project";
    import {inviteMember, list as getProjectMembers, removeMember} from "../../../api/projectMember";
    import {save as createTask, taskDone, sort as sortTask, recycleBatch, batchAssignTask} from "../../../api/task";
    import {save as createState, edit as editStage, del as delStage} from "../../../api/taskStages";
    import {checkResponse} from "../../../assets/js/utils";
    import {formatTaskTime} from "../../../assets/js/dateTime";
    import {collect} from "../../../api/projectCollect";
    import {notice} from "../../../assets/js/notice";

    export default {
        name: "project-space-task",
        components: {
            RecycleBin,
            draggable,
            inviteProjectMember,
            projectConfig
        },
        data() {
            return {
                code: this.$route.params.code,
                loading: true,
                project: {},
                stageName: '',
                task: {}, //当前任务
                taskStages: [], //任务列表
                defaultExecutor: {},//默认执行人
                projectMembers: [], //项目成员列表
                projectMembersCopy: [], //项目成员列表副本
                createTaskLoading: false, //创建任务loading
                showCreateStage: false,

                preCode: '',
                nextCode: '',

                stageKeys: [],
                stageModal: {
                    form: this.$form.createForm(this),
                    stageCode: '',
                    stageIndex: 0,
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '编辑列表',
                },

                slideMenuKey: '',
                showInviteMember: false,
                inviteMemberDraw: {
                    visible: false,
                    keyword: '',
                    searching: false,
                    list: [],
                },
                configDraw: {
                    visible: false,
                },

                /*项目设置*/
                projectModal: {
                    modalStatus: false,
                    modalTitle: '项目设置',
                },
                /*回收站*/
                recycleModal: {
                    modalStatus: false,
                    modalTitle: '查看回收站',
                },

                /*项目成员*/
                projectMemberModal: {
                    loading: false,
                    currentStageIndex: 0,
                    modalStatus: false,
                    modalTitle: '设置任务执行者',
                },
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo
            }),
            scrollOps() {
                return {
                    rail: {
                        background: '#e5e5e5',
                        opacity: 1
                    },
                    bar: {
                        keepShow: true
                    }
                }
            }
        },
        watch: {
            $route(to, from) {
                if (from.name == 'taskdetail') {
                    const stageIndex = from.query.from;
                    if (stageIndex != undefined) {
                        getTasks({stageCode: this.taskStages[stageIndex].code}).then((res) => {
                            this.taskStages[stageIndex].tasksLoading = false;
                            this.taskStages[stageIndex].tasks = res.data;
                            let doneTasks = this.taskStages[stageIndex].doneTasks = [];
                            let unDoneTasks = this.taskStages[stageIndex].unDoneTasks = [];
                            res.data.forEach((task) => {
                                if (task.done) {
                                    doneTasks.push(task);
                                } else {
                                    unDoneTasks.push(task);
                                }
                            });
                        });
                    }
                }
            },
            inviteMemberDraw: {
                handler(newVal) {
                    if (newVal.visible) {
                        this.slideMenuKey = 'member';
                    } else {
                        this.slideMenuKey = false;
                    }
                    if (newVal.keyword) {
                        this.searchInviteMember();
                    }
                },
                deep: true
            },
            configDraw: {
                handler(newVal) {
                    if (newVal.visible) {
                        this.slideMenuKey = 'config';
                    } else {
                        this.slideMenuKey = false;
                    }
                },
                deep: true
            },
            showInviteMember(val) {
                if (!val) {
                    this.getProjectMembers();
                }
            },
        },
        created() {
            this.defaultExecutor = this.userInfo;
            this.getProject();
            this.getProjectMembers();
            this.init();
        },
        methods: {
            init() {
                this.getTaskStages();
            },
            getProject() {
                this.loading = true;
                getProject(this.code).then((res) => {
                    this.loading = false;
                    this.project = res.data;
                });
            },
            getProjectMembers() {
                getProjectMembers({projectCode: this.code, pageSize: 100}).then((res) => {
                    this.projectMembers = res.data.list;
                    this.projectMembersCopy = res.data.list;
                });
            },
            getTaskStages() {
                getTaskStages({projectCode: this.code, pageSize: 30}).then((res) => {
                    this.taskStages = res.data.list;
                    if (this.taskStages) {
                        this.taskStages.forEach((v) => {
                            getTasks({stageCode: v.code}).then((res) => {
                                let canNotReadCount = 0;
                                res.data.forEach((task) => {
                                    if (!task.canRead) {
                                        canNotReadCount++;
                                    }
                                    if (task.done) {
                                        v.doneTasks.push(task);
                                    } else {
                                        v.unDoneTasks.push(task);
                                    }
                                });
                                v.canNotReadCount = canNotReadCount;
                                v.tasksLoading = false;
                                v.tasks = res.data;
                            })
                        })
                    }
                })
            },
            filterTask(tasks, done) {
                return tasks.filter(item => item.done == done);
            },
            //显示添加任务卡片
            showTaskCard(index = false, show = true) {
                this.taskStages.forEach((v) => {
                    v.showTaskCard = false;
                });
                if (index === false) {
                    return false;
                }
                this.taskStages[index].showTaskCard = show;
                this.$nextTick(() => {
                    //滚动创建到创建窗口
                    this.$refs[index + '-stage'][0].scrollIntoView('#card' + index);
                    this.$refs[`inputTaskName${index}`][0].focus();

                });
            },
            selectExecutor({key}) {
                this.defaultExecutor = this.projectMembers[key];
            },
            //准备添加任务
            createTask(stageCode, stageIndex) {
                if (!this.task.name) {
                    this.$message.warning('任务内容不能为空', 2);
                    return false
                }
                this.task.stage_code = stageCode;
                this.task.project_code = this.code;
                this.task.assign_to = this.defaultExecutor.code;
                //判断换行，添加多条任务
                // let titles = this.task.name.split("\n");
                // if (titles.length > 1) {
                //     this.$confirm({
                //         title: '任务提示',
                //         content: `系统检测到你输入了 ${titles.length} 行内容，你是想创建多条任务吗？`,
                //         okText: '创建1条',
                //         cancelText: `创建${titles.length}条`,
                //         onCancel() {
                //             console.log('Cancel');
                //         },
                //         onOk() {
                //             this.confirmCreateTask(stageIndex);
                //             return Promise.resolve();
                //         }
                //     });
                //     return false;
                // }
                this.confirmCreateTask(stageIndex);
            },
            //添加任务
            confirmCreateTask(stageIndex) {
                let app = this;
                if (app.createTaskLoading) {
                    app.$message.warning('正在添加任务，请稍后...', 2);
                    return false;
                }
                setTimeout(function () {
                    if (app.createTaskLoading === true) {
                        app.$message.loading({
                            content: '正在添加任务，请稍后...',
                            duration: 5
                        })
                    }
                }, 2000);
                app.createTaskLoading = true;
                createTask(app.task).then(res => {
                    app.createTaskLoading = false;
                    const result = checkResponse(res);
                    if (result) {
                        app.$message.destroy();
                        let taskStages = app.taskStages[stageIndex];
                        taskStages.tasks.push(res.data);
                        app.taskStages[stageIndex].unDoneTasks.push(res.data);
                        // getTasks({stageCode: app.task.stage_code}).then((res) => {
                        //     let taskStages = app.taskStages[stageIndex];
                        //     taskStages.tasks = res.data;
                        // });
                        app.task = {};
                        // notice({
                        //     title: '添加任务成功',
                        //     msg: '你可以点击该任务继续进行详细设置'
                        // }, 'notice', 'success', 5);
                    }
                }).catch(() => {
                    app.createTaskLoading = false;
                });
            },
            taskDone(taskCode, stageIndex, taskIndex, done) {
                let task = null;
                let unDoneTasks = this.taskStages[stageIndex].unDoneTasks;
                let doneTasks = this.taskStages[stageIndex].doneTasks;
                if (done) {
                    task = unDoneTasks[taskIndex];
                } else {
                    task = doneTasks[taskIndex];
                }
                // let task = this.taskStages[stageIndex].tasks[taskIndex];
                if (task.hasUnDone) {
                    return false;
                }
                taskDone(taskCode, done).then((res) => {
                    const result = checkResponse(res);
                    if (!result) {
                        return false;
                    }
                    task.done = done;
                    if (done) {
                        unDoneTasks.splice(taskIndex, 1);
                        doneTasks.push(task);
                        doneTasks = doneTasks.sort(function (a, b) {
                            if (a.sort === b.sort) {
                                return a.id_num - b.id_num;
                            } else {
                                return a.sort - b.sort;
                            }
                        });
                    } else {
                        doneTasks.splice(taskIndex, 1);
                        unDoneTasks.push(task);
                        unDoneTasks = unDoneTasks.sort(function (a, b) {
                            if (a.sort === b.sort) {
                                return a.id_num - b.id_num;
                            } else {
                                return a.sort - b.sort;
                            }
                        });
                    }
                });
            },
            showInputStrageName() {
                this.showCreateStage = !this.showCreateStage;
                this.$nextTick(() => {
                    this.$refs.inputStageName.focus();
                });
            },
            doStage(action) {
                let app = this;
                let actionKeys = action.key.split('_');
                const stageCode = actionKeys[actionKeys.length - 2];
                const stageIndex = actionKeys[actionKeys.length - 1];
                const actionKey = actionKeys[0];
                switch (actionKey) {
                    case 'editStage':
                        this.stageModal.stageCode = stageCode;
                        this.stageModal.stageIndex = stageIndex;
                        this.$nextTick(() => {
                            this.stageModal.form.setFieldsValue({
                                name: this.taskStages[stageIndex].name,
                            });
                            this.$refs.inputStageTitle.focus();
                        });
                        this.stageModal.modalStatus = true;
                        break;
                    case 'recycleBatch':
                        //您确定要把列表下的所有任务移到回收站吗？
                        this.$confirm({
                            title: '移到回收站',
                            content: `您确定要把列表下的所有任务移到回收站吗？`,
                            okText: '移到回收站',
                            okType: 'danger',
                            cancelText: `再想想`,
                            onOk() {
                                recycleBatch({stageCode: stageCode}).then(res => {
                                    const result = checkResponse(res);
                                    if (!result) {
                                        return false;
                                    }
                                    app.$set(app.taskStages[stageIndex], 'tasks', []);
                                });
                                return Promise.resolve();
                            }
                        });
                        break;
                    case 'setEndTime':
                        this.set_type_endTime_modal = true;
                        break;
                    case 'setExecutor':
                        this.projectMemberModal.currentStageIndex = stageIndex;
                        this.projectMemberModal.modalStatus = true;
                        break;
                    case 'delStage':
                        if (this.taskStages[stageIndex].tasks.length > 0) {
                            this.$warning({
                                title: '删除列表',
                                content: `请先清空此列表上的任务，然后再删除这个列表`,
                                okText: '确定',
                            });
                            return false;
                        }
                        this.$confirm({
                            title: '删除列表',
                            content: `您确定要永远删除这个列表吗？`,
                            okText: '删除',
                            okType: 'danger',
                            cancelText: `再想想`,
                            onOk() {
                                delStage(stageCode);
                                app.taskStages.splice(stageIndex, 1);
                                return Promise.resolve();
                            }
                        });
                        break;
                }
            },
            creteStage() {
                if (!this.stageName) {
                    this.$message.warning('请输入列表名称', 2);
                    return false;
                }
                createState({name: this.stageName, projectCode: this.code}).then(res => {
                    const result = checkResponse(res);
                    if (!result) {
                        return false;
                    }
                    const stage = res.data;
                    this.taskStages.push(stage);
                    this.stageName = '';
                    this.$nextTick(() => {
                        document.getElementById("board-scrum-stages").scrollLeft = 10000;
                    });
                });
            },
            editStage() {
                let stage = this.stageModal.form.getFieldsValue();
                if (!stage.name) {
                    this.$message.warning('请输入列表名称', 2);
                    return false;
                }
                editStage({name: stage.name, stageCode: this.stageModal.stageCode}).then((res) => {
                    const result = checkResponse(res);
                    if (!result) {
                        return false;
                    }
                    this.taskStages[this.stageModal.stageIndex].name = stage.name;
                    this.stageModal.modalStatus = false;
                });
            },
            setExecutor(member) {
                let stage = this.taskStages[this.projectMemberModal.currentStageIndex];
                let taskCodes = [];
                stage.tasks.forEach((v) => {
                    if (v.canRead) {
                        taskCodes.push(v.code);
                    }
                });
                if (taskCodes) {
                    batchAssignTask({taskCodes: JSON.stringify(taskCodes), executorCode: member.code}).then(res => {
                        this.projectMemberModal.modalStatus = false;
                        if (!checkResponse(res)) {
                            return false;
                        }
                        getTasks({stageCode: stage.code}).then((res) => {
                            let canNotReadCount = 0;
                            res.data.forEach((task) => {
                                if (!task.canRead) {
                                    canNotReadCount++;
                                }
                            });
                            stage.canNotReadCount = canNotReadCount;
                            stage.tasksLoading = false;
                            stage.tasks = res.data;
                        });
                    });
                } else {
                    this.projectMemberModal.modalStatus = false;
                }
            },
            showTaskPri(pri) {
                return {
                    'warning': pri == 1,
                    'error': pri == 2,
                }
            },
            showTimeLabel(time) {
                let str = 'label-primary';
                if (time == null) {
                    return str;
                }
                let cha = moment(moment(time).format("YYYY-MM-DD")).diff(moment().format("YYYY-MM-DD"), 'days');
                if (cha < 0) {
                    str = 'label-danger';
                } else if (cha == 0) {
                    str = 'label-warning';
                } else if (cha > 7) {
                    str = 'label-normal'
                }
                return str;
            },
            showTaskTime(time, timeEnd) {
                return formatTaskTime(time, timeEnd);
                // return moment(time).format('MM月DD日 HH:mm')
            },
            taskDetail(code, stageIndex) {
                this.$router.push(`${this.$route.path}/detail/${code}?from=${stageIndex}`);
            },
            stageMove(evt) {
                this.preCode = evt.draggedContext.element.code;
                this.nextCode = evt.relatedContext.element.code;

            },
            stageSort() {
                sort(this.preCode, this.nextCode, this.code);
            },
            taskSort(event) {
                console.log(event);
                const toStageCode = event.to.parentNode.parentNode.parentNode.getAttribute('id');
                let codes = '';
                for (let i = 0, len = event.to.children.length; i < len; i++) {
                    codes += ',' + event.to.children[i].getAttribute('id');
                }
                sortTask({stageCode: toStageCode, codes: codes.substr(1)});
            },
            handleResize(vertical, stageIndex) {
                if (vertical.barSize) {
                    this.taskStages[stageIndex].fixedCreator = true;
                }
            },

            visibleDraw(type) {
                if (type == 'member') {
                    this.configDraw.visible = false;
                    this.inviteMemberDraw.visible = !this.inviteMemberDraw.visible;

                } else {
                    this.inviteMemberDraw.visible = false;
                    this.configDraw.visible = !this.configDraw.visible;
                }
            },
            removeMember(member, index) {
                let app = this;
                this.$confirm({
                    title: `您确定要将「${member.name}」从项目中移除吗？`,
                    content: `移除后该成员将不能查看任何关于该项目的信息`,
                    okText: '移除',
                    okType: 'danger',
                    cancelText: '再想想',
                    onOk() {
                        removeMember(member.code, app.code).then((res) => {
                            if (!checkResponse(res)) {
                                return;
                            }
                            app.projectMembers.splice(index, 1);
                            notice({title: '移除成功'}, 'notice', 'success');
                        });
                        return Promise.resolve();
                    }
                });
            },
            inviteMember(item) {
                inviteMember(item.memberCode, this.projectCode).then((res) => {
                    const success = checkResponse(res);
                    if (success) {
                        item.joined = true;
                    }
                })
            },
            searchInviteMember: _.debounce(
                function () {
                    if (!this.inviteMemberDraw.keyword) {
                        this.projectMembers = JSON.parse(JSON.stringify(this.projectMembersCopy));
                    }
                    if (this.inviteMemberDraw.keyword.length <= 1) {
                        return false;
                    }
                    this.searching = true;
                    this.projectMembers = this.projectMembers.filter(item => item.name.indexOf(this.inviteMemberDraw.keyword) != -1);
                }, 500
            ),
            updateProject(data) {
                this.project = data;
            },
            collectProject() {
                const type = this.project.collected ? 'cancel' : 'collect';
                collect(this.project.code, type).then((res) => {
                    if (!checkResponse(res)) {
                        return;
                    }
                    this.project.collected = !this.project.collected;
                })
            },
        }
    }
</script>

<style lang="less">
    @import "../../../assets/css/components/task";

    .project-space-task {
        .tasks-loading {
            .ant-spin-blur {
                opacity: 0;
            }
        }
    }

    .info-drawer {
        top: 116px;
        width: 0 !important;

        .ant-drawer-mask {
            visibility: hidden;
        }

        .ant-drawer-content {
            background-color: #f7f7f7;
        }

        .ant-drawer-header {
            background-color: #f7f7f7;
            text-align: center;
        }

        .ant-drawer-body {
            padding: 12px 0;
        }

        .search-content {
            padding: 0 24px;
        }
    }

    .info-drawer {
        .member-list {
            padding-top: 12px;

            .ant-list-item-meta {
                align-items: center;
            }

            .member-list-item {
                padding: 12px 24px;

                &:hover {
                    background-color: #eee;
                    cursor: pointer;
                }
            }
        }
    }

    .info-drawer {
        .config-wrapper {
            position: relative;
            padding-bottom: 1px;

            .config-menus {
                padding: 0;
                list-style: none;

                .menu-item {
                    position: relative;
                    line-height: 30px;

                    &:hover {
                        background: #eeeeee;
                    }

                    &:first-child > a {
                        margin-top: -6px;
                    }

                    a {
                        display: block;
                        cursor: pointer;
                        padding: 5px 15px;
                        text-decoration: none;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #383838;
                        font-weight: 600;

                        .anticon {
                            width: 24px;
                            text-align: center;
                            font-size: 15px;
                            margin-right: 5px;
                        }
                    }
                }
            }
        }
    }
</style>
