import { resolve } from 'path'
import { PluginOption } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import type { ViteEnvType } from './getEnv'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import UnoCSS from 'unocss/vite'
import vueJsx from "@vitejs/plugin-vue-jsx";

/** 
 *  @description 创建 vite 插件
 */
export const createVitePlugins = (viteEnv: ViteEnvType): (PluginOption | PluginOption[])[] => {
  const { VITE_TITLE, VITE_ANALYSIS, VITE_GZIP_COMPRESS } = viteEnv
  return [
    vueJsx(),
    UnoCSS(),
    vue(),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等。以及导入naive-ui相关的 API
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ],
      // 生成声明文件的位置
      dts: resolve(__dirname, '../src/types/auto-imports.d.ts')
    }),
    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        NaiveUiResolver(),
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep', 'carbon']
        })
      ],
      dts: resolve(__dirname, '../src/types/components.d.ts')
    }),
    Icons({
      autoInstall: false
    }),
    // esLint 报错信息显示在浏览器界面上
    eslintPlugin(),
    // 注入变量到 html 文件
    createHtmlPlugin({
      inject: {
        data: { title: VITE_TITLE }
      }
    }),
    // 使用 svg 图标
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, '../src/assets/svg')],
      symbolId: 'icon-[name]'
    }),
    // 是否生成包预览，分析依赖包大小做优化处理
    VITE_ANALYSIS &&
    (visualizer({
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true
    }) as PluginOption),
    // GZIP 压缩，压缩速度更快
    VITE_GZIP_COMPRESS &&
    viteCompression({
      ext: '.gz',
      algorithm: 'gzip',
      deleteOriginFile: false
    })
  ]
}
