import React from "react";
import PropTypes from 'prop-types';
import 'draft-js/dist/Draft.css';
import './rich-editor.scss';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import CodeIcon from '@material-ui/icons/Code';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';

function StyleButton(props) {
    const {onToggle, style, active, label = '', icon} = props;

    function handleOnToggle(e) {
        e.preventDefault();
        onToggle && style && onToggle(style);
    }

    let className = 'RichEditor-styleButton';
    if (active) className += ' RichEditor-activeButton';
    return ( icon ? <span className={className} onMouseDown={handleOnToggle}>{icon}</span> : 
    <span className={className} onMouseDown={handleOnToggle}>{label}</span>);
}

StyleButton.propTypes = {
    onToggle: PropTypes.func,
    style: PropTypes.any,
    active: PropTypes.bool,
    label: PropTypes.string,
    icon: PropTypes.any
};

const INLINE_STYLES = [
    {label: 'In đậm', style: 'BOLD', icon:<FormatBoldIcon/>},
    {label: 'Nghiêng', style: 'ITALIC', icon:<FormatItalicIcon/>},
    {label: 'Gạch dưới', style: 'UNDERLINE', icon:<FormatUnderlinedIcon/>},
    // {label: 'Code', style: 'CODE'},
];

export const InlineStyleControls = (props) => {
    const {editorState, onToggle} = props;
    let currentStyle = editorState.getCurrentInlineStyle();

    function handleToggle(e) {
        onToggle && onToggle(e);
    }

    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={handleToggle}
                    style={type.style}
                    icon = {type.icon}
                />
            )}
        </div>
    );
};
InlineStyleControls.propTypes = {
    editorState: PropTypes.any,
    onToggle: PropTypes.func
};

const BLOCK_TYPES = [
    {label: 'Tiêu đề 1', style: 'header-one'},
    {label: 'Tiêu đề 2', style: 'header-two'},
    {label: 'Tiêu đề 3', style: 'header-three'},
    {label: 'Tiêu đề 4', style: 'header-four'},
    {label: 'Tiêu đề 5', style: 'header-five'},
    {label: 'Tiêu đề 6', style: 'header-six'},
    {label: 'Chú thích', style: 'blockquote'},
    {label: ':', style: 'unordered-list-item', icon: <FormatListBulletedIcon/>},
    {label: '1.', style: 'ordered-list-item', icon: <FormatListNumberedIcon/>},
    {label: 'Mã code', style: 'code-block', icon: <CodeIcon/>},
];

export const BlockStyleControls = (props) => {
    const {editorState, onToggle} = props;
    const selection = editorState.getSelection();
    const blockType = editorState.getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    function handleToggle(e) {
        onToggle && onToggle(e);
    }

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={handleToggle}
                    style={type.style}
                    icon = {type.icon}
                />
            )}
        </div>
    );
};

BlockStyleControls.propTypes = {
    editorState: PropTypes.any,
    onToggle: PropTypes.func
};
