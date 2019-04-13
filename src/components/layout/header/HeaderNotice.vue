<template>
    <a-popover v-model="showNotice" overlayClassName="header-notice" trigger="click" placement="bottomRight">
        <template slot="content">
            <a-spin :spinning="loading">
                <a-tabs class="header-notice-content" :tabBarGutter="25">
                    <a-tab-pane key="3">
                        <span slot="tab">通知<span
                                v-if="task.total && task.total">({{task.total}})</span></span>
                        <template v-if="task.total && task.total">
                            <a-list>
                                <template v-for="item in task.list">
                                    <a-list-item :key="item.id">
                                        <a-list-item-meta>
                                            <a-avatar slot="avatar" :src="item.img"/>
                                            <span slot="title">
                                                <p>{{item.title}}</p>
                                             </span>
                                        </a-list-item-meta>
                                    </a-list-item>
                                </template>
                            </a-list>
                            <div class="footer-action">
                              <!--  <a class="item muted" @click="setRead('task')">清空通知</a>-->
                                <a class="item muted" @click="showMore()">查看更多</a>
                            </div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </a-spin>
        </template>
        <span>
          <a-badge :count="total">
            <a-icon class="action-item" type="bell"/>
          </a-badge>
        </span>
    </a-popover>
</template>

<script>
    import moment from 'moment';
    import {getNotice} from "../../../api/mock";

    export default {
        name: 'HeaderNotice',
        data() {
            return {
                showNotice: false,
                loading: false,
                total: 0,
                totalSum: 0,
                list: [],
                task: {
                    page: 1,
                    pageSize: 5,
                    total: 0,
                    list: [],
                }
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.fetchNotice();
            },
            setRead(type) {
                this.total -= this.list[type].length;
                this.list[type] = [];
            },
            showMore() {
                this.showNotice = false;
                this.$router.push('/notify/notice');
            },
            fetchNotice() {
                getNotice().then(res => {
                    this.task.list = res.data.list;
                    this.task.total = res.data.total;
                    this.total = this.task.total;
                })
            },
            formatTime(time) {
                return moment(time).format('YY年MM月DD日 HH:mm');
            }
        }
    }
</script>

<style lang="less">
    .header-notice {
        .ant-popover-inner-content {
            padding: 0;

            .ant-tabs-bar {
                margin-bottom: 0 !important;
            }

            .ant-list {
                .ant-list-item {
                    padding: 12px 24px;
                    transition: all .3s;

                    &:hover {
                        background: #e6f7ff;
                    }
                }
            }
        }

        .header-notice-content {
            width: 340px;

            .ant-tabs-bar {
                text-align: center;
                margin-bottom: 5px;
            }

            .ant-list-item-meta-title {
                p {
                    margin-bottom: 8px;
                    position: relative;
                }
            }

            .ant-list-item-meta-description {
                font-size: 12px;
            }

            .ant-list-item:hover {
                /*background: #e6f7ff;*/
                cursor: pointer;
            }

            .notFound {
                text-align: center;
                padding: 73px 0 88px 0;
                color: rgba(0, 0, 0, 0.45);
                height: 275px;

                img {
                    margin-bottom: 16px;
                }
            }

            .footer-action {
                border-top: 1px solid #e8e8e8;
                padding: 12px 0;

                .item {
                    width: 49%;
                    display: inline-block;
                    text-align: center;
                }
            }
        }
    }
</style>
