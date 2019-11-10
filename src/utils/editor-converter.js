import {convertFromRaw, convertToRaw, EditorState} from 'draft-js';

export function convertStringToEditorState(stringContent) {
    try {
        const rawContentFromString = JSON.parse(stringContent);
        const contentState = convertFromRaw(rawContentFromString);
        return EditorState.createWithContent(contentState);
    } catch (error) {
        console.log('parse editor content from string error: ', error);
        return stringContent;
    }
}

export function convertFromEditorStateToString(editorState) {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    return JSON.stringify(rawContent);
}
