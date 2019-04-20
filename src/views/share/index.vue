<!--这个页面需要-->
<template>
    <div class="members-index">
        <div class="layout-item left">
            <div class="left-content">
                <div class="content-item muted">分享</div>
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
                    <a-list
                            class="project-list"
                            :loading="loading"
                            itemLayout="horizontal"
                            :dataSource="dataSource">
                        <div v-if="showLoadingMore" slot="loadMore"
                             :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                            <a-spin v-if="loadingMore"/>
                            <a-button v-else @click="onLoadMore">查看更多项目</a-button>
                        </div>

                        <a-list-item slot="renderItem" slot-scope="item,index">
                            <span slot="actions" @click="downLoad(item,index)">
                         <a-tooltip title="下载">
                              <a-icon type="download"/>
                         </a-tooltip>
                             </span>
                            <span slot="actions" @click="del(item,index)">
                         <a-tooltip title="移至回收站">
                              <a-icon type="delete"/>
                         </a-tooltip>
                             </span>
                            <span slot="actions" @click="seeDetail(item)">
                         <a-tooltip title="查看详情">
                           <i class="el-icon-view"></i>
                         </a-tooltip>
                    </span>
                    <a-list-item-meta
                            :description="item.createTime">
                        <router-link slot="title" :to="''">{{item.fileName}}</router-link>
                        <a-avatar slot="avatar" icon="file" style="padding-top: 5px"/>
                    </a-list-item-meta>
                    <div class="other-info muted">
                        <div class="info-item">
                            <span>过期时间</span>
                            <span>{{item.expiredTime}}</span>
                        </div>
                        <div class="info-item">
                            <span>分享用户</span>
                            <span>{{item.toUserName}}</span>
                        </div>
                    </div>
                </a-list-item>
                    </a-list>
                </vue-scroll>
            </div>
        </div>
        <box v-model="showInviteMember" v-if="showInviteMember" :seeUrl="seeUrl"></box>
    </div>
</template>

<script>
    import pagination from "../../mixins/pagination";
    import {getShares, delByShareId} from "../../api/mock";
    import box from '../../components/file/box'
    import {notice} from "../../assets/js/notice";

    export default {
        components: {
            'box':box

        },
        name: "members",
        mixins: [pagination],
        data() {
            return {
                selectedKeys: ['0'],
                menus: [
                    {icon: 'team', title: '我的分享'},
                    {icon: 'usergroup-add', title: '收到分享'},
                ],
                currentMenu: {},
                loading: false,
                dataSource: [],
                showLoadingMore: false,
                loadingMore: false,
                showInviteMember: false,
                seeUrl: '',
            }
        },
        created() {
            this.currentMenu = this.menus[0];
            this.getMembers({key: 0});
        },
        methods: {
            seeDetail(item) {
                this.showInviteMember = true;
                this.seeUrl = "http://193.112.27.123:8012/disk/"+ item.fileName;
            },
            getMembers({key} = {}) {
                let app = this;
                if (key != undefined) {
                    this.currentMenu = this.menus[key];
                    app.selectedKeys = [key.toString()];
                    app.requestData.searchType = key;
                }
                app.loading = true;
                getShares(app.requestData).then(res => {
                    app.dataSource = res.data.list;
                    app.pagination.total = res.data.total;
                    app.showLoadingMore = app.pagination.total > app.dataSource.length;
                    app.loading = false;
                    app.loadingMore = false
                });
            },
            onLoadMore() {
                this.loadingMore = true;
                this.pagination.page++;
                this.init(false);
            },
            del(share, index) {
                let app = this;
                this.$confirm('删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    delByShareId({shareId: share.id}).then(res => {
                        app.dataSource.splice(index, 1);
                        notice({title: '删除成功'}, 'notice', 'success');
                    });
                }).catch(() => {

                });
            },
            downLoad(file) {
                window.open("http://193.112.27.123:8888/api/fileDownload?fileId="+file.fileId);
            },
        }
    }
</script>

<style lang="less">
    @import "~ant-design-vue/lib/style/themes/default";

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


                .project-list {
                    .ant-list-item-meta-avatar {
                        .ant-avatar {
                            width: 45px;
                            height: 45px;
                            border-radius: 3px;
                        }
                    }

                    .ant-list-item-content {
                        .other-info {
                            display: flex;

                            .info-item {
                                display: flex;
                                flex-direction: column;
                                padding-left: 30px;
                                width: 180px;
                            }
                        }
                    }

                    .ant-list-item-action {
                        .anticon:hover {
                            svg {
                                color: @primary-color;
                            }
                        }
                    }
                }
            }
        }
    }

</style>
