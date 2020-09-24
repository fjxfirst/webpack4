import './style/index.css';
import './style/sass.scss';
import './style/hello.less';
import logo from './img/hy.jpg';
import React from 'react';
import ReactDOM from 'react-dom';

console.log('hello');
document.write('hello4');
let img = document.createElement('img');
img.src = logo;
document.body.appendChild(img);

ReactDOM.render(<div>react</div>, document.getElementById('root'));
let a;
/*function readonly(target,key,discriptor) {
    discriptor.writable=false;
}

class Person{
    @readonly PI=3.14;
}
let p1=new Person();
p1.PI=3.15;
console.log(p1)*/
