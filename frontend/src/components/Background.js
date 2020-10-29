import React,{Component} from 'react'
import ParticlesBg from 'particles-bg'
class Background extends Component{
    render(){
        return(
            <ParticlesBg num={25} type='circle' bg={true} zIndex="-100"/>
        )
    }
}
export default Background;