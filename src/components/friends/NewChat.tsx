import { useNavigate } from "react-router-dom";
import chats from "../../store/chats";
import { ChatElement } from '../../utils/types';
import messengerUtils from "../messenger/messenge.utils";

interface Props{
    username: string,
}

function NewChat({username}: Props){

    const navigate = useNavigate()

    async function makeChat(){
        let avatars = await messengerUtils.getAvatars([username]);
        let avatar = avatars.get(username)
        if(typeof avatar != "undefined"){
        const chat : ChatElement = {
            _id: chats.getIndex(),
            person :{
                username: username,
                avatar: avatar,
            },
            messages: [],
        } 
        chats.addChat(chat)
        chats.setSelectedChat(chats.chats.length - 1)
        chats.setStage("chat");
        navigate("/app/messenger", { replace: false })}
    }

    return(
        <button onClick={makeChat} className="bg-white h-[30px] border-b-[2px] p-1 border-black">
            Chat
        </button>
    )
}

export default NewChat;