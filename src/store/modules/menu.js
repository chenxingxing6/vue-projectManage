import {getMenuForUser} from "@/api/menu";
import {getStore, setStore} from '@/assets/js/storage';
import {getMenu} from "../../api/menu";

const common = {
    state: {
        menu: getStore('menu', true),
        breadCrumbInfo: []
    },
    mutations: {
        SET_MENU(state, data) {
            state.menu = data;
        },
        setBreadCrumbInfo(state, data) {
            state.breadCrumbInfo = data;
        }
    },
    actions: {
        GET_MENU({commit}) {
            getMenu().then(res => {
                console.log("获取菜单："+res.data);
                setStore('menu', res.data);
                commit('SET_MENU', res.data);
            });
        },
        SET_MENU({commit},data) {
            setStore('menu', data);
            commit('SET_MENU', data);
        },
        setBreadCrumbInfo({commit}, data) {
            commit('setBreadCrumbInfo', data);
        }
    }

};
export default common
