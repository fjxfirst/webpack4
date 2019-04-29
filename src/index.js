import hy from './img/hy.jpg'
// import './style/index.scss'
//import  _ from 'lodash'
const hyImg = new Image()
hyImg.src=hy
hyImg.className='hy'
document.body.appendChild(hyImg)


/*const div1 = document.createElement('div')
div1.innerHTML='<i class="iconfont hello">&#xe851;</i>'
document.body.appendChild(div1)*/
console.log(123)
import './style/style.css'
const btn =document.createElement('button')
btn.innerHTML='new btn'
document.body.appendChild(btn)
btn.onclick=function () {
  const div =document.createElement('div')
  div.innerHTML='item'
  document.body.appendChild(div)
}
const arr=[
  new Promise(()=>{}),
  new Promise(()=>{})
]
arr.map((item)=>{
  console.log(item)
})
function getComponent() {
  return import(/*webpackChunkName:"lodash"*/ 'lodash')
}
getComponent()