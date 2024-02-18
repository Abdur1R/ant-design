import { useEffect, useState } from "react";
import { Mentions } from "antd";
import { TeamDetailsAPI } from "../../services/TeamDetailsApi";

const CommentForm = ({
    handleSubmit,
    submitLabel,
    hasCancelButton = false,
    handleCancel,
    initialText = "",
    parentForm = false,
    questionText = "",
}: {
    handleSubmit: any;
    submitLabel: any;
    hasCancelButton?: any;
    handleCancel?: any;
    initialText?: any;
    parentForm?: boolean;
    questionText?: string;
}) => {
    const [text, setText] = useState(initialText || '');
    const [state, updateState] = useState<any>({});
    const isTextareaDisabled = text ? text.length === 0 : false;
    const onSubmit = (event: any) => {
        event.preventDefault();
        handleSubmit(text);
        setText("");
    };

    const FetchTeamDetails = async () => {
        const response: any = await TeamDetailsAPI();
        if (response) {
            updateState((prev: any) => ({
                ...prev, responseEmpList: response ?? [], employeeList: response.map((item: any) => item.full_name) ?? []
            }));
        }
    };

    useEffect(() => {
        FetchTeamDetails();
    }, []);

    return (
        <form onSubmit={onSubmit}>
            <Mentions
                autoFocus={true}
                defaultValue={parentForm ? '' : initialText}
                value={text}
                rows={3}
                onChange={(text) => {
                    setText(text);
                }}
                placeholder={`Adding Comment for ${questionText}`}>
                {state.employeeList && state.employeeList.map((item: any, index: any) => (
                    <Mentions.Option key={index} value={item}>{item}</Mentions.Option>
                ))}
            </Mentions>
            <button className="comment-form-button" disabled={isTextareaDisabled}>
                {submitLabel}
            </button>
            {hasCancelButton && (
                <button
                    type="button"
                    className="comment-form-button comment-form-cancel-button"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            )}
        </form>
    );
};

export default CommentForm;