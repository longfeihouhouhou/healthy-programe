import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 导入 Vant
import { 
  Button,
  Form,
  Field,
  Toast,
  Dialog,
  Tabbar,
  TabbarItem,
  NavBar,
  Icon,
  Image as VanImage,
  Grid,
  GridItem,
  Cell,
  CellGroup,
  Uploader,
  PullRefresh,
  List,
  Popup,
  Switch
} from 'vant'
import 'vant/lib/index.css'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 注册 Vant 组件
app.use(Button)
app.use(Form)
app.use(Field)
app.use(Toast)
app.use(Dialog)
app.use(Tabbar)
app.use(TabbarItem)
app.use(NavBar)
app.use(Icon)
app.use(VanImage)
app.use(Grid)
app.use(GridItem)
app.use(Cell)
app.use(CellGroup)
app.use(Uploader)
app.use(PullRefresh)
app.use(List)
app.use(Popup)
app.use(Switch)

app.use(createPinia())
app.use(router)

app.mount('#app')
