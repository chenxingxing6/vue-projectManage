<template>
    <div>
        <a-modal
                class="invite-project-member"
                :width="360"
                v-model="actionInfo.modalStatus"
                :title="actionInfo.modalTitle"
                :footer="null"
                @cancel="cancel"
        >
            <div class="header">
                <span>用户分享</span>
                <a @click="createShareUrl()">通过链接分享</a>
            </div>
            <div class="search-content">
                <a-input v-model="keyword" placeholder="输入用户名或邮箱查找">
                    <a-icon slot="prefix" type="search"/>
                </a-input>
            </div>
            <div class="member-list">
                <a-list
                        class="project-list"
                        itemLayout="horizontal"
                        :loading="searching"
                        :dataSource="list"
                        :locale="{emptyText: (keyword && keyword.length > 1) ? '没有搜索到相关用户' : ''}">
                    <a-list-item slot="renderItem" slot-scope="item">
                    <span slot="actions">
                        <a-button size="small" type="dashed" icon="user-add" @click="shareToUser(item.userId)">分享</a-button>
                     </span>
                        <a-list-item-meta :description="item.email">
                            <span slot="title">{{item.username}} <i style="font-size: 5px; font-family: Noteworthy; color: grey;"></i></span>
                            <a-avatar slot="avatar" icon="user" :src="item.imgPath"/>
                        </a-list-item-meta>
                    </a-list-item>
                </a-list>
            </div>
        </a-modal>
        <a-modal
                class="invite-link"
                :width="600"
                v-model="linkInfo.modalStatus"
                :title="linkInfo.modalTitle"
                :footer="null">
            <div class="header">
                <p>链接有效日期：1天</p>
                <a-input-search
                        size="large"
                        v-model="linkInfo.link"
                        v-clipboard:copy="linkInfo.link"
                        enterButton="复制链接"
                />
            </div>
        </a-modal>
    </div>

</template>

<script>
    import _ from 'lodash'
    import moment from 'moment';
    import {findToShareUser, shareToUser, createShareUrl} from "../../api/mock";
    import {checkResponse} from "../../assets/js/utils";
    import {notice} from "../../assets/js/notice";



    export default {
        name: "inviteProjectMember",
        props: {
            value: {
                type: Boolean,
                default() {
                    return false
                }
            },
            fileId: {
                type: [String],
                default() {
                    return ''
                }
            }
        },
        data() {
            return {
                form: this.$form.createForm(this),
                actionInfo: {
                    modalStatus: this.value,
                    confirmLoading: false,
                    modalTitle: '分享资源',
                },
                linkInfo: {
                    modalStatus: false,
                    confirmLoading: false,
                    modalTitle: '邀请成员',
                    link: '',
                    overTime: '',
                },
                keyword: '',
                searching: false,
                list: [],
                fileId: '',
            };
        },
        watch: {
            value(value) {
                this.actionInfo.modalStatus = value;
            },
            keyword() {
                this.search();
            },
            fileId(fileId){
                this.fileId = fileId;
            }
        },
        methods: {
            shareToUser(userId) {
                shareToUser(userId, this.fileId).then((res) => {
                    const success = checkResponse(res);
                    if (success) {
                        notice({
                            title: '分享成功',
                        }, 'notice', 'success');
                    }
                })
            },
            createShareUrl() {
                if (!this.linkInfo.link) {
                    createShareUrl({fileId: this.fileId}).then(res => {
                        const success = checkResponse(res);
                        if (success) {
                            this.linkInfo.modalStatus = true;
                            this.linkInfo.link = window.location.href.split('#')[0] + '#/share/link?code=' + res.data;
                            //this.linkInfo.overTime = moment(res.data.code.over_time).format('YYYY年M月D日 HH:mm');
                        }
                    });
                }else{
                    this.linkInfo.modalStatus = true;
                }
            },
            search: _.debounce(
                function () {
                    if (!this.keyword) {
                        this.list = [];
                    }
                    if (this.keyword.length <= 1) {
                        return false;
                    }
                    this.searching = true;
                    findToShareUser(this.keyword).then(res => {
                        this.searching = false;
                        this.list = res.data.list;
                    });
                }, 500
            ),
            cancel() {
                this.actionInfo.modalStatus = false;
                this.$emit('input', this.actionInfo.modalStatus);
            }
        }
    }
</script>

<style lang="less">
    .invite-project-member {
        .ant-modal-body {
            padding-top: 0;
            padding-bottom: 24px;
            min-height: 40vh;
        }

        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 12px 0;
        }

        .member-list {
            padding-top: 12px;
        }

    }
</style>
