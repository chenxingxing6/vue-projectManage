<!--这个页面需要-->
<template>
    <div class="members-index">
        <div class="layout-item left">
            <div class="left-content">
                <div class="search-content">
                    <a-input size="large" v-model="keyword" ref="keywordInput" placeholder="搜索（文件名）">
                        <a-icon slot="prefix" class="muted" type="search"/>
                        <a-icon v-if="keyword" slot="suffix" class="muted" type="close-circle" @click="emitEmpty"/>
                    </a-input>
                </div>
                <div class="menus">
                    <a-menu mode="inline" v-model="selectedKeys">
                        <a-menu-item :key="index.toString()" v-for="(item,index) in menus">
                            <a-icon type="file"/>
                            <span @click="getSource(item)">{{item.name}}</span>
                        </a-menu-item>
                    </a-menu>
                </div>
            </div>
        </div>
        <div class="layout-item right">
            <div class="header">
                <div class="title">
                    <span>{{currentMenu.name}} · {{pagination.total}}</span>
                </div>
            </div>
            <div class="members-content">
                <vue-scroll ref="contentscroll">

                    <div class="list-content">
                        <a-list :loading="loading">
                            <a-list-item class="list-item-title">
                                <a-list-item-meta>
                                    <div class="muted" slot="title">名称</div>
                                </a-list-item-meta>
                                <div class="other-info muted">
                                    <div class="info-item"  style="padding-right: 20px;"><span>大小</span></div>
                                    <div class="info-item"><span>创建日期</span></div>
                                    <div class="info-item">
                                        <span>创建人</span>
                                    </div>
                                </div>
                                <span slot="actions" :key="item" v-for="item in 3">
                                    <span>位</span>
                                </span>
                            </a-list-item>
                            <a-list-item class="list-item" :key="index" v-for="(item, index) in files">
                                <a-list-item-meta>
                                    <a-avatar slot="avatar" shape="square" :src="item.fileUrl" v-if="item.extension === 'html'" style="">
                                        <a-icon type="code" />
                                    </a-avatar>
                                    <a-avatar slot="avatar" shape="square" :src="item.fileUrl" v-else-if="item.extension === 'pdf'">
                                        <a-icon type="file-pdf"/>
                                    </a-avatar>
                                    <a-avatar slot="avatar" shape="square" :src="item.fileUrl" v-else-if="item.extension === 'txt'">
                                        <a-icon type="file-text"/>
                                    </a-avatar>
                                    <a-avatar slot="avatar" shape="square" :src="item.fileUrl" v-else-if="item.extension === 'doc' || item.extension === 'docx'">
                                        <a-icon type="file-word"/>
                                    </a-avatar>
                                    <a-avatar slot="avatar" shape="square" :src="item.fileUrl" v-else-if="item.extension === 'jpg'">
                                        <a-icon type="file-jpg"/>
                                    </a-avatar>
                                    <a-avatar slot="avatar" shape="square" :src="item.fileUrl" v-else-if="item.extension === 'xls' || item.extension === 'xlsx'">
                                        <a-icon type="file-excel"/>
                                    </a-avatar>
                                    <a-avatar slot="avatar" shape="square" :src="item.fileUrl" v-else-if="item.extension === 'mp3'">
                                        <a-icon type="customer-service"/>
                                    </a-avatar>
                                    <a-avatar slot="avatar" shape="square" :src="item.fileUrl" v-else-if="item.extension === 'zip'">
                                        <a-icon type="folder-open"/>
                                    </a-avatar>
                                    <a-avatar slot="avatar" shape="square" :src="item.fileUrl" v-else>
                                        <a-icon type="file" />
                                    </a-avatar>
                                    <div slot="title">
                                        <a-tooltip :mouseEnterDelay="0.3">
                                            <template slot="title">
                                                <span>{{item.originalName}}</span>
                                            </template>
                                            <a-input
                                                    :ref="`inputTitle${index}`"
                                                    :auto-focus="true"
                                                    v-model="item.name"
                                                    v-show="item.viewFlag"
                                                    @pressEnter="onCellChange(item)"
                                                    @blur="onCellChange(item)"></a-input>
                                            <a class="text-default" v-show="!item.viewFlag" @click="seeBox(item)">{{item.originalName}}</a>
                                        </a-tooltip>
                                    </div>
                                </a-list-item-meta>
                                <div class="other-info muted">
                                    <div class="info-item" style="padding-right: 20px;">
                                        <span>{{item.length}}</span>
                                    </div>
                                    <div class="info-item">
                                        <a-tooltip :title="item.createTime">
                                            <span>{{ formatTime(item.createTime) }}</span>
                                        </a-tooltip>
                                    </div>
                                    <div class="info-item">
                                        <span>{{item.createUser}}</span>
                                    </div>
                                </div>
                                <span slot="actions">
                                    <a-tooltip title="下载">
                                        <a class="muted" @click="downLoad(item)"><a-icon type="download"/></a>
                                    </a-tooltip>
                                </span>
                                <span slot="actions" @click="editFile(item,index)">
                                    <a-tooltip title="编辑">
                                        <a-icon type="edit"/>
                                    </a-tooltip>
                                </span>
                                <a class="muted" slot="actions">
                                    <a-dropdown :trigger="['click']" placement="bottomCenter">
                                        <a-tooltip :mouseEnterDelay="0.5">
                                            <template slot="title">
                                                <span>更多操作</span>
                                            </template>
                                            <a class="action-item muted">
                                                <a-icon type="down"/>
                                            </a>
                                        </a-tooltip>
                                        <a-menu class="field-right-menu"
                                                @click="copyUrl(item.fileUrl)"
                                                slot="overlay">
                                            <a-menu-item key="copy" v-clipboard="item.fileUrl">
                                                <a-icon type="link"/>
                                                <span>复制链接</span>
                                            </a-menu-item>
                                        </a-menu>
                                    </a-dropdown>
                                </a>
                            </a-list-item>
                            <div v-if="showLoadingMore" slot="loadMore"
                                 :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                                <a-spin v-if="loadingMore"/>
                                <a-button v-else @click="onLoadMore">查看更多文件</a-button>
                            </div>
                        </a-list>
                    </div>
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
    import {getSource, fileRename, getSourceType, fileDownload} from "../../api/mock";
    import {relativelyTime} from "../../assets/js/dateTime";
    import {notice} from "../../assets/js/notice";
    import {checkResponse} from "../../assets/js/utils";

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
                menus: [],
                currentMenu: {},
                type: 0,
                files: [],
                loading: false,
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
            this.getSourceType();
        },
        mounted() {
        },
        methods: {
            getSource(item) {
                let app = this;
                if (item != undefined) {
                    this.currentMenu = item;
                    app.requestData.searchType = item.type;
                }
                app.loading = true;
                getSource(app.requestData).then(res => {
                    if (checkResponse(res)) {
                        app.files = res.data.list;
                        app.files.forEach((v) => {
                            v.viewFlag = false;
                        });
                        app.pagination.total = res.total;
                        app.showLoadingMore = app.pagination.total > app.files.length;
                        app.loading = false;
                        app.loadingMore = false
                    }
                });
            },
            getSourceType() {
                let app = this;
                getSourceType().then(res => {
                    app.menus = res.data.list;
                    app.currentMenu = app.menus[0];
                    app.getSource(app.currentMenu);
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
            seeBox(file) {
                var file_url = file.fileUrl;
                this.showInviteMember = true;
                this.seeUrl = file_url;
            },
            onCellChange(file) {
                let currentFile = this.files[this.currentFileIndex];
                this.files.forEach((v) => {
                    v.viewFlag = false;
                });
                const fullName = `${file.name}.${file.extension}`;
                if (fullName != currentFile.originalName) {
                    fileRename({fileName: fullName, fileId: currentFile.id}).then(res => {
                        const result = checkResponse(res);
                        if (!result) {
                            return false;
                        }
                        currentFile.name = file.name;
                        currentFile.originalName = fullName;
                        notice({
                            title: '重命名成功',
                        }, 'notice', 'success');
                    });
                }
            },
            downLoad(file) {
                window.location.href = "http://localhost:8888/api/fileDownload?fileId="+file.id;
            },
            copyUrl(url) {
                notice({
                    title: '复制成功',
                }, 'notice', 'success');
            },
            editFile(file, index) {
                let app = this;
                this.files.forEach((v) => {
                    v.viewFlag = false;
                });
                this.files[index].viewFlag = true;
                this.$nextTick(() => {
                    app.$refs[`inputTitle${index}`][0].focus();
                });
                this.currentFileIndex = index;
            },
            emitEmpty() {
                this.$refs.keywordInput.focus();
                this.keyword = '';
                this.requestData.keyword = '';
                this.getSource();
            },
            formatTime(time) {
                return relativelyTime(time);
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

                .list-content {

                    .list-item-title {
                        padding: 10px 20px;

                        .ant-list-item-action {
                            li {
                                color: #fff;
                            }

                            em {
                                width: 0;
                            }
                        }
                    }

                    .list-item {
                        border-bottom: none;
                        margin-bottom: 2px;
                        /*border-bottom: 1px solid #f5f5f5;*/
                        padding: 10px 20px;
                        transition: background-color 218ms;

                        &:hover {
                            background-color: #f5f5f5;
                        }

                        .ant-list-item-meta-title {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            position: relative;
                            margin-bottom: 0;
                            line-height: 42px;
                        }

                        .ant-list-item-action {
                            em {
                                width: 0;
                            }
                        }
                    }

                    .other-info {
                        display: flex;

                        .info-item {
                            display: flex;
                            flex-direction: column;
                            padding-left: 0;
                            width: 100px;
                            text-align: right;
                        }

                        .schedule {
                            width: 250px;
                        }
                    }
                }

                .ant-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 4px;
                    padding-top: 3px;
                }
            }
        }
    }

</style>
