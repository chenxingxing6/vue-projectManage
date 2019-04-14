# pearProject Mac下开发

基于Vue.js实现的项目管理系统


2019.4.11  前端mock数据完毕
2019.4.12  登陆接口实现完成


base-vue：用户头像上传    
```js
uploadAction: 'http://localhost:9000/front/app/updateImg'
```

---
seeBox: 文件查看
```
getUrl(fileUrl){
    return getFileUrl(fileUrl, 'local');
}
```

---
文件下载(资源库，分享，网盘)
```js
downLoad(file) {
    window.location.href = "http://localhost:8888/api/fileDownload?fileId="+file.id;
},
```


