import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import {
    getComments as getCommentsApi,
    createComment as createCommentApi,
    updateComment as updateCommentApi,
    deleteComment as deleteCommentApi,
} from "./api";

const Comments = ({ commentsUrl, currentUserId, onCommentBodyClick, jsonKey, questionId, questionText }: { commentsUrl: string, currentUserId: string, onCommentBodyClick: ({ jsonKey, questionId }: { jsonKey: string, questionId: string }) => void, jsonKey: string, questionId: string, questionText?: string }) => {
    const [backendComments, setBackendComments] = useState<any>([]);
    const [activeComment, setActiveComment] = useState(null);
    const rootComments = backendComments.filter(
        (backendComment: any) => backendComment.parentId === null
    );
    console.log('backendComments', backendComments);
    console.log('rootComments', rootComments);

    const getReplies = (commentId: string) =>
        backendComments
            .filter((backendComment: any) => backendComment.parentId === commentId)
            .sort(
                (a: any, b: any) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
    const addComment = (text: string, parentId: any) => {
        console.log('jsonKey, questionId in comments page', jsonKey, questionId);
        createCommentApi(text, parentId, jsonKey, questionId).then((comment: any) => {
            setBackendComments([comment, ...backendComments]);
            setActiveComment(null);
        });
    };

    const updateComment = (text: string, commentId: string) => {
        // const html = parser.parseFromString(htmlString, 'text/html');
        updateCommentApi(text).then(() => {
            const updatedBackendComments = backendComments.map((backendComment: any) => {
                if (backendComment.id === commentId) {
                    return { ...backendComment, body: text };
                }
                return backendComment;
            });
            setBackendComments(updatedBackendComments);
            setActiveComment(null);
        });
    };
    const deleteComment = (commentId: any) => {
        if (window.confirm("Are you sure you want to remove comment?")) {
            deleteCommentApi().then(() => {
                const updatedBackendComments = backendComments.filter(
                    (backendComment: any) => backendComment.id !== commentId
                );
                setBackendComments(updatedBackendComments);
            });
        }
    };

    useEffect(() => {
        getCommentsApi().then((data) => {
            setBackendComments(data);
        });
    }, []);

    return (
        <div className="comments">
            <CommentForm parentForm={true} submitLabel="POST" questionText={questionText} handleSubmit={addComment} />
            <div className="comments-container">
                {rootComments.map((rootComment: any) => (
                    <Comment
                        key={rootComment.id}
                        comment={rootComment}
                        replies={getReplies(rootComment.id)}
                        activeComment={activeComment}
                        setActiveComment={setActiveComment}
                        addComment={addComment}
                        deleteComment={deleteComment}
                        updateComment={updateComment}
                        currentUserId={currentUserId}
                        onCommentBodyClick={onCommentBodyClick}
                        reply={false}
                    />
                ))}
            </div>
        </div>
    );
};

export default Comments;