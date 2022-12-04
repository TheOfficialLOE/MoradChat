import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fetchConversations, selectConversations } from "../store/slices/conversationsSlice";
import { fetchUser, selectUser } from "../store/slices/userSlice";
import {
  fetchConversationThunk,
  selectConversation,
  sendMessageThunk,
} from "../store/slices/selectedConversationSlice";

const Index = () => {
  const conversations = useAppSelector(selectConversations);
  const conversation = useAppSelector(selectConversation);
  const [message, setMessage] = useState<string>("");
  const [currentConversationId, setCurrentConversationId] = useState<string>("");
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchConversationThunk(currentConversationId));
  }, [currentConversationId, dispatch]);

  const clickHandler = async (e) => {
    e.preventDefault();
    dispatch(sendMessageThunk({
      conversationId: conversation.id,
      message
    }));
    setMessage("");
  };

  return <div className="h-screen">
    <div className="grid grid-cols-[min-content_auto] grid-flow-dense h-full">
      <ul className="w-96 bg-neutral p-4">
        {conversations.map(conversation => (
          <li key={conversation.id} className="btn justify-start w-full h-20" onClick={() => {
            setCurrentConversationId(conversation.id);
          }}
          >
            <div className="w-12 h-12 avatar justify-center items-center rounded-xl bg-accent">
              <p className="text-accent-content font-bold">J</p>
            </div>
            <div className="ml-4 flex flex-col items-start">
              <p className="text-white font-bold">{
                conversation.creator.id === user.id ? conversation.recipient.name : conversation.creator.name
              }</p>
              <p className="text-sm mt-2">{conversation.lastMessage.content}</p>
            </div>
            <div className="flex flex-col items-end items-end grow">
              <p>8:52 PM</p>
              <div className="badge badge-primary mt-2">1500</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-col mx-8 mb-8">
        <ul className="grow">
          {currentConversationId && conversation.messages.map(message => {
            return <li key={message.id} className={`mt-4 ${message.authorId === user.id && "text-right"}`}>
              <p className={`inline-block ${
                message.authorId === user.id ? "bg-primary text-primary-content" : "bg-secondary text-secondary-content"
              } p-4 rounded-xl`}>{message.content}</p>
            </li>
          })}
        </ul>
        <form className="flex flex-row" onSubmit={clickHandler}>
          <input type="text" className="input input-bordered w-full" onChange={(e) => {
            setMessage(e.target.value);
          }
          } value={message}/>
          <button className="btn btn-ghost rounded-full ml-4 px-0 w-12 h-12">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
};

export default Index;
