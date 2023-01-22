import React, { useState } from 'react'
import { db } from '../firebaseClient'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
// Components
import CommentCard from './CommentCard'

export default function Comments({ newsId, commentsData, user, uid }) {
  const [newComments, setNewComments] = useState([]);

  function addComment(e){
    e.preventDefault();


    const commentText = e.target.comment_text.value;

    if(user){
      addDoc(collection(doc(db, 'news', newsId), 'comments'), {
        data: {
          uid: uid,
          commentText: commentText,
          commentedAt: serverTimestamp()
        }
      }).then((docRef) => {
        const docId = docRef.id;

        updateDoc(docRef, {
          "data.docId": docRef.id
        }).then(() => {
          commentsData.push()
          document.querySelector('.add_comment_form').reset();

          setNewComments(oldComments => [...oldComments, {
            uid: uid,
            commentText: commentText,
            docId: docId,
            commentedAt: new Date()
          }])
        })
      })
    }

    else{
      addDoc(collection(doc(db, 'news', newsId), 'comments'), {
        data: {
          uid: 'anonymous',
          commentText: commentText,
          commentedAt: serverTimestamp()
        }
      }).then((docRef) => {
        const docId = docRef.id;

        updateDoc(docRef, {
          "data.docId": docRef.id
        }).then(() => {
          document.querySelector('.add_comment_form').reset();
          
          setNewComments(oldComments => [...oldComments, {
            uid: 'anonymous',
            docId: docId,
            commentText: commentText,
            commentedAt: new Date()
          }])
        })
      })
    }
  }

  return (
    <div className='comments'>
      <div className='section_title'>Comments ({parseInt(commentsData.length+newComments.length) < 10 && parseInt(commentsData.length+newComments.length) > 0? '0'+parseInt(commentsData.length+newComments.length) : parseInt(commentsData.length+newComments.length)})</div>

      <div className='comments_container'>
        {
          newComments.reverse().map((comment, index) => {
            return(
              <CommentCard key={index} newComment={true} uid={comment.uid} newsId={newsId} currentUID={uid} comment={comment} />
            )
          })
        }
        {
          commentsData.map((comment, index) => {
            return(
              <CommentCard key={index} newComment={false} uid={comment.uid} newsId={newsId} currentUID={uid} comment={comment} />
            )
          })
        }
      </div>

      <form className='add_comment_form default bg_w' style={{marginTop: '30px'}} onSubmit={addComment}>
        <div className='input_container'>
          <label htmlFor='add_comment_input'>Add a comment</label>
          <textarea id='add_comment_input' style={{height: '80px'}} placeholder='Write your comment here...' name='comment_text' required></textarea>
        </div>
        <div className='actions' style={{marginTop: '15px'}}>
          <button className='submit_btn'>Post Comment</button>
        </div>
      </form>
    </div>
  )
}
