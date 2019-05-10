<template>
    <div class="wrap" v-if="flag">
   <div class="my-box" >
       <a-spin class="task-detail-spin" :spinning="loading">
           <div class="task-header" style="background: white;">
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
           <div class="task-wrap">
               <div class="task-content">
                   <iframe :src="getUrl(seeUrl)" height="500px" width="100%"></iframe>
               </div>
           </div>
       </a-spin>
   </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import {getFileUrl} from "../../assets/js/utils";

    export default {
        name: "box-detail",
        props: {
            value: {
                type: Boolean,
                default() {
                    return false
                }
            },
            seeUrl: {
                type: [String],
                default() {
                    return ''
                }
            }
        },
        data() {
            return {
                loading: false,
                flag: true,
            }
        },
        create: function(){
            this.flag = true;
        },
        watch: {
            value(value) {
                this.flag = value;
            },
            seeUrl(seeUrl){
                this.seeUrl = seeUrl;
            }
        },
        methods: {
            close() {
                this.flag = false;
                this.$emit('input', this.flag);
            },
            max() {
                $(".task-detail-spin").css("width", "100%");
                $(".task-detail-spin").css("height", "100%");
            },
            reset() {
                $(".task-detail-spin").css("width", "50%");
            },
            getUrl(fileUrl){
                return getFileUrl(fileUrl, 'local');
            }
        }
    }
</script>

<style lang="less">
    @import "~ant-design-vue/lib/style/themes/default";

    .wrap{
        position: fixed;
        bottom: 0;
        top: 0;
        left: 0;
        background: rgba(113, 111, 111, 0.5);
        width: 100%;

        .my-box {
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
            margin: 100px auto;
            margin-top: 70px;

            .task-detail-spin {
                width: 50%;
                height: 20%;
            }

            .task-header {
                background: white;
                padding: 10px 0;
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

            .task-wrap{
                background: white;
            }

        }
    }
</style>
