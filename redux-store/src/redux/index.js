let createStore=(reducer)=>{
    let state;
    let listeners=[];
    let dispatch=(action)=>{
        state = reducer(state,action);
        listeners.forEach(fn=>fn())
    }
    let subscribe = (listener) => {
        listeners.push(listener);
        return ()=>{
            listeners = listeners.filter(fn=>fn!=listener)
        }
    }
    let getState=()=>state

    
    dispatch({type:'@INIT'})

    return {
        dispatch,
        subscribe,
        getState
    }
}
let combineReducers=(reducers)=>{
    return (state={},action)=>{
        let obj={};
        for(let key in reducers){
            obj[key] = reducers[key](state[key],action)
        }
        return obj
    }
}

let bindActionCreators=(actions,dispatch)=>{
    let obj={};
    for(let key in actions){
        obj[key] = (...args)=>{
            dispatch(actions[key](...args))
        }
    }
    return obj
}



export {
    createStore,
    combineReducers,
    bindActionCreators
}