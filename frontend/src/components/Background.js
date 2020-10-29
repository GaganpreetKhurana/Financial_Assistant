import React,{Component} from 'react'
import ParticlesBg from 'particles-bg'
class Background extends Component{
    render(){
        let config = {
            num: [6],
            rps: 1.2,
            radius: [10,100],
            life: [1.5, 3],
            v: [0.4],
            scale: [0.8,0.6],
            position: "all", 
            color: ["random"],
            
          };
        return(
            <ParticlesBg type="custom" config={config} bg={true}/>
        )
    }
}
export default Background;