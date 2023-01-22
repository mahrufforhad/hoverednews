import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { db, storage } from '../firebaseClient';
import { ref, getDownloadURL } from 'firebase/storage';
import ReactDOMServer from 'react-dom/server';
import $ from 'jquery'
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

export default function CommentCard({comment, newComment, newsId, currentUID, uid}) {
  const [editFormShow, setEditFormShow] = useState(false)
  const [commentData, setCommentData] = useState(comment);
  const [commentText, setCommentText] = useState(comment.commentText);
  const [commentDate, setCommentDate] = useState('')

  useEffect(() =>  {
    var commentedAtSplitted;
    if(newComment){
      commentedAtSplitted = comment.commentedAt.toString().split(" ");
      setCommentDate(commentedAtSplitted[1]+' '+commentedAtSplitted[2]+', '+commentedAtSplitted[3])
    }
    else{
      commentedAtSplitted = comment.commentedAt.toDate().toString().split(" ");
      setCommentDate(commentedAtSplitted[1]+' '+commentedAtSplitted[2]+', '+commentedAtSplitted[3])
    }
  }, [])

  // Get avatar
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('https://firebasestorage.googleapis.com/v0/b/hovered-news.appspot.com/o/App%20Files%2Favatar.png?alt=media&token=1be05c8c-321a-4a36-85e8-aee81cc1c884');

  useEffect(() => {
    if(uid !== 'anonymous'){
      getDownloadURL(ref(storage, `Profile Pictures/profile_picture_${uid}`)).then((url) => {
        setAvatar(url)
      })
  
      getDoc(doc(db, 'users', uid)).then((doc) => {
        if(doc.exists){
          const data = doc.data().data;
  
          setName(data.name);
        }
      })
    }

    else{
      setName('Anonymous')
    }
  }, [])

  useEffect(() => {
    if(!editFormShow){
  
    }
    else{
      document.querySelector('.comment_card_'+comment.docId+' .edit_form textarea').value = editFormShow;
    }
  }, [editFormShow])

  const updateComment = event => {
    event.preventDefault();

    if(event.target.text.value === ''){
      deleteComment();

      return;
    }

    updateDoc(doc(doc(db, 'news', newsId), 'comments', comment.docId), {
      'data.commentText': event.target.text.value
    }).catch((error) => {
      alert('Something went wrong. Please try again.')
    })
    
    comment.commentText = event.target.text.value;
    setCommentText(event.target.text.value);
    setEditFormShow(false)
  }

  function deleteComment(){
    const confirmDelete = confirm('Are you sure that you want to delete this comment?');

    if(confirmDelete){
      deleteDoc(doc(doc(db, 'news', newsId), 'comments', comment.docId)).then(() => {
        document.querySelector('.comment_card_'+comment.docId).remove();
      })
    }
  }

  return (
    <>
      <div className={'comment_card comment_card_'+comment.docId}>
        <div className='image'>
          <Image width="100%" src={avatar} layout="fill" alt='Commenter' />
        </div>
        <div className='details'>
          <div className='top'>
            <div className='left'>
              <div className='name'>{name}</div>
              <div className='date'> - {commentDate}{comment.uid === currentUID?' | ': ''}</div>
            </div>
            {
              comment.uid === currentUID?
              <div className='actions'>
                <div className='edit' onClick={() => {setEditFormShow(commentText)}}>Edit</div>
                <div className='delete' onClick={deleteComment}>Delete</div>
              </div>
              : ''
            }
          </div>
          <div className='text'>{commentText}</div>
          
          {
            editFormShow === false?
            <></>
            :
            <form className='edit_form default bg_w' onSubmit={updateComment}>
              <div className='inputs'>
                <div className='input_container'>
                  <label>Edit your comment</label>
                  <textarea style={{height: '80px'}} className='edit_comment_text' name='text' required></textarea>
                </div>
              </div>
              <div className='actions' style={{marginTop: '10px'}}>
                <button className='submit_btn w_min'>Update Comment</button>
                <button className='submit_btn w_min bg_gray' type='button' onClick={() => {setEditFormShow(false)}}>Cancel</button>
              </div>
            </form>
          }
        </div>
      </div>

    </>
  )
}
