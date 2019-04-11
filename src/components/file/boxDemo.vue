<template>
    <div>
        <a-modal
                class="file-box"
                :width="800"
                v-model="actionInfo.modalStatus"
                :title="actionInfo.modalTitle"
                :footer="null"
                @Max = "max"
                @cancel="cancel">
            <div class="search-content">
                <iframe  :src="actionInfo.url" height="700px" width="100%" scrolling="no"></iframe>
            </div>
        </a-modal>
    </div>

</template>

<script>
    import _ from 'lodash'

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
                form: this.$form.createForm(this),
                actionInfo: {
                    modalStatus: this.value,
                    confirmLoading: false,
                    modalTitle: '查看文件',
                    url: 'http://193.112.27.123:8012/onlinePreview?url=http%3A%2F%2F193.112.27.123%3A8012%2Fdemo%2Ftimg.gif'
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
                // emptyText: keyword ? '没有搜索结果' : ''
            };
        },
        watch: {
            value(value) {
                this.actionInfo.modalStatus = value;
            },
            keyword() {
                this.search();
            }
        },
        methods: {
            invite(item) {

            },
            createInviteLink() {
                if (!this.linkInfo.link) {

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
