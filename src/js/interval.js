// 数据源刷新定时器
// list：数据源实例对象
// time：定时器时间
let interval = function (list, time) {
    if (!Array.isArray(list)) {
        return false
    }
    clearInterval(timer)
    var timer = setInterval(() => {
        list.forEach(item => {
            item.getData()
        })
    }, time)
    return timer
}

export default interval