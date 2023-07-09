import React, { useState, useEffect } from 'react'
import client, { databases } from '../appwriteConfig'
import { ID, Query, Role, Permission } from 'appwrite'
import { Trash2 } from 'react-feather'
import Header from '../components/Header'
import { useAuth } from '../utils/AuthContext'

const databaseID = import.meta.env.VITE_DATABASE_ID
 const collectionIDMessages = import.meta.env.VITE_COLLECTION_ID_MESSAGES

const Room = () => {
  const [messages, setMessages] = useState([])
  const [messageBody, setMessageBody] = useState('')

  const { user } = useAuth()

  useEffect(() => {
    getMessages()

    const unsubscribe = client.subscribe(`databases.${databaseID}.collections.${collectionIDMessages}.documents`, response => {
      // Callback will be executed on changes for documents A and all files.
      console.log('REAL TIME: ', response);
      if (response.events.includes('databases.*.collections.*.documents.*.create')){
        console.log("MESSAGE CREATED")
        setMessages(prevState => [response.payload, ...prevState])
      }
      if (response.events.includes('databases.*.collections.*.documents.*.delete')){
        console.log("MESSAGE deleted")
        setMessages(prevState => prevState.filter((msg) => msg.$id !== response.payload.$id))
      }
  });

  return () => {
    unsubscribe()
  }
    
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    let payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody
    }

    let permissions = [
      Permission.write(Role.user(user.$id))
    ]

    let response = await databases.createDocument(
      databaseID,
      collectionIDMessages,
      ID.unique(),
      payload,
      permissions
    )
    console.log('created', response)
    // setMessages(prevState => [response, ...messages])

    setMessageBody('')
  }
  
  const getMessages = async () => {
    const response = await databases.listDocuments(databaseID, collectionIDMessages, [
      Query.orderDesc('$createdAt'),
      Query.limit(10)
    ])
    console.log('RESPONSE: ', response)
    setMessages(response.documents)
  }

  const deleteMessage = async (msgId) => {

    await databases.deleteDocument(databaseID, collectionIDMessages, msgId)
    // setMessages(prevState => messages.filter((msg) => msg.$id !== msgId))
  }


  return (
    <main className='container'>
      <Header />
      <div className='room--container'>

        <form onSubmit={handleSubmit} id='message--form' action="">
          <div>
            <textarea required maxLength="1000" placeholder='Say Something...' onChange={e => setMessageBody(e.target.value)} value={messageBody} name="" id="" cols="30" rows="10">

            </textarea>
          </div>
          <div className='send-btn--wrapper'>
            <input className='btn btn--secondary' type="submit" value="Send" />
          </div>
        </form>

          <div>
            {
              messages.map((message) => (
                // eslint-disable-next-line no-useless-escape
                <div key={message.$id} className={message.$permissions.includes(`delete(\"user:${user.$id}\")`) ? 'message--wrapper-my-msg' : 'message--wrapper'}>
                  <div className='message--header'>
                    <p>
                      {message?.username ? (
                        <span>{message.username}</span>
                      ) : (
                        <span>Anonymous user</span>
                      )}
                    <small className='message--timestamp'>{new Date(message.$createdAt).toLocaleString()}</small>
                    </p>
                    {
                      // eslint-disable-next-line no-useless-escape
                      message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (

                        <Trash2 onClick={() => {deleteMessage(message.$id)}} className='delete--btn' />
                      )
                    }
                  </div>
                  {/* eslint-disable-next-line no-useless-escape */}
                  <div className={message.$permissions.includes(`delete(\"user:${user.$id}\")`) ? 'message--body-my-msg' : 'message--body'}>
                    <span>{message.body}</span>
                  </div>

                </div>
              ))
            }
          </div>
        </div>
    </main>
  )
}

export default Room
