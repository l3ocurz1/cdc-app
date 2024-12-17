import { useRef } from "react";
import { createPortal } from "react-dom";

export default function Slider({temperature, setTemperature}) {

    const slider = useRef<HTMLInputElement>();
    const intialValue = useRef<HTMLSpanElement>(null);
    const currentValue = useRef(null);
  
    /*
    
    function onChangeTemperature(e) {
      setTemperature(e.target.value);
      
      if(intialValue.current) {
        
        const maxLenght = slider.current.offsetWidth / (parseInt(slider.current.max) - parseInt(slider.current.min));
        const step = maxLenght / 10 
        let px = slider.current.valueAsNumber * 10 * step

        let offsetTop = intialValue.current.getBoundingClientRect().top + 20
        let offsetLeft = intialValue.current.getBoundingClientRect().left + px
        currentValue.current.parentElement.style.left = offsetLeft + "px"
        currentValue.current.parentElement.style.top = offsetTop + "px"
        
      }

  
    } */

    const portal = createPortal(
    <span style={{ position: "absolute", zIndex:9999}}>
      <span className="is-size-7" ref={currentValue}>{temperature}</span>
    </span>, document.body
    )

    return (
    <div>
        <div className="flex items-center space-x-2">
        <span className="is-size-7" ref={intialValue}>0.1</span>
        
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value) }
            className="w-full h-1 bg-gray-300 rounded appearance-none cursor-pointer"
          />
          <span className="text-gray-800 is-size-7">1</span>
        </div>
    </div>)
}