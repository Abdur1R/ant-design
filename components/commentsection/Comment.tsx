import CommentForm from "./CommentForm";

const Comment = ({
    comment,
    replies,
    setActiveComment,
    activeComment,
    updateComment,
    deleteComment,
    addComment,
    parentId = null,
    currentUserId,
    onCommentBodyClick,
    reply
}: any) => {
    const isEditing =
        activeComment &&
        activeComment.id === comment.id &&
        activeComment.type === "editing";
    const isReplying =
        activeComment &&
        activeComment.id === comment.id &&
        activeComment.type === "replying";
    const fiveMinutes = 300000;
    const timePassed: any = (new Date().getTime() - new Date(comment.createdAt).getTime()) > fiveMinutes;
    const canDelete = currentUserId === comment.userId && replies.length === 0;
    // && !timePassed;
    const canReply = Boolean(currentUserId);
    const canEdit = currentUserId === comment.userId
    // && !timePassed;
    const replyId = parentId ? parentId : comment.id;
    const createdAt = new Date(comment.createdAt).toLocaleDateString();
    const convertDateFormat = (inputDate: any) => {
        const inputDateTime = new Date(inputDate);

        // Check if the input is a valid date
        if (isNaN(inputDateTime.getTime())) {
            return "Invalid date";
        }

        const options: any = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(inputDateTime);

        return formattedDate.replace(',', '') + ` @ ${inputDateTime.getHours()}:${String(inputDateTime.getMinutes()).padStart(2, '0')} ${inputDateTime.getHours() < 12 ? 'AM' : 'PM'}`;
    };

    const AlphabetRange = (start: string, end: string, letter: string): boolean => {
        if (letter >= start && letter <= end) {
            return true;
        }
        return false;
    };

    let PicColor = '';
    let firstLetter = ((comment.username.split(' ')[0][0]) || (comment.username.split(' ')[1] ? comment.username.split(' ')[1][0] : comment.username.split(' ')[0][1])).toUpperCase();

    if (AlphabetRange('A', 'G', firstLetter)) {
        PicColor = 'A';
    } else if (AlphabetRange('H', 'M', firstLetter)) {
        PicColor = 'H';
    } else if (AlphabetRange('N', 'T', firstLetter)) {
        PicColor = 'N'
    } else {
        PicColor = 'U';
    }
    return (
        <div onClick={() => {
            if (!isReplying && !isEditing) {
                onCommentBodyClick && onCommentBodyClick({ jsonKey: comment.jsonKey, questionId: comment.questionId });
            }
        }} key={comment.id} style={{ marginBottom: `${reply ? '0px' : '28px'}` }} className="comment">
            <div className={`comment-image-container color${PicColor}`}>
                {comment.username.split(' ')[0][0] + (comment.username.split(' ')[1] ? comment.username.split(' ')[1][0] : comment.username.split(' ')[0][1])}
                {/* <img src="/user-icon.png" /> */}
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">{comment.username}</div>
                    <div className="comment-time">{convertDateFormat(comment.createdAt)}</div>
                </div>
                {!isEditing &&
                    <div className="comment-text">
                        {comment.body.body
                            ? <div dangerouslySetInnerHTML={{ __html: comment.body.body.innerHTML }} />
                            : comment.body}
                    </div>}
                {isEditing && (
                    <CommentForm
                        submitLabel="Update"
                        hasCancelButton
                        initialText={comment.body.body ?? comment.body}
                        handleSubmit={(text: any) => updateComment(text, comment.id)}
                        handleCancel={() => {
                            setActiveComment(null);
                        }}
                    />
                )}
                <div className="comment-actions">
                    {canReply && (
                        <div
                            className="comment-action"
                            onClick={() =>
                                setActiveComment({ id: comment.id, type: "replying" })
                            }
                        >
                            Reply
                        </div>
                    )}
                    {canEdit && (
                        <div
                            className="comment-action"
                            onClick={() =>
                                setActiveComment({ id: comment.id, type: "editing" })
                            }
                        >
                            Edit
                        </div>
                    )}
                    {canDelete && (
                        <div
                            className="comment-action"
                            onClick={() => deleteComment(comment.id)}
                        >
                            Delete
                        </div>
                    )}
                </div>
                {isReplying && (
                    <CommentForm
                        submitLabel="Reply"
                        hasCancelButton
                        handleSubmit={(text: any) => addComment(text, replyId)}
                        handleCancel={() => {
                            setActiveComment(null);
                        }}
                    />
                )}
                {replies.length > 0 && (
                    <div className="replies">
                        {replies.map((reply: any) => (
                            <Comment
                                comment={reply}
                                key={reply.id}
                                setActiveComment={setActiveComment}
                                activeComment={activeComment}
                                updateComment={updateComment}
                                deleteComment={deleteComment}
                                addComment={addComment}
                                parentId={comment.id}
                                replies={[]}
                                currentUserId={currentUserId}
                                reply={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;