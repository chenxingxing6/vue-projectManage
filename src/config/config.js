export default {
    crossDomain: false, //是否开启跨域支持
    //PROD_URL: 'https://beta.vilson.xyz/index.php/', //生产环境接口地址
    PROD_URL: 'http://localhost:8888/api', //生产环境接口地址(网关)服务器url
    MOCK_URL: 'https://result.eolinker.com/1DVzyqbab364c82aaead42f24de532c4c046e6805221c90?uri=/', //mock数据url
    WS_URI: 'ws://localhost:8888/websocket', //WebSocket地址
    HOME_PAGE: '/home',//主页路由
    ERROR_PAGE_URL: 'http://ppkn5nh6t.bkt.clouddn.com/upload/20190410/dbf66652effa4b309d98b00946043690.jpeg',//404页面图片
    VIEW_FILE_SERVER_LOCAL: 'http://localhost:8012/onlinePreview?url=', //本地查看文件服务器
    VIEW_FILE_SERVER_SERVER: 'http://193.112.27.123:8012/onlinePreview?url=', //远程查看文件服务器
};
