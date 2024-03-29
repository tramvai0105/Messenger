import { useEffect, useState } from 'react';
import socket from '../../store/socket';
import messengerUtils from '../messenger/messenge.utils';
import Avatar from '../utils/Avatar';

interface User{
    _id: string,
    username: string,
    avatar: string,
}

function RequestsList(){

    const [requests, setRequests] = useState<User[] | null>(null)

    useEffect(()=>{
        if(socket.token){
            getRequests()}
    }, [])
    
    async function getRequests() {
        let res = await fetch("http://localhost:5000/friends/friendslist",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${socket.token}`,
            },
          })
        let {requests} = await res.json()
        let persons = []
        for(let i = 0; i < requests.length; i++){
            persons.push(requests[i].username)
        }
        let avatars = await messengerUtils.getAvatars(persons)
        for(let i = 0; i < requests.length; i++){
            requests[i].avatar = avatars.get(requests[i].username)
        }
        setRequests(requests)
    }

    async function acceptFriend(id: string){
        let res = await fetch("http://localhost:5000/friends/acceptfriend",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${socket.token}`,
            },
            body: JSON.stringify({friendId: id})
          })
        let {message} = await res.json()
        alert(message)
        getRequests();
    }

    return(
        <div className='h-full w-full flex flex-col'>
            {requests?.map((request, i)=>
            <div className='w-full flex justify-between items-center bg-white rounded-md pl-2 pr-2 h-10 mb-1' key={i}>
                <Avatar r={32} avatar={request.avatar}/> {request.username}
                {(socket.token) 
                ? <button onClick={()=>acceptFriend(request._id)} 
                    className='border-b-[2px] p-1 h-[30px] border-black'>Add to friends</button>
                : <></>}
            </div>
            )}
        </div>
    )
}

export default RequestsList;