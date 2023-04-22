import {ChangeEvent, useRef, useState} from 'react';

interface Props{
    submit: (msg:string)=>void,
}

function ChatControls({submit}:Props){

    const [msgInput, setMsgInput] = useState<string>("");
    const inputRef = useRef<HTMLTextAreaElement>(null)

    function controlInput(e:ChangeEvent<HTMLTextAreaElement>){     
        if(inputRef.current){
            inputRef.current.style.height = "0px";
            let height = inputRef.current.scrollHeight;
            if(height < 200){
                inputRef.current.style.height = `${height}px`;
            } else {
                inputRef.current.style.height = "200px";
            }
        }
        setMsgInput(e.target.value)
    }

    function send(msg:string){
        setMsgInput("");
        submit(msg);
        if(inputRef.current){
            inputRef.current.style.height = "40px";
        }
    }

    return(
        <div className="chat-controls flex flex-row">
            <textarea ref={inputRef} style={{height:`40px`}}
            value={msgInput} onChange={(e)=>controlInput(e)} 
            className='chat-input overflow-y-hidden p-2 h-auto'/>
            <button className="bg-blue-200" onClick={()=>send(msgInput)}>Send</button>
        </div>        
    )
}

export default ChatControls;