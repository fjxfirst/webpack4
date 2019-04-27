import hy from './img/hy.jpg'
import './style/index.scss'

const root = document.createElement('div')
const hyImg = new Image()
hyImg.src=hy
hyImg.className='hy'
document.body.appendChild(hyImg)

const div1 = document.createElement('div')
div1.innerHTML='<i class="iconfont">&#xe851;</i>'
root.appendChild(div1)