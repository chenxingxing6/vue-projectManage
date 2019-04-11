<template>
    <div class="home-index">
        <div class="page-header">
            <p class="day-text muted">『 {{ yiyan.hitokoto }}』 —— 《{{ yiyan.from }}》 <a class="muted" @click="getYiYan">
                <a-icon type="reload"/>
            </a>
            </p>
            <div class="header-content">
                <div class="left-content">
                    <div class="avatar">
                        <a-avatar :size="64" :src="userInfo.imgPath">{{userInfo.username}}</a-avatar>
                    </div>
                    <div class="user-info">
                        <div class="title">{{helloTime}}{{ userInfo.username }}，祝你开心每一天！</div>
                        <div class="team muted">{{userInfo.companyName}} | {{ userInfo.deptName }}</div>
                    </div>
                </div>
                <div class="right-content">
                    <div class="content-item">
                        <div class="item-title muted">
                            分享数
                        </div>
                        <div class="item-text">
                            <span>{{shareNum}}</span>
                        </div>
                    </div>
                    <div class="content-item">
                        <div class="item-title muted">
                            文件总数
                        </div>
                        <div class="item-text">
                            <span>{{fileNum}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-wrapper">
            <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
                <div class="salesCard">
                    <a-tabs default-active-key="1" size="large"
                            :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
                        <a-tab-pane forceRender tab="文件数" key="1">
                            <a-row>
                                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                                    <div class="chart-wrappers-single">
                                        <ve-histogram
                                                :data="projectTotalData.chartData"
                                                :settings="projectTotalData.chartSettings"
                                                :extend="projectTotalData.chartExtend"
                                                :legend-visible="false"
                                                height="300px"></ve-histogram>
                                    </div>
                                </a-col>
                                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                                    <rank-list title="文件数排行榜" :list="rankList"/>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane forceRender tab="分享数" key="2">
                            <a-row>
                                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                                    <div class="chart-wrappers-single">
                                        <ve-histogram
                                                :data="projectTotalData.chartData"
                                                :settings="projectTotalData.chartSettings"
                                                :extend="projectTotalData.chartExtend"
                                                :legend-visible="false"
                                                height="300px"></ve-histogram>
                                    </div>
                                </a-col>
                                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                                    <rank-list title="分享数排行榜" :list="rankList"/>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-card>
            <a-row :gutter="12">
                <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="20">
                    <a-card :loading="loading" :bordered="false" title="最近操作记录" :style="{ marginTop: '24px' }">
                        <div class="block">
                            <el-timeline>
                                <div v-for="item in operateLogs">
                                    <el-timeline-item placement="top">
                                        <el-card>
                                            <h4>{{item.operation}}</h4>
                                            <p>{{item.userName}} 提交于 {{item.createTime}}</p>
                                        </el-card>
                                    </el-timeline-item>
                                    <br>
                                </div>
                            </el-timeline>
                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {getYiYan} from "../../api/other";
    import {formatTaskTime, relativelyTime, showHelloTime} from "../../assets/js/dateTime";
    import VeLine from 'v-charts/lib/line.common'
    import VeHistogram from 'v-charts/lib/histogram.common'
    import ChartCard from '@/components/chart/ChartCard'
    import Trend from '@/components/Trend'
    import MiniProgress from '@/components/chart/MiniProgress'
    import RankList from '@/components/chart/RankList'
    import pagination from "@/mixins/pagination";
    import {getOperateLog, getIndexData} from "../../api/mock";


    export default {
        components: {
            VeLine,
            VeHistogram,
            ChartCard,
            MiniProgress,
            Trend,
            RankList
        },
        mixins: [pagination],
        data() {
            return {
                loading: false,
                yiyan: {},
                operateLogs: [],
                shareNum:0,
                fileNum:0,
                rankList:[],
                projectTotalData: {
                    chartData: {
                        columns: ['日期', '数量'],
                        rows: []
                    },
                    chartSettings: {
                        itemStyle: {
                            color: '#1890ff'
                        },
                    },
                    chartExtend: {
                        grid: {
                            left: '30',
                            right: '0',
                            top: '15',
                            bottom: '0'
                        },
                        series: {
                            barWidth: 45,
                        },
                    }
                },

            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
            }),
            helloTime() {
                return showHelloTime()
            }
        },
        created() {
           this.getYiYan();
           this.getOperateLog();
           this.getIndexData();
        },
        methods: {
            getYiYan() {
                let app = this;
                getYiYan(function (data) {
                    app.yiyan = data
                }, 'd')
            },
            formatTime(time) {
                return relativelyTime(time);
            },
            showTaskTime(time, timeEnd) {
                return formatTaskTime(time, timeEnd);
            },
            getOperateLog(){
                var app = this;
                app.loading = true;
                getOperateLog().then(res => {
                    app.operateLogs = res.data.list;
                    app.loading = false;
                }).catch(()=>{
                });
            },
            getIndexData() {
                var app = this;
                app.loading = true;
                getIndexData().then(res => {
                    app.projectTotalData.chartData.rows = res.data.rankdatas;
                    app.rankList = res.data.ranks;
                    app.shareNum = res.data.shareNum;
                    app.fileNum = res.data.fileNum;
                    app.loading = false;
                }).catch(()=>{
                });
            }
        }
    }
