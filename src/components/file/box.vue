<template>
    <div>
        <a-modal>
            <div class="task-detail" v-if="flag">
                <a-spin class="task-detail-spin" :spinning="loading">
                    <div class="task-header">
                    <span class="head-title">
                        <span>查看文件</span>
                    </span>
                        <span class="header-action text-right">
                     <a-tooltip :mouseEnterDelay="0.5">
                        <template slot="title">
                            <span>最小化</span>
                        </template>
                        <a class="action-item muted" @click="reset()"><a-icon type="minus"/></a>
                     </a-tooltip>
                     <a-tooltip :mouseEnterDelay="0.5">
                        <template slot="title">
                            <span>最大化</span>
                        </template>
                        <a class="action-item muted" @click="max()"><a-icon type="plus"/></a>
                     </a-tooltip>
                     <a-tooltip :mouseEnterDelay="0.5">
                        <template slot="title">
                            <span>关闭面板</span>
                        </template>
                        <a class="action-item muted" @click="close()"><a-icon type="close"/></a>
                     </a-tooltip>
                    </span>
                    </div>
                    <div class="task-wrap" style="border: 1px solid #e5e5e5;">
                        <div class="task-content">
                            <iframe  :src="url" height="700px" width="100%" scrolling="no"></iframe>
                        </div>
                    </div>
                </a-spin>
            </div>
        </a-modal>
    </div>

</template>

<script>
    import _ from 'lodash'
    import moment from 'moment';
    import {inviteMember, searchInviteMember} from "../../api/projectMember";
    import {checkResponse} from "../../assets/js/utils";
    import {createInviteLink} from "../../api/common/common";

    export default {
        name: "box",
        props: {
            value: {
                type: Boolean,
                default() {
                    return false
                }
            },
            projectCode: {
                type: [String, Number],
                default() {
                    return ''
                }
            }
        },
        data() {
            return {
                loading: false,
                flag: true,
                url: 'http://193.112.27.123:8012/onlinePreview?url=http%3A%2F%2F193.112.27.123%3A8012%2Fdemo%2Ftimg.gif',
                actionInfo: {
                    modalStatus: this.value,
                    confirmLoading: false,
                    modalTitle: '查看文件',
                    url: 'http://193.112.27.123:8012/onlinePreview?url=http%3A%2F%2F193.112.27.123%3A8012%2Fdemo%2Ftimg.gif'
                }
            };
        },
        watch: {
            value(value) {
                this.actionInfo.modalStatus = value;
            }
        },
        methods: {
            invite(item) {
                inviteMember(item.memberCode, this.projectCode).then((res) => {
                    const success = checkResponse(res);
                    if (success) {
                        item.joined = true;
                    }
                })
            },
            cancel() {
                this.actionInfo.modalStatus = false;
                this.$emit('input', this.actionInfo.modalStatus);
            }
        }
    }
</script>

<style lang="less">
    .file-box {
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
