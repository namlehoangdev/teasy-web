import React from "react";
import PropTypes from 'prop-types';
import 'draft-js/dist/Draft.css';
import './rich-editor.scss';

function StyleButton(props) {
    const {onToggle, style, active, label = ''} = props;

    function handleOnToggle(e) {
        e.preventDefault();
        onToggle && style && onToggle(style);
    }

    let className = 'RichEditor-styleButton';
    if (active) className += ' RichEditor-activeButton';
    return (<span className={className} onMouseDown={handleOnToggle}>{label}</span>);
}

StyleButton.propTypes = {
    onToggle: PropTypes.func,
    style: PropTypes.any,
    active: PropTypes.bool,
    label: PropTypes.string
};

const INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'},
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
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
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
                />
            )}
        </div>
    );
};

BlockStyleControls.propTypes = {
    editorState: PropTypes.any,
    onToggle: PropTypes.func
};
