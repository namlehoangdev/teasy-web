import React from 'react';
import {RichUtils} from 'draft-js';
import PropTypes from 'prop-types';
import 'draft-js/dist/Draft.css';
import './rich-editor.scss';
import {BlockStyleControls, InlineStyleControls} from './rich-controls';
import createMathjaxPlugin from 'draft-js-mathjax-plugin'
import Editor from 'draft-js-plugins-editor'


const mathjaxPlugin = createMathjaxPlugin()

const plugins = [
  mathjaxPlugin,
]



export default function RichEditor(props) {
    const {editorState, onChange} = props;
    // const [editorState, setEditorState] = React.useState(EditorState.createEmpty()); 

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

    // function onChange(e){
    //   setEditorState(e)
    // }


    let className = 'RichEditor-editor';
    let contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== 'unstyled') {
            className += ' RichEditor-hidePlaceholder';
        }
    }

    return (
        <div className="RichEditor-root">
            <BlockStyleControls editorState={editorState} onToggle={toggleBlockType}/>
            <InlineStyleControls editorState={editorState} onToggle={toggleInlineStyle}/>
            <div onClick={()=>{}}>aaaa</div>
            <div className={className}>
                <Editor
                    blockStyleFn={getBlockStyle}
                    customStyleMap={styleMap}
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    onChange={onChange}
                    onTab={onTab}
                    placeholder="Nhập nội dung câu hỏi..."
                    spellCheck={true}
                    plugins={plugins}
                />
            </div>
        </div>
    );
}
RichEditor.propTypes = {
    editorState: PropTypes.any,
    onChange: PropTypes.func
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





