<!--这个页面需要-->
<template>
    <div class="members-index">
        <div class="layout-item left">
            <div class="left-content">
                <div class="search-content">
                    <a-input size="large" v-model="keyword" ref="keywordInput" placeholder="搜索">
                        <a-icon slot="prefix" class="muted" type="search"/>
                        <a-icon v-if="keyword" slot="suffix" class="muted" type="close-circle" @click="emitEmpty"/>
                    </a-input>
                </div>
                <div class="menus">
                    <a-menu mode="inline" v-model="selectedKeys" @click="getMembers">
                        <a-menu-item :key="index.toString()" v-for="(item,index) in menus">
                            <a-icon :type="item.icon"/>
                            <span>{{item.title}}</span>
                        </a-menu-item>
                    </a-menu>
                </div>
            </div>
        </div>
        <div class="layout-item right">
            <div class="header">
                <div class="title">
                    <span>{{currentMenu.title}} · {{pagination.total}}</span>
                </div>
            </div>
            <div class="members-content">
                <vue-scroll ref="contentscroll">
                    <a-list class="member-list" :loading="loading">
                        <div v-if="showLoadingMore" slot="loadMore"
                             :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                            <a-spin v-if="loadingMore"/>
                            <a-button v-else @click="onLoadMore">加载更多</a-button>
                        </div>
                        <a-list-item :key="index" v-for="(item, index) in members">
                            <a-list-item-meta>
                                <a-avatar slot="avatar" class="user">
                                    <a-icon type="file" />
                                </a-avatar>
                                <div slot="title">
                                    {{item.originalName}}
                                    <a-tag class="m-l-sm">{{item.length}}</a-tag>
                                </div>
                                <div slot="description">
                                    <a-tooltip :mouseEnterDelay="0.3" :title="item.originalName">
                                    <span>{{ item.opTime }}</span>
                                </span>
                                    </a-tooltip>
                                </div>
                            </a-list-item-meta>
                            <template>
                            <a class="muted" slot="actions"
                               @click="seeFile(item,index)">
                                <a-tooltip title="查看文件">
                                    <a-icon type="eye" />
                                </a-tooltip>
                            </a>
                        </template>
                        </a-list-item>
                    </a-list>
                </vue-scroll>
            </div>
        </div>
        <box v-model="showInviteMember" v-if="showInviteMember" :seeUrl="seeUrl"></box>
    </div>
</template>

<script>
    import _ from 'lodash'
    import box from '../../components/file/box'
    import pagination from "../../mixins/pagination";
    import {getSource} from "../../api/mock";

    export default {
        name: "members",
        components: {
            'box':box

        },
        mixins: [pagination],
        data() {
            return {
                keyword: '',
                selectedKeys: ['0'],
                menus: [
                    {icon: 'usergroup-add', title: '所有文件'},
                    {icon: 'user', title: '图片'},
                    {icon: 'user', title: '视频'},
                ],
                currentMenu: {},
                loading: false,
                members: [],
                showLoadingMore: false,
                loadingMore: false,
                showInviteMember: false,
                seeUrl: 'http://193.112.27.123:8012/onlinePreview?url=http%3A%2F%2F193.112.27.123%3A8012%2Fdemo%2Ftimg.gif',
            }
        },
        watch: {
            keyword() {
                this.search();
            },
        },
        created() {
            this.currentMenu = this.menus[0];
            this.getSource({key: 0});
        },
        methods: {
            getSource({key} = {}) {
                let app = this;
                if (key != undefined) {
                    this.currentMenu = this.menus[key];
                    this.selectedKeys = [key.toString()];
                    this.requestData.searchType = key;
                }
                app.loading = true;
                getSource(this.requestData).then(res => {
                    app.members = res.data.files;
                    app.pagination.total = res.data.total;
                    app.showLoadingMore = app.pagination.total > app.members.length;
                    app.loading = false;
                    app.loadingMore = false
                });
            },
            search: _.debounce(
                function () {
                    if (!this.keyword) {
                        this.list = [];
                    }
                    if (this.keyword.length <= 1) {
                        return false;
                    }
                    this.requestData.keyword = this.keyword;
                    this.getSource();
                }, 500
            ),
            onLoadMore() {
                this.loadingMore = true;
                this.pagination.page++;
                this.init(false);
            },
            seeFile(file, index) {
                this.showInviteMember = true;
                this.seeUrl = "http://193.112.27.123:8012/test.txt";
            },
            emitEmpty() {
                this.$refs.keywordInput.focus();
                this.keyword = '';
                this.requestData.keyword = '';
                this.getSource();
            },
        }
    }
</script>

<style lang="less">
    .members-index {
        margin: 24px auto;
        display: flex;
        flex-direction: row;
        width: 1100px;
        padding: 0 12px;

        .layout-item {
            background: #FFF;
            width: 100%;
        }

        .left {
            padding: 12px 24px 12px 0;
            width: 280px;
            height: 85vh;

            .left-content {
                width: 255px;
                height: 100%;
                border-right: 1px solid #e8e8e8;

                .content-item {
                    padding: 6px 24px 12px 24px;
                }

                .search-content {
                    padding: 12px;

                    .anticon-close-circle {
                        cursor: pointer;
                        color: #ccc;
                        transition: color 0.3s;
                        font-size: 12px;
                    }

                    .anticon-close-circle:hover {
                        color: #999;
                    }

                    .anticon-close-circle:active {
                        color: #666;
                    }
                }

                .menus {
                }

                .actions {
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 0;
                }

                .department {
                    padding: 6px 12px 12px 12px;

                    .ant-tree li {
                        position: relative;

                        .ant-tree-node-content-wrapper {
                            height: 40px;
                            line-height: 40px;
                            width: 100%;

                            &.ant-tree-node-selected, &:hover {
                                background-color: #f5f5f5;
                            }
                        }

                        .ant-tree-iconEle {
                            height: 40px;
                            line-height: 40px;
                        }

                        .ant-tree-switcher {
                            position: absolute;
                            right: 0;
                            height: 40px;
                            line-height: 40px;

                            .ant-tree-switcher-loading-icon {
                                height: 40px;
                            }
                        }
                    }
                }

            }

            .ant-menu-root {
                border-right: none;
            }
        }

        .right {
            padding: 24px 12px 12px 0;

            .header {
                padding-right: 12px;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #e8e8e8;
                padding-bottom: 24px;

                .title {
                    font-size: 18px;
                }

                .actions {
                    a {
                        margin-left: 12px;
                    }
                }
            }

            .members-content {
                height: 75vh;
                .member-list{
                    margin-right: 12px;
                }

                .ant-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    padding-top: 2px;
                }
            }
        }
    }

</style>
