import Storage from 'react-native-storage'
import AsyncStorage from '@react-native-community/async-storage'

const storage = new Storage({
    size: 5000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    // 你可以在构造函数这里就写好sync的方法 
    // 或是在任何时候，直接对storage.sync进行赋值修改 
    // 或是写到另一个文件里，这里require引入
    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // sync: require('你可以另外写一个文件专门处理sync'),
})
storage.sync = {
    searchHistory() {
        return []
    },
    star() {
        return false
    },
    history() {
        return false
    }
}
export default storage