</script>
<style lang="less">
    .home-index {
        margin: 10px auto;

        .page-header {
            .header-content {
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;

                .left-content {
                    display: flex;
                    align-items: center;

                    .user-info {
                        margin-left: 12px;
                        line-height: 33px;

                        .title {
                            font-size: 20px;
                        }

                        .team {

                        }
                    }
                }

                .right-content {
                    display: flex;

                    .content-item {
                        padding: 0 32px;
                        position: relative;

                        .item-text {
                            font-size: 30px;

                            .small {
                                font-size: 20px;
                            }
                        }

                        &:after {
                            background-color: #e8e8e8;
                            position: absolute;
                            top: 8px;
                            right: 0;
                            width: 1px;
                            height: 40px;
                            content: "";
                        }

                        &:last-child {
                            &:after {
                                width: 0;
                            }
                        }
                    }
                }
            }
        }

        .page-wrapper {
            margin: 24px;

            .project-list {

                .card-title {
                    font-size: 0;

                    a {
                        color: rgba(0, 0, 0, 0.85);
                        margin-left: 12px;
                        line-height: 24px;
                        height: 24px;
                        display: inline-block;
                        vertical-align: top;
                        font-size: 14px;

                        &:hover {
                            color: #1890ff;
                        }
                    }
                }

                .card-description {
                    color: rgba(0, 0, 0, 0.45);
                    height: 44px;
                    line-height: 22px;
                    overflow: hidden;
                    .description-text{
                        height: 22px;
                    }
                }

                .project-item {
                    display: flex;
                    margin-top: 8px;
                    overflow: hidden;
                    font-size: 12px;
                    height: 20px;
                    line-height: 20px;

                    a {
                        color: rgba(0, 0, 0, 0.45);
                        display: inline-block;
                        flex: 1 1 0;

                        &:hover {
                            color: #1890ff;
                        }
                    }

                    .datetime {
                        color: rgba(0, 0, 0, 0.25);
                        flex: 0 0 auto;
                        float: right;
                    }
                }

                .ant-card-meta-description {
                    color: rgba(0, 0, 0, 0.45);
                    height: 44px;
                    line-height: 22px;
                    overflow: hidden;
                }
            }

            .activities-list {
                .ant-list-item-meta-title {
                    position: relative;
                }

                .comment-text {
                    margin-bottom: 0;
                }

                .right-item {
                    float: right;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }

            .tasks-list {
                .ant-card-body {
                    padding: 6px 24px;
                }
            }

            .item-group {
                padding: 20px 0 8px 24px;
                font-size: 0;

                a {
                    color: rgba(0, 0, 0, 0.65);
                    display: inline-block;
                    font-size: 14px;
                    margin-bottom: 13px;
                    width: 25%;
                }
            }

            .members {
                a {
                    display: block;
                    margin: 12px 0;
                    line-height: 24px;
                    height: 24px;

                    .member {
                        font-size: 14px;
                        color: rgba(0, 0, 0, .65);
                        line-height: 24px;
                        max-width: 100px;
                        vertical-align: top;
                        margin-left: 12px;
                        transition: all 0.3s;
                        display: inline-block;
                    }

                    &:hover {
                        span {
                            color: #1890ff;
                        }
                    }
                }
            }
        }
    }
</style>
