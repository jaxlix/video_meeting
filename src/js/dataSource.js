import { post, postJson, get } from '@/http/http'
import store from '../store/store';

/** 
 * vue: 目标对象
 * dataName: 目标对象data名称
 * type: 数据源获取方式, get/post/postJson/json
 * url: 数据源地址
 * paging: 是否分页获取数据
 * pagingRow: 分页总条数
 * params: 数据获取参数
**/
export default class DataSource {
    constructor(params) {
        // 目标对象
        this.targetObject = params.vue
        // data名称
        this.dataName = params.dataName
        // 数据源获取方式
        this.type = params.type
        // 数据源地址
        this.url = params.url
        // 是否分页获取数据
        this.paging = params.paging
        // 每一页获取的数据行数
        this.pagingRow = params.pagingRow
        // 数据源获取接口请求参数
        this.params = {}
        //  是否保存数据到数据源，默认为true
        this.save = params.save === false ? false : true
        // 是否有分页
        if (this.paging) {
            this.params.pagingRow = this.pagingRow ? this.pagingRow : 10
        }
        // 是否有参数
        if (params.params) {
            this.params = Object.assign(this.params, params.params)
        }
        this.getData()
    }
    // 获取数据
    getData () {
        this[this.type]()
    }
    // get请求
    get() {
        // this.targetObject[this.dataName] += 1
        get(this.url, this.params).then(res => {
            this.targetObject[this.dataName] = res.data
            if(this.save){
                this.setData(res.data)
            }
        })
    }
    // post请求,formdata格式
    post() {
        post(this.url, this.params).then(res => {
            this.targetObject[this.dataName] = res.data
            if(this.save){
                this.setData(res.data)
            }
        })
    }
    // post请求,json格式
    postJson() {
        postJson(this.url, this.params).then(res => {
            this.targetObject[this.dataName] = res.data
            if(this.save){
                this.setData(res.data)
            }
        })
    }
    // 引入本地json方式, url为json文件名
    json() {
        let data = require('../json/' + this.url + '.json')
        this.targetObject[this.dataName] = data
        if(this.save){
            this.setData(data)
        }
    }
    // 将数据保存到dataSource
    setData(data) {
        if(Array.isArray(data) && data.length > 0 && data[0].type != undefined){
            let dataSource = store.state.dataSource
            let obj = {
                "data": data
            }
            if(dataSource[data[0].type] == null || dataSource[data[0].type] == undefined){
                obj.show = true
            }else{
                obj.show = dataSource[data[0].type].show
            }
            // 判断两个对象不相等，更新数据源
            if(!this.isObjectValueEqual(obj, dataSource[data[0].type])){
                dataSource[data[0].type] = obj
                store.commit("setDataSource", dataSource);
                console.log('更新数据源')
            }
        }
    }
    // 对比两个对象的值是否完全相等 返回值 true/false
    isObjectValueEqual (a, b) {
        if(a == undefined || b == undefined){
            return false;
        }
        //取对象a和b的属性名
        let aProps = Object.getOwnPropertyNames(a);
        let bProps = Object.getOwnPropertyNames(b);
        //判断属性名的length是否一致
        if (aProps.length != bProps.length) {
            return false;
        }
        //循环取出属性名，再判断属性值是否一致
        for (let i = 0; i < aProps.length; i++) {
          let propName = aProps[i];
          if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    }
}