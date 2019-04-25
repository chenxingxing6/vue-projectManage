<template>
    <div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {getStore, setStore} from '@/assets/js/storage';
    import config from "../../config/config";
    import {notice} from "../../assets/js/notice";


    export default {
        data() {
            return {
                websocket: null,
                loginData: null,
                member: null
            }
        },
        methods: {
            initWebSocket() { //初始化weosocket
                const app = this;
                //ws地址
                const WS_URI = config.WS_URI;
                this.websocket = new WebSocket(WS_URI);
                //打开事件
                this.websocket.onopen = function() {
                    console.log("Socket 已打开");
                    //socket.send("这是来自客户端的消息" + location.href + new Date());
                };
                //获得消息事件
                this.websocket.onmessage = function(res) {
                    this.loginData = JSON.parse(res.data);
                    if (this.loginData.code === 500){
                        notice({title: this.loginData.msg}, 'notice', 'error');
                    }
                    if (this.loginData.msg === 'login'){
                        this.member = this.loginData.data.member;
                        const obj = {
                            userInfo: this.member,
                            tokenList: 7033929,
                        };
                        console.log(obj)
                        setStore("token", this.loginData.token);
                        app.$store.dispatch('SET_LOGGED', obj);
                        app.$store.dispatch('GET_MENU').then(() => {
                            app.loginBtn = false;
                            app.$router.push(config.HOME_PAGE );
                        });
                    }
                };
                //关闭事件
                this.websocket.onclose = function() {
                    console.log("Socket已关闭");
                };
                //发生了错误事件
                this.websocket.onerror = function() {
                    notice({title: 'Socket发生了错误'}, 'notice', 'error');
                }
            },
       /*     loginSuccess(res) {
                setTimeout(() => {
                    const menu = getStore('menu', true);
                    if (menu) {
                        let routes = this.$router.options.routes;
                        menu.forEach(function (v) {
                            routes[0].children.push(createRoute(v));
                            if (v.children) {
                                v.children.forEach(function (v2) {
                                    routes[0].children.push(createRoute(v2));
                                    if (v2.children) {
                                        v2.children.forEach(function (v3) {
                                            routes[0].children.push(createRoute(v3));
                                        });
                                    }
                                });
                            }
                        });
                        this.loginBtn = false;
                        this.$router.addRoutes(routes);
                        let redirect = this.$route.query.redirect || config.HOME_PAGE;
                        this.$router.push({
                            path: redirect
                        });
                        this.$notification.success({
                            message: '欢迎',
                            description: `${res.data.member.username}，${timeFix()}，欢迎回来`,
                        })
                    }
                }, 500);
            },*/
        },
        created() {
            this.initWebSocket()
        }
    }
</script>
