function render(vnode, container) {
    container.appendChild(_render(vnode))
}
function setAttribute(element, key, value) {
    if (key === 'className') key = 'class'
    if (key === 'style') {
        if (typeof value === 'object') {
            for (let k in value) {
                element.style[k] = value[k]
            }
        }
        return
    }
    if (key.startsWith('on')) {
        key = key.toLowerCase();
        element[key] = value;
        return;
    }
    element.setAttribute(key, value)
}

function isType(type) {
    return function (content) {
        return Object.prototype.toString.call(content) === `[object ${type}]`
    }
}

let util = {};
let arr = ['String', 'Object', 'Function', 'Null', 'Number']
arr.forEach(t => {
    util['is' + t] = isType(t)
})

let createComponent = function (component, props) {
    if (component.prototype.render) {
        component = new component(props)
    } else {
        component.render = function () {
            return component(props)
        }
    }
    return component
}

export function renderComponent(component) {
    let dom;
    if(!component.dom){
        if (component.componentWillMount) {
            component.componentWillMount()
        }
    }
    dom = _render(component.render())
    if(!component.dom){
        if (component.componentDidMount) {
            component.componentDidMount()
        }
    }
    return dom
}

function _render(vnode) {
    if (util.isNumber(vnode)) vnode = vnode.toString();
    if (util.isString(vnode)) return document.createTextNode(vnode)
    let { type, props, children } = vnode;
    //type是函数时 为组件
    if (util.isFunction(type)) {
        //创建组件  用来渲染
        let component = createComponent(type, props)
        component.props = props;
        //进行渲染  返回真实dom
        let dom = renderComponent(component)
        component.dom = dom;
        return dom
    }
    let element = document.createElement(type);
    if (props) {
        for (let key in props) {
            setAttribute(element, key, props[key])
        }
    }
    //递归
    if (children) {
        children.forEach(child => render(child, element))
    }
    return element
}
let ReactDOM = {
    render
}

export default ReactDOM;