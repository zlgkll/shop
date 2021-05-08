import Vue from 'vue'
import {
    Button,
    Form,
    Input,
    FormItem,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card
} from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input)
Vue.use(Container).use(Header).use(Aside).use(Main).use(Menu).use(Submenu).use(MenuItem)
Vue.use(Breadcrumb).use(BreadcrumbItem).use(Card)

Vue.prototype.$message = Message