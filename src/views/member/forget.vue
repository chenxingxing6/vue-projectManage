<template>
    <div class="main user-layout-register">
        <h3><span>找回密码</span></h3>
        <a-form ref="formForget" :autoFormCreate="(form)=>{this.form = form}" id="formForget">
            <a-form-item
                    fieldDecoratorId="mobile"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ }, { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur'] }">
                <a-input size="large" placeholder="11 位手机号">
                    <a-select slot="addonBefore" size="large" defaultValue="+86">
                        <a-select-option value="+86">+86</a-select-option>
                        <!--<a-select-option value="+87">+87</a-select-option>-->
                    </a-select>
                </a-input>
            </a-form-item>
            <a-row :gutter="16">
                <a-col class="gutter-row" :span="16">
                    <a-form-item
                            fieldDecoratorId="captcha"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}">
                        <a-input size="large" type="text" placeholder="验证码">
                            <a-icon slot="prefix" type='mail' :style="{ color: 'rgba(0,0,0,.25)' }"/>
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="8">
                    <a-button
                            class="getCaptcha"
                            size="large"
                            :disabled="state.smsSendBtn"
                            @click.stop.prevent="getCaptcha"
                            v-text="!state.smsSendBtn && '获取验证码'||(state.time+' s')"></a-button>
                </a-col>
            </a-row>

            <a-form-item>
                <a-button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        class="register-button"
                        :loading="findBtn"
                        @click.stop.prevent="handleSubmit"
                        :disabled="findBtn">确认
                </a-button>
                <router-link class="login" :to="{ name: 'login' }">返回登录页面</router-link>
            </a-form-item>

        </a-form>
    </div>
</template>

<script>
    import md5 from 'md5'
    import {getCaptcha, forget} from '@/api/user'
    import {checkResponse} from "../../assets/js/utils";
    import {notice} from "../../assets/js/notice";

    const levelNames = {
        0: '低',
        1: '低',
        2: '中',
        3: '强'
    };
    const levelClass = {
        0: 'error',
        1: 'error',
        2: 'warning',
        3: 'success'
    };
    const levelColor = {
        0: '#ff0000',
        1: '#ff0000',
        2: '#ff7e05',
        3: '#52c41a',
    };
    export default {
        name: 'forget',
        components: {},
        data() {
            return {
                form: null,

                state: {
                    time: 60,
                    smsSendBtn: false,
                    percent: 10,
                    progressColor: '#FF0000'
                },
                findBtn: false
            }
        },
        computed: {
        },
        methods: {
            handlePhoneCheck(rule, value, callback) {
                // console.log('handlePhoneCheck, value', value);
                // console.log('handlePhoneCheck, callback', callback);
                callback()
            },
            handleSubmit() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.findBtn = true;
                        let params = this.form.getFieldsValue();
                        forget(params).then(res => {
                            this.findBtn = false;
                            if (!checkResponse(res)) {
                                return false;
                            }
                            notice({title: '提示', msg: '注册成功，请登陆'}, 'notification', 'success');
                            this.$router.push({name: 'login'})
                        });
                    }
                })
            },

            getCaptcha(e) {
                e.preventDefault();
                const that = this;
                this.form.validateFields(['mobile'], {force: true},
                    (err, values) => {
                        if (!err) {
                            this.state.smsSendBtn = true;

                            const interval = window.setInterval(() => {
                                if (that.state.time-- <= 0) {
                                    that.state.time = 60;
                                    that.state.smsSendBtn = false;
                                    window.clearInterval(interval)
                                }
                            }, 1000);

                            const hide = this.$message.loading('验证码发送中..', 0);
                            getCaptcha(values.mobile)
                                .then(res => {
                                    this.$message.destroy();
                                    if (!checkResponse(res)) {
                                        return false;
                                    }
                                    let tips = '验证码获取成功';
                                    if (res.data) {
                                        tips += '，您的验证码为：' + res.data;
                                    }
                                    this.$notification['success']({
                                        message: '提示',
                                        description: tips,
                                        duration: 8,
                                        placement: 'bottomLeft'
                                    })
                                })
                                .catch(err => {
                                    setTimeout(hide, 1);
                                    clearInterval(interval);
                                    this.state.time = 60;
                                    this.state.smsSendBtn = false;
                                    this.requestFailed(err)
                                })
                        }
                    }
                )
            },
            requestFailed(err) {
                this.$notification['error']({
                    message: '错误',
                    description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
                    duration: 4,
                });
                this.findBtn = false
            },
        },
        watch: {
            'state.passwordLevel'(val) {
                // console.log(val)

            }
        }
    }
</script>
<style lang="less">
    .user-register {

        &.error {
            color: #ff0000;
        }

        &.warning {
            color: #ff7e05;
        }

        &.success {
            color: #52c41a;
        }


    }

    .user-layout-register {
        .ant-input-group-addon:first-child {
            background-color: #fff;
        }
    }
</style>
<style lang="less">
    .user-layout-register {

        & > h3 {
            font-size: 16px;
            margin-bottom: 20px;
        }


        .getCaptcha {
            display: block;
            width: 100%;
            height: 40px;
        }

        .register-button {
            width: 50%;
        }

        .login {
            float: right;
            line-height: 40px;
        }
    }
</style>
