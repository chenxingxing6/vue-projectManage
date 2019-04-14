<template>
    <div class="inviteFromLink" style="height: 100%;">
        <div class="content">
            <a-spin :spinning="loading">
                <a-card :title="`来自  [${inviteLink.member.dept} - ${inviteLink.member.userName}]  的分享`">
                    <div class="header">
                    <span>
                       <a @click="seeBox(inviteLink.member)"> {{inviteLink.member.fileName}} </a>
                    </span>
                    </div>
                    <div class="member-info">
                        <div class="avatar">
                            <a-avatar size="large" :src="inviteLink.member.imgPath"></a-avatar>
                        </div>
                        <div class="info">
                            <p>{{inviteLink.member.userName}}</p>
                            <p class="muted">{{inviteLink.member.email}}</p>
                        </div>
                    </div>
                    <a-button type="primary" block size="large" class="middle-btn" @click="acceptFile">
                        <span>提取文件</span>
                    </a-button>
                </a-card>
            </a-spin>
        </div>
        <box v-model="showInviteMember" v-if="showInviteMember" :seeUrl="seeUrl"></box>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {checkResponse} from "@/assets/js/utils";
    import {getLinkInfo, shareToUser} from "../../api/mock";
    import {notice} from "../../assets/js/notice";
    import box from '../../components/file/box'

    export default {
        components: {
            'box':box,
        },
        data() {
            return {
                loading: false,
                inviteLink: {
                    member: {
                        name: 11,
                        email: '341'
                    }
                },
                code :this.$route.query.code,
                seeUrl: '',
                showInviteMember: false,
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
            })
        },
        created() {
            this.getInviteInfo();
        },
        methods: {
            getInviteInfo() {
                this.loading = true;
                getLinkInfo({code: this.code}).then(res => {
                    this.inviteLink.member = res.data;
                    this.loading = false;
                });
            },
            acceptFile() {
                shareToUser(this.inviteLink.member.userId, this.inviteLink.member.fileId).then((res) => {
                    const success = checkResponse(res);
                    if (success) {
                        notice({
                            title: '提取成功',
                        }, 'notice', 'success');
                    }
                })
            },
            seeBox(file) {
                this.showInviteMember = true;
                this.seeUrl = "http://localhost:8012/disk/"+ file.fileName;
            },
        }
    }
</script>
<style lang="less">
    .inviteFromLink {
        .content {
            width: 600px;
            margin: 50px auto;

            .header {
                font-size: 18px;
            }

            .member-info {
                margin: 36px 0;
                display: flex;
                align-items: center;

                .avatar {
                    margin-right: 12px;
                }

                .info {
                    p {
                        margin: 0;
                    }
                }
            }
        }
    }
</style>
