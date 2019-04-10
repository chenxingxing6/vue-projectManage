<template>
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
</template>

<script>
    import $ from 'jquery'
    import {notice} from "@/assets/js/notice";

    export default {
        name: "task-detail",
        data() {
            return {
                loading: false,
                flag: true,
                url: 'http://193.112.27.123:8012/onlinePreview?url=http%3A%2F%2F193.112.27.123%3A8012%2Fdemo%2Ftimg.gif',
            }
        },
        methods: {
            close() {
                this.flag = false;
            },
            max() {
                $(".task-detail-spin").css("width", "100%");
            },
            reset() {
                $(".task-detail-spin").css("width", "50%");
            },
        }
    }
</script>


<style lang="less">
    @import "~ant-design-vue/lib/style/themes/default";

    .task-detail {
        background: #FFF;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        min-height: 1px;
        min-width: 1px;
        margin: 10px auto;

        .task-detail-spin {
            width: 50%;
            height: 80%;
        }

        .task-header {
            padding: 20px 0;
            border: 1px solid #e5e5e5;
            background: whitesmoke;
            display: flex;
            vertical-align: middle;


            .head-title {
                padding: 0 20px 0 20px;
                flex: 1 1;

                .breadcrumb {
                    display: inline;

                    a {
                        color: inherit;

                        &:hover {
                            color: #40a9ff;
                        }

                    }
                }
            }

            .header-action {
                font-size: 16px;
                padding: 0 20px;
                display: flex;
                max-height: 24px;

                .action-item {
                    margin-left: 10px;
                    padding: 4px;
                    transition: 218ms;
                    transition-property: background, color;
                    border-radius: 4px;
                    align-items: center;
                    display: flex;
                    text-align: center;
                    justify-content: center;
                    min-width: 32px;

                    span {
                        margin-left: 6px;
                        font-size: 14px;
                    }

                    &.active {
                        color: #3da8f5;
                    }

                    &:hover {
                        background: #ecf6fe;
                        color: #3da8f5;
                        border-radius: 4px;
                    }
                }
            }

            &.disabled {
                background: #f5f5f5;
            }
        }

    }
</style>
