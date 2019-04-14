<template>
    <div class="members-profile">
        <a-breadcrumb separator=">" class="breadcrumb">
            <a-breadcrumb-item>
                <router-link to="/">
                    <a-icon type="home"/>
                    首页
                </router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/followuser">
                    <a-icon type="team"/>
                    关注用户
                </router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>{{member.username}}</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="header">
            <div class="member-info">
                <template v-if="member">
                    <div class="base">
                        <a-avatar size="large" class="m-r" :src="member.imgPath"></a-avatar>
                        <div class="title">
                            {{member.username}}
                        </div>
                    </div>
                    <div class="mail muted">
                        <a-icon type="mail"></a-icon>
                        {{member.email}}
                    </div>
                </template>
            </div>
        </div>
        <div class="actions">
            <a-tabs :animated="false" defaultActiveKey="1">
                <a-tab-pane class="info-content base-info" tab="详细资料" key="1">
                    <a-row class="content-wrapper">
                        <a-col :span="24">
                            <div class="info-item">
                                <span class="muted">姓名</span>
                                <span>{{member.username}}</span>
                            </div>
                        </a-col>
                        <a-col :span="24">
                            <div class="info-item">
                                <span class="muted">手机</span>
                                <span>{{member.mobile}}</span>
                            </div>
                        </a-col>
                        <a-col :span="24">
                            <div class="info-item">
                                <span class="muted">邮箱</span>
                                <span>{{member.email}}</span>
                            </div>
                        </a-col>
                        <a-col :span="24">
                            <div class="info-item">
                                <span class="muted">部门</span>
                                <span>{{member.deptName}}</span>
                            </div>
                        </a-col>
                        <a-col :span="8">
                            <div class="info-item">
                                <span class="muted">加入时间</span>
                                <span>{{formatTime(member.createTime)}}</span>
                            </div>
                        </a-col>
                    </a-row>
                </a-tab-pane>
            </a-tabs>
        </div>

    </div>
</template>

<script>
    import {getUserDetail} from "../../api/mock";
    import {formatDateTime} from "../../assets/js/dateTime";
    export default {
        data() {
            return {
                userId: this.$route.query.id,
                member: {},
            }
        },
        computed: {},
        watch: {},
        created() {
            this.init();
        },
        methods: {
            init() {
                this.getInfo();
            },
            getInfo() {
                getUserDetail({userId: this.userId}).then(res => {
                     this.member = res.data.member;
                 });
            },
            formatTime(time){
                return formatDateTime(time);
            }
        }
    }
</script>

<style lang="less">
    .members-profile {
        margin: 24px auto;
        width: 1100px;
        padding: 0 12px;

        .breadcrumb {
            margin-bottom: 18px;
        }

        .header {
            background: #FFF;
            width: 100%;
            padding: 18px;


            .member-info {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .base {
                    display: flex;
                    align-items: center;
                }
            }
        }

        .actions {
            .ant-tabs-nav-container {
                background: #FFF;
                padding: 12px 18px 0;
            }

            .info-content {
                .action-wrapper {
                    display: flex;
                    justify-content: space-between;
                    padding: 6px 0;

                    .title {
                        font-size: 16px;

                    }
                }

                .content-wrapper {
                    padding: 0 36px;
                    background: #FFF;

                    &.list {
                        padding: 4px 0;

                        .ant-list-item {
                            padding: 12px;
                            border-bottom: none;

                            .tips {
                                font-size: 12px;
                            }

                            &:hover {
                                background-color: #f5f5f5;
                                cursor: pointer;
                            }
                        }
                    }

                    &.default-list {
                        .ant-list-item-meta {
                            align-items: center;
                        }
                    }
                }

            }

            .base-info {
                .info-item {
                    display: flex;
                    flex-direction: column;
                    padding: 28px 0;
                    margin-right: 24px;
                }
            }
        }
    }

</style>
