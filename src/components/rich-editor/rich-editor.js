import React from 'react';
import {RichUtils} from 'draft-js';
import PropTypes from 'prop-types';
import 'draft-js/dist/Draft.css';
import './rich-editor.scss';
import {BlockStyleControls, InlineStyleControls} from './rich-controls';
import createMathjaxPlugin from 'draft-js-mathjax-plugin'
import Editor from 'draft-js-plugins-editor'
import { disabledStyleWrapper } from 'utils';



export default function RichEditor(props) {
    const {editorState, onChange,readOnly} = props;
    const [plugins, setPlugins] = React.useState([createMathjaxPlugin()]); 
    

    function handleOnChange(editorState) {
        onChange && onChange(editorState);
    }


    function handleKeyCommand(command) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            onChange(newState);
            return true;
        }
        return false;
    }

    function onTab(e) {
        const maxDepth = 4;
        handleOnChange(RichUtils.onTab(e, editorState, maxDepth));
    }

    function toggleBlockType(blockType) {
        handleOnChange(RichUtils.toggleBlockType(editorState, blockType));
    }

    function toggleInlineStyle(inlineStyle) {
        handleOnChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    }


    let className = 'RichEditor-editor';
    let contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== 'unstyled') {
            className += ' RichEditor-hidePlaceholder';
        }
    }

    return (
        <div style={readOnly === true ? disabledStyleWrapper(true, {}, {opacity: 1, border: 0} ):{}} className="RichEditor-root">
            {readOnly === false && <BlockStyleControls editorState={editorState} onToggle={toggleBlockType}/>}
            {readOnly === false &&<InlineStyleControls editorState={editorState} onToggle={toggleInlineStyle}/>}
            <div className={className}>
                <Editor 
                    blockStyleFn={getBlockStyle}
                    customStyleMap={styleMap}
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    onChange={handleOnChange}
                    onTab={onTab}
                    placeholder="Nhập nội dung câu hỏi..."
                    spellCheck={false}
                    plugins={plugins}
                    readOnly={readOnly}
                />
            </div>
        </div>
    );
}
RichEditor.propTypes = {
    editorState: PropTypes.any,
    onChange: PropTypes.func,
    readOnly: PropTypes.any
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        //fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace'
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
}





