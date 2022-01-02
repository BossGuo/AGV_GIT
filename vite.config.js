import { defineConfig } from 'vite'
import{join} from 'path';
import vue from '@vitejs/plugin-vue'
function resolve(dir) {
    return join(__dirname, dir);
}
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve('src'),
        }
    },
    server: {
        // cors: true, // 默认启用并允许任何源
        // open: true, // 在服务器启动时自动在浏览器中打开应用程序
        port: 3000,
        //反向代理配置，注意rewrite写法，开始没看文档在这里踩了坑
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:10086', //代理接口
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },

})