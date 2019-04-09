<template>
    <div class="house-index">
        <wrapper-content>
            <div class="page-search">
                <a-form
                        layout="inline"
                        :autoFormCreate="(form)=>{this.searchForm = form}"
                        @submit.prevent="handleSearchSubmit">
                    <a-form-item
                            label='关键字'
                            fieldDecoratorId="title">
                        <a-input placeholder='请输入关键字'/>
                    </a-form-item>
                    <a-form-item
                            label='日期'
                            fieldDecoratorId="date">
                        <a-range-picker :placeholder="['开始日期','结束日期']"></a-range-picker>
                    </a-form-item>
                    <a-form-item>
                        <a-button icon="search" type="primary" htmlType='submit'
                                  :loading="searchLoading">搜索
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>

            <a-table :columns="columns" :dataSource="dataSource" :loading="loading" :showTotal="pagination.showTotal" :pagination="pagination"
                     @change="pageChange" rowKey="id">
            <p slot="expandedRowRender" slot-scope="record" style="margin: 0" v-html="record.content"></p>
            </a-table>
        </wrapper-content>
    </div>
</template>
<script>
    import {checkResponse} from '@/assets/js/utils';
    import {getNotice} from "../../api/mock";
    import pagination from "@/mixins/pagination";

    const columns = [{
        title: '公告标题',
        dataIndex: 'title',
    },{
        title: '时间',
        dataIndex: 'create_time',
        width: '30%',
    },{
        title: '创建者',
        dataIndex: 'create_user',
        width: '30%',
    }];
    export default {
        mixins: [pagination],
        data() {
            return {
                columns,
                dataSource: [],
                loading: true,
                searchForm: {},
                searchLoading: false,
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let app = this;
                app.requestData.type = 'system';
                app.loading = false;
                getNotice(app.requestData).then(res => {
                    app.dataSource = res.data.list;
                    app.pagination.total = res.data.total;
                    app.loading = false;
                });
            },
            handleSearchSubmit() {
                let app = this;
                app.searchForm.validateFields(
                    (err, values) => {
                        if (!err) {
                            app.search();
                        }
                    })
            },
            search(){
                let obj = this.searchForm.getFieldsValue();
                if (obj.date && obj.date.length > 0) {
                    const beginDate = obj.date[0].format('YYYY-MM-DD');
                    const endDate = obj.date[1].format('YYYY-MM-DD');
                    obj.date = beginDate + '~' + endDate;
                }
                Object.assign(this.requestData, obj);
                this.init();
            }
        }
    }
</script>
