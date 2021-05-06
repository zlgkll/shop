import Vue from 'vue'
import { Button, Form, Input, FormItem, Message } from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input)

Vue.prototype.$message = Message
