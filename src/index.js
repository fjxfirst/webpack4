import hy from './img/hy.jpg'
import imgStyle from './style/index.scss'
const root = document.getElementById('root')
const hyImg = new Image()
hyImg.src=hy
hyImg.className=imgStyle.hy
root.appendChild(hyImg)
var a = 'fengjianxiong'
console.log(a)